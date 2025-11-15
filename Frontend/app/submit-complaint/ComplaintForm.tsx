
'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Location {
  lat: number;
  lng: number;
}

interface ComplaintFormProps {
  selectedLocation: Location | null;
  onSubmitSuccess: () => void;
  onToggleLocationAddress: (nextValue: boolean) => void;
  resolvedAddress: string;
  usingLocationAddress: boolean;
  isGeocodingAddress: boolean;
}

const CATEGORIES = [
  { value: 'pothole', label: 'Potholes & Road Damage' },
  { value: 'water', label: 'Water Leakage' },
  { value: 'garbage', label: 'Garbage Collection' },
  { value: 'streetlight', label: 'Street Lighting' },
  { value: 'drainage', label: 'Drainage Issues' },
  { value: 'park', label: 'Park Maintenance' },
  { value: 'noise', label: 'Noise Pollution' },
  { value: 'other', label: 'Other' },
] as const;

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-600' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-200 text-red-800' },
] as const;

export default function ComplaintForm({
  selectedLocation,
  resolvedAddress,
  usingLocationAddress,
  onToggleLocationAddress,
  isGeocodingAddress,
  onSubmitSuccess,
}: ComplaintFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    severity: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (usingLocationAddress && resolvedAddress) {
      setFormData((prev) => ({
        ...prev,
        address: resolvedAddress,
      }));
    }
  }, [usingLocationAddress, resolvedAddress]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const charactersRemaining = useMemo(
    () => 500 - formData.description.length,
    [formData.description.length],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    if (usingLocationAddress) {
      onToggleLocationAddress(false);
    }
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
  };

  const handleSeverityClick = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      severity: prev.severity === value ? '' : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSubmitError(
        'This photo is a bit too heavy. Please pick an image under 10 MB.',
      );
      return;
    }

    setSubmitError(null);
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      description: '',
      severity: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      address: usingLocationAddress ? resolvedAddress : '',
    });
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLocation) {
      setSubmitError('Pick a location on the map so our crews know where to go.');
      return;
    }
    if (!formData.severity) {
      setSubmitError('Let us know how urgent this feels so we can triage it properly.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append('category', formData.category);
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('severity', formData.severity);
    payload.append('contactName', formData.contactName);
    payload.append('contactPhone', formData.contactPhone);
    payload.append('contactEmail', formData.contactEmail);
    payload.append('address', formData.address);
    payload.append('latitude', String(selectedLocation.lat));
    payload.append('longitude', String(selectedLocation.lng));

    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      await apiClient.post('/complaints', payload);
      resetForm();
      onSubmitSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We had trouble saving your complaint — please check your connection.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="complaint-form"
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Tell us what went wrong and we’ll nudge the right city team to fix it.
        A clear description and a photo (if you have one) help speed things up.
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Category *
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Pick the closest match</option>
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="ri-arrow-down-s-line" />
            </span>
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-gray-800">
            Severity *
          </span>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_LEVELS.map((level) => {
              const isSelected = formData.severity === level.value;
              return (
                <button
                  type="button"
                  key={level.value}
                  onClick={() => handleSeverityClick(level.value)}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isSelected
                      ? `${level.color} shadow-sm ring-2 ring-offset-2 ring-blue-200`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{level.label}</span>
                </button>
              );
            })}
          </div>
          {formData.severity === '' && (
            <p className="mt-2 text-xs text-gray-500">
              Pick how urgent this feels so crews can triage quickly.
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Issue Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Large pothole on Maple Street"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Detailed Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          maxLength={500}
          placeholder="Share what’s happening, how long it’s been an issue, and anything else that helps crews find and fix it."
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Up to 500 characters</span>
          <span>
            {charactersRemaining} character{charactersRemaining === 1 ? '' : 's'} left
          </span>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">
            Location Address
          </span>
          <label className="inline-flex cursor-pointer items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={usingLocationAddress}
              onChange={(event) =>
                onToggleLocationAddress(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Use marker location</span>
          </label>
        </div>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleAddressChange}
          placeholder="Building, cross street, or nearest landmark"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {isGeocodingAddress && usingLocationAddress && (
          <p className="flex items-center text-xs font-medium text-blue-600">
            <i className="ri-compass-3-line mr-2 text-sm" />
            Finding the address for that pin…
          </p>
        )}
        {!selectedLocation && (
          <p className="flex items-center text-xs font-medium text-orange-600">
            <i className="ri-alert-line mr-2 text-sm" />
            Drop the pin on the map so we know exactly where this is.
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <span className="text-sm font-semibold text-gray-800">
          Attach a supporting photo (optional)
        </span>
        <label
          htmlFor="image"
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-center transition hover:border-blue-400"
        >
          <i className="ri-upload-cloud-2-line text-2xl text-blue-500" />
          <span className="mt-2 text-sm font-semibold text-blue-600">
            Drop a photo or click to browse
          </span>
          <span className="text-xs text-gray-500">
            JPG, PNG, or HEIC — up to 10&nbsp;MB
          </span>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {imagePreview && (
          <div className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="relative h-16 w-20 overflow-hidden rounded-lg bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Complaint evidence preview"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {imageFile?.name}
              </p>
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                  }
                  setImagePreview(null);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          How can we reach you?
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="contactName"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="contactPhone"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="Best number to reach you"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            placeholder="you@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <p className="mt-1 text-xs text-gray-500">
            We’ll send confirmations here and let you know when the status
            changes.
          </p>
        </div>
      </div>

      {submitError && (
        <div className="flex items-start rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <i className="ri-error-warning-line mr-2 text-lg" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <p className="text-xs text-gray-500">
          By submitting, you consent to CityPulse contacting you about this
          report.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line mr-2 animate-spin" />
              Sending it in…
            </>
          ) : (
            'Submit complaint'
          )}
        </button>
      </div>
    </form>
  );
}


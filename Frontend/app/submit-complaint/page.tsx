
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComplaintForm from './ComplaintForm';
import LocationMap from './LocationMap';

interface Location {
  lat: number;
  lng: number;
}

export default function SubmitComplaint() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoAddressEnabled, setAutoAddressEnabled] = useState(true);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const mapsApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY ??
    '';

  const reverseGeocode = useCallback(
    async (location: Location) => {
      if (!mapsApiKey) {
        setGeocodeError('Google Maps API key missing. Please update your .env.');
        setResolvedAddress('');
        return;
      }

      try {
        setIsGeocoding(true);
        setGeocodeError(null);
        const query = new URLSearchParams({
          latlng: `${location.lat},${location.lng}`,
          key: mapsApiKey,
        });
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?${query.toString()}`,
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
          setResolvedAddress(data.results[0].formatted_address);
        } else {
          setResolvedAddress('');
          setGeocodeError(
            'We could not determine the address from that pin. You can type it in manually.',
          );
        }
      } catch (error) {
        setResolvedAddress('');
        setGeocodeError(
          error instanceof Error
            ? error.message
            : 'We had trouble pulling the address. Please type it manually.',
        );
      } finally {
        setIsGeocoding(false);
      }
    },
    [mapsApiKey],
  );

  useEffect(() => {
    if (selectedLocation && autoAddressEnabled) {
      reverseGeocode(selectedLocation);
    }
  }, [selectedLocation, autoAddressEnabled, reverseGeocode]);

  const handleLocationSelect = (location: Location | null) => {
    if (!location) {
      setSelectedLocation(null);
      setResolvedAddress('');
      setGeocodeError(null);
      return;
    }
    setSelectedLocation(location);
  };

  const handleRecenter = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleSubmitSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 6000);
  };

  const successMessage = useMemo(
    () => (
      <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-green-100 p-2 text-green-600">
            <i className="ri-sparkling-fill text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              Thanks — we’ll get on it ASAP!
            </h3>
            <p className="text-sm text-green-700">
              Your report is in our system. You’ll receive an email confirmation and
              updates as the city team moves it along.
            </p>
          </div>
        </div>
      </div>
    ),
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <i className="ri-megaphone-line text-base" />
              New complaint
            </span>
            <h1 className="text-4xl font-bold text-gray-900">
              Point, describe, and send
            </h1>
            <p className="max-w-2xl text-lg text-gray-600">
              Drop the pin where the issue lives, add a quick description, and
              we’ll route it to the right team. Most reports get an initial
              response within 24 hours.
            </p>
          </div>

          {showSuccess && successMessage}
          {geocodeError && autoAddressEnabled && (
            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              <i className="ri-alert-line mr-2 text-lg" />
              {geocodeError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/40">
              <h2 className="mb-1 flex items-center text-xl font-semibold text-gray-900">
                <i className="ri-map-pin-2-line mr-2 text-2xl text-blue-600" />
                Pin the exact spot
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                Drag the marker until it’s right where the issue is. We’ll use this
                to plot the crew’s route.
              </p>
              <LocationMap
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
                onRecenter={handleRecenter}
              />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/40">
              <h2 className="mb-1 flex items-center text-xl font-semibold text-gray-900">
                <i className="ri-file-text-line mr-2 text-2xl text-blue-600" />
                Tell us what’s happening
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                If you spotted something unusual, we’d love to know. No detail is too
                small.
              </p>
              <ComplaintForm
                selectedLocation={selectedLocation}
                resolvedAddress={resolvedAddress}
                usingLocationAddress={autoAddressEnabled}
                onToggleLocationAddress={setAutoAddressEnabled}
                isGeocodingAddress={isGeocoding}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

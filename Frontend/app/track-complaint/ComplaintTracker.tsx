
'use client';

import { ComplaintResponse, ComplaintSeverity, ComplaintStatus } from '@/types/complaint';

interface ComplaintTrackerProps {
  complaint: ComplaintResponse;
}

const STATUS_ORDER: ComplaintStatus[] = ['SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

function getStatusBadgeStyles(status: ComplaintStatus): string {
  switch (status) {
    case 'SUBMITTED':
      return 'bg-gray-100 text-gray-700';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700';
    case 'RESOLVED':
      return 'bg-green-100 text-green-700';
    case 'REJECTED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getSeverityStyles(severity: ComplaintSeverity): string {
  switch (severity) {
    case 'LOW':
      return 'bg-green-100 text-green-700';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-700';
    case 'HIGH':
      return 'bg-orange-100 text-orange-700';
    case 'URGENT':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatDisplayStatus(status: ComplaintStatus): string {
  return status.replace('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

function formatTimestamp(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function computeProgress(status: ComplaintStatus): number {
  const index = STATUS_ORDER.indexOf(status);
  if (index < 0) {
    return 0;
  }
  if (status === 'REJECTED') {
    return 100;
  }
  return Math.min(100, Math.round(((index + 1) / (STATUS_ORDER.length - 1)) * 100));
}

export default function ComplaintTracker({ complaint }: ComplaintTrackerProps) {
  const progress = computeProgress(complaint.status);
  const googleMapsLink =
    complaint.latitude != null && complaint.longitude != null
      ? `https://www.google.com/maps?q=${Number(complaint.latitude)},${Number(complaint.longitude)}`
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Complaint #{complaint.id}</p>
          <h2 className="text-3xl font-semibold text-gray-900 mt-1">{complaint.title}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyles(complaint.status)}`}>
            {formatDisplayStatus(complaint.status)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityStyles(complaint.severity)}`}>
            Severity: {complaint.severity.toLowerCase()}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            Category: {complaint.category.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">{complaint.description}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporter</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-gray-400" />
                <span>{complaint.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-mail-line text-gray-400" />
                <a className="text-blue-600 hover:underline" href={`mailto:${complaint.contactEmail}`}>
                  {complaint.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-phone-line text-gray-400" />
                <a className="text-blue-600 hover:underline" href={`tel:${complaint.contactPhone}`}>
                  {complaint.contactPhone}
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <i className="ri-map-pin-line mt-0.5 text-gray-400" />
                <span>{complaint.address ?? 'Address not provided'}</span>
              </div>
              {complaint.latitude != null && complaint.longitude != null && (
                <div className="flex items-center gap-2">
                  <i className="ri-compass-3-line text-gray-400" />
                  <span>
                    {Number(complaint.latitude).toFixed(6)}, {Number(complaint.longitude).toFixed(6)}
                  </span>
                </div>
              )}
              {googleMapsLink && (
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open in Google Maps
                  <i className="ri-external-link-line ml-1" />
                </a>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <dl className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt>Submitted</dt>
                <dd className="font-medium">{formatTimestamp(complaint.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Last updated</dt>
                <dd className="font-medium">{formatTimestamp(complaint.updatedAt)}</dd>
              </div>
              {complaint.statusNotes && (
                <div className="pt-2 border-t border-gray-200">
                  <dt className="text-sm font-semibold text-gray-900 mb-1">Latest note</dt>
                  <dd className="text-sm text-gray-700">{complaint.statusNotes}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-wide text-gray-500">
                <span>{formatDisplayStatus(complaint.status)}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

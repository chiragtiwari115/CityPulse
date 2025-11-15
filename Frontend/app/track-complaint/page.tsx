'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComplaintTracker from './ComplaintTracker';
import ComplaintHistory, { TimelineEntry } from './ComplaintHistory';
import { apiClient } from '@/lib/api-client';
import { ComplaintResponse, ComplaintStatus } from '@/types/complaint';
import { useUser } from '@/lib/user-context';

function buildTimeline(complaint: ComplaintResponse): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      id: `${complaint.id}-submitted`,
      status: 'SUBMITTED',
      label: 'Complaint submitted',
      description: 'Thanks for reporting this issue. Our team has received your complaint.',
      timestamp: complaint.createdAt,
    },
  ];

  if (complaint.status !== 'SUBMITTED') {
    entries.push({
      id: `${complaint.id}-status`,
      status: complaint.status,
      label: `Status updated to ${complaint.status.replace('_', ' ').toLowerCase()}`,
      description: complaint.statusNotes
        ? complaint.statusNotes
        : 'City staff left an update on your complaint.',
      timestamp: complaint.updatedAt,
    });
  }

  return entries;
}

function statusBadgeClass(status: ComplaintStatus): string {
  switch (status) {
    case 'RESOLVED':
      return 'bg-green-100 text-green-700';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700';
    case 'REJECTED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function TrackComplaint() {
  const { isAuthenticated } = useUser();
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState<ComplaintResponse | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [myComplaints, setMyComplaints] = useState<ComplaintResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMyComplaints = useCallback(async () => {
    setIsLoadingComplaints(true);
    try {
      const response = await apiClient.get<{ content: ComplaintResponse[]; totalElements: number }>('/complaints?size=100');
      setMyComplaints(response.content || []);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setIsLoadingComplaints(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyComplaints();
    }
  }, [isAuthenticated, loadMyComplaints]);

  const performLookup = useCallback(
    async (id: string) => {
      setError(null);
      try {
        // Try to parse as number first
        const numericId = parseInt(id.trim(), 10);
        if (isNaN(numericId)) {
          throw new Error('Invalid complaint ID. Please enter a numeric ID.');
        }
        const result = await apiClient.get<ComplaintResponse>(`/complaints/${numericId}`);
        setComplaint(result);
        setTimeline(buildTimeline(result));
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'We could not find that complaint. Double-check the ID and try again.';
        setError(message);
        setComplaint(null);
        setTimeline([]);
      }
    },
    [],
  );

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = trackingId.trim();
    if (!trimmed) {
      return;
    }

    setIsSearching(true);
    try {
      await performLookup(trimmed);
    } finally {
      setIsSearching(false);
    }
  };

  const myComplaintsCards = useMemo(
    () =>
      myComplaints.map((item) => ({
        id: item.id,
        title: item.title,
        status: item.status,
        date: formatDate(item.createdAt),
      })),
    [myComplaints],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Track your complaint</h1>
            <p className="text-lg text-gray-600">
              Enter your complaint ID to check the current status and latest updates.
            </p>
          </div>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label htmlFor="trackingId" className="mb-2 block text-sm font-medium text-gray-700">
                  Complaint ID
                </label>
                <input
                  id="trackingId"
                  type="text"
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value)}
                  placeholder="e.g. 102 or CP-2025-014"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSearching ? (
                  <>
                    <i className="ri-loader-4-line mr-2 animate-spin" />
                    Searching…
                  </>
                ) : (
                  <>
                    <i className="ri-search-line mr-2" />
                    Track complaint
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <i className="ri-error-warning-line mr-2 align-middle text-base" />
                {error}
              </div>
            )}
          </div>

          {complaint && (
            <div className="space-y-8">
              <ComplaintTracker complaint={complaint} />
              <ComplaintHistory timeline={timeline} />
            </div>
          )}

          {isAuthenticated && (
            <section className="mt-12 rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Complaints</h2>
              {isLoadingComplaints ? (
                <div className="text-center py-8">
                  <i className="ri-loader-4-line animate-spin text-2xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Loading your complaints...</p>
                </div>
              ) : myComplaintsCards.length > 0 ? (
                <div className="space-y-3">
                  {myComplaintsCards.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        const id = String(item.id);
                        setTrackingId(id);
                        setIsSearching(true);
                        performLookup(id).finally(() => setIsSearching(false));
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          ID: {item.id} • Submitted {item.date}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(
                          item.status,
                        )}`}
                      >
                        {item.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="ri-file-list-line text-4xl text-gray-300 mb-2" />
                  <p className="text-sm text-gray-600">You haven't submitted any complaints yet.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


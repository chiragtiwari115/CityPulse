'use client';

import { ComplaintStatus } from '@/types/complaint';

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  label: string;
  description: string;
  timestamp: string;
}

interface ComplaintHistoryProps {
  timeline: TimelineEntry[];
}

function statusStyles(status: ComplaintStatus): { icon: string; badge: string } {
  switch (status) {
    case 'SUBMITTED':
      return { icon: 'ri-file-add-line', badge: 'bg-gray-100 text-gray-600' };
    case 'IN_PROGRESS':
      return { icon: 'ri-tools-line', badge: 'bg-blue-100 text-blue-600' };
    case 'RESOLVED':
      return { icon: 'ri-check-line', badge: 'bg-green-100 text-green-600' };
    case 'REJECTED':
      return { icon: 'ri-close-line', badge: 'bg-red-100 text-red-600' };
    default:
      return { icon: 'ri-information-line', badge: 'bg-gray-100 text-gray-600' };
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ComplaintHistory({ timeline }: ComplaintHistoryProps) {
  if (!timeline.length) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Updates</h2>
      <div className="relative space-y-6">
        <div className="absolute left-6 top-4 bottom-4 w-px bg-gray-200" />
        {timeline.map((item, index) => {
          const styles = statusStyles(item.status);
          return (
            <div key={item.id} className="relative flex gap-4 pl-12">
              <div className="absolute -left-2 top-1 flex items-center justify-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.badge}`}>
                  <i className={`${styles.icon} text-lg`} />
                </div>
              </div>
              <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:border-blue-100 hover:bg-blue-50/40 transition">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <time className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {formatDate(item.timestamp)}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


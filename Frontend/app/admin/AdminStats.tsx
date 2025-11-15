
'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ComplaintResponse } from '@/types/complaint';

interface AdminStatsProps {
  filters?: {
    status?: string;
    category?: string;
    priority?: string;
  };
}

export default function AdminStats({ filters }: AdminStatsProps) {
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ content: ComplaintResponse[]; totalElements: number }>(
        `/admin/complaints?size=1000`
      );
      const allComplaints = response.content || [];
      
      setStats({
        total: response.totalElements || allComplaints.length,
        submitted: allComplaints.filter(c => c.status === 'SUBMITTED').length,
        inProgress: allComplaints.filter(c => c.status === 'IN_PROGRESS').length,
        resolved: allComplaints.filter(c => c.status === 'RESOLVED').length,
        rejected: allComplaints.filter(c => c.status === 'REJECTED').length,
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statsData = [
    {
      title: 'Total Complaints',
      value: stats.total.toString(),
      icon: 'ri-file-text-line',
      color: 'blue'
    },
    {
      title: 'Submitted',
      value: stats.submitted.toString(),
      icon: 'ri-time-line',
      color: 'yellow'
    },
    {
      title: 'In Progress',
      value: stats.inProgress.toString(),
      icon: 'ri-tools-line',
      color: 'blue'
    },
    {
      title: 'Resolved',
      value: stats.resolved.toString(),
      icon: 'ri-check-line',
      color: 'green'
    },
    {
      title: 'Rejected',
      value: stats.rejected.toString(),
      icon: 'ri-close-line',
      color: 'red'
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${getColorClasses(stat.color)}`}>
              <i className={`${stat.icon} text-2xl`}></i>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

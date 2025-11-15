
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminStats from './AdminStats';
import ComplaintsList from './ComplaintsList';
import AnalyticsChart from './AnalyticsChart';

export default function AdminDashboard() {
  const { isLoading, isAuthenticated, isAdmin } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: '7days'
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      router.replace('/login?returnTo=/admin');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'complaints', label: 'Complaints', icon: 'ri-file-list-line' },
    { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' },
    { id: 'reports', label: 'Reports', icon: 'ri-file-chart-line' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">
              Manage complaints, track progress, and analyze city infrastructure data
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className={tab.icon}></i>
                    </div>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedFilters.status}
                    onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedFilters.category}
                    onChange={(e) => setSelectedFilters({...selectedFilters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                  >
                    <option value="all">All Categories</option>
                    <option value="pothole">Potholes</option>
                    <option value="water">Water Issues</option>
                    <option value="garbage">Garbage</option>
                    <option value="streetlight">Street Lights</option>
                    <option value="drainage">Drainage</option>
                    <option value="park">Park</option>
                    <option value="noise">Noise</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedFilters.priority}
                    onChange={(e) => setSelectedFilters({...selectedFilters, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={selectedFilters.dateRange}
                    onChange={(e) => setSelectedFilters({...selectedFilters, dateRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm pr-8"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="1year">Last Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                <AdminStats filters={selectedFilters} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AnalyticsChart />
                  <ComplaintsList isPreview={true} filters={selectedFilters} />
                </div>
              </>
            )}

            {activeTab === 'complaints' && (
              <ComplaintsList isPreview={false} filters={selectedFilters} />
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <AnalyticsChart />
                <AdminStats />
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Generate Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mb-4">
                      <i className="ri-file-chart-line text-2xl text-blue-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
                    <p className="text-gray-600 mb-4">Comprehensive monthly analysis of all complaints</p>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
                      Generate Report
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-lg mb-4">
                      <i className="ri-bar-chart-box-line text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Performance Report</h3>
                    <p className="text-gray-600 mb-4">Department performance and resolution metrics</p>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                      Generate Report
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg mb-4">
                      <i className="ri-map-pin-line text-2xl text-purple-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Area Analysis</h3>
                    <p className="text-gray-600 mb-4">Location-based complaint analysis and trends</p>
                    <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

export default function AnalyticsChart() {
  const [activeChart, setActiveChart] = useState('trends');

  const trendsData = [
    { month: 'Jan', submitted: 120, resolved: 95, pending: 25 },
    { month: 'Feb', submitted: 145, resolved: 110, pending: 35 },
    { month: 'Mar', submitted: 165, resolved: 140, pending: 25 },
    { month: 'Apr', submitted: 190, resolved: 160, pending: 30 },
    { month: 'May', submitted: 210, resolved: 180, pending: 30 },
    { month: 'Jun', submitted: 235, resolved: 200, pending: 35 },
    { month: 'Jul', submitted: 220, resolved: 190, pending: 30 }
  ];

  const categoryData = [
    { name: 'Potholes', value: 320, color: '#3B82F6' },
    { name: 'Water Issues', value: 180, color: '#10B981' },
    { name: 'Garbage', value: 150, color: '#F59E0B' },
    { name: 'Street Lights', value: 120, color: '#EF4444' },
    { name: 'Parks', value: 90, color: '#8B5CF6' },
    { name: 'Others', value: 60, color: '#6B7280' }
  ];

  const responseTimeData = [
    { department: 'Road Maintenance', avgTime: 4.2, target: 6 },
    { department: 'Water Dept', avgTime: 2.8, target: 4 },
    { department: 'Electrical', avgTime: 3.5, target: 8 },
    { department: 'Waste Mgmt', avgTime: 1.9, target: 2 },
    { department: 'Parks', avgTime: 5.1, target: 12 }
  ];

  const chartTypes = [
    { id: 'trends', label: 'Complaint Trends', icon: 'ri-line-chart-line' },
    { id: 'categories', label: 'By Category', icon: 'ri-pie-chart-line' },
    { id: 'response', label: 'Response Time', icon: 'ri-bar-chart-line' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Analytics Overview</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveChart(type.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeChart === type.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className={type.icon}></i>
              </div>
              <span className="whitespace-nowrap">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {activeChart === 'trends' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="submitted" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stackId="2"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="pending" 
                stackId="3"
                stroke="#F59E0B" 
                fill="#F59E0B"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'categories' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : '0'}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'response' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgTime" fill="#3B82F6" name="Average Time (hours)" />
              <Bar dataKey="target" fill="#E5E7EB" name="Target Time (hours)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total This Month</p>
              <p className="text-2xl font-bold text-blue-900">847</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="ri-file-text-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-900">92%</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full">
              <i className="ri-check-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Avg Response</p>
              <p className="text-2xl font-bold text-purple-900">3.2h</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full">
              <i className="ri-timer-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { ComplaintResponse, ComplaintStatus, ComplaintCategory, ComplaintSeverity } from '@/types/complaint';

interface ComplaintsListProps {
  isPreview?: boolean;
  filters?: {
    status?: string;
    category?: string;
    priority?: string;
  };
}

export default function ComplaintsList({ isPreview = false, filters }: ComplaintsListProps) {
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintResponse | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>('SUBMITTED');
  const [updateNotes, setUpdateNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status.toUpperCase());
      }
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category.toUpperCase());
      }
      if (filters?.priority && filters.priority !== 'all') {
        params.append('severity', filters.priority.toUpperCase());
      }
      params.append('size', isPreview ? '3' : '50');
      
      const response = await apiClient.get<{ content: ComplaintResponse[]; totalElements: number }>(
        `/admin/complaints?${params.toString()}`
      );
      setComplaints(response.content || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isPreview]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const displayedComplaints = isPreview ? complaints.slice(0, 3) : complaints;

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (severity: ComplaintSeverity) => {
    switch (severity) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      case 'URGENT': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: ComplaintCategory) => {
    switch (category) {
      case 'POTHOLE': return 'ri-road-line';
      case 'WATER': return 'ri-drop-line';
      case 'GARBAGE': return 'ri-delete-bin-line';
      case 'STREETLIGHT': return 'ri-lightbulb-line';
      case 'PARK': return 'ri-plant-line';
      case 'DRAINAGE': return 'ri-water-flash-line';
      case 'NOISE': return 'ri-volume-up-line';
      default: return 'ri-information-line';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaints(prev => 
      prev.includes(id) 
        ? prev.filter(complaintId => complaintId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`${action} complaints:`, selectedComplaints);
    setSelectedComplaints([]);
  };

  const handleEditStatus = (complaint: ComplaintResponse) => {
    setSelectedComplaint(complaint);
    setUpdateStatus(complaint.status);
    setUpdateNotes(complaint.statusNotes || '');
    setUpdateError(null);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;

    setIsUpdating(true);
    setUpdateError(null);
    try {
      await apiClient.put<ComplaintResponse>(
        `/admin/complaints/${selectedComplaint.id}/status`,
        {
          status: updateStatus,
          notes: updateNotes.trim() || null,
        }
      );
      setShowStatusModal(false);
      setSelectedComplaint(null);
      setUpdateNotes('');
      setUpdateError(null);
      // Reload complaints to show updated status
      loadComplaints();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-3xl text-gray-400 mb-4" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <i className="ri-error-warning-line text-2xl mb-2" />
          <p>{error}</p>
          <button
            onClick={loadComplaints}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {isPreview ? 'Recent Complaints' : 'All Complaints'}
          </h2>
          
          {!isPreview && (
            <div className="flex items-center space-x-3">
              {selectedComplaints.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedComplaints.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('assign')}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => handleBulkAction('update_status')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors whitespace-nowrap"
                  >
                    Update Status
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-download-line"></i>
                  </div>
                  <span className="text-sm">Export</span>
                </button>
                <button
                  onClick={loadComplaints}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-refresh-line"></i>
                  </div>
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {!isPreview && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComplaints(complaints.map(c => String(c.id)));
                      } else {
                        setSelectedComplaints([]);
                      }
                    }}
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Complaint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedComplaints.length === 0 ? (
              <tr>
                <td colSpan={isPreview ? 6 : 7} className="px-6 py-12 text-center text-gray-500">
                  <i className="ri-file-list-line text-4xl mb-2 text-gray-300" />
                  <p>No complaints found</p>
                </td>
              </tr>
            ) : (
              displayedComplaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                {!isPreview && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedComplaints.includes(String(complaint.id))}
                      onChange={() => handleSelectComplaint(String(complaint.id))}
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full flex-shrink-0">
                      <i className={`${getCategoryIcon(complaint.category)} text-blue-600`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {complaint.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {complaint.id} • {complaint.address || 'No address'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium capitalize ${getPriorityColor(complaint.severity)}`}>
                    {complaint.severity.toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('_', ' ').toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {complaint.reporter?.username || complaint.contactName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(complaint.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-eye-line"></i>
                      </div>
                    </button>
                    <button
                      onClick={() => handleEditStatus(complaint)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Update Status"
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-edit-line"></i>
                      </div>
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-delete-bin-line"></i>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isPreview && (
        <div className="p-6 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            View All Complaints →
          </button>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedComplaint && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isUpdating) {
              setShowStatusModal(false);
              setSelectedComplaint(null);
              setUpdateNotes('');
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Update Complaint Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  #{selectedComplaint.id}: {selectedComplaint.title}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUpdating}
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Notes (Optional)
                </label>
                <textarea
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Add notes about this status update..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {updateNotes.length}/500 characters
                </p>
              </div>
              {updateError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <i className="ri-error-warning-line mr-2 align-middle" />
                  {updateError}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedComplaint(null);
                  setUpdateNotes('');
                }}
                disabled={isUpdating}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:bg-blue-300 whitespace-nowrap"
              >
                {isUpdating ? (
                  <span className="flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Complaints</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Department
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option>Road Maintenance</option>
                  <option>Water Department</option>
                  <option>Electrical Department</option>
                  <option>Waste Management</option>
                  <option>Parks Department</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleBulkAction('assign');
                  setShowAssignModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

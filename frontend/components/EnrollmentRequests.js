"use client";
import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/authApi";

const EnrollmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchEnrollmentRequests();
  }, []);

  const fetchEnrollmentRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/enrollments/teacher/requests");
      if (response.data.success) {
        // Only show requests that are pending (is_approved: false)
        const pendingRequests = response.data.data.filter(
          (request) => request.is_approved === false
        );
        setRequests(pendingRequests);
      }
    } catch (error) {
      console.error("Error fetching enrollment requests:", error);
      showNotification("Failed to fetch enrollment requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      setProcessing((prev) => ({ ...prev, [requestId]: true }));

      // Call the actual API endpoint to approve the enrollment request
      const response = await api.put(`/enrollments/approve/${requestId}`, {
        is_approved: true,
      });

      if (response.data.success) {
        // Remove the approved request from the list since we only show pending requests
        setRequests((prev) => prev.filter((req) => req.id !== requestId));

        showNotification("Enrollment request approved successfully", "success");
      } else {
        throw new Error("Failed to approve enrollment request");
      }
    } catch (error) {
      console.error("Error approving enrollment request:", error);
      showNotification("Failed to approve enrollment request", "error");
    } finally {
      setProcessing((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isApproved) => {
    // Since we're only showing pending requests, always show pending status
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <ClockIcon className="h-3 w-3 mr-1" />
        Pending Approval
      </span>
    );
  };

  const getActionButtons = (request) => {
    // Since we're only showing pending requests, always show the approve button
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleRequestAction(request.id, "approve")}
          disabled={processing[request.id]}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {processing[request.id] ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Approve Request
            </>
          )}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Enrollment Requests
          </h3>
          <p className="text-gray-500">
            You don't have any pending enrollment requests at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            notification.type === "success"
              ? "bg-green-100 border border-green-400 text-green-800"
              : "bg-red-100 border border-red-400 text-red-800"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 mr-2" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Enrollment Requests List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Enrollment Requests ({requests.length})
            </h3>
            <button
              onClick={fetchEnrollmentRequests}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <ClockIcon className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {request.student_name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {request.course_name}
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-13">
                    {getStatusBadge(request.is_approved)}
                  </div>
                </div>

                <div className="ml-6 flex-shrink-0">
                  {getActionButtons(request)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EnrollmentRequests;

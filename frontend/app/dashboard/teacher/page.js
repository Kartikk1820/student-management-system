"use client";
import { useState } from "react";
import RoleGuard from "../../../components/RoleGuard";
import AttendanceForm from "../../../components/AttendanceForm";
import AttendanceTable from "../../../components/AttendanceTable";
import {
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAttendanceSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "attendance", name: "Mark Attendance", icon: CalendarIcon },
    { id: "view-attendance", name: "View Attendance", icon: BookOpenIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
                Welcome to Your Teacher Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Manage your courses, track student attendance, and monitor
                academic progress. Use the tabs above to navigate between
                different features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900">5</div>
                      <div className="text-sm text-blue-600">
                        Active Courses
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-green-900">
                        45
                      </div>
                      <div className="text-sm text-green-600">
                        Total Students
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-purple-900">
                        12
                      </div>
                      <div className="text-sm text-purple-600">
                        Classes This Week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("attendance")}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200 text-left"
                >
                  <CalendarIcon className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="font-medium text-blue-900">
                    Mark Attendance
                  </div>
                  <div className="text-sm text-blue-600">
                    Record student attendance for today's classes
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("view-attendance")}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200 text-left"
                >
                  <BookOpenIcon className="h-6 w-6 text-green-600 mb-2" />
                  <div className="font-medium text-green-900">
                    View Attendance
                  </div>
                  <div className="text-sm text-green-600">
                    Check attendance records and statistics
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
                Attendance Management
              </h2>
              <p className="text-gray-600 mb-6">
                Mark attendance for your students. Select a course and date,
                then mark each student as present or absent.
              </p>
            </div>

            <AttendanceForm onAttendanceSaved={handleAttendanceSaved} />
          </div>
        );

      case "view-attendance":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
                Attendance Records
              </h2>
              <p className="text-gray-600 mb-6">
                View attendance records for your courses on specific dates.
                Select a course and date to see which students were present or
                absent.
              </p>
            </div>

            <AttendanceTable
              type="teacher"
              key={refreshKey}
              onRefresh={handleAttendanceSaved}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <RoleGuard allowedRoles={["teacher", "admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Teacher Dashboard
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                Welcome back, Teacher!
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </main>
      </div>
    </RoleGuard>
  );
}

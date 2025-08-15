"use client";
import { useState, useEffect } from "react";
import {
  CalendarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/authApi.js";

const AttendanceTable = ({
  type = "student", // 'student' or 'teacher'
  courseId = null,
  onRefresh,
}) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(courseId || "");
  const [selectedDate, setSelectedDate] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (type === "teacher") {
      fetchTeacherCourses();
    }
  }, [type]);

  useEffect(() => {
    if (type === "teacher" && selectedCourse && selectedDate) {
      fetchCourseAttendanceByDate();
    }
  }, [selectedCourse, selectedDate, type]);

  const fetchTeacherCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await api.get("/courses/teacher/my");
      if (response.data.success) {
        setCourses(response.data.data);
        if (response.data.data.length > 0 && !selectedCourse) {
          setSelectedCourse(response.data.data[0].id);
          // Set today's date as default
          setSelectedDate(today);
        }
      }
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchCourseAttendanceByDate = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/attendance/course/${selectedCourse}/date/${selectedDate}`
      );
      if (response.data.success) {
        setAttendance(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching course attendance:", error);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (type === "teacher" && selectedCourse && selectedDate) {
      fetchCourseAttendanceByDate();
    }
    if (onRefresh) onRefresh();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "long",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "present") {
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    }
    return <XCircleIcon className="h-5 w-5 text-red-600" />;
  };

  const getStatusBadge = (status) => {
    if (status === "present") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Present
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Absent
      </span>
    );
  };

  const today = new Date().toISOString().split("T")[0];

  if (type === "teacher" && coursesLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            {type === "teacher" ? "Course Attendance" : "My Attendance"}
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
        >
          <ArrowPathIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Course and Date Selection for Teachers */}
      {type === "teacher" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="" className="text-gray-500">
                Choose a course
              </option>
              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                  className="text-gray-900"
                >
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {type === "teacher" && (!selectedCourse || !selectedDate) ? (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Please select both a course and date to view attendance records.
          </p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : attendance.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {type === "teacher"
              ? "No attendance records found for this course and date."
              : "No attendance records found."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {type === "teacher" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                )}
                {type === "teacher" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {type === "teacher" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {record.student_name?.charAt(0).toUpperCase() ||
                              "S"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.student_name || "Unknown Student"}
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                  {type === "teacher" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {record.student_id}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(record.status)}
                      <span className="ml-2">
                        {getStatusBadge(record.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {attendance.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {attendance.length}
              </div>
              <div className="text-sm text-gray-500">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendance.filter((r) => r.status === "present").length}
              </div>
              <div className="text-sm text-gray-500">Present</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendance.filter((r) => r.status === "absent").length}
              </div>
              <div className="text-sm text-gray-500">Absent</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;

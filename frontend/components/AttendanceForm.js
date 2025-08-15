"use client";
import { useState, useEffect } from "react";
import {
  CalendarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  UserIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/authApi.js";

const AttendanceForm = ({ onAttendanceSaved }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    fetchTeacherCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      // Get students from the selected course data
      const selectedCourseData = courses.find(
        (course) => course.id === selectedCourse
      );
      if (selectedCourseData && selectedCourseData.students_with_names) {
        setStudents(selectedCourseData.students_with_names);
        // Initialize attendance state for all students
        const initialAttendance = {};
        selectedCourseData.students_with_names.forEach((student) => {
          initialAttendance[student.id] = "present"; // Default to present
        });
        setAttendance(initialAttendance);
      }
    }
  }, [selectedCourse, selectedDate, courses]);

  const fetchTeacherCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await api.get("/courses/teacher/my");
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teacher courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedDate) {
      alert("Please select both course and date");
      return;
    }

    if (students.length === 0) {
      alert("No students enrolled in this course");
      return;
    }

    setLoading(true);
    try {
      const attendanceData = Object.entries(attendance).map(
        ([studentId, status]) => ({
          course_id: selectedCourse,
          student_id: studentId,
          date: selectedDate,
          status,
        })
      );

      // Mark attendance for all students
      for (const record of attendanceData) {
        await api.post("/attendance/mark", record);
      }

      alert("Attendance marked successfully!");
      setAttendance({});
      setSelectedDate("");
      if (onAttendanceSaved) {
        onAttendanceSaved();
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <BookOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          {coursesLoading ? (
            <div className="animate-pulse bg-gray-100 h-10 rounded-lg"></div>
          ) : (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
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
                  {course.name} ({course.enrolled_students_count || 0} students)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date Selection */}
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
              required
            />
          </div>
        </div>

        {/* Students Table */}
        {selectedCourse && selectedDate && students.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                <UserGroupIcon className="h-5 w-5 inline mr-2 text-gray-500" />
                Mark Attendance for Enrolled Students
              </label>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {students.length} student{students.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <IdentificationIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 font-mono">
                            {student.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student.id, "present")
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              attendance[student.id] === "present"
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-green-100 hover:shadow-sm"
                            }`}
                          >
                            <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(student.id, "absent")
                            }
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              attendance[student.id] === "absent"
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-gray-200 text-gray-700 hover:bg-red-100 hover:shadow-sm"
                            }`}
                          >
                            <XCircleIcon className="h-4 w-4 inline mr-1" />
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Students Message */}
        {selectedCourse && selectedDate && students.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">
              No Students Enrolled
            </p>
            <p className="text-gray-400 text-sm mt-1">
              This course doesn't have any enrolled students yet.
            </p>
          </div>
        )}

        {/* Submit Button */}
        {selectedCourse && selectedDate && students.length > 0 && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Saving Attendance...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Save Attendance for {students.length} Student
                {students.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default AttendanceForm;

"use client";
import { useState, useEffect } from "react";
import RoleGuard from "@/components/RoleGuard";
import {
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  PlusIcon,
  UserPlusIcon,
  LinkIcon,
  ChartBarIcon,
  CogIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import api from "../../../utils/authApi.js";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Course creation state
  const [courseForm, setCourseForm] = useState({
    name: "",
    duration: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  // Promotion state
  const [promotionForm, setPromotionForm] = useState({
    student_id: "",
    course_id: "",
  });

  // Assignment state
  const [assignmentForm, setAssignmentForm] = useState({
    course_id: "",
    teacher_id: "",
  });

  // Data state
  const [students, setStudents] = useState([]);
  const [unassignedCourses, setUnassignedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setDataLoading(true);
      await Promise.all([
        fetchStudents(),
        fetchUnassignedCourses(),
        fetchAllCourses(),
        fetchTeachers(),
      ]);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/admin/students");
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchUnassignedCourses = async () => {
    try {
      const response = await api.get("/admin/unassigned-courses");
      if (response.data.success) {
        setUnassignedCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching unassigned courses:", error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await api.get("/courses");
      if (response.data.success) {
        setAllCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      // Assuming there's an endpoint to get teachers
      const response = await api.get("/admin/teachers");
      if (response.data.success) {
        setTeachers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      // If endpoint doesn't exist, we'll handle it gracefully
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/admin/courses", courseForm);
      if (response.data.success) {
        showNotification("Course created successfully!", "success");
        setCourseForm({
          name: "",
          duration: "",
          description: "",
          start_date: "",
          end_date: "",
        });
        fetchUnassignedCourses();
        fetchAllCourses();
      }
    } catch (error) {
      console.error("Error creating course:", error);
      showNotification("Failed to create course", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/admin/promote-student", promotionForm);
      if (response.data.success) {
        showNotification(
          "Student promoted to teacher successfully!",
          "success"
        );
        setPromotionForm({ student_id: "", course_id: "" });
        fetchStudents();
        fetchTeachers();
        fetchUnassignedCourses();
      }
    } catch (error) {
      console.error("Error promoting student:", error);
      showNotification("Failed to promote student", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/admin/assign-course", assignmentForm);
      if (response.data.success) {
        showNotification("Course assigned to teacher successfully!", "success");
        setAssignmentForm({ course_id: "", teacher_id: "" });
        fetchUnassignedCourses();
        fetchAllCourses();
      }
    } catch (error) {
      console.error("Error assigning course:", error);
      showNotification("Failed to assign course", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: ChartBarIcon },
    { id: "create-course", name: "Create Course", icon: PlusIcon },
    { id: "promote-student", name: "Promote Student", icon: UserPlusIcon },
    { id: "assign-course", name: "Assign Course", icon: LinkIcon },
    { id: "manage-data", name: "Manage Data", icon: CogIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Courses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {allCourses.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {students.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Teachers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {teachers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Unassigned Courses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {unassignedCourses.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab("create-course")}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200 text-left"
                >
                  <PlusIcon className="h-6 w-6 text-blue-600 mb-2" />
                  <div className="font-medium text-blue-900">
                    Create New Course
                  </div>
                  <div className="text-sm text-blue-600">
                    Add a new course to the system
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("promote-student")}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200 text-left"
                >
                  <UserPlusIcon className="h-6 w-6 text-green-600 mb-2" />
                  <div className="font-medium text-green-900">
                    Promote Student
                  </div>
                  <div className="text-sm text-green-600">
                    Promote a student to teacher role
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("assign-course")}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200 text-left"
                >
                  <LinkIcon className="h-6 w-6 text-purple-600 mb-2" />
                  <div className="font-medium text-purple-900">
                    Assign Course
                  </div>
                  <div className="text-sm text-purple-600">
                    Assign course to a teacher
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case "create-course":
        return (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <PlusIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Course
              </h2>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={courseForm.name}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={courseForm.duration}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, duration: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={courseForm.start_date}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        start_date: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={courseForm.end_date}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, end_date: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Course...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create Course
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case "promote-student":
        return (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <UserPlusIcon className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Promote Student to Teacher
              </h2>
            </div>

            <form onSubmit={handlePromoteStudent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    value={promotionForm.student_id}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        student_id: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Choose a student
                    </option>
                    {students.map((student) => (
                      <option
                        key={student.id}
                        value={student.id}
                        className="text-gray-900"
                      >
                        {student.name} ({student.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select
                    value={promotionForm.course_id}
                    onChange={(e) =>
                      setPromotionForm({
                        ...promotionForm,
                        course_id: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Choose a course
                    </option>
                    {unassignedCourses.map((course) => (
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
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>This action will:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>
                          Change the student's role from "student" to "teacher"
                        </li>
                        <li>Assign them to the selected course</li>
                        <li>This action cannot be easily undone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Promoting Student...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Promote to Teacher
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case "assign-course":
        return (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <LinkIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Course to Teacher
              </h2>
            </div>

            <form onSubmit={handleAssignCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <select
                    value={assignmentForm.course_id}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        course_id: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Choose a course
                    </option>
                    {unassignedCourses.map((course) => (
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
                    Select Teacher
                  </label>
                  <select
                    value={assignmentForm.teacher_id}
                    onChange={(e) =>
                      setAssignmentForm({
                        ...assignmentForm,
                        teacher_id: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Choose a teacher
                    </option>
                    {teachers.map((teacher) => (
                      <option
                        key={teacher.id}
                        value={teacher.id}
                        className="text-gray-900"
                      >
                        {teacher.name || teacher.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Assigning Course...
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-5 w-5 mr-2" />
                    Assign Course
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case "manage-data":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    All Students
                  </h2>
                </div>
                <button
                  onClick={fetchStudents}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {dataLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
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
                                  {student.name?.charAt(0).toUpperCase() || "S"}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name || "Unknown"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-mono">
                              {student.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {student.email || "N/A"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Teacher Assignments
                  </h2>
                </div>
                <button
                  onClick={fetchTeachers}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {dataLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">
                    No teachers found in the system
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teacher ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher) => {
                        // Find all courses assigned to this teacher
                        const assignedCourses = allCourses.filter(
                          (course) => course.teacher === teacher.id
                        );

                        return (
                          <tr key={teacher.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-purple-600 font-semibold text-sm">
                                    {(teacher.name || teacher.email || "T")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {teacher.name || "Unknown"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {teacher.email || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">
                                {teacher.id}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {assignedCourses.length > 0 ? (
                                <div className="text-sm font-medium text-green-600">
                                  ✓ {assignedCourses.length} Course
                                  {assignedCourses.length > 1 ? "s" : ""}
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-orange-600">
                                  ⚠ No Course
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {assignedCourses.length > 0 ? (
                                <div className="space-y-2">
                                  {assignedCourses.map((course, index) => (
                                    <div
                                      key={course.id}
                                      className={`p-3 rounded-lg border ${
                                        index > 0 ? "mt-2" : ""
                                      } ${
                                        assignedCourses.length > 1
                                          ? "bg-gray-50 border-gray-200"
                                          : "bg-white border-gray-100"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="text-sm font-medium text-gray-900">
                                            {course.name}
                                          </div>
                                          <div className="text-sm text-gray-500">
                                            {course.duration} minutes
                                          </div>
                                          <div className="text-sm text-gray-400">
                                            {new Date(
                                              course.start_date
                                            ).toLocaleDateString()}{" "}
                                            -{" "}
                                            {new Date(
                                              course.end_date
                                            ).toLocaleDateString()}
                                          </div>
                                        </div>
                                        {assignedCourses.length > 1 && (
                                          <div className="ml-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                              Course {index + 1}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">
                                  No course assigned
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Unassigned Courses
                  </h2>
                </div>
                <button
                  onClick={fetchUnassignedCourses}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {dataLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ) : unassignedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">
                    All courses are assigned to teachers!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unassignedCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {course.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {course.duration} minutes
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(course.start_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(course.end_date).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage courses, users, and system settings
                </p>
              </div>
              <button
                onClick={fetchInitialData}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ArrowPathIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center">
              {notification.type === "success" && (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              )}
              {notification.type === "error" && (
                <XCircleIcon className="h-5 w-5 mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </div>
    </RoleGuard>
  );
}

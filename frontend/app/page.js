"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import api from "../utils/authApi.js";
import CourseCard from "../components/CourseCard";
import ScrollableCourses from "../components/ScrollableCourses";
import Notification from "../components/Notification";
import StatsCard from "../components/StatsCard";
import QuickActionCard from "../components/QuickActionCard";
import CourseDetailsModal from "../components/CourseDetailsModal";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [enrollmentStatuses, setEnrollmentStatuses] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    setUser({ role });
    setLoading(false);
    fetchCourses();
    // Only fetch enrolled courses for students
    if (role === "student") {
      fetchEnrolledCourses();
      fetchEnrollmentStatuses();
    }
  }, [router]);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await api.get("/courses");
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showNotification("Failed to fetch courses", "error");
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      setEnrolledLoading(true);
      const response = await api.get("/courses/enrolled/my");
      if (response.data.success) {
        setEnrolledCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setEnrolledLoading(false);
    }
  };

  const fetchEnrollmentStatuses = async () => {
    try {
      const response = await api.get("/enrollments/my-requests");
      if (response.data.success) {
        const statuses = {};
        response.data.data.forEach((request) => {
          statuses[request.course_id] = request.is_approved
            ? "approved"
            : "pending";
        });
        setEnrollmentStatuses(statuses);
      }
    } catch (error) {
      console.error("Error fetching enrollment statuses:", error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling((prev) => ({ ...prev, [courseId]: true }));
      await api.post("/api/enrollments/request", { course_id: courseId });

      // Update enrollment status locally
      setEnrollmentStatuses((prev) => ({ ...prev, [courseId]: "pending" }));

      showNotification("Enrollment request sent successfully!", "success");

      // Refresh enrollment statuses
      fetchEnrollmentStatuses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
      showNotification(
        "Failed to send enrollment request. Please try again.",
        "error"
      );
    } finally {
      setEnrolling((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const handleDashboardRedirect = () => {
    if (user?.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user?.role === "teacher") {
      router.push("/dashboard/teacher");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={5000}
        />
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onEnroll={handleEnroll}
          enrollmentStatus={enrollmentStatuses[selectedCourse.id]}
          isEnrolling={enrolling[selectedCourse.id]}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Student Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome,{" "}
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Learning Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access your courses, track your progress, and stay connected with
            your educational journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <QuickActionCard
            icon={BookOpenIcon}
            title="My Courses"
            description="View your enrolled courses and track your academic progress."
            onClick={() => {}}
            iconColor="text-blue-600"
            buttonColor="text-blue-600"
            buttonHoverColor="hover:text-blue-700"
          />

          <QuickActionCard
            icon={CalendarIcon}
            title="Class Schedule"
            description="Check your upcoming classes and important dates."
            onClick={() => {}}
            iconColor="text-green-600"
            buttonColor="text-green-600"
            buttonHoverColor="hover:text-green-700"
          />

          <QuickActionCard
            icon={BellIcon}
            title="Notifications"
            description="Stay updated with important announcements and updates."
            onClick={() => {}}
            iconColor="text-orange-600"
            buttonColor="text-orange-600"
            buttonHoverColor="hover:text-orange-700"
          />
        </div>

        {/* Enrolled Courses Section - Only for Students */}
        {user?.role === "student" && (
          <ScrollableCourses
            courses={enrolledCourses}
            loading={enrolledLoading}
            title="My Enrolled Courses"
            showEnrollButton={false}
            variant="compact"
            onCourseClick={handleCourseClick}
          />
        )}

        {/* Available Courses Section */}
        {user?.role === "student" && (
          <ScrollableCourses
            courses={courses}
            loading={coursesLoading}
            onEnroll={handleEnroll}
            enrolling={enrolling}
            enrollmentStatuses={enrollmentStatuses}
            title="Available Courses"
            showEnrollButton={true}
            onCourseClick={handleCourseClick}
          />
        )}

        {/* Role-specific Content */}
        {user?.role === "admin" && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Administrator Dashboard
                </h3>
                <p className="text-purple-100 mb-4">
                  Manage users, courses, and system settings. Access
                  comprehensive analytics and administrative tools.
                </p>
                <button
                  onClick={handleDashboardRedirect}
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
              <CogIcon className="h-24 w-24 text-purple-200" />
            </div>
          </div>
        )}

        {user?.role === "teacher" && (
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Teacher Dashboard</h3>
                <p className="text-green-100 mb-4">
                  Manage your classes, grade assignments, and track student
                  progress. Access teaching resources and tools.
                </p>
                <button
                  onClick={handleDashboardRedirect}
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
              <UserGroupIcon className="h-24 w-24 text-green-200" />
            </div>
          </div>
        )}

        {user?.role === "student" && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Student Portal</h3>
                <p className="text-blue-100 mb-4">
                  Access your courses, submit assignments, and track your
                  academic progress. Everything you need is right here.
                </p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center">
                  Explore Courses
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
              <AcademicCapIcon className="h-24 w-24 text-blue-200" />
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={BookOpenIcon}
            title="Total Courses"
            value={courses.length}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <StatsCard
            icon={ChartBarIcon}
            title="Enrolled Courses"
            value={user?.role === "student" ? enrolledCourses.length : "N/A"}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />

          <StatsCard
            icon={CalendarIcon}
            title="Classes Today"
            value="3"
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />

          <StatsCard
            icon={BellIcon}
            title="Notifications"
            value="5"
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  New assignment posted in Mathematics 101
                </span>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Grade updated for Science Project
                </span>
                <span className="text-sm text-gray-400">1 day ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">
                  New course material available in History
                </span>
                <span className="text-sm text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

"use client";
import { Fragment } from "react";
import {
  XMarkIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const CourseDetailsModal = ({
  course,
  isOpen,
  onClose,
  onEnroll,
  enrollmentStatus = null,
  isEnrolling = false,
}) => {
  if (!isOpen || !course) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} hours ${mins} minutes` : `${mins} minutes`;
  };

  const getEnrollmentButton = () => {
    if (enrollmentStatus === "approved") {
      return (
        <div className="w-full bg-green-100 text-green-800 py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg">
          <AcademicCapIcon className="h-6 w-6 mr-2" />
          Already Enrolled
        </div>
      );
    }

    if (enrollmentStatus === "pending") {
      return (
        <div className="w-full bg-yellow-100 text-yellow-800 py-4 px-6 rounded-xl font-semibold flex items-center justify-center text-lg">
          <ClockIcon className="h-6 w-6 mr-2" />
          Enrollment Pending Approval
        </div>
      );
    }

    return (
      <button
        onClick={() => onEnroll(course.id)}
        disabled={isEnrolling}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-lg"
      >
        {isEnrolling ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing Enrollment...
          </>
        ) : (
          <>
            <BookOpenIcon className="h-6 w-6 mr-2" />
            Enroll in Course
          </>
        )}
      </button>
    );
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{course.name}</h2>
                  <p className="text-blue-100 text-lg">{course.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Course Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <BookOpenIcon className="h-6 w-6 mr-2 text-blue-600" />
                      Course Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-700">
                        <UserIcon className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium">Instructor:</span>
                        <span className="ml-2 text-gray-900">
                          {course.teacher_name}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <ClockIcon className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDuration(course.duration)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium">Start Date:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(course.start_date)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-5 w-5 mr-3 text-gray-500" />
                        <span className="font-medium">End Date:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(course.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Course Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Right Column - Enrollment & Additional Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Enrollment
                    </h3>
                    {getEnrollmentButton()}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What You'll Learn
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>
                          Comprehensive understanding of{" "}
                          {course.name.toLowerCase()}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Practical skills and hands-on experience</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Expert guidance from {course.teacher_name}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span>Flexible learning schedule</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Course Benefits
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Flexible Schedule</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Expert Instructor</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Practical Learning</span>
                      </div>
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Progress Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CourseDetailsModal;

"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import CourseCard from "./CourseCard";

const ScrollableCourses = ({
  courses,
  loading,
  onEnroll = null,
  enrolling = {},
  enrollmentStatuses = {},
  title = "Available Courses",
  showEnrollButton = true,
  variant = "default",
  onCourseClick = null, // New prop for handling course clicks
}) => {
  const scrollCourses = (direction) => {
    const container = document.getElementById("courses-container");
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No courses available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scrollCourses("left")}
            className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => scrollCourses("right")}
            className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          id="courses-container"
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((course) => (
            <div key={course.id} className="flex-shrink-0">
              <CourseCard
                course={course}
                onEnroll={onEnroll}
                enrollmentStatus={enrollmentStatuses[course.id]}
                isEnrolling={
                  enrolling && enrolling[course.id]
                    ? enrolling[course.id]
                    : false
                }
                showEnrollButton={showEnrollButton}
                variant={variant}
                onClick={onCourseClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableCourses;

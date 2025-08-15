"use client";
import {
  UserIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const CourseCard = ({
  course,
  onEnroll,
  enrollmentStatus = null,
  isEnrolling = false,
  showEnrollButton = true,
  variant = "default", // "default", "enrolled", "compact"
  onClick = null, // New prop for handling card clicks
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEnrollmentButton = () => {
    if (!showEnrollButton) return null;

    if (enrollmentStatus === "approved") {
      return (
        <div className="w-full bg-green-100 text-green-800 py-3 px-4 rounded-lg font-semibold flex items-center justify-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Enrolled
        </div>
      );
    }

    if (enrollmentStatus === "pending") {
      return (
        <div className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg font-semibold flex items-center justify-center">
          <PendingIcon className="h-5 w-5 mr-2" />
          Pending Approval
        </div>
      );
    }

    return (
      <button
        onClick={() => onEnroll(course.id)}
        disabled={isEnrolling}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
      >
        {isEnrolling ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Enrolling...
          </>
        ) : (
          "Enroll Now"
        )}
      </button>
    );
  };

  const getCardClasses = () => {
    const baseClasses =
      "bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200";

    if (variant === "compact") {
      return `${baseClasses} w-[280px] h-[420px] flex-shrink-0`;
    }

    return `${baseClasses} w-[320px] h-[520px] flex-shrink-0`;
  };

  const getContentPadding = () => {
    return variant === "compact" ? "p-4" : "p-6";
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(course);
    }
  };

  return (
    <div className={`${getCardClasses()} ${onClick ? "cursor-pointer" : ""}`}>
      <div className={`${getContentPadding()} h-full flex flex-col`}>
        {/* Clickable header area */}
        <div
          className={`flex-1 ${onClick ? "cursor-pointer" : ""}`}
          onClick={onClick ? handleCardClick : undefined}
        >
          <div className="flex items-start justify-between mb-4">
            <h3
              className={`font-bold text-gray-900 line-clamp-2 ${
                variant === "compact" ? "text-lg" : "text-xl"
              } ${
                onClick
                  ? "hover:text-blue-600 transition-colors duration-200"
                  : ""
              }`}
            >
              {course.name}
            </h3>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0">
              {course.duration} min
            </div>
          </div>

          <p
            className={`text-gray-600 mb-4 line-clamp-3 ${
              variant === "compact" ? "text-sm" : "text-base"
            }`}
          >
            {course.description}
          </p>

          {/* Course details - clickable */}
          <div
            className={`space-y-3 mb-4 ${
              variant === "compact" ? "space-y-2" : "space-y-3"
            }`}
          >
            <div className="flex items-center text-sm text-gray-500">
              <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">Teacher: {course.teacher_name}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Duration: {formatDuration(course.duration)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Start: {formatDate(course.start_date)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>End: {formatDate(course.end_date)}</span>
            </div>
          </div>

          {/* View Details button when card is clickable */}
          {onClick && (
            <div className="mb-4">
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm">
                <EyeIcon className="h-4 w-4 mr-1" />
                View Details
              </button>
            </div>
          )}
        </div>

        {/* Enrollment button - positioned at bottom */}
        <div className="mt-auto">{getEnrollmentButton()}</div>
      </div>
    </div>
  );
};

export default CourseCard;

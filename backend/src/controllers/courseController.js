import {
  getAllCourses,
  getCourseById,
  getCoursesByTeacher,
} from "../models/courseModel.js";

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({
      success: true,
      data: courses,
      message: "Courses retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// Get course by ID
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
      message: "Course retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: error.message,
    });
  }
};

// Get enrolled courses by student
export const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.id; // From auth middleware

    // Get all courses and filter by student enrollment
    const allCourses = await getAllCourses();
    const enrolledCourses = allCourses.filter(
      (course) => course.students && course.students.includes(studentId)
    );

    res.status(200).json({
      success: true,
      data: enrolledCourses,
      message: "Enrolled courses retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting enrolled courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve enrolled courses",
      error: error.message,
    });
  }
};

// Get courses taught by teacher
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id; // From auth middleware

    // Get courses directly from database for better performance
    const teacherCourses = await getCoursesByTeacher(teacherId);

    // Transform the response to include student names
    const transformedCourses = teacherCourses.map((course) => ({
      ...course,
      students: course.students_with_names || [],
      enrolled_students_count: parseInt(course.enrolled_students_count) || 0,
    }));

    res.status(200).json({
      success: true,
      data: transformedCourses,
      message: "Teacher courses retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting teacher courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher courses",
      error: error.message,
    });
  }
};

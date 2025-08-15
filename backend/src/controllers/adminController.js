import {
  getUserById,
  updateUserRole,
  getAllUsersByRole,
} from "../models/userModel.js";
import {
  getCourseById,
  updateCourseTeacher,
  getCoursesWithoutTeacher,
  createCourse,
} from "../models/courseModel.js";

// Create a course without a teacher (admin only)
export const createCourseWithoutTeacher = async (req, res) => {
  try {
    const { name, duration, description, start_date, end_date } = req.body;

    // Create course without teacher
    const course = await createCourse({
      name,
      duration,
      description,
      start_date,
      end_date,
      // teacher field is omitted intentionally
    });

    res.status(201).json({
      success: true,
      data: course,
      message: "Course created successfully without teacher assignment",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Change student role to teacher and assign course
export const changeStudentToTeacher = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;
    // console.log("student_id", student_id);
    // console.log("course_id", course_id);

    const admin_id = req.user.id;

    // Validate student exists and is actually a student
    const student = await getUserById(student_id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "User is not a student",
      });
    }

    // Validate course exists
    // console.log("Looking for course with ID:", course_id);
    const course = await getCourseById(course_id);
    // console.log("course", course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if course already has a teacher
    if (course.teacher) {
      return res.status(400).json({
        success: false,
        message: "Course already has a teacher assigned",
      });
    }

    // Update user role from student to teacher
    const updatedUser = await updateUserRole(student_id, "teacher");

    // Assign course to the new teacher
    const updatedCourse = await updateCourseTeacher(course_id, student_id);

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
        course: updatedCourse,
      },
      message:
        "Student successfully promoted to teacher and assigned to course",
    });
  } catch (error) {
    console.error("Error changing student to teacher:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change student role",
      error: error.message,
    });
  }
};

// Assign existing course to a teacher
export const assignCourseToTeacher = async (req, res) => {
  try {
    const { course_id, teacher_id } = req.body;
    const admin_id = req.user.id;

    // Validate course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if course already has a teacher
    if (course.teacher) {
      return res.status(400).json({
        success: false,
        message: "Course already has a teacher assigned",
      });
    }

    // Validate teacher exists and is actually a teacher
    const teacher = await getUserById(teacher_id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    if (teacher.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "User is not a teacher",
      });
    }

    // Assign course to teacher
    const updatedCourse = await updateCourseTeacher(course_id, teacher_id);

    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Course successfully assigned to teacher",
    });
  } catch (error) {
    console.error("Error assigning course to teacher:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign course to teacher",
      error: error.message,
    });
  }
};

// Get all students (for admin to select from)
export const getAllStudents = async (req, res) => {
  try {
    const students = await getAllUsersByRole("student");

    res.status(200).json({
      success: true,
      data: students,
      message: "Students retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve students",
      error: error.message,
    });
  }
};

// Get all teachers (for admin)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await getAllUsersByRole("teacher");

    res.status(200).json({
      success: true,
      data: teachers,
      message: "Teachers retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting teachers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teachers",
      error: error.message,
    });
  }
};

// Get all courses without teachers (for admin to assign)
export const getUnassignedCourses = async (req, res) => {
  try {
    const courses = await getCoursesWithoutTeacher();

    res.status(200).json({
      success: true,
      data: courses,
      message: "Unassigned courses retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting unassigned courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve unassigned courses",
      error: error.message,
    });
  }
};

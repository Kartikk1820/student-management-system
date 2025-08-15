import {
  createEnrollmentRequest,
  getAllEnrollmentRequests,
  getEnrollmentRequestsForTeacher,
  getEnrollmentRequestsByStudent,
  updateEnrollmentStatus,
} from "../models/enrollmentModel.js";
import {
  getCourseById,
  addStudentToCourse,
  removeStudentFromCourse,
} from "../models/courseModel.js";

// Send enrollment request (student)
export const sendEnrollmentRequest = async (req, res) => {
  try {
    const { course_id } = req.body;
    const student_id = req.user.id; // From auth middleware

    // Validate course exists
    const course = await getCourseById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is already enrolled
    if (course.students && course.students.includes(student_id)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    const enrollmentData = {
      teacher_id: course.teacher,
      course_id,
      student_id,
    };

    const enrollment = await createEnrollmentRequest(enrollmentData);

    res.status(201).json({
      success: true,
      data: enrollment,
      message: "Enrollment request sent successfully",
    });
  } catch (error) {
    console.error("Error sending enrollment request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send enrollment request",
      error: error.message,
    });
  }
};

// Get all enrollment requests (admin)
export const getEnrollmentRequests = async (req, res) => {
  try {
    const enrollments = await getAllEnrollmentRequests();
    res.status(200).json({
      success: true,
      data: enrollments,
      message: "Enrollment requests retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting enrollment requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve enrollment requests",
      error: error.message,
    });
  }
};

// Get enrollment requests by teacher
export const getTeacherEnrollmentRequests = async (req, res) => {
  try {
    const teacher_id = req.user.id; // From auth middleware
    const enrollments = await getEnrollmentRequestsForTeacher(teacher_id);

    res.status(200).json({
      success: true,
      data: enrollments,
      message: "Teacher enrollment requests retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting teacher enrollment requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve teacher enrollment requests",
      error: error.message,
    });
  }
};

// Get enrollment requests by student
export const getStudentEnrollmentRequests = async (req, res) => {
  try {
    const student_id = req.user.id; // From auth middleware
    const enrollments = await getEnrollmentRequestsByStudent(student_id);

    res.status(200).json({
      success: true,
      data: enrollments,
      message: "Student enrollment requests retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting student enrollment requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve student enrollment requests",
      error: error.message,
    });
  }
};

// Approve/Reject enrollment request (teacher)
export const approveEnrollmentRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;
    const teacher_id = req.user.id; // From auth middleware

    // Get the enrollment request to verify teacher ownership
    const enrollments = await getEnrollmentRequestsForTeacher(teacher_id);
    const enrollment = enrollments.find((e) => e.id === id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment request not found or not authorized",
      });
    }

    const updatedEnrollment = await updateEnrollmentStatus(id, is_approved);

    // Update course enrollment based on approval status
    if (is_approved) {
      await addStudentToCourse(enrollment.course_id, enrollment.student_id);
    } else {
      // If rejecting, remove student from course if they were previously added
      await removeStudentFromCourse(
        enrollment.course_id,
        enrollment.student_id
      );
    }

    res.status(200).json({
      success: true,
      data: updatedEnrollment,
      message: `Enrollment request ${
        is_approved ? "approved" : "rejected"
      } successfully`,
    });
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment status",
      error: error.message,
    });
  }
};

import {
  markAttendance,
  getStudentAttendance,
  getCourseAttendance,
  getAttendanceByDate,
  getAttendanceStats,
} from "../models/attendanceModel.js";
import { getCourseById } from "../models/courseModel.js";

// Mark attendance (Teacher)
export const markStudentAttendance = async (req, res) => {
  try {
    const { course_id, student_id, date, status } = req.body;
    const teacher_id = req.user.id;

    // Validate course exists and teacher owns it
    const course = await getCourseById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher !== teacher_id) {
      return res.status(403).json({
        success: false,
        message: "You can only mark attendance for your own courses",
      });
    }

    // Validate status
    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'present' or 'absent'",
      });
    }

    const attendance = await markAttendance({
      course_id,
      student_id,
      date,
      status,
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });
  }
};

// Get student's own attendance
export const getMyAttendance = async (req, res) => {
  try {
    const student_id = req.user.id;
    const attendance = await getStudentAttendance(student_id);

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting student attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance",
      error: error.message,
    });
  }
};

// Get course attendance (Teacher)
export const getCourseAttendanceRecords = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacher_id = req.user.id;

    // Validate course exists and teacher owns it
    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher !== teacher_id) {
      return res.status(403).json({
        success: false,
        message: "You can only view attendance for your own courses",
      });
    }

    const attendance = await getCourseAttendance(courseId);

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Course attendance retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting course attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course attendance",
      error: error.message,
    });
  }
};

// Get attendance by specific date (Teacher)
export const getAttendanceForDate = async (req, res) => {
  try {
    const { courseId, date } = req.params;
    const teacher_id = req.user.id;

    // Validate course exists and teacher owns it
    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacher !== teacher_id) {
      return res.status(403).json({
        success: false,
        message: "You can only view attendance for your own courses",
      });
    }

    const attendance = await getAttendanceByDate(courseId, date);

    res.status(200).json({
      success: true,
      data: attendance,
      message: "Date attendance retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting date attendance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve date attendance",
      error: error.message,
    });
  }
};

// Get attendance statistics for a student in a course
export const getAttendanceStatistics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const student_id = req.user.id;

    const stats = await getAttendanceStats(student_id, courseId);

    res.status(200).json({
      success: true,
      data: stats,
      message: "Attendance statistics retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting attendance statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance statistics",
      error: error.message,
    });
  }
};

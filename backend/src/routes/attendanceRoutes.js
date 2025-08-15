import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  markStudentAttendance,
  getMyAttendance,
  getCourseAttendanceRecords,
  getAttendanceForDate,
  getAttendanceStatistics,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Teacher routes
// Mark attendance for a student
router.post("/mark", protect, authorize("teacher"), markStudentAttendance);

// Get attendance for a specific course (teacher only)
router.get(
  "/course/:courseId",
  protect,
  authorize("teacher"),
  getCourseAttendanceRecords
);

// Get attendance for a specific date in a course (teacher only)
router.get(
  "/course/:courseId/date/:date",
  protect,
  authorize("teacher"),
  getAttendanceForDate
);

// Student routes
// Get student's own attendance
router.get("/my-attendance", protect, authorize("student"), getMyAttendance);

// Get attendance statistics for a student in a course
router.get(
  "/stats/:courseId",
  protect,
  authorize("student"),
  getAttendanceStatistics
);

export default router;

import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getCourses,
  getCourse,
  getEnrolledCourses,
  getTeacherCourses,
} from "../controllers/courseController.js";

const router = express.Router();

// Public route - Get all courses (no authentication required)
router.get("/", getCourses);

// Get course by ID (no authentication required)
router.get("/:id", getCourse);

// Protected routes
// Get enrolled courses by student (student only)
router.get("/enrolled/my", protect, authorize("student"), getEnrolledCourses);

// Get courses taught by teacher (teacher only)
router.get("/teacher/my", protect, authorize("teacher"), getTeacherCourses);

export default router;

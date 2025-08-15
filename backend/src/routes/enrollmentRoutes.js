import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  sendEnrollmentRequest,
  getEnrollmentRequests,
  getTeacherEnrollmentRequests,
  getStudentEnrollmentRequests,
  approveEnrollmentRequest,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// Student routes
// Send enrollment request
router.post("/request", protect, authorize("student"), sendEnrollmentRequest);

// Get student's own enrollment requests
router.get(
  "/my-requests",
  protect,
  authorize("student"),
  getStudentEnrollmentRequests
);

// Teacher routes
// Get enrollment requests for teacher's courses
router.get(
  "/teacher/requests",
  protect,
  authorize("teacher"),
  getTeacherEnrollmentRequests
);

// Approve/Reject enrollment request
router.put(
  "/approve/:id",
  protect,
  authorize("teacher"),
  approveEnrollmentRequest
);

// Admin routes
// Get all enrollment requests
router.get("/all", protect, authorize("admin"), getEnrollmentRequests);

export default router;

import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  changeStudentToTeacher,
  getAllStudents,
  getUnassignedCourses,
  createCourseWithoutTeacher,
  assignCourseToTeacher,
  getAllTeachers,
} from "../controllers/adminController.js";

const router = express.Router();

// Create course without teacher
router.post(
  "/courses",
  protect,
  authorize("admin"),
  createCourseWithoutTeacher
);

// Change student role to teacher and assign course
router.post(
  "/promote-student",
  protect,
  authorize("admin"),
  changeStudentToTeacher
);

// Assign existing course to a teacher
router.post(
  "/assign-course",
  protect,
  authorize("admin"),
  assignCourseToTeacher
);

// Get all students for selection
router.get("/students", protect, authorize("admin"), getAllStudents);

// Get all teachers
router.get("/teachers", protect, authorize("admin"), getAllTeachers);

// Get unassigned courses for assignment
router.get(
  "/unassigned-courses",
  protect,
  authorize("admin"),
  getUnassignedCourses
);

export default router;

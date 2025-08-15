import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";
import { createUserTable } from "./models/userModel.js";

import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import { initTables } from "./models/index.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// // Debug middleware to log all requests
// app.use((req, res, next) => {
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to check if body is parsed
// app.use((req, res, next) => {
//   if (req.method === "POST" || req.method === "PUT") {
//     console.log("Body after parsing:", req.body);
//   }
//   next();
// });

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);

initTables();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

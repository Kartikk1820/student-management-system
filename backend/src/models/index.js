import { createUserTable } from "./userModel.js";
import { createCourseTable } from "./courseModel.js";
import { createEnrollmentTable } from "./enrollmentModel.js";
import { createAttendanceTable } from "./attendanceModel.js";

export const initTables = async () => {
  await createUserTable();
  await createCourseTable();
  await createEnrollmentTable();
  await createAttendanceTable();
  console.log("All tables checked/created successfully.");
};

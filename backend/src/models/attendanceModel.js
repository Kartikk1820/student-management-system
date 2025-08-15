import db from "../config/db.js";

export const createAttendanceTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS attendance (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status TEXT CHECK(status IN('present', 'absent')) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(course_id, student_id, date)
    );
  `;

  await db.query(query);
};

export const markAttendance = async (attendanceData) => {
  const { course_id, student_id, date, status } = attendanceData;

  // Use UPSERT to handle duplicate entries
  const query = `
    INSERT INTO attendance (course_id, student_id, date, status)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (course_id, student_id, date)
    DO UPDATE SET status = $4, created_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [course_id, student_id, date, status];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getStudentAttendance = async (student_id) => {
  const query = `
    SELECT a.*, c.name as course_name, u.name as teacher_name
    FROM attendance a
    JOIN courses c ON a.course_id = c.id
    JOIN users u ON c.teacher = u.id
    WHERE a.student_id = $1
    ORDER BY a.date DESC, c.name;
  `;

  const result = await db.query(query, [student_id]);
  return result.rows;
};

export const getCourseAttendance = async (course_id) => {
  const query = `
    SELECT a.*, u.name as student_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    WHERE a.course_id = $1
    ORDER BY a.date DESC, u.name;
  `;

  const result = await db.query(query, [course_id]);
  return result.rows;
};

export const getAttendanceByDate = async (course_id, date) => {
  const query = `
    SELECT a.*, u.name as student_name
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    WHERE a.course_id = $1 AND a.date = $2
    ORDER BY u.name;
  `;

  const result = await db.query(query, [course_id, date]);
  return result.rows;
};

export const getAttendanceStats = async (student_id, course_id) => {
  const query = `
    SELECT 
      COUNT(*) as total_sessions,
      COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
      COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
      ROUND(
        (COUNT(CASE WHEN status = 'present' THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2
      ) as attendance_percentage
    FROM attendance
    WHERE student_id = $1 AND course_id = $2;
  `;

  const result = await db.query(query, [student_id, course_id]);
  return result.rows[0];
};

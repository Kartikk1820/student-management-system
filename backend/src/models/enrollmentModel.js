import db from "../config/db.js";

export const createEnrollmentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS enrollment_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.query(query);
};

export const createEnrollmentRequest = async (enrollmentData) => {
  const { teacher_id, course_id, student_id } = enrollmentData;
  const query = `
    INSERT INTO enrollment_requests (teacher_id, course_id, student_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [teacher_id, course_id, student_id];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const getAllEnrollmentRequests = async () => {
  const query = `
    SELECT er.*, 
           t.name as teacher_name,
           c.name as course_name,
           s.name as student_name
    FROM enrollment_requests er
    JOIN users t ON er.teacher_id = t.id
    JOIN courses c ON er.course_id = c.id
    JOIN users s ON er.student_id = s.id
    ORDER BY er.created_at DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};

export const getEnrollmentRequestById = async (id) => {
  const query = `
    SELECT er.*, 
           t.name as teacher_name,
           c.name as course_name,
           s.name as student_name
    FROM enrollment_requests er
    JOIN users t ON er.teacher_id = t.id
    JOIN courses c ON er.course_id = c.id
    JOIN users s ON er.student_id = s.id
    WHERE er.id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const getEnrollmentRequestsForTeacher = async (teacher_id) => {
  const query = `
    SELECT er.*, 
           c.name as course_name,
           s.name as student_name
    FROM enrollment_requests er
    JOIN courses c ON er.course_id = c.id
    JOIN users s ON er.student_id = s.id
    WHERE er.teacher_id = $1
    ORDER BY er.created_at DESC;
  `;

  const result = await db.query(query, [teacher_id]);
  return result.rows;
};

export const getEnrollmentRequestsByStudent = async (student_id) => {
  const query = `
    SELECT er.*, 
           t.name as teacher_name,
           c.name as course_name
    FROM enrollment_requests er
    JOIN users t ON er.teacher_id = t.id
    JOIN courses c ON er.course_id = c.id
    WHERE er.student_id = $1
    ORDER BY er.created_at DESC;
  `;

  const result = await db.query(query, [student_id]);
  return result.rows;
};

export const updateEnrollmentStatus = async (id, is_approved) => {
  const query = `
    UPDATE enrollment_requests 
    SET is_approved = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [is_approved, id]);
  return result.rows[0];
};

export const deleteEnrollmentRequest = async (id) => {
  const query = `DELETE FROM enrollment_requests WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

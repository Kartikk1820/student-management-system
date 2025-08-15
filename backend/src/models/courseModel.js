import db from "../config/db.js";

export const createCourseTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      students UUID[] DEFAULT '{}',
      duration INTEGER NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      teacher UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.query(query);
};

export const createCourse = async (courseData) => {
  const { name, duration, description, start_date, end_date, teacher } =
    courseData;

  // Handle optional teacher field
  let query, values;

  if (teacher) {
    query = `
      INSERT INTO courses (name, duration, description, start_date, end_date, teacher)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    values = [name, duration, description, start_date, end_date, teacher];
  } else {
    query = `
      INSERT INTO courses (name, duration, description, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    values = [name, duration, description, start_date, end_date];
  }

  const result = await db.query(query, values);
  return result.rows[0];
};

export const getAllCourses = async () => {
  const query = `
    SELECT c.*, u.name as teacher_name 
    FROM courses c 
    JOIN users u ON c.teacher = u.id;
  `;

  const result = await db.query(query);
  return result.rows;
};

export const getCourseById = async (id) => {
  const query = `
    SELECT c.*, u.name as teacher_name 
    FROM courses c 
    LEFT JOIN users u ON c.teacher = u.id 
    WHERE c.id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const updateCourse = async (id, courseData) => {
  const { name, duration, description, start_date, end_date } = courseData;
  const query = `
    UPDATE courses 
    SET name = $1, duration = $2, description = $3, start_date = $4, end_date = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [name, duration, description, start_date, end_date, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const deleteCourse = async (id) => {
  const query = `DELETE FROM courses WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

// Add student to course
export const addStudentToCourse = async (courseId, studentId) => {
  const query = `
    UPDATE courses 
    SET students = array_append(students, $1)
    WHERE id = $2 AND NOT ($1 = ANY(students))
    RETURNING *;
  `;

  const result = await db.query(query, [studentId, courseId]);
  return result.rows[0];
};

// Remove student from course
export const removeStudentFromCourse = async (courseId, studentId) => {
  const query = `
    UPDATE courses 
    SET students = array_remove(students, $1)
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [studentId, courseId]);
  return result.rows[0];
};

// Update course teacher
export const updateCourseTeacher = async (courseId, teacherId) => {
  const query = `
    UPDATE courses 
    SET teacher = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [teacherId, courseId]);
  return result.rows[0];
};

// Get courses without teachers
export const getCoursesWithoutTeacher = async () => {
  const query = `
    SELECT * FROM courses 
    WHERE teacher IS NULL
    ORDER BY name;
  `;

  const result = await db.query(query);
  return result.rows;
};

// Get courses by teacher ID
export const getCoursesByTeacher = async (teacherId) => {
  const query = `
    SELECT 
      c.*,
      COUNT(a.student_id) as enrolled_students_count,
      COALESCE(
        json_agg(
          json_build_object(
            'id', u.id,
            'name', u.name
          )
        ) FILTER (WHERE u.id IS NOT NULL),
        '[]'::json
      ) as students_with_names
    FROM courses c
    LEFT JOIN LATERAL (
      SELECT UNNEST(c.students) as student_id
    ) a ON true
    LEFT JOIN users u ON u.id = a.student_id
    WHERE c.teacher = $1
    GROUP BY c.id
    ORDER BY c.name;
  `;

  const result = await db.query(query, [teacherId]);
  return result.rows;
};

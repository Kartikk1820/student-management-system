import db from "../config/db.js";

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN('admin', 'teacher', 'student')) NOT NULL,
    courses UUID[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 `;

  await db.query(query);
};

export const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export const updateUserRole = async (id, newRole) => {
  const query = `
    UPDATE users 
    SET role = $1 
    WHERE id = $2 
    RETURNING *;
  `;
  const result = await db.query(query, [newRole, id]);
  return result.rows[0];
};

export const getAllUsersByRole = async (role) => {
  const query = `SELECT id, name, email, role, created_at FROM users WHERE role = $1 ORDER BY name;`;
  const result = await db.query(query, [role]);
  return result.rows;
};

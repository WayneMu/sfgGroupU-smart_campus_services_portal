const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, role = 'student', department }) {
    // Validate role
    const validRoles = ['student', 'lecturer', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role specified');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, department]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT id, name, email, role, department FROM users');
    return rows;
  }

  // New methods for role management
  static async updateRole(userId, newRole) {
    const validRoles = ['student', 'lecturer', 'admin'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);
  }

  static async getByRole(role) {
    const [rows] = await pool.query(
      'SELECT id, name, email, department FROM users WHERE role = ?',
      [role]
    );
    return rows;
  }
}

module.exports = User;
const pool = require('../config/db');

class Maintenance {
  static async create({ userId, issueType, description, urgency }) {
    const [result] = await pool.query(
      'INSERT INTO maintenance_tickets (user_id, issue_type, description, urgency) VALUES (?, ?, ?, ?)',
      [userId, issueType, description, urgency]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT m.*, u.name as user_name 
       FROM maintenance_tickets m
       JOIN users u ON m.user_id = u.id
       WHERE user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT m.*, u.name as user_name 
       FROM maintenance_tickets m
       JOIN users u ON m.user_id = u.id`
    );
    return rows;
  }
}

module.exports = Maintenance;
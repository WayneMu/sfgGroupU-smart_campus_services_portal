const pool = require('../config/db');

class Notification {
  static async create({ userId, message, urgency }) {
    const [result] = await pool.query(
      'INSERT INTO notifications (user_id, message, urgency) VALUES (?, ?, ?)',
      [userId, message, urgency]
    );
    return result.insertId;
  }

  static async getByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT n.*, u.name as user_name 
       FROM notifications n
       JOIN users u ON n.user_id = u.id
       ORDER BY created_at DESC`
    );
    return rows;
  }
}

module.exports = Notification;
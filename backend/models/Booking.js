const pool = require('../config/db');

class Booking {
  static async create({ userId, room, purpose, startTime, endTime }) {
    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, room, purpose, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
      [userId, room, purpose, startTime, endTime]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT b.*, u.name as user_name 
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE user_id = ?`, 
      [userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT b.*, u.name as user_name 
       FROM bookings b
       JOIN users u ON b.user_id = u.id`
    );
    return rows;
  }
}

module.exports = Booking;
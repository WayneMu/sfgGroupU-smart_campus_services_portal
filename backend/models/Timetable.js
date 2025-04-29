const pool = require('../config/db');

class Timetable {
  static async getByUser(userId) {
    const [rows] = await pool.query(
      `SELECT t.*, u.name as lecturer_name 
       FROM timetable t
       JOIN users u ON t.lecturer_id = u.id
       WHERE t.student_id = ? OR t.lecturer_id = ?`,
      [userId, userId]
    );
    return rows;
  }

  static async getAll() {
    const [rows] = await pool.query(
      `SELECT t.*, u1.name as lecturer_name, u2.name as student_name 
       FROM timetable t
       JOIN users u1 ON t.lecturer_id = u1.id
       LEFT JOIN users u2 ON t.student_id = u2.id`
    );
    return rows;
  }
}

module.exports = Timetable;
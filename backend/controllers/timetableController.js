const pool = require('../config/db');

exports.getUserTimetable = async (req, res) => {
  try {
    const query = `
      SELECT t.*, u.name AS lecturer_name 
      FROM timetable t
      JOIN users u ON t.lecturer_id = u.id
      WHERE (t.student_id = ? OR t.lecturer_id = ?)
      ${req.user.department ? 'AND u.department = ?' : ''}
    `;
    const params = [req.user.id, req.user.id];
    if (req.user.department) params.push(req.user.department);
    
    const [timetable] = await pool.query(query, params);
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllTimetable = async (req, res) => {
  try {
    let query = `
      SELECT t.*, u1.name AS lecturer_name, u2.name AS student_name 
      FROM timetable t
      JOIN users u1 ON t.lecturer_id = u1.id
      LEFT JOIN users u2 ON t.student_id = u2.id
    `;
    const params = [];
    if (req.departmentFilter) {
      query += ' WHERE u1.department = ?';
      params.push(req.departmentFilter);
    }
    const [timetable] = await pool.query(query, params);
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ✅ Create Timetable
exports.createTimetable = async (req, res) => {
  try {
    const { lecturer_id, student_id, subject, time, room } = req.body;
    const query = `INSERT INTO timetable (lecturer_id, student_id, subject, time, room) VALUES (?, ?, ?, ?, ?)`;
    await pool.query(query, [lecturer_id, student_id, subject, time, room]);
    res.status(201).json({ message: 'Timetable created' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ✅ Update Timetable
exports.updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { lecturer_id, student_id, subject, time, room } = req.body;
    const query = `
      UPDATE timetable SET lecturer_id = ?, student_id = ?, subject = ?, time = ?, room = ? WHERE id = ?
    `;
    await pool.query(query, [lecturer_id, student_id, subject, time, room, id]);
    res.json({ message: 'Timetable updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

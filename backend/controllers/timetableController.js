const Timetable = require('../models/Timetable');

exports.getUserTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.getByUser(req.user.userId);
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.getAll();
    res.json(timetable);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const { ClassAppointment, ClassBooking, Room, User } = require('../models');
const Booking = require('../models/Bookings');
// const pool = require('../config/db'); // Uncomment if you're using raw SQL with pool

// ===============================
// 🎓 CLASS APPOINTMENT HANDLERS
// ===============================

// POST /api/class-appointments
exports.createClassAppointment = async (req, res) => {
  try {
    const { title, description, date, timeSlot, lecturerId, capacity } = req.body;
    const appointment = await ClassAppointment.create({
      title,
      description,
      date,
      timeSlot,
      lecturerId,
      capacity
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating appointment.' });
  }
};

// GET /api/class-appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await ClassAppointment.findAll();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments.' });
  }
};

// POST /api/class-appointments/book
exports.bookClassAppointment = async (req, res) => {
  try {
    const { studentId, appointmentId } = req.body;

    const existing = await ClassBooking.findOne({
      where: { studentId, appointmentId }
    });
    if (existing) {
      return res.status(400).json({ message: 'Already booked this appointment.' });
    }

    const appointment = await ClassAppointment.findByPk(appointmentId);
    const bookingCount = await ClassBooking.count({ where: { appointmentId } });

    if (bookingCount >= appointment.capacity) {
      return res.status(400).json({ message: 'Appointment is full.' });
    }

    const booking = await ClassBooking.create({ studentId, appointmentId });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error booking appointment.' });
  }
};

// GET /api/class-appointments/student/:studentId
exports.getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const bookings = await ClassBooking.findAll({
      where: { studentId },
      include: [{ model: ClassAppointment }]
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving student appointments.' });
  }
};

// ===============================
// 🏢 ROOM MANAGEMENT HANDLERS
// ===============================

// GET /api/rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms.' });
  }
};

// POST /api/rooms
exports.createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const room = await Room.create({ name, capacity });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Error creating room.' });
  }
};

// PUT /api/rooms/:id
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const { name, capacity } = req.body;
    await room.update({ name, capacity });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Error updating room.' });
  }
};

// DELETE /api/rooms/:id
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    await room.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room.' });
  }
};

// ===============================
// 📆 GENERAL ROOM BOOKING HANDLERS
// ===============================

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { room, purpose, startTime, endTime } = req.body;

    // Example using Sequelize - implement logic based on your Booking model
    const existingBookings = await Booking.findAll({
      where: {
        room,
        [Op.or]: [
          { startTime: { [Op.lt]: endTime }, endTime: { [Op.gt]: startTime } },
          { startTime: { [Op.gte]: startTime }, startTime: { [Op.lt]: endTime } },
          { endTime: { [Op.gt]: startTime }, endTime: { [Op.lte]: endTime } }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ msg: 'Room already booked for this time' });
    }

    const booking = await Booking.create({
      userId: req.user.userId,
      room,
      purpose,
      startTime,
      endTime
    });

    res.status(201).json({ 
      ...booking.dataValues,
      status: 'pending'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// GET /api/bookings/user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUser(req.user.userId);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.getAll();
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

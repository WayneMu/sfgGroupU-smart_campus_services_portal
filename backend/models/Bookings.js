// Combined Models File
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const pool = require('../config/db');

// ClassAppointment Model
const ClassAppointment = sequelize.define('ClassAppointment', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lecturerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'class_appointments'
});

// ClassAppointmentBooking Model
const ClassAppointmentBooking = sequelize.define('ClassAppointmentBooking', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isInt: true }
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isInt: true }
  }
}, {
  timestamps: true,
  tableName: 'class_appointment_bookings'
});

ClassAppointmentBooking.associate = function(models) {
  ClassAppointmentBooking.belongsTo(models.ClassAppointment, {
    foreignKey: 'appointmentId',
    as: 'appointment'
  });
};

// Room Model
const Room = sequelize.define('Room', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  }
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'rooms'
});

// Sequelize Booking Model
const Bookings = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

// MySQL Booking Class for direct SQL operations
class RawBooking {
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

module.exports = {
  ClassAppointment,
  ClassAppointmentBooking,
  Room,
  Bookings,
  RawBooking
};

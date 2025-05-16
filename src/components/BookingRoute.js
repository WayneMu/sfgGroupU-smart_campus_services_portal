import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// ================= Navbar =================
const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
    <Link className="navbar-brand" to="/">SmartUni Portal</Link>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>

    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/rooms">Rooms</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/appointments">Appointments</Link>
        </li>
      </ul>
    </div>
  </nav>
);

// ================= Footer =================
const Footer = () => (
  <footer className="bg-light text-center py-3 mt-auto">
    <div className="container">
      <span className="text-muted">© {new Date().getFullYear()} Smart University Services Portal</span>
    </div>
  </footer>
);

// ================= Create Appointment Form =================
const CreateAppointmentForm = ({ lecturerId }) => {
  const [form, setForm] = useState({
    topic: '',
    date: '',
    timeSlot: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/class-appointments/appointments', {
        ...form,
        lecturerId,
      });
      alert('Appointment created!');
      setForm({ topic: '', date: '', timeSlot: '', location: '' });
    } catch (err) {
      alert('Error creating appointment.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Class Appointment</h3>
      <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic" required />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <input name="timeSlot" value={form.timeSlot} onChange={handleChange} placeholder="Time Slot (e.g. 10:00-11:00)" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <button type="submit">Create</button>
    </form>
  );
};

// ================= Appointment List =================
const ClassAppointmentList = ({ studentId }) => {
  const [appointments, setAppointments] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get('/api/class-appointments/appointments').then((res) => {
      setAppointments(res.data);
    });
  }, []);

  const bookAppointment = async (appointmentId) => {
    try {
      await axios.post('/api/class-appointments/bookings', {
        appointmentId,
        studentId,
      });
      setBookingStatus('Booked successfully!');
    } catch (err) {
      if (err.response?.status === 409) {
        setBookingStatus('Already booked this appointment.');
      } else {
        setBookingStatus('Error booking appointment.');
      }
    }
  };

  return (
    <div>
      <h2>Available Class Appointments</h2>
      {bookingStatus && <p>{bookingStatus}</p>}
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.topic} with Lecturer {appt.lecturerId} on {appt.date} at {appt.timeSlot} @ {appt.location}
            <button onClick={() => bookAppointment(appt.id)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ================= Student Booked Appointments =================
const StudentAppointments = ({ studentId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`/api/class-appointments/bookings/${studentId}`).then((res) => {
      setBookings(res.data);
    });
  }, [studentId]);

  return (
    <div>
      <h2>Your Booked Class Appointments</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            Topic: {b.ClassAppointment.topic}, Date: {b.ClassAppointment.date}, Time: {b.ClassAppointment.timeSlot}, Location: {b.ClassAppointment.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ================= Room Booking Form =================
const BookingForm = ({ userId }) => {
  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bookings', {
        userId,
        roomId,
        date,
        timeSlot
      });
      alert('Booking successful!');
    } catch (err) {
      alert('Error: ' + err.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Book a Room</h3>
      <input type="number" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="text" placeholder="Time Slot" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} />
      <button type="submit">Book</button>
    </form>
  );
};

// =================== Main Page Wrapper ===================
const CombinedBookingModule = ({ studentId, lecturerId, userId }) => {
  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <ClassAppointmentList studentId={studentId} />
        <hr />
        <CreateAppointmentForm lecturerId={lecturerId} />
        <hr />
        <StudentAppointments studentId={studentId} />
        <hr />
        <BookingForm userId={userId} />
      </div>
      <Footer />
    </div>
  );
};

export default CombinedBookingModule;

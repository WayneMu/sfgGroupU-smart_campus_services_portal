import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Bookings Component
export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/api/bookings/all' : '/api/bookings';
        const res = await axios.get(endpoint);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <Alert variant="info">Loading...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>My Bookings</h2>
        <Button as={Link} to="/bookings/new" variant="primary">New Booking</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Room</th>
            <th>Purpose</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            {user.role === 'admin' && <th>User</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.room}</td>
                <td>{booking.purpose}</td>
                <td>{new Date(booking.startTime).toLocaleDateString()}</td>
                <td>
                  {new Date(booking.startTime).toLocaleTimeString()} - {' '}
                  {new Date(booking.endTime).toLocaleTimeString()}
                </td>
                <td>{getStatusBadge(booking.status)}</td>
                {user.role === 'admin' && <td>{booking.user_name}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user.role === 'admin' ? 6 : 5} className="text-center">No bookings found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// ClassAppointmentList Component
export const ClassAppointmentList = ({ studentId }) => {
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
      setBookingStatus(err.response?.status === 409
        ? 'Already booked this appointment.'
        : 'Error booking appointment.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Available Class Appointments</h2>
      {bookingStatus && <div className="alert alert-info">{bookingStatus}</div>}
      <div className="list-group">
        {appointments.map((appt) => (
          <div className="list-group-item d-flex justify-content-between align-items-center" key={appt.id}>
            <div>
              <h5>{appt.topic}</h5>
              <p>
                With Lecturer <strong>{appt.lecturerId}</strong><br />
                Date: {appt.date} <br />
                Time: {appt.timeSlot}<br />
                Location: {appt.location}
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => bookAppointment(appt.id)}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// StudentAppointments Component
export const StudentAppointments = ({ studentId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get(`/api/class-appointments/bookings/${studentId}`).then((res) => {
      setBookings(res.data);
    });
  }, [studentId]);

  return (
    <div className="container mt-4">
      <h2>Your Booked Appointments</h2>
      <ul className="list-group">
        {bookings.map((b) => (
          <li className="list-group-item" key={b.id}>
            <strong>{b.ClassAppointment.topic}</strong><br />
            Date: {b.ClassAppointment.date} | Time: {b.ClassAppointment.timeSlot} <br />
            Location: {b.ClassAppointment.location}
          </li>
        ))}
      </ul>
    </div>
  );
};


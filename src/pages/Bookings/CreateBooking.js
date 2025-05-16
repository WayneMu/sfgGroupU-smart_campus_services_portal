// src/pages/SmartServices.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';

const SmartServices = ({ lecturerId }) => {
  const [key, setKey] = useState('home');

  // Booking form state
  const [bookingData, setBookingData] = useState({
    room: '',
    purpose: '',
    startTime: '',
    endTime: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const handleBookingChange = e => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

  const handleBookingSubmit = async e => {
    e.preventDefault();
    setBookingError('');
    setBookingLoading(true);
    try {
      await api.post('/api/bookings', bookingData);
      navigate('/bookings');
    } catch (err) {
      setBookingError(err.response?.data?.msg || 'Booking failed');
      setBookingLoading(false);
    }
  };

  // Appointment form state
  const [appointmentData, setAppointmentData] = useState({
    topic: '',
    date: '',
    timeSlot: '',
    location: '',
  });

  const handleAppointmentChange = e => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleAppointmentSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/class-appointments/appointments', {
        ...appointmentData,
        lecturerId,
      });
      alert('Appointment created!');
      setAppointmentData({ topic: '', date: '', timeSlot: '', location: '' });
    } catch (err) {
      alert('Error creating appointment.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Smart University Services Portal</h2>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="home" title="Home">
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Book a Study Room</Card.Title>
                  <Card.Text>Reserve available rooms for individual or group study.</Card.Text>
                  <Button variant="primary" onClick={() => setKey('booking')}>Book Now</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Class Appointments</Card.Title>
                  <Card.Text>Schedule academic appointments with lecturers or tutors.</Card.Text>
                  <Button variant="success" onClick={() => setKey('appointment')}>Schedule</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="booking" title="Room Booking">
          <h3>New Booking</h3>
          {bookingError && <Alert variant="danger">{bookingError}</Alert>}
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Select
                name="room"
                value={bookingData.room}
                onChange={handleBookingChange}
                required
              >
                <option value="">Select a room</option>
                <option value="A101">Room A101</option>
                <option value="B202">Room B202</option>
                <option value="C303">Room C303</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purpose</Form.Label>
              <Form.Control
                as="textarea"
                name="purpose"
                value={bookingData.purpose}
                onChange={handleBookingChange}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={bookingLoading}>
              {bookingLoading ? 'Submitting...' : 'Submit Booking'}
            </Button>
          </Form>
        </Tab>

        <Tab eventKey="appointment" title="Class Appointment">
          <h3>Create Class Appointment</h3>
          <Form onSubmit={handleAppointmentSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Topic</label>
              <input name="topic" className="form-control" value={appointmentData.topic} onChange={handleAppointmentChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input name="date" type="date" className="form-control" value={appointmentData.date} onChange={handleAppointmentChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Time Slot</label>
              <input name="timeSlot" className="form-control" placeholder="e.g. 10:00-11:00" value={appointmentData.timeSlot} onChange={handleAppointmentChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input name="location" className="form-control" value={appointmentData.location} onChange={handleAppointmentChange} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">Create Appointment</button>
            </div>
          </Form>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SmartServices;

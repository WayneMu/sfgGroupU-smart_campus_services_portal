import React, { useState } from 'react';
import { Form, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateBooking = () => {
  const [formData, setFormData] = useState({
    room: '',
    purpose: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/api/bookings', formData);
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.msg || 'Booking failed');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">New Booking</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Room</Form.Label>
          <Form.Select
            name="room"
            value={formData.room}
            onChange={onChange}
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
            value={formData.purpose}
            onChange={onChange}
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
                value={formData.startTime}
                onChange={onChange}
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
                value={formData.endTime}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Booking'}
        </Button>
      </Form>
    </div>
  );
};

export default CreateBooking;
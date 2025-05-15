import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/api/bookings/all' : '/api/bookings';
        const res = await api.get(endpoint);
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
        <Button as={Link} to="/bookings/new" variant="primary">
          New Booking
        </Button>
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
              <td colSpan={user.role === 'admin' ? 6 : 5} className="text-center">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Bookings;
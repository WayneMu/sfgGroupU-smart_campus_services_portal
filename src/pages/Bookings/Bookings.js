import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Different endpoints based on role
      let endpoint = '/api/bookings';
      if (user.role === 'admin') {
        endpoint = '/api/bookings/all';
      } else if (user.role === 'lecturer') {
        endpoint = '/api/bookings?forApproval=true';
      }

      const res = await api.get(endpoint);
      setBookings(res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      console.error('Booking fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.role]); // Refetch when role changes

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'pending': return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'rejected': return <Badge bg="danger">Rejected</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <Alert variant="info">Loading bookings...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>{user.role === 'admin' ? 'All Bookings' : user.role === 'lecturer' ? 'Bookings for Approval' : 'My Bookings'}</h2>
        {user.role !== 'lecturer' && (
          <Button as={Link} to="/bookings/new" variant="primary">
            New Booking
          </Button>
        )}
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
            {(user.role === 'admin' || user.role === 'lecturer') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.room}</td>
                <td>{booking.purpose}</td>
                <td>
                  {booking.startTime ? new Date(booking.startTime).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  {booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} - {' '}
                  {booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </td>
                <td>{getStatusBadge(booking.status)}</td>
                {user.role === 'admin' && <td>{booking.user_name || booking.user_email || 'N/A'}</td>}
                {(user.role === 'admin' || user.role === 'lecturer') && (
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="secondary" size="sm">
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {booking.status !== 'approved' && (
                          <Dropdown.Item onClick={() => handleStatusChange(booking.id, 'approved')}>
                            Approve
                          </Dropdown.Item>
                        )}
                        {booking.status !== 'rejected' && (
                          <Dropdown.Item onClick={() => handleStatusChange(booking.id, 'rejected')}>
                            Reject
                          </Dropdown.Item>
                        )}
                        {user.role === 'admin' && (
                          <Dropdown.Item 
                            onClick={() => handleDelete(booking.id)}
                            className="text-danger"
                          >
                            Delete
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user.role === 'admin' ? 7 : user.role === 'lecturer' ? 6 : 5} className="text-center">
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
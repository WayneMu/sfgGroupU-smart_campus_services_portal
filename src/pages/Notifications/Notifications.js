import React, { useState, useEffect } from 'react';
import { ListGroup, Badge, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/api/notifications/all' : '/api/notifications';
        const res = await api.get(endpoint);
        setNotifications(res.data);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  if (loading) return <Alert variant="info">Loading notifications...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Notifications</h2>
        <Button variant="outline-secondary" size="sm">
          Mark All as Read
        </Button>
      </div>

      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <ListGroup.Item 
              key={notification.id}
              className={`d-flex justify-content-between align-items-start ${!notification.is_read ? 'fw-bold' : ''}`}
            >
              <div className="ms-2 me-auto">
                <div>{notification.message}</div>
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleString()}
                  {user.role === 'admin' && ` • From: ${notification.user_name}`}
                </small>
              </div>
              {!notification.is_read && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
              <Badge bg={notification.urgency === 'high' ? 'danger' : notification.urgency === 'medium' ? 'warning' : 'info'} className="ms-2">
                {notification.urgency}
              </Badge>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info">No notifications found</Alert>
        )}
      </ListGroup>
    </div>
  );
};

export default Notifications;
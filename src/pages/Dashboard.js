import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // ← Add this

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Welcome, {user?.name}</Card.Title>
              <Card.Text>
                Role: {user?.role}<br />
                Department: {user?.department || 'Not specified'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/bookings" className="btn btn-primary">Book a Room</Link>
                <Link to="/timetable" className="btn btn-secondary">View Timetable</Link>
                <Link to="/maintenance" className="btn btn-warning">Report Issue</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-danger">Admin Panel</Link>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
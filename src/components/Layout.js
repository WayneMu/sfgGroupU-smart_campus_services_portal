import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Smart Campus</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link as={Link} to="/bookings">Bookings</Nav.Link>
                  <Nav.Link as={Link} to="/timetable">Timetable</Nav.Link>
                  <Nav.Link as={Link} to="/maintenance">Maintenance</Nav.Link>
                  <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
                  {user.role === 'admin' && (
                    <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                  )}
                </>
              )}
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Navbar.Text className="me-3">
                    Signed in as: {user.name} ({user.role})
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {children}
      </Container>
    </>
  );
};

export default Layout;
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Maintenance = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/api/maintenance/all' : '/api/maintenance';
        const res = await api.get(endpoint);
        setIssues(res.data);
      } catch (err) {
        setError('Failed to fetch maintenance issues');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return <Badge bg="danger">Open</Badge>;
      case 'in_progress': return <Badge bg="warning" text="dark">In Progress</Badge>;
      case 'resolved': return <Badge bg="success">Resolved</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) return <Alert variant="info">Loading issues...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Maintenance Issues</h2>
        <Button as={Link} to="/maintenance/report" variant="primary">
          Report New Issue
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Urgency</th>
            <th>Date Reported</th>
            {user.role === 'admin' && <th>Reported By</th>}
          </tr>
        </thead>
        <tbody>
          {issues.length > 0 ? (
            issues.map(issue => (
              <tr key={issue.id}>
                <td>{issue.issue_type}</td>
                <td>{issue.description}</td>
                <td>{getStatusBadge(issue.status)}</td>
                <td>{issue.urgency}</td>
                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                {user.role === 'admin' && <td>{issue.user_name}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user.role === 'admin' ? 6 : 5} className="text-center">
                No maintenance issues found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Maintenance;
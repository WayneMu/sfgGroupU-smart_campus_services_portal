import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    urgency: 'medium'
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
      await api.post('/api/maintenance', formData);
      navigate('/maintenance');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to report issue');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Report Maintenance Issue</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Issue Type</Form.Label>
          <Form.Select
            name="issueType"
            value={formData.issueType}
            onChange={onChange}
            required
          >
            <option value="">Select issue type</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="furniture">Furniture</option>
            <option value="cleaning">Cleaning</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Urgency</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="Low"
              name="urgency"
              value="low"
              checked={formData.urgency === 'low'}
              onChange={onChange}
            />
            <Form.Check
              inline
              type="radio"
              label="Medium"
              name="urgency"
              value="medium"
              checked={formData.urgency === 'medium'}
              onChange={onChange}
            />
            <Form.Check
              inline
              type="radio"
              label="High"
              name="urgency"
              value="high"
              checked={formData.urgency === 'high'}
              onChange={onChange}
            />
          </div>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </Form>
    </div>
  );
};

export default ReportIssue;
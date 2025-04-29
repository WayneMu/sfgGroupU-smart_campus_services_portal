import React, { useState, useEffect } from 'react';
import { Table, Alert, Button } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/api/timetable/all' : '/api/timetable';
        const res = await api.get(endpoint);
        setTimetable(res.data);
      } catch (err) {
        setError('Failed to fetch timetable');
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [user]);

  if (loading) return <Alert variant="info">Loading timetable...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>My Timetable</h2>
        {user.role === 'admin' && (
          <Button variant="primary">Add New Schedule</Button>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Course</th>
            <th>Lecturer</th>
            <th>Day</th>
            <th>Time</th>
            <th>Room</th>
          </tr>
        </thead>
        <tbody>
          {timetable.length > 0 ? (
            timetable.map(item => (
              <tr key={item.id}>
                <td>{item.course_name} ({item.course_code})</td>
                <td>{item.lecturer_name}</td>
                <td>{item.day}</td>
                <td>
                  {item.start_time} - {item.end_time}
                </td>
                <td>{item.room}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No timetable entries found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Timetable;
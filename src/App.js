import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ No BrowserRouter here
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings/Bookings';
import CreateBooking from './pages/Bookings/CreateBooking';
import Timetable from './pages/Timetable/Timetable';
import Maintenance from './pages/Maintenance/Maintenance';
import ReportIssue from './pages/Maintenance/ReportIssue';
import Notifications from './pages/Notifications/Notifications';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
        <Route path="/bookings/new" element={<PrivateRoute><CreateBooking /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
        <Route path="/maintenance" element={<PrivateRoute><Maintenance /></PrivateRoute>} />
        <Route path="/maintenance/report" element={<PrivateRoute><ReportIssue /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

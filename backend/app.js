require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const timetableRoutes = require('./routes/timetable');
const maintenanceRoutes = require('./routes/maintenance');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // 1. Serve static files from React's build folder
  app.use(express.static(path.join(__dirname, '../build')));
  
  // 2. Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Global error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Logs detailed error stack in the server console

  // Check if the error is an instance of `ValidationError`
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors  // Detailed error validation message from `express-validator`
    });
  }

  // General error handler
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // Avoid sending stack trace in production
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

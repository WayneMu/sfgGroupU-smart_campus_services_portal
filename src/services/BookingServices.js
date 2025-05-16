// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if deployed
});

// Automatically attach token if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Appointments APIs
export const getAllAppointments = () => API.get('/class-appointments');
export const createAppointment = (appointmentData) => API.post('/class-appointments', appointmentData);
export const deleteAppointment = (id) => API.delete(`/class-appointments/${id}`);
export const updateAppointment = (id, data) => API.put(`/class-appointments/${id}`, data);

// Rooms APIs
export const getAllRooms = () => API.get('/rooms');
export const getRoomById = (id) => API.get(`/rooms/${id}`);
export const createRoom = (roomData) => API.post('/rooms', roomData);
export const deleteRoom = (id) => API.delete(`/rooms/${id}`);
export const updateRoom = (id, updatedData) => API.put(`/rooms/${id}`, updatedData);

// Bookings APIs (if used in your project)
export const createBooking = (bookingData) => API.post('/bookings', bookingData);

export default API;

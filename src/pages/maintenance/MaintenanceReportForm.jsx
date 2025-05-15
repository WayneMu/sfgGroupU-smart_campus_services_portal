/*import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';*/

const MaintenanceReportForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    try {
      setMessage('');
      setError('');

      const payload = {
        issueType: data.issueType,
        location: data.location,
        description: data.description,
        image: data.image[0] ? await toBase64(data.image[0]) : null,
      };

      const response = await axios.post('/api/maintenance/report', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // adjust based on auth
        },
      });

      setMessage(response.data.message || 'Issue reported successfully!');
      reset();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Report a Maintenance Issue</h2>

      {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Issue Type</label>
          <select {...register('issueType', { required: true })} className="w-full border p-2 rounded">
            <option value="">Select Issue Type</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="WiFi">WiFi</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>
          {errors.issueType && <span className="text-red-500 text-sm">Issue type is required.</span>}
        </div>

        <div>
          <label className="block mb-1">Location</label>
          <input
            type="text"
            {...register('location', { required: true })}
            className="w-full border p-2 rounded"
            placeholder="e.g., Library - Study Room 3"
          />
          {errors.location && <span className="text-red-500 text-sm">Location is required.</span>}
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            {...register('description', { required: true })}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Describe the issue..."
          />
          {errors.description && <span className="text-red-500 text-sm">Description is required.</span>}
        </div>

        <div>
          <label className="block mb-1">Optional Image</label>
          <input type="file" accept="image/*" {...register('image')} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isSubmitting ? 'Submitting...' : 'Report Issue'}
        </button>
      </form>
    </div>
  );
};

export default MaintenanceReportForm;

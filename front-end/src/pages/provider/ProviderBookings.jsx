import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Change from '/api/admin/appointments' to the new specific route
      const res = await api.get('/api/appointments/my-bookings'); 
      setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.patch(`/api/appointments/${id}/cancel`);
      fetchBookings(); // Refresh list
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' ? true : b.status === filter
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Booking Management</h1>
        
        {/* Filter Tabs */}
        <div className="flex bg-slate-200 p-1 rounded-lg">
          {['all', 'confirmed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                filter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Client</th>
              <th className="p-4 font-semibold text-slate-700">Date & Time</th>
              <th className="p-4 font-semibold text-slate-700">Service</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {filteredBookings.map((booking) => (
                <motion.tr 
                  key={booking._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{booking.client?.name}</div>
                    <div className="text-xs text-slate-500">{booking.client?.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700">{dayjs(booking.date).format('MMM DD, YYYY')}</div>
                    <div className="text-xs font-bold text-blue-600">{booking.startTime} - {booking.endTime}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {/* Accessing the populated businessName or service name */}
                    {booking.service?.name || "Standard Service"}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancel(booking._id)}
                        className="text-sm text-red-500 hover:underline font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="p-20 text-center text-slate-400">
            No bookings found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderBookings;
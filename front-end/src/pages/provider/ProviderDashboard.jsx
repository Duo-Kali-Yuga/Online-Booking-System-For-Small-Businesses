import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiCalendar, FiSettings, FiTrash2 } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useNavigate, Link } from 'react-router-dom';
import DashboardStats from './components/DashboardStats';
import CalendarAgenda from './components/CalendarAgenda';

const ProviderDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, count: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading2, setLoading2] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/appointments/provider-bookings');
      const data = res.data.data;
      setAppointments(data);

      // Calculate Analytics locally for performance
      const revenue = data
        .filter(a => a.status === 'confirmed')
        .reduce((sum, a) => sum + (a.service?.price || 0), 0);
      
      const pending = data.filter(a => a.status === 'pending').length;

      setStats({ revenue, count: data.length, pending });
    } catch (err) {
      console.error("Dashboard load error", err);
      
      // 🔥 THE FIX: If the provider profile is missing, redirect to setup
      if (err.response && err.response.status === 404) {
        navigate('/provider/setup'); 
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isNew = (createdAt) => {
    return dayjs().diff(dayjs(createdAt), 'hour') < 24;
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      fetchDashboardData(); // Refresh analytics and list
    } catch (err) {
      alert("Update failed");
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );


  const handleAddService = () => {
    navigate('/provider/services'); // Or wherever your service management page lives
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get('/appointments/provider-bookings');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading2(false);
      }
    };
    loadDashboard();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this appointment from your records?")) return;
    
    try {
      await api.delete(`/appointments/${id}`); // Ensure this route exists in your backend
      fetchDashboardData(); // Refresh the list and stats
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };



  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Business Overview</h1>
          <p className="text-slate-500">Welcome back! Here is what's happening today.</p>
        </div>
        <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200">
          {dayjs().format('dddd, MMMM D')}
        </div>
      </header>

      {/* 1. Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue}`} 
          icon={FiDollarSign} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.count} 
          icon={FiCalendar} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pending} 
          icon={FiUsers} 
          color="bg-orange-50 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Recent Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Recent Appointments</h2>
            <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.slice(0, 5).map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{appt.client?.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{appt.service?.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{dayjs(appt.date).format('MMM D')}</div>
                      <div className="text-xs text-blue-600 font-bold">{appt.startTime}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Pulse Badge for New Bookings */}
                          {isNew(appt.createdAt) && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          )}
                          <div className="font-bold text-slate-800">{appt.client?.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {appt.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-700"
                          >
                            Accept
                          </button>
                        )}
                        
                        <button 
                          onClick={() => navigate(`/booking/${appt.provider}`)}
                          className="border border-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-50"
                        >
                          Reschedule
                        </button>

                        {/* NEW: Delete Button for Confirmed or Cancelled */}
                        {(appt.status === 'confirmed' || appt.status === 'cancelled') && (
                          <button 
                            onClick={() => handleDelete(appt._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Quick Actions Sidebar */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <button 
            onClick={handleAddService} // Add this!
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white transition group"
          >
            <span className="font-bold">Add New Service</span>
            <FiSettings className="text-slate-400 group-hover:text-white" />
          </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white transition group">
              <span className="font-bold">Update Schedule</span>
              <FiCalendar className="text-slate-400 group-hover:text-white" />
            </button>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white">
            <h4 className="font-bold mb-2">Need Help?</h4>
            <p className="text-blue-100 text-sm mb-4">Check our guide on how to maximize your bookings.</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold">Read Docs</button>
          </div>
        </div>
      </div>
      {/* { */}
        // (!loading) ? <div className="p-10 text-center">Loading System Metrics...</div>
        // :
        <div className="p-6 bg-slate-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Provider Command Center</h1>
            
            {/* 1. Statistics Summary */}
            <DashboardStats bookings={bookings} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 2. Main Calendar/Agenda View */}
              <div className="lg:col-span-2">
                <CalendarAgenda bookings={bookings} />
              </div>

              {/* 3. Quick Actions or Notifications */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4">Quick Links</h3>
                  <div className="flex flex-col gap-2">
                    <button className="text-left p-2 hover:bg-blue-50 text-blue-600 rounded">Manage Services</button>
                    <button className="text-left p-2 hover:bg-blue-50 text-blue-600 rounded">Edit Availability</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* } */}

      <Link 
        to="/provider/availability" 
        className="block w-full text-center bg-blue-500 text-white border border-blue-400 py-2 rounded-lg font-bold hover:bg-blue-400 transition"
      >
        Edit Availability
      </Link>
    </div>
  );
};

export default ProviderDashboard;
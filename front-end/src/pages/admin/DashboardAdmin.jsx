import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiBriefcase, FiCalendar, FiTrash2, FiPower, FiShield } from 'react-icons/fi';




export const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${color}`}><Icon size={24} /></div>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);


export default function DashboardAdmin() {

  const [view, setView] = useState('users');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ userCount: 0, providerCount: 0, appointmentCount: 0 });


  const fetchStats = async () => {
    const res = await api.get('/admin/stats');
    setStats(res.data.data);
  };

  const fetchCurrentView = async () => {
    try {
      const res = await api.get(`/admin/${view}`);
      setData(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/admin/providers/${id}/toggle`);
      fetchCurrentView();
    } catch (err) { alert("Toggle failed"); }
  };

  const handleDelete = async (id, item) => {
    const typeLabel = view === 'appointments' ? 'appointment' : 'user/provider';
    if (!window.confirm(`Danger: This will delete this ${typeLabel} and associated data. Proceed?`)) return;

    try {
      if (view === 'appointments') {

        await api.delete(`/admin/appointments/${id}`);
      } else if (view === 'providers') {

        await api.delete(`/admin/users/${item.user}`);
      } else {

        await api.delete(`/admin/users/${id}`);
      }
      
      fetchCurrentView();
      fetchStats();
    } catch (err) {
      alert("Deletion failed: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCurrentView();
  }, [view]);




  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <FiShield className="text-red-500" /> System Control
          </h1>
          <p className="text-slate-500 font-medium">Global management and service oversight.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['users', 'providers', 'appointments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition ${
                view === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={stats.userCount} icon={FiUsers} color="bg-blue-50 text-blue-600" />
        <StatCard title="Total Businesses" value={stats.providerCount} icon={FiBriefcase} color="bg-purple-50 text-purple-600" />
        <StatCard title="Platform Bookings" value={stats.appointmentCount} icon={FiCalendar} color="bg-orange-50 text-orange-600" />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest font-black">
              <tr>
                <th className="px-8 py-5">Entity Name</th>
                <th className="px-8 py-5">Sub-Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode='wait'>
                {data.map((item) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={item._id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800">{item.name || item.businessName || item.client?.name}</p>
                      <p className="text-xs text-slate-400">{item.email || item.category || 'System Record'}</p>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-600">
                      {view === 'appointments' ? item.service?.name : (item.role || 'Provider')}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        (item.active || item.status === 'confirmed') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status || (item.active ? 'Active' : 'Disabled')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      {view === 'providers' && (
                        <button 
                          onClick={() => handleToggleStatus(item._id)}
                          className={`p-2 rounded-lg transition-colors ${item.active ? 'text-green-500 bg-green-50' : 'text-slate-400 bg-slate-100'}`}
                        >
                          <FiPower size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(item._id, item)} // Pass 'item' here
                        className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};




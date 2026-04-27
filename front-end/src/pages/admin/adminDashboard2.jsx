import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiShield, FiAlertCircle, FiCheckCircle, FiTrash2, FiSearch } from 'react-icons/fi';

const AdminDashboard2 = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [uRes, pRes] = await [
        api.get('/api/admin/users'), 
        api.get('/api/admin/providers')
      ];
      setUsers(uRes.data);
      setProviders(pRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Always confirm before destructive actions
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}? This will permanently remove all their appointments, reviews, and profile data.`
    );

    if (confirmed) {
      try {
        await api.delete(`/api/admin/users/${userId}`);
        // Filter out the deleted user from the local state to update UI instantly
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
        alert("User purged successfully.");
      } catch (err) {
        alert("Error deleting user: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-2xl">
          <FiShield className="text-3xl text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-slate-500">System-wide management and security.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management Section */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg">Platform Users</h2>
            <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{users.length} Total</span>
            {/* 2. Search Bar Implementation */}
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email} • <span className="capitalize">{user.role}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-400 italic">
                No users found matching "{searchTerm}"
              </div>
            )}
          </div>
          <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
            {users.map(user => (
              <div key={user._id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email} • <span className="capitalize">{user.role}</span></p>
                </div>
                <button 
                  onClick={() => handleDeleteUser(user._id, user.name)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete User"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Provider Verification Section */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg">Business Verification</h2>
          </div>
          <div className="p-6">
            {providers.filter(p => !p.isVerified).map(p => (
              <div key={p._id} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl mb-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-orange-800">{p.businessName}</p>
                  <p className="text-xs text-orange-600">{p.industry}</p>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                  Verify Business
                </button>
              </div>
            ))}
            {providers.every(p => p.isVerified) && (
              <div className="text-center py-10">
                <FiCheckCircle className="mx-auto text-4xl text-green-200 mb-2" />
                <p className="text-slate-400 text-sm">All businesses are currently verified.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

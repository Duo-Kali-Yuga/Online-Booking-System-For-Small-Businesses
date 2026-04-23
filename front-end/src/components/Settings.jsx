import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FiCamera, FiUser, FiMail } from 'react-icons/fi';

const Settings = () => {
  const { user, updateUserData } = useAuth(); // Assuming you added updateUserData to Context
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('name', name);
    if (file) data.append('avatar', file);

    try {
      const res = await api.patch('/users/me', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Update the AuthContext so the Navbar updates immediately
      updateUserData(res.data.data);
      alert("Identity updated!");
    } catch (err) {
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-black mb-8 text-slate-900">Account Settings</h1>
      
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img 
              src={file ? URL.createObjectURL(file) : (user.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}`)} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50 shadow-md"
              alt="Profile"
            />
            <label htmlFor="avatar" className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl text-white cursor-pointer shadow-lg hover:scale-110 transition">
              <FiCamera />
              <input type="file" id="avatar" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Photo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><FiUser /> Full Name</label>
            <input 
              type="text" className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2"><FiMail /> Email Address</label>
            <input type="text" className="w-full p-4 bg-slate-100 border-none rounded-2xl text-slate-400 cursor-not-allowed" value={user.email} disabled />
          </div>
        </div>

        <button 
          disabled={saving}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black hover:bg-black transition"
        >
          {saving ? "Saving..." : "Update Settings"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { motion } from 'framer-motion';

const SetupProviderProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'other',
    description: '',
    location: {
      city: '',
      country: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST to your /api/providers route
      await api.post('/api/providers', formData);
      alert("Business profile created successfully!");
      navigate('/provider'); // Now they can go to the dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Error creating profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Setup Business</h2>
        <p className="text-slate-500 mb-8">Tell us about the services you offer.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Business Name</label>
            <input
              type="text" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Downtown Barber Shop"
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Industry</label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            >
              <option value="other">Other</option>
              <option value="doctor">Doctor</option>
              <option value="barber">Barber</option>
              <option value="salon">Salon</option>
              <option value="consultant">Consultant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">City</label>
            <input
              type="text" required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Madrid"
              onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Description</label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Describe your services..."
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
          >
            Finish Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SetupProviderProfile;
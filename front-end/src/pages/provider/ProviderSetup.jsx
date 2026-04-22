import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ProviderSetup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'other',
    description: '',
    address: '',
    city: '',
    country: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This hits the router.post("/", ...) in your providerRoutes
      await api.post('/providers', {
        businessName: formData.businessName,
        industry: formData.industry,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country
        }
      });
      alert("Profile created! Redirecting to dashboard...");
      navigate('/provider');
    } catch (err) {
      alert(err.response?.data?.message || "Setup failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Setup Your Business Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
          <input 
            type="text" 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
          >
            <option value="barber">Barber</option>
            <option value="doctor">Doctor</option>
            <option value="consultant">Consultant</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input 
            placeholder="City" 
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          <input 
            placeholder="Country" 
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
            onChange={(e) => setFormData({...formData, country: e.target.value})}
          />
        </div>
        <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
          Finish Setup
        </button>
      </form>
    </div>
  );
};

export default ProviderSetup;
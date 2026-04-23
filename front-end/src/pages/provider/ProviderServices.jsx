import { useState, useEffect } from 'react';
import api from "../../api/axios";
import { motion, AnimatePresence } from 'framer-motion';

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ name: '', duration: '', price: '' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch Services on Load
  useEffect(() => {
    fetchServices();
  }, []);

  // const fetchServices = async () => {
  //   try {
  //     // 1. Get the current provider's profile
  //     const res = await api.get('/providers/me'); 
      
  //     // Look for the ID in res.data.data OR res.data depending on your backend fix
  //     const providerId = res.data.data?._id || res.data._id;
      
  //     if (!providerId) {
  //       console.error("Could not find Provider ID");
  //       return;
  //     }

  //     // 2. Fetch services using that ID
  //     const servicesRes = await api.get(`/services/${providerId}`);
      
  //     // Standardize the data extraction
  //     const finalData = servicesRes.data.data || servicesRes.data;
  //     setServices(Array.isArray(finalData) ? finalData : []);
      
  //   } catch (err) {
  //     console.error("Error fetching services", err);
  //   }
  // };

  // const fetchServices = async () => {
  //   try {
  //     // The backend knows who you are from the token in the headers
  //     const res = await api.get('/services/me'); 
  //     const finalData = res.data.data || res.data;
  //     setServices(Array.isArray(finalData) ? finalData : []);
  //   } catch (err) {
  //     console.error("Fetch error", err);
  //   }
  // };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/me'); // Backend handles the ID via token
      const finalData = res.data.data || res.data;
      setServices(Array.isArray(finalData) ? finalData : []);
    } catch (err) { console.error("Fetch error", err); }
  };

  // 2. Handle Form Submission
  // const handleSubmit = async (e) => {
  //     e.preventDefault();
      
  //     // Validation check
  //     if (formData.duration <= 0 || formData.price < 0) {
  //       alert("Please enter valid positive values");
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       // Your backend likely needs the providerId associated with the service.
  //       // If your backend doesn't automatically add it from the token, 
  //       // you'd add it here.
  //       await api.post('/services', formData);
        
  //       setFormData({ name: '', duration: '', price: '' });
  //       fetchServices(); 
  //     } catch (err) {
  //       alert(err.response?.data?.message || "Error adding service");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // No need to pass providerId here, backend adds it from the token!
  //     await api.post('/services', formData);
  //     setFormData({ name: '', duration: '', price: '' });
  //     fetchServices();
  //   } catch (err) {
  //     alert("Check if you are logged in correctly.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // CRITICAL for your math: Duration must be > 0
    if (formData.duration <= 0) {
      alert("Duration must be at least 1 minute.");
      return;
    }

    try {
      await api.post('/services', formData);
      setFormData({ name: '', duration: '', price: '' });
      fetchServices();
    } catch (err) {
      alert("Error adding service.");
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      // 1. Try adding /api/ if your other routes use it
      await api.delete(`/services/${id}`); 
      
      // 2. Update UI
      setServices(services.filter(s => s._id !== id));
    } catch (err) {
      // 3. See the REAL error in the console
      console.error("Full error object:", err.response?.data);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Manage Services</h1>

      {/* Add Service Form */}
      <motion.form 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Service Name</label>
          <input 
            type="text" required value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Haircut"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Duration (min)</label>
          <input 
            type="number" required value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Price ($)</label>
          <input 
            type="number" required value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="25"
          />
        </div>
        <button 
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Adding...' : 'Add Service'}
        </button>
      </motion.form>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Name</th>
              <th className="p-4 font-semibold text-slate-700">Duration</th>
              <th className="p-4 font-semibold text-slate-700">Price</th>
              <th className="p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {services.map((service) => (
                <motion.tr 
                  key={service._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
                >
                  <td className="p-4 text-slate-800 font-medium">{service.name}</td>
                  <td className="p-4 text-slate-600">{service.duration} mins</td>
                  <td className="p-4 text-slate-600">${service.price}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(service._id)}
                      className="text-red-500 hover:text-red-700 font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {services.length === 0 && (
          <p className="p-10 text-center text-slate-400">No services added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;
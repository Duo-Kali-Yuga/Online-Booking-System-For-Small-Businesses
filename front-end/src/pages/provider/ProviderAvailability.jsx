import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const ProviderAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Local state for the "Active" day being edited
  const [editingDay, setEditingDay] = useState(1); // Default to Monday
  const [formData, setFormData] = useState({
    startTime: "09:00",
    endTime: "17:00",
    breaks: []
  });
  

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function fetchAvailability() {
    try {
      const userRes = await api.get('/providers/me');
      const res = await api.get(`/api/availability/${userRes.data._id}`);
      setAvailability(res.data);
      
      // If Monday exists in DB, load it into the form
      const monday = res.data.find(a => a.dayOfWeek === 1);
      if (monday) setFormData({ 
        startTime: monday.startTime, 
        endTime: monday.endTime, 
        breaks: monday.breaks 
      });
    } catch (err) {
      console.error("Error fetching availability", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/api/availability', {
        dayOfWeek: editingDay,
        ...formData
      });
      fetchAvailability();
      alert(`Hours saved for ${DAYS[editingDay]}`);
    } catch (err) {
      alert("Failed to save hours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Operating Hours</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Day Selector Sidebar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-semibold text-slate-500 mb-4 px-2 uppercase text-xs tracking-wider">Select Day</h2>
          {DAYS.map((day, index) => {
            const isSaved = availability.some(a => a.dayOfWeek === index);
            return (
              <button
                key={day}
                onClick={() => setEditingDay(index)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition flex justify-between items-center ${
                  editingDay === index ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {day}
                {isSaved && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
              </button>
            );
          })}
        </div>

        {/* Editor Panel */}
        <motion.div 
          key={editingDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Setup {DAYS[editingDay]}</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Opening Time</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Closing Time</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : `Save ${DAYS[editingDay]} Schedule`}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderAvailability;
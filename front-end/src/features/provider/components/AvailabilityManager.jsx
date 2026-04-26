import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilityManager = () => {
const [schedules, setSchedules] = useState([]);
  const [editingDay, setEditingDay] = useState(1); // Default to Monday
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    startTime: "09:00",
    endTime: "17:00",
    breaks: []
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Update form when switching days or when schedules load
  useEffect(() => {
    const existing = schedules.find(s => s.dayOfWeek === editingDay);
    if (existing) {
      setFormData({ 
        startTime: existing.startTime, 
        endTime: existing.endTime, 
        breaks: existing.breaks || [] 
      });
    } else {
      setFormData({ startTime: "09:00", endTime: "17:00", breaks: [] });
    }
  }, [editingDay, schedules]);

  const fetchSchedules = async () => {
    const res = await api.get('/availability/me'); 
    setSchedules(res.data.data || []);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/availability', { dayOfWeek: editingDay, ...formData });
      await fetchSchedules();
      alert("Schedule updated!");
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const addBreak = () => setFormData({ ...formData, breaks: [...formData.breaks, { start: "12:00", end: "13:00" }] });
  
  const removeBreak = (idx) => setFormData({ 
    ...formData, 
    breaks: formData.breaks.filter((_, i) => i !== idx) 
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setEditingDay(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              editingDay === i ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border'
            }`}
          >
            {day} {schedules.some(s => s.dayOfWeek === i) && "●"}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-800">{DAYS[editingDay]} Hours</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Starts At</label>
            <input type="time" value={formData.startTime} 
              onChange={e => setFormData({...formData, startTime: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ends At</label>
            <input type="time" value={formData.endTime} 
              onChange={e => setFormData({...formData, endTime: e.target.value})}
              className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700">Scheduled Breaks</h3>
            <button onClick={addBreak} className="text-blue-600 text-sm font-bold">+ Add Break</button>
          </div>
          <div className="space-y-3">
            {formData.breaks.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                <input type="time" value={b.start} className="bg-transparent text-sm" 
                  onChange={e => {
                    const newB = [...formData.breaks]; newB[i].start = e.target.value;
                    setFormData({...formData, breaks: newB});
                  }}/>
                <span className="text-slate-300">→</span>
                <input type="time" value={b.end} className="bg-transparent text-sm"
                  onChange={e => {
                    const newB = [...formData.breaks]; newB[i].end = e.target.value;
                    setFormData({...formData, breaks: newB});
                  }}/>
                <button onClick={() => removeBreak(i)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition disabled:opacity-50">
          {loading ? "Saving..." : `Save ${DAYS[editingDay]} Schedule`}
        </button>
      </div>
    </div>
  );
}

export default AvailabilityManager

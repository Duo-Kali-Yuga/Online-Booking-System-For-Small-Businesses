import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCoffee, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const ProviderAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingDay, setEditingDay] = useState(1); // Default to Monday
  
  // This state now mirrors the 'settings' object in your Provider model
  const [settings, setSettings] = useState({
    bufferTime: 10,
    operatingHours: DAYS.map((day, index) => ({
      dayOfWeek: index,
      dayName: day,
      isOpen: true,
      startTime: "09:00",
      endTime: "17:00",
      breaks: []
    }))
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/providers/me');
      if (res.data.data.settings) {
        setSettings(res.data.data.settings);
      }
    } catch (err) {
      console.error("Error fetching settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Patch directly to the provider's settings field
      await api.patch('/providers/profile', { settings });
      alert("Availability settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to update specific day data
  const updateDay = (field, value) => {
    const updatedHours = settings.operatingHours.map(d => 
      d.dayOfWeek === editingDay ? { ...d, [field]: value } : d
    );
    setSettings({ ...settings, operatingHours: updatedHours });
  };

  const currentDay = settings.operatingHours.find(d => d.dayOfWeek === editingDay);

  const addBreak = () => {
    const newBreaks = [...currentDay.breaks, { start: "12:00", end: "13:00" }];
    updateDay('breaks', newBreaks);
  };

  const removeBreak = (index) => {
    const newBreaks = currentDay.breaks.filter((_, i) => i !== index);
    updateDay('breaks', newBreaks);
  };

  if (loading) return <div className="p-10 text-center">Loading schedule...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Schedule Manager</h1>
          <p className="text-slate-500 text-sm">Define when you are available for bookings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition disabled:bg-blue-300 shadow-lg shadow-blue-100"
        >
          <FiSave /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Buffer & Day Selector */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <label className="block text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">
              Buffer Time
            </label>
            <input 
              type="range" min="0" max="60" step="5"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={settings.bufferTime}
              onChange={(e) => setSettings({...settings, bufferTime: parseInt(e.target.value)})}
            />
            <div className="flex justify-between mt-2 font-bold text-blue-600">
              <span>{settings.bufferTime} mins</span>
              <span className="text-slate-300 text-xs">Interval</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            {DAYS.map((day, index) => (
              <button
                key={day}
                onClick={() => setEditingDay(index)}
                className={`w-full text-left p-4 rounded-2xl mb-1 transition flex justify-between items-center ${
                  editingDay === index ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="font-bold">{day}</span>
                {!settings.operatingHours.find(d => d.dayOfWeek === index)?.isOpen && 
                  <span className="text-[10px] uppercase opacity-60">Closed</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Day Editor */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div 
              key={editingDay}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-slate-900">{DAYS[editingDay]}</h2>
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500 ml-2">Open for business?</span>
                  <button 
                    onClick={() => updateDay('isOpen', !currentDay.isOpen)}
                    className={`px-4 py-2 rounded-xl font-bold transition ${currentDay.isOpen ? 'bg-green-500 text-white' : 'bg-slate-300 text-white'}`}
                  >
                    {currentDay.isOpen ? 'YES' : 'NO'}
                  </button>
                </div>
              </div>

              {currentDay.isOpen ? (
                <div className="space-y-10">
                  {/* Hours Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-6 rounded-3xl">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3">
                        <FiClock /> Start Shift
                      </label>
                      <input 
                        type="time" value={currentDay.startTime}
                        onChange={(e) => updateDay('startTime', e.target.value)}
                        className="text-2xl font-black bg-transparent outline-none w-full"
                      />
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-3">
                        <FiClock /> End Shift
                      </label>
                      <input 
                        type="time" value={currentDay.endTime}
                        onChange={(e) => updateDay('endTime', e.target.value)}
                        className="text-2xl font-black bg-transparent outline-none w-full"
                      />
                    </div>
                  </div>

                  {/* Breaks Selection */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <FiCoffee /> Scheduled Breaks
                      </h3>
                      <button 
                        onClick={addBreak}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition"
                      >
                        <FiPlus /> Add Break
                      </button>
                    </div>

                    <div className="space-y-3">
                      {currentDay.breaks.map((brk, index) => (
                        <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <input 
                            type="time" value={brk.start}
                            onChange={(e) => {
                              const b = [...currentDay.breaks];
                              b[index].start = e.target.value;
                              updateDay('breaks', b);
                            }}
                            className="bg-transparent font-bold text-lg outline-none"
                          />
                          <span className="text-slate-300">to</span>
                          <input 
                            type="time" value={brk.end}
                            onChange={(e) => {
                              const b = [...currentDay.breaks];
                              b[index].end = e.target.value;
                              updateDay('breaks', b);
                            }}
                            className="bg-transparent font-bold text-lg outline-none"
                          />
                          <button 
                            onClick={() => removeBreak(index)}
                            className="ml-auto text-red-400 hover:text-red-600 p-2"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      ))}
                      {currentDay.breaks.length === 0 && (
                        <p className="text-slate-400 text-center py-6 border-2 border-dashed border-slate-100 rounded-3xl">
                          No breaks added for this day.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-[30px] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic text-lg">You are closed on this day.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProviderAvailability;
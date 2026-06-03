import { useState, useEffect } from "react";
import api from "../../api/axios";
import Button from "../../components/ui/Button";
import ProviderHeader from "../../features/provider/components/ProviderHeader";
import Label from "../../components/ui/Label";
import GlobalLoader from "../../components/layout/GlobalLoader";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const AvailabilityManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [editingDay, setEditingDay] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    startTime: "09:00",
    endTime: "17:00",
    breaks: [],
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const existing = schedules.find((s) => s.dayOfWeek === editingDay);
    if (existing) {
      setFormData({
        startTime: existing.startTime,
        endTime: existing.endTime,
        breaks: existing.breaks || [],
      });
    } else {
      setFormData({
        startTime: "09:00",
        endTime: "17:00",
        breaks: [],
      });
    }
  }, [editingDay, schedules]);

  const fetchSchedules = async () => {
    const res = await api.get("/availability/me");
    setSchedules(res.data.data || []);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/availability", {
        dayOfWeek: editingDay,
        ...formData,
      });
      await fetchSchedules();
    } catch {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const addBreak = () => {
    setFormData({
      ...formData,
      breaks: [...formData.breaks, { start: "12:00", end: "13:00" }],
    });
  };

  const removeBreak = (idx) => {
    setFormData({
      ...formData,
      breaks: formData.breaks.filter((_, i) => i !== idx),
    });
  };


  const handleDeleteDay = async () => {
    if (!window.confirm("Remove this day's availability?")) return;

    try {
      await api.delete(`/availability/${editingDay}`);

      // 🔥 Refresh data
      await fetchSchedules();

      // Reset form
      setFormData({
        startTime: "09:00",
        endTime: "17:00",
        breaks: [],
      });

      alert("Availability removed");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const hasSchedule = schedules.some(
    (s) => s.dayOfWeek === editingDay
  );

  if (loading) return <GlobalLoader message='Loading Availability...'/>
  
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-8">

      <ProviderHeader
        title="Manage Availability"
        subtitle="Set Your working Days and Break"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 slide overflow-hidden px-2">
        {/* LEFT: Day Selector */}
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2">
            {DAYS.map((day, i) => (
              <Button
                key={day}
                onClick={() => setEditingDay(i)}
                className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition cursor-pointer"
                variant={`${editingDay === i ? "primary": "secondary"}`}
              >
                {day}
                {schedules.some((s) => s.dayOfWeek === i) && " 📅"}
              </Button>
            ))}
          </div>
        </div>

        {/* RIGHT: Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-100 slideUp">

            {/* Title */}
            <h2 className="text-lg md:text-xl font-bold mb-6 text-slate-800 border-b-2 border-t-2 rounded-full text-center py-2">
              <span className="text-(--brand-primary-hover)">{DAYS[editingDay]}</span> Schedule
            </h2>

            {/* Time Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8">
              <div>
                <Label className="block text-xs font-bold text-slate-400 mb-2"
                  variant="ghost"
                >
                  Starts At
                </Label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-(--brand-primary)"
                />
              </div>

              <div>
                <Label className="block text-xs font-bold text-slate-400 mb-2"
                  variant="ghost"
                >
                  Ends At
                </Label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-(--brand-primary)"
                />
              </div>
            </div>

            {/* -------------------- */}
            {/* Breaks Section */}
            {/* -------------------- */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">
                  Scheduled Breaks
                </h3>
                <button
                  onClick={addBreak}
                  className="text-(--border-focus) text-sm font-bold"
                >
                  + Add Break
                </button>
              </div>

              <div className="space-y-3">
                {formData.breaks.map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 p-3 rounded-xl"
                  >
                    <input
                      type="time"
                      value={b.start}
                      onChange={(e) => {
                        const newB = [...formData.breaks];
                        newB[i].start = e.target.value;
                        setFormData({ ...formData, breaks: newB });
                      }}
                      className="bg-transparent text-sm"
                    />

                    <span className="hidden sm:block text-slate-300">
                      →
                    </span>

                    <input
                      type="time"
                      value={b.end}
                      onChange={(e) => {
                        const newB = [...formData.breaks];
                        newB[i].end = e.target.value;
                        setFormData({ ...formData, breaks: newB });
                      }}
                      className="bg-transparent text-sm"
                    />

                    <button
                      onClick={() => removeBreak(i)}
                      className="sm:ml-auto text-red-400 hover:text-(--color-danger)"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {formData.breaks.length === 0 && (
                  <p className="text-black text-center py-4 border border-dashed rounded-xl">
                    No breaks added
                  </p>
                )}
              </div>
            </div>

            {/* -------------------- */}
            {/* Save Button */}
            {/* -------------------- */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              {hasSchedule && (
                <button
                  onClick={handleDeleteDay}
                  className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-200"
                >
                  Remove Day
                </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;


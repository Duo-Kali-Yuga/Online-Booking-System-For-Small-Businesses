import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";
import api from "../../api/axios";

export default function BookingPage() {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const rescheduleId = searchParams.get("reschedule");
  const isRescheduling = Boolean(rescheduleId);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [oldApptData, setOldApptData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isRescheduling) {
      api.get(`/appointments/${rescheduleId}`)
        .then((res) => setOldApptData(res.data.data))
        .catch((err) => console.error("Error retrieving historical details", err));
    }
  }, [rescheduleId, isRescheduling]);

  const handleCommitSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please specify both a date and a time slot.");
      return;
    }

    setLoading(true);
    try {
      if (isRescheduling) {
        // SCENARIO A: Rescheduling path
        await api.post("/appointments", {
          ...oldApptData,
          providerId,
          date: selectedDate,
          startTime: selectedTime,
          rescheduleId, // Attaching the ID triggers the cancel-and-create logic in backend
        });
        alert("The appointment has been successfully rescheduled!");
      } else {
        // SCENARIO B: Normal booking path
        await api.post("/appointments", {
          providerId,
          date: selectedDate,
          startTime: selectedTime,
        });
        alert("New appointment booked successfully!");
      }

      navigate("/dashboard"); 
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isRescheduling ? (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-amber-900">Rescheduling Workspace</h2>
          
          {user?.role === "provider" ? (
            <p className="text-sm text-amber-700 mt-1">
              Mode: **Provider Modification**. Shifting slot timeline for client:{" "}
              <span className="font-bold text-slate-900">{oldApptData?.client?.name || "Loading..."}</span>
            </p>
          ) : (
            <p className="text-sm text-amber-700 mt-1">
              Mode: **Client Self-Service**. Shifting your appointment with:{" "}
              <span className="font-bold text-slate-900">{oldApptData?.provider?.businessName || "the provider"}</span>
            </p>
          )}

          {oldApptData && (
            <div className="text-xs text-amber-600 mt-3 border-t border-amber-200/60 pt-2">
              Current Slot: {dayjs(oldApptData.date).format("MMMM D, YYYY")} at <span className="font-bold">{oldApptData.startTime}</span>
            </div>
          )}
        </div>
      ) : (
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Appointment</h2>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-slate-100 rounded-2xl shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">1. Choose Date</label>
          <input 
            type="date" 
            min={dayjs().format("YYYY-MM-DD")}
            className="w-full border p-3 rounded-xl focus:outline-none focus:border-indigo-600 bg-slate-50"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">2. Choose Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-xl border font-medium text-sm transition-all ${
                  selectedTime === time 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCommitSchedule}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md disabled:bg-slate-300"
        >
          {loading ? "Processing..." : isRescheduling ? "Confirm Reschedule" : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}
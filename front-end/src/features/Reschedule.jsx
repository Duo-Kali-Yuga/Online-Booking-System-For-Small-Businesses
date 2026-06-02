import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/axios"; // Your customized axios instance

export default function BookingPage() {
  const { providerId } = useParams(); // Gets the business ID from the URL path
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. Detect if we are in Reschedule Mode
  const rescheduleId = searchParams.get("reschedule");
  const isRescheduling = Boolean(rescheduleId);

  // Component States
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [existingAppt, setExistingAppt] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Optional: Fetch details of the old appointment if rescheduling
  useEffect(() => {
    if (isRescheduling) {
      api.get(`/appointments/${rescheduleId}`)
        .then((res) => setExistingAppt(res.data.data))
        .catch((err) => console.error("Error fetching appointment details", err));
    }
  }, [rescheduleId, isRescheduling]);

  // 3. Handle the Submission Logic
  const handleActionSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please choose both a date and a time slot.");
      return;
    }

    setLoading(true);
    try {
      if (isRescheduling) {
        // Run PATCH request to update the record
        await api.patch(`/appointments/${rescheduleId}/reschedule`, {
          newDate: selectedDate,
          newTimeSlot: selectedTime,
        });
        alert("Your appointment has been successfully rescheduled!");
      } else {
        // Run standard POST request to create a brand new reservation
        await api.post("/appointments", {
          providerId,
          date: selectedDate,
          startTime: selectedTime,
        });
        alert("Appointment booked successfully!");
      }

      // Send the user back to their dashboard once completed
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "An operational error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Dynamic Header Mode Indicator */}
      {isRescheduling ? (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-6">
          <h2 className="text-xl font-bold text-amber-900">Rescheduling Mode</h2>
          <p className="text-sm text-amber-700 mt-1">
            You are moving your previous appointment for{" "}
            <span className="font-semibold">{existingAppt?.service?.name || "the selected service"}</span>.
          </p>
          {existingAppt && (
            <p className="text-xs text-amber-600 mt-1">
              Current slot: {dayjs(existingAppt.date).format("MMMM D")} at {existingAppt.startTime}
            </p>
          )}
        </div>
      ) : (
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Book an Appointment</h2>
      )}

      {/* Your Calendar Component / Slots Selection Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-slate-100 rounded-2xl shadow-sm">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Date</label>
          <input 
            type="date" 
            min={dayjs().format("YYYY-MM-DD")}
            className="w-full border p-3 rounded-xl focus:outline-none focus:border-indigo-600"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Available Time Slots</label>
          <div className="grid grid-cols-3 gap-2">
            {["09:00", "10:00", "11:00", "14:00", "15:00"].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`py-2 rounded-xl border font-medium text-sm transition-all ${
                  selectedTime === time 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Final Execution Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleActionSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md disabled:bg-slate-300"
        >
          {loading ? "Processing..." : isRescheduling ? "Confirm New Time" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
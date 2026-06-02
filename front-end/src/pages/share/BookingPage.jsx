import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function BookingPage() {
  const { providerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const rescheduleId = searchParams.get("reschedule");
  const isRescheduling = Boolean(rescheduleId);

  // ===== STATE =====
  const [providerData, setProviderData] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [oldApptData, setOldApptData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ===== LOAD PROVIDER + SERVICES =====
  useEffect(() => {
    const loadProviderAndServices = async () => {
      if (!providerId) return;

      try {
        setPageLoading(true);

        const [pRes, sRes] = await Promise.all([
          api.get(`/providers/${providerId}`),
          api.get(`/services/${providerId}`),
        ]);

        setProviderData(pRes.data.data || pRes.data);

        const servicesData = sRes.data.data || sRes.data || [];
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (err) {
        console.error("Provider/services error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    loadProviderAndServices();
  }, [providerId]);

  // ===== LOAD OLD APPOINTMENT (RESCHEDULE) =====
  useEffect(() => {
    if (!isRescheduling) return;

    const loadOld = async () => {
      try {
        const res = await api.get(`/appointments/${rescheduleId}`);
        const appt = res.data.data || res.data;

        setOldApptData(appt);
        setSelectedDate(dayjs(appt.date).format("YYYY-MM-DD"));
        setSelectedTime(appt.startTime);

        if (appt.service) setSelectedService(appt.service);
      } catch (err) {
        console.error("Old appointment error:", err);
      }
    };

    loadOld();
  }, [rescheduleId, isRescheduling]);

  // ===== LOAD SLOTS =====
  useEffect(() => {
    const fetchSlots = async () => {
      if (!providerId || !selectedService || !selectedDate) return;

      try {
        setLoadingSlots(true);

        const res = await api.get("/slots", {
          params: {
            providerId,
            date: selectedDate,
            duration: selectedService.duration,
            _t: Date.now(),
          },
        });

        const slots = Array.isArray(res.data) ? res.data : res.data.data || [];
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Slots error:", err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [providerId, selectedService, selectedDate]);

  // ===== BOOK / RESCHEDULE =====
  const handleCommitSchedule = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please select service, date, and time.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/appointments", {
        providerId,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedTime,
        ...(isRescheduling ? { rescheduleId } : {}),
      });

      alert(isRescheduling ? "Appointment rescheduled!" : "Appointment booked!");

      navigate(user?.role === "provider" ? "/provider/bookings" : "/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOADING =====
  if (pageLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        Loading booking page...
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-red-500 font-bold">Provider not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Provider Header */}
      <div className="bg-white border rounded-2xl p-5 mb-6 shadow-sm">
        <h2 className="text-xl font-bold">{providerData.businessName}</h2>
        <p className="text-slate-500">{providerData.industry}</p>
        <p className="text-sm mt-2 text-slate-600">{providerData.description}</p>
      </div>

      {/* Reschedule Banner */}
      {isRescheduling && oldApptData && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl mb-6">
          <h2 className="font-bold text-amber-900">Rescheduling Mode</h2>
          <p className="text-sm text-amber-700 mt-1">
            {user?.role === "provider"
              ? `Client: ${oldApptData.client?.name}`
              : `Provider: ${providerData?.businessName}`}
          </p>
          <div className="text-sm mt-2 text-amber-700">
            Current: <b>{dayjs(oldApptData.date).format("MMMM D, YYYY")}</b> at{" "}
            <b>{oldApptData.startTime}</b>
          </div>
        </div>
      )}

      {/* Service Selection */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Select Service</h3>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => (
            <button
              key={s._id}
              onClick={() => setSelectedService(s)}
              className={`p-3 border rounded-xl text-sm font-bold ${
                selectedService?._id === s._id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-50"
              }`}
            >
              {s.name} • {s.duration}m • ${s.price}
            </button>
          ))}
        </div>
      </div>

      {/* Date + Slots */}
      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 border rounded-2xl">
        <div>
          <label className="font-bold text-sm">Choose Date</label>
          <input
            type="date"
            value={selectedDate}
            min={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mt-2 p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="font-bold text-sm">Available Slots</label>

          {!selectedService ? (
            <p className="text-slate-400 mt-2">Please select a service first</p>
          ) : loadingSlots ? (
            <p className="mt-2">Loading slots...</p>
          ) : availableSlots.length === 0 ? (
            <p className="mt-2 text-red-500">No slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => setSelectedTime(slot.start)}
                  className={`p-2 border rounded-lg text-sm ${
                    selectedTime === slot.start
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-50"
                  }`}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCommitSchedule}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:bg-slate-300"
        >
          {loading
            ? "Processing..."
            : isRescheduling
            ? "Confirm Reschedule"
            : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}
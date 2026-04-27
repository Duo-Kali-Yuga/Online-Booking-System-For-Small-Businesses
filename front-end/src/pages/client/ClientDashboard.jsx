import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Navigate, useNavigate } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModel';
import { API_BASE } from '../../lib/public.constants';



const ClientDashboard = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      // Create a route in your backend for GET /api/appointments/my-appointments
      const res = await api.get('/appointments/my-bookings');
      setAppointments(res.data.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      // Update local state to show 'cancelled' immediately
      setAppointments(prev => prev.map(appt => 
        appt._id === id ? { ...appt, status: 'cancelled' } : appt
      ));
    } catch (err) {
      alert("Error cancelling appointment");
    }
  };

  const handleOpenReview = (appt) => {
    setSelectedAppt(appt);
    setIsModalOpen(true);
  };

  const upcoming = appointments.filter(a => 
    dayjs(a.date).isAfter(dayjs().subtract(1, 'day')) && a.status !== 'cancelled'
  );

  const pastOrCancelled = appointments.filter(a => 
    dayjs(a.date).isBefore(dayjs()) || a.status === 'cancelled'
  );

  const AppointmentCard = ({ appt, isPast }) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center mb-4">
      <div className="flex gap-4 items-center">
        <div className="bg-slate-100 p-3 rounded-lg text-center min-w-[70px]">
          <span className="block text-xs font-bold text-slate-500 uppercase">
            {dayjs(appt.date).format('MMM')}
          </span>
          <span className="text-xl font-black">{dayjs(appt.date).format('DD')}</span>
        </div>
        <div>
        <img 
          src={appt.provider.avatar ? `${API_BASE}${appt.provider.avatar}` : `${API_BASE}${appt.provider.avatar}`} 
          className="w-32 h-32 rounded-3xl object-cover"
        />
          <h4 className="font-bold text-slate-800">{appt.provider?.businessName}</h4>
          <p className="text-sm text-slate-500">{appt.service?.name} • {appt.startTime}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {appt.status}
        </span>

        {/* Action: Review */}
        {!isPast && appt.status === 'confirmed' && !appt.isReviewed && (
          <button 
            onClick={() => handleOpenReview(appt)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold "
          >
            Leave a Review
          </button>
        )}

        {/* Action: Cancel (Now connected to handleCancel) */}
        {!isPast && appt.status === 'confirmed' && (
          <button 
            onClick={() => handleCancel(appt._id)}
            className="text-xs text-red-500 font-semibold hover:underline"
          >
            Cancel
          </button>
        )}

        {/* Action: Reschedule (Fixed Navigate Bug) */}
        {!isPast && (
          <button 
            onClick={() => navigate(`/booking/${appt.provider?._id}?reschedule=${appt._id}`)}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500">Manage your upcoming bookings and history.</p>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Schedule</h1>

        {/* Upcoming Section */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            Upcoming <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{upcoming.length}</span>
          </h2>
          {upcoming.length > 0 ? (
            upcoming.map(a => <AppointmentCard key={a._id} appt={a} isPast={false} />)
          ) : (
            <p className="text-slate-400 italic">No upcoming appointments.</p>
          )}
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Past & Cancelled</h2>
          <div className="opacity-75"> {/* Slightly fade out history for visual hierarchy */}
            {pastOrCancelled.length > 0 ? (
              pastOrCancelled.map(a => <AppointmentCard key={a._id} appt={a} isPast={false} />)
            ) : (
              <p className="text-slate-400 italic">History is empty.</p>
            )}
          </div>
        </section>
      </div>
    <ReviewModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      appointment={selectedAppt}
      onReviewSuccess={fetchMyAppointments}
    />
    </div>
  );
};

export default ClientDashboard;
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Navigate } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModel';


const ClientDashboard = () => {
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
      await api.patch(`/api/appointments/${id}/cancel`);
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
          <span className="block text-xs font-bold text-slate-500 uppercase">{dayjs(appt.date).format('MMM')}</span>
          <span className="text-xl font-black">{dayjs(appt.date).format('DD')}</span>
        </div>
        <div>
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

        {/* Action Button: Review (Only if Past & Confirmed) */}
        {isPast && appt.status === 'confirmed' && (
          <button 
            onClick={() => handleOpenReview(appt)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition"
          >
            Leave a Review
          </button>
        )}
                
        {/* Action Button: Cancel (Only if Upcoming) */}
        {!isPast && appt.status === 'confirmed' && (
          <button className="text-xs text-red-500 font-semibold hover:underline">
            Cancel
          </button>
        )}

      <button 
        onClick={() => Navigate(`/booking/${appt.provider._id}`)}
        className="text-xs text-blue-600 font-semibold hover:underline"
      >
        Reschedule
      </button>
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
              pastOrCancelled.map(a => <AppointmentCard key={a._id} appt={a} isPast={true} />)
            ) : (
              <p className="text-slate-400 italic">History is empty.</p>
            )}
          </div>
        </section>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading your schedule...</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {appointments.map((appt) => (
              <motion.div
                key={appt._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex gap-6 items-center">
                  {/* Date Badge */}
                  <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-center min-w-[80px]">
                    <div className="text-xs uppercase font-bold">{dayjs(appt.date).format('MMM')}</div>
                    <div className="text-2xl font-black">{dayjs(appt.date).format('DD')}</div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {appt.provider?.businessName || "Service Provider"}
                    </h3>
                    <p className="text-slate-600 font-medium">{appt.service?.name}</p>
                    <div className="text-sm text-slate-400 mt-1">
                      🕒 {appt.startTime} • {appt.service?.duration} mins
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {appt.status.toUpperCase()}
                  </span>
                  
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {appointments.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">You haven't booked any appointments yet.</p>
            </div>
          )}
        </div>
      )}
    <ReviewModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      appointment={selectedAppt}
      onReviewSuccess={fetchMyAppointments} // Refresh list to remove the button if already reviewed
    />
    </div>
  );
};

export default ClientDashboard;
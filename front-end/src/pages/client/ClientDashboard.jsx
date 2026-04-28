import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Navigate, useNavigate } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModel';
import { API_BASE } from '../../lib/public.constants';
import AppointmentCard from '../../features/provider/dashboard/AppointmentCard';
import ClientHeader from '../../features/client/components/ClientHeader';
import PastAppointmentCard from '../../features/client/components/PastAppointmentCard';



const ClientDashboard = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providerInfo, setProviderInfo] = useState([])


  useEffect(() => {
    fetchMyAppointments();
  }, []);
  
  const fetchMyAppointments = async () => {
    try {
      const res = await api.get('/appointments/my-bookings');
      setAppointments(res.data.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointments.length > 0) {
      fetchProviderInfo();
      
    }
  }, [appointments]);


  const fetchProviderInfo = async () => {
    try {
      const responses = await Promise.all(
        appointments.map((appt) => api.get(`/providers/${appt.provider._id}`))
      );
      const providerData = responses.map((response) => response.data);
      setProviderInfo(providerData.map((val) => val.data));
    } catch (err) {
      console.error("Error while fetching provider info:", err.response?.data || err.message);
    }
  };


  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ClientHeader
        title="My Appointments"
        subtitle="Manage your upcoming bookings and history."
      />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Schedule</h1>

        {/* Upcoming Section */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            Upcoming <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{upcoming.length}</span>
          </h2>
          {upcoming.length > 0 ? (
            upcoming.map(a => <AppointmentCard key={a._id} appt={a} isPast={false} handleCancel={handleCancel} handleOpenReview={handleOpenReview}/>)
          ) : (
            <p className="text-slate-400 italic">No upcoming appointments.</p>
          )}
        </section>

        {/* History Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Past & Cancelled</h2>
          <div className="opacity-75"> {/* Slightly fade out history for visual hierarchy */}
            {pastOrCancelled.length > 0 ? (
              pastOrCancelled.map(a => <PastAppointmentCard key={a._id} appt={a} isPast={false} handleCancel={handleCancel} handleOpenReview={handleOpenReview}
              providerInfo={providerInfo.find((info) => info._id === a.provider._id)}
              />)
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
import React, { useEffect, useState } from 'react'
import api from '../../../api/axios';
import DashboardStats from './DashboardStats';
import CalendarAgenda from './CalendarAgenda';
import GlobalLoader from '../../../components/layout/GlobalLoader';


const ProviderDailyInfo = ({ title }) => {

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get('/appointments/provider-bookings');
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (isLoading) return <GlobalLoader/>

  return (
    <section>
      <h3
        className='text-2xl font-bold text-(--brand-primary-hover) pl-12'
      >{title}</h3>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border-t-4 rounded-2xl py-6 px-4 custom-arrow-left border-(--brand-primary-hover)">

        {/* 1. Statistics Summary */}
        <DashboardStats bookings={bookings} />

        <CalendarAgenda bookings={bookings} />
      </div>
    </section>
  )
}

export default ProviderDailyInfo

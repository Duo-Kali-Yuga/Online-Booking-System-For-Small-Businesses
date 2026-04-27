import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiCalendar, FiSettings, FiTrash2 } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useNavigate, Link } from 'react-router-dom';

import DashboardStats from '../../features/provider/dashboard/DashboardStats';
import CalendarAgenda from '../../features/provider/dashboard/CalendarAgenda';
import ProviderHeader from '../../features/provider/components/ProviderHeader';
import StatCard from '../../features/provider/dashboard/StatCard';
import { DashboardUp } from '../../features/provider/services/dashboard.service';
import ProviderDashboardSection from '../../features/provider/dashboard/ProviderDashboardSection';

import ProviderDailyInfo from '../../features/provider/dashboard/ProviderDailyInfo';
import ProviderDashboardTable from '../../features/provider/dashboard/ProviderDashboardTable';



const ProviderDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, count: 0, pending: 0 });

  const values = [stats.revenue, stats.count, stats.pending]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <ProviderHeader
        title="Business Overview"
        subtitle="Welcome back! Here is what's happening today."
      />

      <ProviderDashboardSection
        title="Command Center"
        repeat={
          DashboardUp.map((val, index) => (
            {
              ...val, value: values[index]
            }
          ))
        }
        type="cards"
      />

      <ProviderDailyInfo
        title="Daily Information"
      />

      <ProviderDashboardTable
        title="Recent Appointments"
        setStats={setStats}
      />

    </div>
  );
};


export default ProviderDashboard;
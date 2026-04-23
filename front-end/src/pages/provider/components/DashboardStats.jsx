import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const DashboardStats = ({ bookings }) => {
  const today = dayjs().format('YYYY-MM-DD');
  const todayBookings = bookings.filter(b => dayjs(b.date).isSame(today, 'day'));
  
  // Logic: Calculate total minutes booked vs 8-hour capacity (480 mins)
  const totalMinutesBooked = todayBookings.reduce((acc, b) => acc + (b.service?.duration || 0), 0);
  const utilization = ((totalMinutesBooked / 480) * 100).toFixed(1);

  const stats = [
    { label: "Today's Appointments", value: todayBookings.length, color: "border-blue-500", bg: "bg-blue-50" },
    { label: "Daily Utilization", value: `${utilization}%`, color: "border-green-500", bg: "bg-green-50" },
    { label: "Pending Requests", value: bookings.filter(b => b.status === 'pending').length, color: "border-purple-500", bg: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((stat, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${stat.color}`}
        >
          <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">{stat.label}</p>
          <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
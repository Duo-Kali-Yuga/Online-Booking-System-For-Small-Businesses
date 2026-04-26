import { useState } from 'react';
import dayjs from 'dayjs';

const CalendarAgenda = ({ bookings }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  const dailyBookings = bookings
    .filter(b => dayjs(b.date).format('YYYY-MM-DD') === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ">
      <div className="p-4 border-b bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="font-bold text-slate-800">Daily Agenda</h2>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition design-btn"
        />
      </div>

      <div className="p-2">
        {dailyBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-300 text-5xl mb-4">🗓️</div>
            <p className="text-slate-400 font-medium">No appointments for this date.</p>
          </div>
        ) : (
          <div className="space-y-8 design-bg ">
            {dailyBookings.map((appt) => (
              <div key={appt._id} className="flex gap-6 items-start">
                <div className="w-16 pt-1">
                  <span className="text-xs font-bold text-blue-600 uppercase">{appt.startTime}</span>
                </div>
                <div className="relative pb-2 border-l-2 border-slate-100 pl-8 flex-1">
                  {/* Timeline Node */}
                  <div className="absolute -left-[9px] top-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                  
                  <div className="bg-white border border-slate-100 p-4 rounded-xl hover:shadow-md hover:border-blue-200 transition group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition">
                          {appt.client?.name || "Guest Client"}
                        </h4>
                        <p className="text-xs text-slate-400">{appt.client?.email}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">{appt.service?.name}</span>
                      <span className="flex items-center gap-1 text-blue-500 font-medium">
                        ⏱️ {appt.service?.duration} mins
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarAgenda;
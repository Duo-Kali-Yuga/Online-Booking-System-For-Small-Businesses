import AppointmentCard from "./AppointmentCard";
import AppointmentRow from "./AppointmentRow";




export default function AppointmentsTable({
  appointments,
  onUpdate,
  onDelete,
}) {
  const visible = appointments.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl shadow-sm ">
      
      {/* ------------------ */}
      {/* 🖥 DESKTOP TABLE */}
      {/* ------------------ */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Info</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((appt) => (
              <AppointmentRow
                key={appt._id}
                appt={appt}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------ */}
      {/* 📱 MOBILE CARDS */}
      {/* ------------------ */}
      <div className="md:hidden p-4 space-y-3">
        {visible.map((appt) => (
          <AppointmentCard
            key={appt._id}
            appt={appt}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

    </div>
  );
}
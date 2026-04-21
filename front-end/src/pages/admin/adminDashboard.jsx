import { Link } from "react-router-dom";

export default function AdminDashboard() {

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Admin Panel
      </h1>

      <div className="grid grid-cols-3 gap-4">

        <Link to="/admin/users" className="border p-4 rounded">
          👥 Users
        </Link>

        <Link to="/admin/providers" className="border p-4 rounded">
          🏢 Providers
        </Link>

        <Link to="/admin/appointments" className="border p-4 rounded">
          📅 Appointments
        </Link>

      </div>

    </div>
  );
}
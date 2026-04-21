import { Link } from "react-router-dom";

export default function ProviderDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Provider Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">

        <Link
          to="/provider/services"
          className="border p-4 rounded hover:shadow"
        >
          🛠 Manage Services
        </Link>

        <Link
          to="/provider/availability"
          className="border p-4 rounded hover:shadow"
        >
          ⏰ Availability
        </Link>

        <Link
          to="/provider/bookings"
          className="border p-4 rounded hover:shadow"
        >
          📅 Bookings
        </Link>

      </div>

    </div>
  );
}
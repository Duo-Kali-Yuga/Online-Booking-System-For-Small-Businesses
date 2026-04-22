import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProviderLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-6">
        <h1 className="text-xl font-bold border-b border-slate-700 pb-4">Business Panel</h1>
        <nav className="flex flex-col space-y-4">
          <Link to="/provider" className="hover:text-blue-400">Dashboard</Link>
          <Link to="/provider/services" className="hover:text-blue-400">Manage Services</Link>
          <Link to="/provider/bookings" className="hover:text-blue-400">My Bookings</Link>
          <button 
            onClick={logout}
            className="mt-10 text-left text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This is where child routes render */}
      </main>
    </div>
  );
};

export default ProviderLayout;
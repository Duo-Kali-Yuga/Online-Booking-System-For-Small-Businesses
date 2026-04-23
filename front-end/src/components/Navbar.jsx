import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiGrid, FiSearch, FiShield, FiClock } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Don't show navbar if not logged in

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">
          BookEase<span className="text-slate-400">.</span>
        </Link>

        {/* Dynamic Links based on Role */}
        <div className="hidden md:flex items-center gap-8">
          {user.role === 'client' && (
            <>
              <Link to="/app" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                <FiSearch /> Find Services
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                <FiGrid /> My Bookings
              </Link>
            </>
          )}

          {user.role === 'provider' && (
            <>
              <Link to="/provider" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                <FiGrid /> Dashboard
              </Link>
              <Link to="/provider/services" className="text-slate-600 font-medium hover:text-blue-600">
                Services
              </Link>
              {/* ADD THIS LINK HERE */}
              <Link to="/provider/availability" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                <FiClock /> Availability
              </Link>
              <Link to="/provider/profile" className="flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600">
                <FiUser /> Edit Profile
              </Link>
            </>
          )}

          {user.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-2 text-red-600 font-bold hover:text-red-700">
              <FiShield /> Admin Panel
            </Link>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4 border-l pl-8 border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.role}</p>
            <p className="text-sm font-bold text-slate-800">{user.name}</p>
          </div>
          
          <Link to={user.role === 'provider' ? "/provider/profile" : "/settings"}>
            <img 
              src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100 hover:border-blue-500 transition-all"
            />
          </Link>

          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
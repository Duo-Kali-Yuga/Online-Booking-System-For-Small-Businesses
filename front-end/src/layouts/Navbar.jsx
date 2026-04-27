import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiLogOut,
  FiUser,
  FiGrid,
  FiSearch,
  FiShield,
  FiClock,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // -------------------------
  // Reusable Links
  // -------------------------
  const renderLinks = () => {
    if (user.role === "client") {
      return (
        <>
          <NavLink to="/client" onClick={() => setOpen(false)}>🔍 Find Services</NavLink>
          <NavLink to="/client/dashboard" onClick={() => setOpen(false)}>📅 My Bookings</NavLink>
          <NavLink to="/client/settings" onClick={() => setOpen(false)}>👤 Profile</NavLink>
        </>
      );
    }

    if (user.role === "provider") {
      return (
        <>
          <NavLink to="/provider" onClick={() => setOpen(false)}>📊 Dashboard</NavLink>
          <NavLink to="/provider/services" onClick={() => setOpen(false)}>🛠 Services</NavLink>
          <NavLink to="/provider/availability" onClick={() => setOpen(false)}>⏰ Availability</NavLink>
          <NavLink to="/provider/reviews" onClick={() => setOpen(false)}>💬 Reviews</NavLink>
          <NavLink to="/provider/profile" onClick={() => setOpen(false)}>👤 Profile</NavLink>
        </>
      );
    }

    if (user.role === "admin") {
      return (
        <NavLink to="/admin" onClick={() => setOpen(false)}>
          🛡 Admin Panel
        </NavLink>
      );
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="text-2xl font-black text-blue-600">
          BookEase<span className="text-slate-400">.</span>
        </NavLink>

        {/* ------------------ */}
        {/* Desktop Links */}
        {/* ------------------ */}
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          {renderLinks()}
        </div>

        {/* ------------------ */}
        {/* Right Section */}
        {/* ------------------ */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* User info (hidden on small) */}
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-black text-blue-600 uppercase">
              {user.role}
            </p>
            <p className="text-sm font-bold">{user.name}</p>
          </div>

          {/* Avatar */}
          <NavLink
            to={
              user.role === "provider"
                ? "/provider/profile"
                : "/client/settings"
            }
          >
            <img
              src={
                user.avatar
                  ? `http://localhost:5000${user.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}`
              }
              alt="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover border"
            />
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden md:block text-slate-400 hover:text-red-500"
          >
            <FiLogOut size={20} />
          </button>

          {/* ------------------ */}
          {/* Mobile Menu Button */}
          {/* ------------------ */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-slate-600"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>


      {/* MOBILE MENU */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="md:hidden mt-4 border-t pt-4 space-y-4 text-slate-700 font-medium">

              {/* Links */}
              <div className="flex flex-col gap-3 px-2">
                {renderLinks()}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 px-2"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



    </nav>
  );
};

export default Navbar;
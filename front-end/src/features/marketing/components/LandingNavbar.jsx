import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 h-r(--nav-height) max-w-(--container-max) mx-auto sticky top-0 z-50 bg-white/70 backdrop-blur-md">

      <div className="text-2xl font-black text-brand">
        BOOK<span className="text-slate-800">EASE</span>.
      </div>

      <div className="flex items-center gap-6">
        <Link to="/login">Login</Link>
        <Link to="/register" className="bg-slate-900 text-white px-6 py-2 rounded-full">
          Sign Up
        </Link>
      </div>

    </nav>
  );
};

export default LandingNavbar;
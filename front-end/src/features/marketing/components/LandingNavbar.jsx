import { Link } from "react-router-dom";
import { PROJECT_NAME } from "../../../lib/public.constants";


const LandingNavbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 h-r(--nav-height) max-w-(--container-max) mx-auto sticky top-0 z-50 bg-white/70 backdrop-blur-md py-4">

      <div className="text-2xl font-black text-brand">
        {PROJECT_NAME[0]}<span className="text-slate-800">{PROJECT_NAME[1]}</span>.
      </div>

      <div className="flex items-center gap-6 ">
        <Link to="/login"
          className="slideUp px-6 py-2 rounded-full"
        >Login</Link>
        <Link to="/register" className="slideUp px-6 py-2 rounded-full">
          Sign Up
        </Link>
      </div>

    </nav>
  );
};

export default LandingNavbar;
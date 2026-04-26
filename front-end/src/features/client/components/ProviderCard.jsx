import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { API_BASE } from "../../../lib/public.constants";


const ProviderCard = ({ provider }) => {

  console.log(provider)


  return (
    <motion.div whileHover={{ y: -5 }} className="bg-(--bg-card) rounded-2xl overflow-hidden shadow-sm border border-(--border-focus) flex flex-col">

      <div className="h-32 bg-linear-to-t from-(--brand-primary) via-40% via-(--brand-light) to-(--brand-primary-hover) flex items-center justify-center">
        <span className="text-(--overlay-bg) text-4xl font-bold">
          {provider.businessName.charAt(0)}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-slate-800">{provider.businessName}</h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold p-2 rounded-full">
            {provider.industry}
          </span>
        </div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <img 
              src={
                provider.avatar 
                  ? `http://localhost:5000${provider.avatar}` 
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.user.name)}&background=random`
              } 
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover border-2 border-slate-100 hover:border-blue-500 transition-all"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${provider.user.name}`; }}
            />
            <h2 className="text-xl font-bold text-slate-800">{provider.user.name}</h2>

          </div>
          <div className="flex justify-center gap-2 pr-2">
            <span className="text-yellow-400 text-ms">★</span>
            <span className="text-yellow-400 text-ms font-bold ">
              {provider.ratingStats.totalReviews}
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-sm mb-4 flex-1">
          {provider.user.email}
        </p>
        <p className="text-slate-500 text-sm mb-4 flex-1">
          {provider.description || "No description provided."}
        </p>
        <div className="text-sm text-slate-400 mb-6">
          📍 {provider.location?.city}, {provider.location?.country}
        </div>
        <NavLink 
          to={`/client/booking/${provider._id}`}
          className="w-full bg-linear-to-tl from-(--brand-primary-light) via-60% via-(--brand-primary) to-(--brand-primary-light) text-black  py-3 rounded-xl font-bold hover:bg-slate-800 transition-all  shadow-(--shadow-lg) hover:text-white text-center hover:-translate-y-0.5  hover:shadow-2xs duration-600"
        >
          Book Appointment
        </NavLink>
      </div>
    </motion.div>
  );
};

export default ProviderCard;
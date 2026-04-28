import { motion } from 'framer-motion';
import { PROJECT_NAME } from '../../lib/public.constants';


const GlobalLoader = ({ message = `Loading ${PROJECT_NAME.join("")}...` }) => {
  // Variations of the Indigo brand color for a gradient effect
  const primaryColor = 'var(--brand-primary)'; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-6"
    >
      {/* The Animated Spinner Container */}
      <div className="relative w-20 h-20">
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-4 border-indigo-100"
        />

        {/* Inner Spinning Arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-4 border-l-4 border-transparent"
          style={{ borderTopColor: primaryColor, borderLeftColor: primaryColor }}
        />
        
        {/* Central Brand Dot */}
        <div className="absolute inset-4 rounded-full bg-slate-900 shadow-inner flex items-center justify-center text-white font-black text-xs">
            {PROJECT_NAME[0].charAt(0)}.{PROJECT_NAME[1].charAt(0)}
        </div>
      </div>

      {/* Loading Message & Status */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <p className="text-xl font-bold text-slate-800 tracking-tight">
          {message}
        </p>
        <div className="flex justify-center items-center gap-1.5 mt-2">
            {/* Pulsing indicator */}
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              Connecting to Server
            </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlobalLoader;
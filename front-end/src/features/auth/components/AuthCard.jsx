import { motion } from "framer-motion";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="p-10 bg-white shadow-xl rounded-2xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-slate-500 text-sm mt-2">{subtitle}</p>
          </div>

          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
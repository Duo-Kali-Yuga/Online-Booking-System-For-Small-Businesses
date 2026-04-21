import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold"
        >
          Smart Booking System for Small Businesses
        </motion.h1>

        <p className="text-gray-600 mt-4">
          Book appointments easily. Manage your schedule efficiently.
        </p>

        <div className="mt-6 flex justify-center gap-4">

          <Link to="/login" className="px-6 py-2 bg-black text-white rounded">
            Login
          </Link>

          <Link to="/register" className="px-6 py-2 border border-black rounded">
            Get Started
          </Link>

        </div>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-3 gap-6 px-10 mt-10">

        <div className="p-6 bg-white shadow rounded">
          <h2 className="font-bold">Easy Booking</h2>
          <p className="text-sm text-gray-500">
            Book appointments in seconds.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h2 className="font-bold">Smart Scheduling</h2>
          <p className="text-sm text-gray-500">
            Avoid overlaps and manage availability.
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded">
          <h2 className="font-bold">Business Dashboard</h2>
          <p className="text-sm text-gray-500">
            Track appointments and performance.
          </p>
        </div>

      </div>

    </div>
  );
}
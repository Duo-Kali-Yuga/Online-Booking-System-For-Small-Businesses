import React from 'react'
import {motion} from "framer-motion"
import { FiArrowRight, FiCheckCircle, FiShield, FiZap } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <main className="max-w-(--container-max) mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand text-xs font-black uppercase tracking-widest mb-6">
          <FiZap /> The Future of Scheduling
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          The smartest way to <span className="text-brand">book</span> your day.
        </h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
          From barbers to doctors, manage your appointments with ease. 
          A complete scheduling solution built for modern businesses 
          and busy clients.
        </p>

        <div className="flex flex-col sm:row gap-4">
          <Link 
            to="/login" 
            className="bg-brand text-white text-center px-10 py-5 rounded-(--radius-lg) font-bold text-lg hover:bg-brand-hover shadow-premium transition-all flex items-center justify-center gap-2"
          >
            Get Started Now <FiArrowRight />
          </Link>
          <Link 
            to="/register?role=client" 
            className="bg-white text-slate-800 text-center border border-(--border-light) px-10 py-5 rounded-(--radius-lg) font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            Register as Client
          </Link>
          <Link 
            to="/register?role=provider" 
            className="bg-white text-slate-800 text-center border border-(--border-light) px-10 py-5 rounded-(--radius-lg) font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            Register as Business
          </Link>
        </div>

        {/* Social Proof */}
        <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i} 
                src={`https://i.pravatar.cc/100?img=${i+10}`} 
                className="w-10 h-10 rounded-full border-4 border-white object-cover" 
                alt="User"
              />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Used by <span className="text-slate-900">500+</span> professionals
          </p>
        </div>
      </motion.div>

      {/* Decorative Visual - Using your Premium Shadows */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative hidden lg:block"
      >
        <div className="w-full h-[520px] bg-brand-light rounded-[var(--radius-xl)] rotate-2 relative overflow-hidden border border-brand/10 shadow-premium">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent" />
          
          {/* Mock Floating UI Card */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-20 left-10 right-10 bg-white p-6 rounded-[var(--radius-lg)] shadow-premium border border-slate-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <FiCheckCircle size={24} />
              </div>
              <div>
                <div className="h-3 w-32 bg-slate-100 rounded-full mb-2" />
                <div className="h-2 w-20 bg-slate-50 rounded-full" />
              </div>
            </div>
            <div className="h-10 w-full bg-brand rounded-xl" />
          </motion.div>

          {/* Status Card */}
          <div className="absolute bottom-16 right-[-20px] bg-slate-900 p-6 rounded-[var(--radius-lg)] shadow-2xl w-72 text-white">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-black uppercase text-slate-400">Next Appointment</p>
              <FiShield className="text-brand" />
            </div>
            <p className="text-lg font-bold mb-1">Dr. Alberto Silochi</p>
            <p className="text-sm text-slate-400">Today at 14:30 PM</p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default HeroSection

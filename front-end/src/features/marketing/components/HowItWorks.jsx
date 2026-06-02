import React from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {

  const steps = [
    {
      icon: <FiUserPlus />,
      title: "Create your profile",
      desc: "Sign up as a client or provider in seconds."
    },
    {
      icon: <FiCalendar />,
      title: "Pick a service",
      desc: "Choose what you need from available services."
    },
    {
      icon: <FiClock />,
      title: "Select a time",
      desc: "See real-time availability and book instantly."
    },
    {
      icon: <FiCheckCircle />,
      title: "You're done",
      desc: "Appointments are confirmed and synced automatically."
    }
  ];

  return (
    <section className="bg-slate-50 py-24 border-t border-[var(--border-light)]">
      <div className="max-w-[var(--container-max)] mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Booking shouldn’t be complicated
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            A simple flow that gets you from discovery to confirmed appointment in under a minute.
          </p>
        </div>

        

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="w-12 h-12 bg-brand-light text-brand rounded-xl flex items-center justify-center text-xl mb-5">
                {step.icon}
              </div>

              <h3 className="font-extrabold text-slate-900 mb-2">
                {step.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-white border border-slate-100 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Ready to simplify your schedule?
            </h3>
            <p className="text-slate-500">
              Start booking or managing appointments in minutes.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/register?role=client"
              className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-hover transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-800 hover:bg-slate-50 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
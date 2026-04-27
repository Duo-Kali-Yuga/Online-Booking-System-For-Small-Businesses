import React from 'react'
import { FiCheckCircle, FiShield, FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion';

const FeaturesSection = () => {

  const pub = [
          { icon: <FiZap />, title: "Smart Slots", desc: "Our algorithm calculates availability in real-time." },
          { icon: <FiCheckCircle />, title: "Instant Sync", desc: "Clients and providers stay updated via real-time alerts." },
          { icon: <FiShield />, title: "Role Control", desc: "Dedicated dashboards for businesses and customers." }
        ]

  return (
    <section className="bg-white py-24 border-t border-[var(--border-light)]">
      <div className="max-w-[var(--container-max)] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
        {pub.map((f, i) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={i} 
            className="group"
          >
            <div className="w-12 h-12 bg-brand-light text-brand rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-brand group-hover:text-white transition-all">
              {f.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection

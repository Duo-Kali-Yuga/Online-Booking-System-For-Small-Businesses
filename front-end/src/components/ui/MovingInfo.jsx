import React from 'react';
import { FiClock, FiCalendar, FiShield, FiZap } from 'react-icons/fi';

const MovingInfoStrip = () => {
  const items = [
    { icon: <FiZap />, text: "Instant booking in under 60 seconds" },
    { icon: <FiCalendar />, text: "Real-time availability updates" },
    { icon: <FiClock />, text: "Smart scheduling across time zones" },
    { icon: <FiShield />, text: "Secure and role-based access control" },
  ];

  return (
    <section className="w-full overflow-hidden bg-white border-y border-[var(--border-light)]">
      
      {/* Track */}
      <div className="flex w-[200%] animate-marquee">
        
        {/* First copy */}
        <div className="flex w-1/2 justify-around py-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-slate-700 font-semibold"
            >
              <span className="text-brand text-lg">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Duplicate copy for seamless loop */}
        <div className="flex w-1/2 justify-around py-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-slate-700 font-semibold"
            >
              <span className="text-brand text-lg">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MovingInfoStrip;
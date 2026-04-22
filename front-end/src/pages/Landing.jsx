import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">
          BOOK<span className="text-slate-800">EASE</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 font-semibold hover:text-blue-600 transition">
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold hover:bg-slate-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            The smartest way to <span className="text-blue-600">book</span> your day.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            From barbers to doctors, manage your appointments with ease. 
            A complete scheduling solution built for modern businesses 
            and busy clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/login" 
              className="bg-blue-600 text-white text-center px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              Get Started Now
            </Link>
            <Link 
              to="/register?role=provider" 
              className="bg-white text-slate-800 text-center border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Register as Business
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4 text-slate-400">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-slate-50" />
              ))}
            </div>
            <p className="text-sm font-medium">Joined by 500+ local professionals</p>
          </div>
        </motion.div>

        {/* Decorative Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="w-full h-[500px] bg-blue-100 rounded-[40px] rotate-3 relative overflow-hidden border-4 border-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
            {/* Mock UI Elements */}
            <div className="absolute top-10 left-10 right-10 bg-white p-4 rounded-xl shadow-lg">
              <div className="h-4 w-1/3 bg-slate-100 rounded mb-2" />
              <div className="h-4 w-full bg-slate-50 rounded" />
            </div>
            <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-xl w-64 border border-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-8 w-full bg-blue-600 rounded-lg" />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Feature Section */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Smart Slots", desc: "Our algorithm calculates availability in real-time." },
            { title: "Instant Sync", desc: "Clients and providers stay updated instantly." },
            { title: "Role Control", desc: "Dedicated dashboards for businesses and customers." }
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="text-blue-600 font-black text-xl mb-2">{f.title}</div>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
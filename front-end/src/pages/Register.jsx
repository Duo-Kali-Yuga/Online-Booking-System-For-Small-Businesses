import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if "role=provider" was passed in the URL
  const initialRole = searchParams.get('role') === 'provider' ? 'provider' : 'client';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(formData)
      // 1. Register the User
      await api.post('/auth/register', formData);
      
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-center mb-8">Join the community today.</p>

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setFormData({ ...formData, role: 'client' })}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              formData.role === 'client' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setFormData({ ...formData, role: 'provider' })}
            className={`flex-1 py-2 rounded-lg font-bold transition ${
              formData.role === 'provider' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Business
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="john@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:bg-blue-300"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
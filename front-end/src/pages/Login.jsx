import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      
      // Professional Role-Based Redirection
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'provider') {
        navigate('/provider');
      } else {
        navigate('/app'); // Client discovery page
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || "Invalid credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="p-10 bg-white shadow-2xl rounded-3xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2 text-sm">Please enter your details to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="name@company.com" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Password</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            disabled={isLoading}
            className="w-full mt-8 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:bg-blue-300"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
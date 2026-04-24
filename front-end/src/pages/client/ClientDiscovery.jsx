import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ClientDiscovery = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');


    const industries = ['healthcare', 'beauty', 'education', 'consulting', 'fitness', 'other'];

  // const fetchProviders = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await api.get('/providers', {
  //       params: { search, industry, city }
  //     });

  //     // Log this to your browser console to see the structure!
  //     console.log("Full Backend Response:", res.data);

  //     // If you use successResponse utility, the data is usually in res.data.data
  //     const responseData = res.data.data;

  //     if (responseData && responseData.providers) {
  //       // If the service returned { providers, total }
  //       setProviders(responseData.providers);
  //     } else if (Array.isArray(responseData)) {
  //       // If the service returned just the array
  //       setProviders(responseData);
  //     } else {
  //       setProviders([]);
  //     }
  //   } catch (err) {
  //     console.error("Search Error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProviders = async () => {
    console.log("Step 1: Function triggered");
    setLoading(true);
    
    try {
      console.log("Step 2: Sending request with:", { search, industry, city });
      
      const res = await api.get('/providers', {
        params: { 
          search: search.trim(), 
          industry, 
          city: city.trim() 
        }
      });

      console.log("Step 3: Response received", res.data);

      // Unwrapping logic
      const responseData = res.data.success ? res.data.data : res.data;
      const finalArray = responseData.providers || responseData;

      setProviders(Array.isArray(finalArray) ? finalArray : []);
      
    } catch (err) {
      console.error("Step 4: Error caught", err.response?.data || err.message);
    } finally {
      console.log("Step 5: Setting loading to false");
      setLoading(false);
    }
  };

  // const fetchProviders = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await api.get('/providers', {
  //       params: { search, industry, city }
  //     });

  //     // Check exactly what res.data looks like in the browser console
  //     console.log("Browser received:", res.data);

  //     // Safely extract the array
  //     const providersList = res.data?.data?.providers || res.data?.providers || [];
      
  //     setProviders(providersList);
  //   } catch (err) {
  //     console.error("Frontend Search Error:", err);
  //   } finally {
  //     setLoading(false); // This MUST run to hide the spinner
  //   }
  // };


  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  useEffect(() => {
    fetchProviders();
  }, [industry]); // Refetch when industry changes

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Service</h1>
        <p className="text-slate-600">Book professional services in your city instantly.</p>
      </header>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-12 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      {/* Search Input */}
        <input 
          type="text" 
          placeholder="Business name..." 
          className="flex-1 p-3 outline-none bg-slate-50 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* City Input */}
          <input 
            type="text" 
            placeholder="City (e.g. Nanjing)" 
            className="flex-1 p-3 outline-none bg-slate-50 rounded-xl"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

        {/* Industry Select */}
        <select 
          className="p-3 bg-slate-50 rounded-xl outline-none text-slate-600"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          {/* <option value="">All Industries</option>
          <option value="barber">Barber</option>
          <option value="doctor">Doctor</option>
          <option value="salon">Salon</option>
          <option value="consultant">Consultant</option> */}
            <option value="">All Industries</option>
            {industries.map((ind, index) => <option key={index} value={ind}>{ind}</option>)}
        </select>
        
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        type='submit'
        disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading experts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <motion.div 
              key={provider._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl uppercase font-bold">
                  {provider.businessName.charAt(0)}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-slate-800">{provider.businessName}</h2>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    {provider.industry}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-4 flex-1">
                  {provider.description || "No description provided."}
                </p>
                <div className="text-sm text-slate-400 mb-6">
                  📍 {provider.location?.city}, {provider.location?.country}
                </div>
                <Link 
                  to={`/booking/${provider._id}`}
                  className="w-full bg-slate-900 text-white text-center py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && providers.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
          <p className="text-slate-400">No providers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ClientDiscovery;
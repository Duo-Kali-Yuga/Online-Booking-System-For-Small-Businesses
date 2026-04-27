import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { INDUSTRIES } from '../../lib/public.constants';
import ProviderSearchForm from '../../features/client/components/ProviderSearchForm';
import ProviderList from '../../features/client/components/ProviderList';


const ClientDiscovery = () => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    industry: "",
  });


  const fetchProviders = async () => {
    setIsLoading(true);
    
    try {
      const res = await api.get('/providers', {
        params: { 
          search: filters.search.trim(), 
          industry: filters.industry.trim(), 
          city: filters.city.trim() 
        }
      });

      // Unwrapping logic
      const responseData = res.data.success ? res.data.data : res.data;
      const finalArray = responseData.providers || responseData;

      setProviders(Array.isArray(finalArray) ? finalArray : []);
      
    } catch (err) {
      console.error("Step 4: Error caught", err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  useEffect(() => {
    fetchProviders();
  }, [filters.industry]); // Refetch when industry changes

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Find a Service</h1>
        <p className="text-slate-600">Book professional services in your city instantly.</p>
      </header>

      <div>
        <ProviderSearchForm
          filters={filters}
          setFilters={setFilters}
          onSubmit={handleSearch}
          loading={isLoading}
          />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ProviderList providers={providers} />
        )}

      </div>

    </div>
  );
};




export default ClientDiscovery;
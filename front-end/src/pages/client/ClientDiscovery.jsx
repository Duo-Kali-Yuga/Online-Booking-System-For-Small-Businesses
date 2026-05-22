import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { INDUSTRIES } from '../../lib/public.constants';
import ProviderSearchForm from '../../features/client/components/ProviderSearchForm';
import ProviderList from '../../features/client/components/ProviderList';
import ClientHeader from '../../features/client/components/ClientHeader';
import GlobalLoader from '../../components/layout/GlobalLoader';


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
      <ClientHeader
        title="Find a Service"
        subtitle="Book professional services in your city instantly."
      />

      <div className='mt-6'>
        <ProviderSearchForm
          filters={filters}
          setFilters={setFilters}
          onSubmit={handleSearch}
          loading={isLoading}
          />
        {isLoading ? (
          <GlobalLoader message="Search Providing..."/>
        ) : (
          <ProviderList providers={providers} />
        )}

      </div>

    </div>
  );
};




export default ClientDiscovery;
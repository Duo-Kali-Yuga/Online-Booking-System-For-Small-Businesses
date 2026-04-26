import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ProviderForm from '../../features/provider/dashboard/ProviderForm';

const ProviderSetup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'other',
    description: '',
    address: '',
    city: '',
    country: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/providers', {
        businessName: formData.businessName,
        industry: formData.industry,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country
        }
      });
      alert("Profile created! Redirecting to dashboard...");
      navigate('/provider');
    } catch (err) {
      alert(err.response?.data?.message || "Setup failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-(--bg-card) rounded-3xl border border-(--border-light) shadow-(--shadow-premium) flex flex-col justify-center items-center gap-2">
      <h1 className="text-2xl font-bold mb-6 text-(--overlay-bg) ">Setup Your Business Profile</h1>
      <ProviderForm
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};


export default ProviderSetup;
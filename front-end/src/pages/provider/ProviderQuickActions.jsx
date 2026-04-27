import React from 'react'
import { FiUsers, FiDollarSign, FiCalendar, FiSettings, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import { NavLink, useNavigate } from 'react-router-dom';

const ProviderQuickActions = () => {

  const navigate = useNavigate()


  const handleAddService = () => {
    navigate('/provider/services'); // Or wherever your service management page lives
  };

  const handleAvailability = () => {
    navigate('/provider/availability');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <h2 className="text-xl font-bold text-slate-800 text-center">Quick Actions</h2>
        <Button
          onClick={handleAddService} // Add this!
          className="w-full flex items-center justify-between transition group rounded-b-2xl"
          size = "lg"
          variant='design'
          
        >
          <span className="font-bold">Add New Service</span>
          <FiSettings className="text-slate-400 group-hover:text-white" />
        </Button>
        <Button 
          onClick={handleAvailability} // Add this!
          className="w-full flex items-center justify-between transition group rounded-t-2xl"
          size = "lg"
          variant='design'
          >
            <span className="font-bold">Edit Availability</span>
            <FiCalendar className="text-slate-400 group-hover:text-white" />
        </Button>
      </div>

      <div className="bg-blue-600 rounded-3xl p-6 text-white">
        <h4 className="font-bold mb-2">Need Help?</h4>
        <p className="text-blue-100 text-sm mb-4">Check our ChatBot guide on how to maximize your bookings.</p>
      </div>
    </div>
  )
}


export default ProviderQuickActions

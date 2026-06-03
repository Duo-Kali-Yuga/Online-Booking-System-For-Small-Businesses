import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';
import ProviderHeaderStart from '../../components/ProviderHeaderStart';
import ReviewList from '../../components/ReviewList';
import ClientHeader from '../../features/client/components/ClientHeader';
import { API_BASE } from '../../lib/public.constants';
import GlobalLoader from '../../components/layout/GlobalLoader';



const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('reschedule');

  useEffect(() => {
    const fetchProvider = async () => {
      const res = await api.get(`/providers/${providerId}`);
      setProvider(res.data.data);
    };
    fetchProvider();
  }, [providerId]);

  // 1. Fetch Provider and their Services
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [pRes, sRes] = await Promise.all([
          api.get(`/providers/${providerId}`), // Direct fetch is better
          api.get(`/services/${providerId}`)
        ]);

        const providerData = pRes.data.data || pRes.data;
        const servicesData = sRes.data.data || sRes.data;

        setProvider(providerData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        
      } catch (err) {
        console.error("Fetch error", err);
        // 🔥 CRITICAL: If fetch fails, don't leave it loading forever
        setProvider({ error: true }); 
      }
    };
    if (providerId) fetchData();
  }, [providerId]);

  const fetchSlots = async () => {


    if (!providerId || !selectedService || !selectedDate) return;

    setLoadingSlots(true);
    try {
      const res = await api.get('/slots', {
        params: { 
          providerId, 
          date: selectedDate, 
          duration: selectedService.duration,
          _t: Date.now()
        }
      });

      const slotsArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setAvailableSlots(slotsArray);

    } catch (err) {
      console.error("Error fetching slots:", err);
      setAvailableSlots([]); 
    } finally {
      setLoadingSlots(false);
    }
  };

  // 2. Fetch Available Slots when Service or Date changes
  useEffect(() => {
    console.log("Check before fetch: useEffect", { providerId, selectedService, selectedDate });
    if (selectedService && selectedDate) {
      fetchSlots();
    }
  }, [selectedService, selectedDate]);


  const handleBooking = async (slot) => {
    try {
      await api.post('/appointments', {
        providerId: providerId,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: slot.start,
        endTime: slot.end,
        // Pass the ID to the backend if it exists
        rescheduleId: rescheduleId || null 
      });

      alert(rescheduleId ? "Reschedule Successful!" : "Booking Successful!");
      navigate('/client');
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!provider) return <GlobalLoader message="Loading Profile..."/>;

  if (provider.error) return (
    <div className="p-10 text-center">
      <h2 className="text-red-500 font-bold">Provider not found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ClientHeader
        title="Booking Appointment"
        subtitle="Manage the appointment"
      />
      <ProviderHeaderStart provider={provider}/>

      {/* Existing Header Layout */}
      <div className="flex flex-col mb-12 items-start">
        <h1 className="text-2xl font-bold text-(--brand-primary-hover) pl-12">Basic Information</h1>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 border-t-4 rounded-2xl py-6 px-4 custom-arrow-left border-(--brand-primary-hover) w-full">

          <div className="flex-1 flex justify-between px-4 py-2 border-2 border-(--border-focus) bg-(--glass-bg) text-center rounded-2xl shadow-(--shadow-lg)">
            <div className='flex-2 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Company Name:</h2>
              <h1 className="text-xl font-bold text-brand">{provider.businessName}</h1>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Industry:</h2>
              <h1 className="text-xl font-bold text-brand">{provider.industry}</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-between px-3 py-2 border-2 border-(--border-focus) bg-(--glass-bg) text-center rounded-2xl shadow-(--shadow-lg)">
            <div className='flex-1 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Provider Name:</h2>
              <h1 className="text-xl font-bold text-brand">{provider.user.name}</h1>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Email:</h2>
              <h1 className="text-xl font-bold text-brand">{provider.user.email}</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-between px-3 py-2 border-2 border-(--border-focus) bg-(--glass-bg) text-center rounded-2xl shadow-(--shadow-lg)">
            <div className='flex-1 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Phone:</h2>
              <p className="text-md font-bold text-brand">{provider.phone}</p>
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
              <h2 className="text-ms font-bold text-(--overlay-bg)">Location:</h2>
              <p className="text-md font-bold text-brand">📍 {provider.location?.address}, {provider.location?.city}, {provider.location?.country}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center border-2 border-(--border-focus) bg-(--glass-bg) text-center rounded-2xl shadow-(--shadow-lg)">
            <h2 className="text-ms font-bold text-(--overlay-bg)">Description:</h2>
            <p className="text-slate-500 mb-2">
              {provider.description ? provider.description : "No description set..."}
              </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-(--brand-primary-hover) pl-12">Basic Information</h1>
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-10 custom-arrow-left border-t-4 rounded-2xl py-6 px-4  border-(--brand-primary-hover)">
        {/* Step 1: Select Service */}
        <section className="lg:col-span-2 space-y-10  py-6 px-4 slideUp">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand">
            <span className="bg-(--brand-primary) text-(--bg-main) w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Select Service
          </h2>
          <div className="space-y-3">
            {services.map(s => (
              <div 
                key={s._id}
                onClick={() => setSelectedService(s)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition ${
                  selectedService?._id === s._id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="font-bold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.duration} min • ${s.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Step 2 & 3: Date & Slots */}
        <section className='slideUp py-6 px-4'>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-brand">
            <span className="bg-(--brand-primary) text-(--bg-main) w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Pick Date & Time
          </h2>
          
          <input 
            type="date" 
            min={dayjs().format('YYYY-MM-DD')}
            className="w-full p-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          {!selectedService ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400">
              Please select a service first
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {loadingSlots ? (
                <div className="col-span-3 text-center py-4">Checking slots...</div>
              ) : (
                availableSlots.map(slot => (
                  <button
                    key={slot.start}
                    onClick={() => handleBooking(slot)}
                    className="p-2 text-sm font-bold border rounded-lg hover:bg-blue-600 hover:text-white transition text-blue-600 border-blue-100"
                  >
                    {slot.start}
                  </button>
                ))
              )}
            </div>
          )}
          
          {!loadingSlots && selectedService && availableSlots.length === 0 && (
            <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg">
              No slots available for this day.
            </div>
          )}
        </section>


      </div>
      {/* Existing Header Layout */}
        <div className="flex flex-col items-start w-full">
          <h1 className="text-2xl font-bold text-(--brand-primary-hover) pl-12 flex justify-evenly items-center w-full">
            <span className="text-lg font-bold text-(--brand-primary-hover) flex items-center gap-2">
              Reviews 
              {/* ({provider.averageRating?.totalReviews || 0}) */}
            </span>
            <span className="text-yellow-400 font-bold text-lg">★ {provider.ratingStats?.averageRating || 0} </span>
          </h1>

          <div className="relative w-full border-t-4 rounded-2xl px-4 custom-arrow-left border-(--brand-primary-hover) ">
          {/* Sidebar: Reviews Column */}
            <ReviewList providerId={providerId} provider = {provider}/>
          </div>
        </div>
    </div>
  );
};

export default BookingPage;

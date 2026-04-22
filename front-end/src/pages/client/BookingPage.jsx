import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import dayjs from 'dayjs';

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // 1. Fetch Provider and their Services
  useEffect(() => {
    const fetchData = async () => {
      try {

        const [pRes, sRes] = await Promise.all([
          api.get(`/providers/${providerId}`), // Direct fetch is better
          api.get(`/services/${providerId}`)
        ]);

        console.log("Provider Data:", pRes.data);
        

        const providerData = pRes.data.data || pRes.data;
        const servicesData = sRes.data.data || sRes.data;

        console.log("Services loaded into state:", servicesData);

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
    // Ensure we have everything before making the call
    console.log("Check before fetch:", { providerId, selectedService, selectedDate });
    if (!providerId || !selectedService || !selectedDate) return;

    setLoadingSlots(true);
    try {
      const res = await api.get('/slots', { // Removed /api/ if it's in your baseURL
        params: { 
          providerId, 
          date: selectedDate, 
          duration: selectedService.duration 
        }
      });

      console.log("Slots from backend:", res.data);

      // Since your backend does res.json(slots), res.data IS the array.
      // We add a safety check just in case.
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


  const handleBook = async (slot) => {
    try {
      await api.post('/api/appointments', {
        providerId,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: slot.start
      });
      alert("Booking Successful! Check your email.");
      navigate('/dashboard'); // Go to client dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (!provider) return <div className="p-10 text-center">Loading Profile...</div>;

  if (provider.error) return (
    <div className="p-10 text-center">
      <h2 className="text-red-500 font-bold">Provider not found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Go Back</button>
    </div>
  );


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-slate-800">{provider.businessName}</h1>
        <p className="text-slate-500">📍 {provider.location?.city}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Step 1: Select Service */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
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
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
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
                    onClick={() => handleBook(slot)}
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
    </div>
  );
};

export default BookingPage;
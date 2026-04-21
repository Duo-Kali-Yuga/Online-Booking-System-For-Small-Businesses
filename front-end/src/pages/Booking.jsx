import { useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getServices,
  getSlots,
  bookAppointment,
  getReviews,
} from "../api/services";


export default function Booking() {

  const [success, setSuccess] = useState(false);

  const { providerId } = useParams();

  const queryClient = useQueryClient();

  // -------------------------
  // Local State
  // -------------------------
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState(null);

  // -------------------------
  // Fetch Services
  // -------------------------
  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services", providerId],
    queryFn: () => getServices(providerId),
  });

  // -------------------------
  // Fetch Slots (depends on service + date)
  // -------------------------
  const {
    data: slots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useQuery({
    queryKey: ["slots", providerId, date, selectedService?.duration],
    queryFn: () =>
      getSlots({
        providerId,
        date,
        duration: selectedService.duration,
      }),
    enabled: !!selectedService, // only run when service selected
  });

  // -------------------------
  // Booking Mutation
  // -------------------------
  const bookingMutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      setSuccess(true);

      setTimeout(() => setSuccess(false), 2000);

      queryClient.invalidateQueries({ queryKey: ["slots", providerId] });
      setSelectedSlot(null);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleBooking = () => {
    if (!selectedService || !selectedSlot) {
      return alert("Please select service and time");
    }

    bookingMutation.mutate({
      providerId,
      serviceId: selectedService._id,
      date,
      startTime: selectedSlot,
    });
  };


  // Reviews

  const { data: reviews } = useQuery({
    queryKey: ["reviews", providerId],
    queryFn: () => getReviews(providerId),
  });

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>

      {/* -------------------- */}
      {/* Services */}
      {/* -------------------- */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Select Service</h2>

        {servicesLoading && (
          <div className="flex gap-2">
            {[1,2,3].map((i) => (
              <div key={i} className="w-24 h-10 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        )}
        {servicesError && <p>Error loading services</p>}

        <div className="flex flex-wrap gap-2">
          {services?.map((s) => (
            <motion.button
              key={s._id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setSelectedService(s);
                setSelectedSlot(null);
              }}
              className={`px-4 py-2 border rounded ${
                selectedService?._id === s._id
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {s.name} ({s.duration}m)
            </motion.button>
          ))}
        </div>
      </div>

      {/* -------------------- */}
      {/* Date Picker */}
      {/* -------------------- */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Select Date</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null); // reset slot
          }}
          className="border p-2 rounded"
        />
      </div>

      {/* -------------------- */}
      {/* Slots */}
      {/* -------------------- */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Available Time Slots</h2>

        {!selectedService && (
          <p className="text-gray-500">Select a service first</p>
        )}

        {slotsLoading && (
          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 animate-pulse rounded"
              />
            ))}
          </div>
        )}
        {slotsError && <p>Error loading slots</p>}

        <div className="grid grid-cols-4 gap-2">
          {slots?.map((slot, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedSlot(slot.start)}
              className={`border p-2 rounded transition ${
                selectedSlot === slot.start
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {slot.start}
            </motion.button>
          ))}
        </div>
      </div>

      {/* -------------------- */}
      {/* Book Button */}
      {/* -------------------- */}
      <button
        onClick={handleBooking}
        disabled={!selectedService || !selectedSlot || bookingMutation.isLoading}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {bookingMutation.isLoading ? "Booking..." : "Confirm Booking"}
      </button>
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          ✅ Appointment booked successfully!
        </div>
      )}

      {/* -------------------- */}
      {/* review Part */}
      {/* -------------------- */}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Reviews</h2>

        {reviews?.map((r) => (
          <div key={r._id} className="border p-3 rounded mb-2">
            <p className="font-semibold">{r.client.name}</p>
            <p>⭐ {r.rating}</p>
            <p className="text-sm text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
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
} from "../api/services";



export default function Booking() {
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
      alert("✅ Appointment booked!");

      // refresh slots after booking
      queryClient.invalidateQueries({
        queryKey: ["slots", providerId],
      });

      // reset selection
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

        {servicesLoading && <p>Loading services...</p>}
        {servicesError && <p>Error loading services</p>}

        <div className="flex flex-wrap gap-2">
          {services?.map((s) => (
            <button
              key={s._id}
              onClick={() => {
                setSelectedService(s);
                setSelectedSlot(null); // reset slot
              }}
              className={`px-4 py-2 border rounded ${
                selectedService?._id === s._id
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {s.name} ({s.duration}m)
            </button>
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

        {slotsLoading && <p>Loading slots...</p>}
        {slotsError && <p>Error loading slots</p>}

        <div className="grid grid-cols-4 gap-2">
          {slots?.map((slot, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlot(slot.start)}
              className={`border p-2 rounded ${
                selectedSlot === slot.start
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {slot.start}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------- */}
      {/* Book Button */}
      {/* -------------------- */}
      <button
        onClick={handleBooking}
        disabled={bookingMutation.isLoading ||!selectedService ||!selectedSlot}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {bookingMutation.isLoading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
}
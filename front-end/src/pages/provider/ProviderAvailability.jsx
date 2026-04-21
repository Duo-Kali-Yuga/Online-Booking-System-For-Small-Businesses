import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetcher } from "../../api/fetcher";
import { useQueryClient } from "@tanstack/react-query";


export default function ProviderAvailability() {
  const [localEvents, setLocalEvents] = useState([]);
  const queryClient = useQueryClient();

  // 🔹 Fetch existing availability
  const { data } = useQuery({
    queryKey: ["availability"],
    queryFn: () => fetcher("/availability/provider"),
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      fetcher("/availability", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  // 🔹 Convert backend data to calendar format
  const backendEvents =
    data?.map((a) => ({
      id: a._id,
      title: "Available",
      start: a.start,
      end: a.end,
    })) || [];

  // 🔹 Handle selecting time range
  const handleSelect = (info) => {
    const newEvent = {
      title: "Available",
      start: info.startStr,
      end: info.endStr,
    };

    // 🚫 Prevent overlap
    const isOverlap = [...backendEvents, ...localEvents].some(
      (e) =>
        new Date(info.start) < new Date(e.end) &&
        new Date(info.end) > new Date(e.start)
    );

    if (isOverlap) {
      alert("This time overlaps with existing availability");
      return;
    }

    // Add locally
    setLocalEvents((prev) => [...prev, newEvent]);

    // Save to backend
    mutation.mutate({
      start: info.startStr,
      end: info.endStr,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      fetcher(`/availability/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["availability"]);
    },
  });

  // 🔹 Delete event
  const handleEventClick = (info) => {
    if (confirm("Delete this availability slot?")) {
      const id = info.event.id;

      if (id) {
        deleteMutation.mutate(id); // ✅ backend delete
      } else {
        // local event (not saved yet)
        setLocalEvents((prev) =>
          prev.filter((e) => e.start !== info.event.startStr)
        );
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Availability Calendar
      </h1>

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        select={handleSelect}
        events={[...backendEvents, ...localEvents]}
        eventClick={handleEventClick}
        height="auto"
      />

    </div>
  );
}
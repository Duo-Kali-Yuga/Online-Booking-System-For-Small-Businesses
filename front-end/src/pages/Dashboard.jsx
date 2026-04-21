import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";
import { cancelAppointment, rescheduleAppointment } from "../api/services";
import dayjs from "dayjs";
import { useState } from "react";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const [rescheduleData, setRescheduleData] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: () => fetcher("/appointments/user"),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["myAppointments"]);
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }) =>
      rescheduleAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["myAppointments"]);
      setRescheduleData(null);
    },
  });

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6">{error.message}</p>;

  const appointments = data || [];

  const now = dayjs();

  const upcoming = appointments.filter((a) =>
    dayjs(`${a.date} ${a.startTime}`).isAfter(now)
  );

  const past = appointments.filter((a) =>
    dayjs(`${a.date} ${a.startTime}`).isBefore(now)
  );

  const AppointmentCard = ({ appt, isPast }) => (
    <div className="border p-4 rounded flex justify-between items-center">

      <div>
        <h2 className="font-semibold">{appt.providerName}</h2>
        <p className="text-sm text-gray-600">
          {appt.date} • {appt.startTime}
        </p>

        <span className="text-xs px-2 py-1 bg-gray-200 rounded">
          {appt.status}
        </span>
      </div>

      <div className="flex gap-2">

        {/* CANCEL */}
        {!isPast && (
          <button
            onClick={() => cancelMutation.mutate(appt._id)}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded"
          >
            Cancel
          </button>
        )}

        {/* RESCHEDULE */}
        {!isPast && (
          <button
            onClick={() =>
              setRescheduleData({
                id: appt._id,
                date: appt.date,
                time: appt.startTime,
              })
            }
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
          >
            Reschedule
          </button>
        )}

      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      {/* UPCOMING */}
      <h2 className="font-semibold mb-2">Upcoming</h2>
      <div className="space-y-3 mb-8">
        {upcoming.map((a) => (
          <AppointmentCard key={a._id} appt={a} />
        ))}
      </div>

      {/* PAST */}
      <h2 className="font-semibold mb-2">Past</h2>
      <div className="space-y-3">
        {past.map((a) => (
          <AppointmentCard key={a._id} appt={a} isPast />
        ))}
      </div>

      {/* RESCHEDULE MODAL (simple version) */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded w-96">

            <h2 className="font-bold mb-4">Reschedule</h2>

            <input
              type="date"
              className="border p-2 w-full mb-2"
              onChange={(e) =>
                setRescheduleData({
                  ...rescheduleData,
                  date: e.target.value,
                })
              }
            />

            <input
              type="time"
              className="border p-2 w-full mb-4"
              onChange={(e) =>
                setRescheduleData({
                  ...rescheduleData,
                  time: e.target.value,
                })
              }
            />

            <button
              onClick={() =>
                rescheduleMutation.mutate({
                  id: rescheduleData.id,
                  data: {
                    newDate: rescheduleData.date,
                    newStartTime: rescheduleData.time,
                  },
                })
              }
              className="bg-black text-white w-full py-2"
            >
              Confirm
            </button>

            <button
              onClick={() => setRescheduleData(null)}
              className="mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
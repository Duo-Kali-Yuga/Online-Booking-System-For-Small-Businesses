import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment } from "../api/services";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: () => fetcher("/appointments/user"),
  });



  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["myAppointments"]);
    },
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">My Appointments</h1>

      {data.map((appt) => (
        <div key={appt._id} className="border p-3 mb-2">
          <p>{appt.date}</p>
          <p>{appt.startTime}</p>
          <p>Status: {appt.status}</p>
          <button
            onClick={() => cancelMutation.mutate(appt._id)}
            className="bg-red-500 text-white px-2 py-1 mt-2"
          >
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
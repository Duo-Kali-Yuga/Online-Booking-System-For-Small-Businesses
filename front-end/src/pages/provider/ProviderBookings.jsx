import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../api/fetcher";

export default function ProviderBookings() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["providerBookings"],
    queryFn: () => fetcher("/appointments/provider"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      fetcher(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["providerBookings"]);
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Incoming Bookings
      </h1>

      <div className="space-y-3">

        {data?.map((b) => (
          <div
            key={b._id}
            className="border p-4 rounded flex justify-between"
          >

            <div>
              <p>{b.date} - {b.startTime}</p>
              <p>Status: {b.status}</p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() =>
                  updateStatus.mutate({
                    id: b._id,
                    status: "confirmed",
                  })
                }
                className="bg-green-500 text-white px-3 py-1"
              >
                Accept
              </button>

              <button
                onClick={() =>
                  updateStatus.mutate({
                    id: b._id,
                    status: "cancelled",
                  })
                }
                className="bg-red-500 text-white px-3 py-1"
              >
                Reject
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
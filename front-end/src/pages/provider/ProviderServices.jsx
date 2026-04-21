import { useState } from "react";
import { fetcher } from "../../api/fetcher";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProviderServices() {
  const queryClient = useQueryClient();

  const [service, setService] = useState({
    name: "",
    duration: 30,
    price: 0,
  });

  const { data: services } = useQuery({
    queryKey: ["myServices"],
    queryFn: () => fetcher("/services/provider"),
  });

  const createMutation = useMutation({
    mutationFn: (data) =>
      fetcher("/services", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myServices"]);
    },
  });

  const handleSubmit = () => {
    createMutation.mutate(service);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-xl font-bold mb-4">My Services</h1>

      {/* CREATE SERVICE */}
      <div className="border p-4 rounded mb-6">

        <input
          placeholder="Service name"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setService({ ...service, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Duration (min)"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setService({ ...service, duration: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setService({ ...service, price: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2"
        >
          Add Service
        </button>

      </div>

      {/* LIST */}
      <div className="space-y-2">
        {services?.map((s) => (
          <div key={s._id} className="border p-3 rounded">
            {s.name} — {s.duration} min — ${s.price}
          </div>
        ))}
      </div>

    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProvidersAdmin, toggleProvider } from "../../api/services";

export default function AdminProviders() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["adminProviders"],
    queryFn: getProvidersAdmin,
  });

  const mutation = useMutation({
    mutationFn: toggleProvider,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProviders"]);
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Providers</h1>

      {data?.map((p) => (
        <div key={p._id} className="border p-3 mb-2 flex justify-between">

          <div>
            {p.businessName}
          </div>

          <button
            onClick={() => mutation.mutate(p._id)}
            className={`px-3 py-1 ${
              p.active ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {p.active ? "Disable" : "Enable"}
          </button>

        </div>
      ))}
    </div>
  );
}
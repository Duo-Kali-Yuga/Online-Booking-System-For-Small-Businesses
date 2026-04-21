import { useQuery } from "@tanstack/react-query";
import { getProviders } from "../api/services";
import { Link } from "react-router-dom";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: () => getProviders(),
  });

  if (isLoading) return <p>Loading providers...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Providers</h1>

      <div className="grid grid-cols-3 gap-4">
        {data.map((p) => (
          <Link
            key={p._id}
            to={`/booking/${p._id}`}
            className="border p-4 rounded"
          >
            <h2>{p.businessName}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
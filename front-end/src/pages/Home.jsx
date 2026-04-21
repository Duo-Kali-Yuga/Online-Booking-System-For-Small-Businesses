import { useQuery } from "@tanstack/react-query";
import { getProviders } from "../api/services";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers", search],
    queryFn: () => getProviders({ search }),
  });

  if (isLoading) return <p className="p-6">Loading providers...</p>;
  if (error) return <p className="p-6">{error.message}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Find Services</h1>

      {/* SEARCH */}
      <input
        placeholder="Search doctors, barbers..."
        className="border p-2 w-full mb-6"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROVIDERS */}
      <div className="grid grid-cols-3 gap-4">
        {data.providers.map((p) => (
          <Link
            key={p._id}
            to={`/booking/${p._id}`}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-semibold">{p.businessName}</h2>
            <p className="text-sm text-gray-500">{p.category}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}
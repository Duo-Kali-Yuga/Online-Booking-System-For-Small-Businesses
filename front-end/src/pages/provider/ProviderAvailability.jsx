import { useState } from "react";
import { fetcher } from "../../api/fetcher";
import { useMutation } from "@tanstack/react-query";

export default function ProviderAvailability() {
  const [availability, setAvailability] = useState({
    day: "Monday",
    start: "09:00",
    end: "17:00",
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      fetcher("/availability", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  return (
    <div className="p-6 max-w-xl mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Set Availability
      </h1>

      <select
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setAvailability({ ...availability, day: e.target.value })
        }
      >
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
      </select>

      <input
        type="time"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setAvailability({ ...availability, start: e.target.value })
        }
      />

      <input
        type="time"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setAvailability({ ...availability, end: e.target.value })
        }
      />

      <button
        onClick={() => mutation.mutate(availability)}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Save
      </button>

    </div>
  );
}
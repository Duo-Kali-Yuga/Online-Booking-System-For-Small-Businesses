import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/services";

export default function AdminUsers() {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  console.log(data)

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Users</h1>

      {data?.map((u) => (
        <div key={u._id} className="border p-2 mb-2">
          {u.name} — {u.email} — {u.role}
        </div>
      ))}
    </div>
  );
}
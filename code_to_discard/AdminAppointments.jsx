import { useQuery } from "@tanstack/react-query";
import { getAppointmentsAdmin } from "../../api/services";

export default function AdminAppointments() {
  const { data } = useQuery({
    queryKey: ["adminAppointments"],
    queryFn: getAppointmentsAdmin,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">All Appointments</h1>

      {data?.map((a) => (
        <div key={a._id} className="border p-3 mb-2">
          {a.client?.name} → {a.provider?.businessName}
          <br />
          {a.date} {a.startTime} ({a.status})
        </div>
      ))}
    </div>
  );
}
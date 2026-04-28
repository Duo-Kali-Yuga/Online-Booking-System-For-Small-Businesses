import { useProviderDashboard } from "./useProviderDashboard";
import AppointmentsTable from "./AppointmentsTable";
import ProviderQuickActions from "../../../pages/provider/ProviderQuickActions";
import GlobalLoader from "../../../components/layout/GlobalLoader";

export default function ProviderDashboardTable({
  title,
  setStats,
}) {
  const {
    appointments,
    isLoading,
    updateStatus,
    deleteAppointment,
  } = useProviderDashboard(setStats);

  if (isLoading) return <GlobalLoader/>

  return (
    <section>
      <h3 className="text-2xl font-bold pl-12  text-(--brand-primary-hover)">
        {title}
      </h3>

      <div className="relative grid md:grid-cols-3 gap-6 border-t-4 rounded-2xl p-6 custom-arrow-left border-(--brand-primary-hover)">
        <div className="md:col-span-2">
          <AppointmentsTable
            appointments={appointments}
            onUpdate={updateStatus}
            onDelete={deleteAppointment}
          />
        </div>

        <ProviderQuickActions />
      </div>
    </section>
  );
}
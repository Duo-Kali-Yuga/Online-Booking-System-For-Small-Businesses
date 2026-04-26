import ProviderHeader from "../../features/provider/components/ProviderHeader";
import ServiceForm from "../../features/provider/services/ServiceForm";
import ServicesTable from "../../features/provider/services/ServicesTable";
import { useServices } from "../../features/provider/services/useServices";

export default function ProviderServices() {
  const { services, addService, deleteService, loading } =
    useServices();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-2.5">

      <ProviderHeader
        title="Manage Services"
        subtitle="Add business services for your client to see"
      />

      <ServiceForm onSubmit={addService} loading={loading} />

      <ServicesTable
        services={services}
        onDelete={deleteService}
      />
    </div>
  );
}
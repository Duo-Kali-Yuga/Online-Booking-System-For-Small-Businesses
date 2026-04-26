import ProviderCard from "./ProviderCard";

const ProviderList = ({ providers }) => {
  if (!providers.length) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
        <p className="text-slate-400">No providers found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((p) => (
        <ProviderCard key={p._id} provider={p} />
      ))}
    </div>
  );
};

export default ProviderList;
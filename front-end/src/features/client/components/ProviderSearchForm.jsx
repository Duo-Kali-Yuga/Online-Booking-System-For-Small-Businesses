import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { INDUSTRIES } from "../../../lib/public.constants";



const ProviderSearchForm = ({ filters, setFilters, onSubmit, loading }) => {

  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-5 mb-12 bg-(--bg-card) px-4 py-6 rounded-2xl shadow-sm border border-(--bg-card)">

      <Input
        placeholder="Business name..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="flex-1"
        ring="small"
      />

      <Input
        placeholder="City (e.g. Nanjing)"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        className="flex-1"
        ring="small"
      />

      <select
        value={filters.industry}
        onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
        className="p-3 bg-slate-50 rounded-xl"
      >
      <option value="">All Industries</option>
        {INDUSTRIES.map((ind) => (
          <option key={ind} value={ind}>{ind}</option>
        ))}
      </select>

      <Button disabled={loading} className="px-8"
        size="lg"
        type="submit"
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};


export default ProviderSearchForm;
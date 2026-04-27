import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../components/ui/Button";

export default function ServicesTable({ services, onDelete }) {
  return (
    <div className="bg-(--glass-border) rounded-xl shadow-(--shadow-premium) border-2 border-(--overlay-bg) overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Duration</th>
            <th className="p-4">Price</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          <AnimatePresence>
            {services.map((s) => (
              <motion.tr
                key={s._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="border-b-2 rounded-full bg-slate-100 text-center hover:bg-(--border-focus) group design-bg"
              >
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.duration} min</td>
                <td className="p-4">${s.price}</td>
                <td className="p-4">
                  <Button
                    onClick={() => onDelete(s._id)}
                    className="text-red-500 w-full  group-hover:bg-conic-10 via-(--glass-bg) via-85% from-(--brand-primary-light) to-(--overlay-bg) transition-all duration-600 hover:bg-slate-800"
                    variant=""
                  >
                    Delete
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {services.length === 0 && (
        <p className="p-6 text-center text-gray-400">
          No services yet
        </p>
      )}
    </div>
  );
}


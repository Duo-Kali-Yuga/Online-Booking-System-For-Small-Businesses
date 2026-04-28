import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../../components/ui/Button";
import GlobalLoader from "../../../components/layout/GlobalLoader";

export default function ServiceForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
      setFormData({ name: "", duration: "", price: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <GlobalLoader message='Loading Availability...'/>

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className=" p-6 rounded-xl shadow-sm border mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 items-end design-bgRight"
    >
      <input
        placeholder="Service name"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        className="p-2 border rounded "
        required
      />

      <input
        type="number"
        placeholder="Duration"
        value={formData.duration}
        onChange={(e) =>
          setFormData({
            ...formData,
            duration: Number(e.target.value),
          })
        }
        className="p-2 border rounded "
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) =>
          setFormData({
            ...formData,
            price: Number(e.target.value),
          })
        }
        className="p-2 border rounded"
        required
      />

      <Button className="px-4 py-2">
        {loading ? "Adding..." : "Add"}
      </Button>
    </motion.form>
  );
}


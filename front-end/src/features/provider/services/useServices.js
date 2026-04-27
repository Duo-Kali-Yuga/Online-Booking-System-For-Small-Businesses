import { useState, useEffect } from "react";
import api from "../../../api/axios";

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services/me");
      const finalData = res.data.data || res.data;
      setServices(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const addService = async (formData) => {
    if (formData.duration <= 0) {
      throw new Error("Duration must be at least 1 minute.");
    }

    await api.post("/services", formData);
    await fetchServices();
  };

  const deleteService = async (id) => {
    await api.delete(`/services/${id}`);
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    addService,
    deleteService,
  };
};
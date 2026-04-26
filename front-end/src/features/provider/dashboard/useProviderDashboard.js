import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export const useProviderDashboard = (setStats) => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/appointments/provider-bookings");
      const data = res.data.data;

      setAppointments(data);

      const revenue = data
        .filter((a) => a.status === "confirmed")
        .reduce((sum, a) => sum + (a.service?.price || 0), 0);

      const pending = data.filter((a) => a.status === "pending").length;

      setStats({ revenue, count: data.length, pending });
    } catch (err) {
      if (err.response?.status === 404) {
        navigate("/provider/setup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status });
    fetchDashboardData();
  };

  const deleteAppointment = async (id) => {
    await api.delete(`/appointments/${id}`);
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    appointments,
    isLoading,
    updateStatus,
    deleteAppointment,
  };
};
import api from "../../api/axios";


// CLIENT
export const getMyAppointments = () =>
  api.get("/appointments/my");

// PROVIDER
export const getProviderAppointments = () =>
  api.get("/appointments/provider-bookings");

// ADMIN (optional)
export const getAllAppointments = () =>
  api.get("/admin/appointments");
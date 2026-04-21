import { fetcher } from "./fetcher";

export const loginUser = (data) =>
  fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Providers
export const getProviders = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/providers?${query}` : `/providers`;
  return fetcher(url);
};


// Services
export const getServices = (providerId) =>
  fetcher(`/services/${providerId}`);

// Slots
export const getSlots = ({ providerId, date, duration }) =>
  fetcher(
    `/slots?providerId=${providerId}&date=${date}&duration=${duration}`
  );

// Booking
export const bookAppointment = (data) =>
  fetcher("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const cancelAppointment = (id) =>
  fetcher(`/appointments/${id}/cancel`, {
    method: "PATCH",
  });

export const rescheduleAppointment = (id, data) =>
  fetcher(`/appointments/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
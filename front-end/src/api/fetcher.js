const BASE_URL = "http://localhost:5000/api";

export const fetcher = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  const data = await res.json();

  // 🔥 Handle API format
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data;
};
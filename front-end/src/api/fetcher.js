export const fetcher = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  let data;

  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Invalid JSON response (${res.status})`, err);
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data.data;
};
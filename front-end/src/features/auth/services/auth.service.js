import { api } from "@/api/client";

export const loginUser = (data) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const registerUser = (data) => {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
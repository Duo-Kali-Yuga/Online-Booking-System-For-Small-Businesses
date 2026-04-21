import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../api/fetcher";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("Account created successfully!");

      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">Create Account</h1>

      {/* NAME */}
      <input
        name="name"
        placeholder="Name"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
      />

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
      />

      {/* PASSWORD */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={handleChange}
      />

      {/* ROLE SELECTION */}
      <select
        name="role"
        className="border p-2 w-full mb-4"
        onChange={handleChange}
      >
        <option value="client">Client</option>
        <option value="provider">Provider</option>
        <option value="admin">Admin</option>
      </select>

      {/* BUTTON */}
      <button
        onClick={handleRegister}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Register
      </button>

    </div>
  );
}
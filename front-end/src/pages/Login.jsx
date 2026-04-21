import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/services";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email, password });

      // localStorage.setItem("token", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/app");
      // if (role === "CLIENT") → /app
      // if (role === "PROVIDER") → /provider-dashboard
      // if (role === "ADMIN") → /admin
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Login
      </button>
    </div>
  );
}
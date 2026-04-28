import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Label from "../../../components/ui/Label";
import GlobalLoader from "../../../components/layout/GlobalLoader";



const LoginForm = () => {
  const navigate = useNavigate();
  const { login: saveUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const user = await saveUser(form.email, form.password);

      const routes = {
        admin: "/admin",
        provider: "/provider",
        client: "/client",
      };

      navigate(routes[user.role] || "/client");
    } catch (err) {
      console.error("Login failed: " + (err.response?.data?.message || "Invalid credentials"));

    } finally {
      setIsLoading(false)
    }
  };

  if(isLoading) return <GlobalLoader/>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Email Address</Label>
      <Input
        type="email"
        placeholder="Example@g.com"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Label>Password</Label>
      <Input
        type="password"
        placeholder="••••••••"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button className="w-full mt-8 shadow-lg shadow-blue-100 disabled:bg-blue-300" disabled={isLoading} size="lg">
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="mt-8 text-center text-slate-500 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Create one
        </Link>
      </p>
      <p className="mt-2.5 text-center text-slate-500 text-sm">
        Return to {' '}
        <Link to="/" className="text-blue-600 font-bold hover:underline">
          Home Page
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
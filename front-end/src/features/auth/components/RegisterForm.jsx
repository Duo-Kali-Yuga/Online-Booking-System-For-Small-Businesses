import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Label from "../../../components/ui/Label";
import api from "../../../api/axios";
import GlobalLoader from "../../../components/layout/GlobalLoader";



const RegisterForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: searchParams.get("role") === "provider" ? "provider" : "client",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // await mutateAsync(form);
      await api.post("/auth/register", form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if(isLoading) return <GlobalLoader/>

  return (
    <section>
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <Button
            onClick={() => setForm({ ...form, role: 'client' })}
            className={`flex-1 rounded-lg font-bold transition ${
              form.role === 'client' ? ' shadow-sm' : ''
            }`}
            variant={`${form.role === "client" ? "primary": "ghost"}`}
          >
            Client
          </Button>
          <Button
            onClick={() => setForm({ ...form, role: 'provider' })}
            className={`flex-1 rounded-lg font-bold transition ${
              form.role === 'provider' ? ' shadow-sm' : ''
            }`}
            variant={`${form.role === "provider" ? "primary": "ghost"}`}
          >
            Business
          </Button>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Role toggle stays here (feature-specific UI) */}
        <Label>Full Name</Label>
        <Input
          placeholder="Full Name"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Label>Email</Label>
        <Input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Label>Password</Label>
        <Input
          type="password"
          required
          placeholder="min 6 characters"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <Button className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-8 text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 font-bold hover:underline">
          Login here
        </Link>
      </p>
      <p className="mt-2.5 text-center text-slate-500 text-sm">
        Return to {' '}
        <Link to="/" className="text-blue-600 font-bold hover:underline">
          Home Page
        </Link>
      </p>
    </section>
  );
};

export default RegisterForm;
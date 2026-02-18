import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    const { user, token } = res.data;

    // Save token
    localStorage.setItem("token", token);

    // Save user in context
    login(user);

    // 🔥 ROLE BASED REDIRECT
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-dashboard");
    }

  } catch (err) {
    setError(
      err.response?.data?.message || "Invalid email or password"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">

          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              Medi<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your dashboard
          </p>

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600" />

        <div className="relative flex h-full flex-col justify-center px-16 text-white">
          <h2 className="mb-6 text-4xl font-bold leading-tight">
            Your Health,<br />Our Priority
          </h2>

          <p className="mb-12 text-lg text-white/80">
            Manage appointments & connect with expert doctors.
          </p>

          <div className="space-y-6">
            <Feature icon={<Shield />} title="Secure & Private" />
            <Feature icon={<Clock />} title="24/7 Availability" />
            <Feature icon={<Users />} title="Expert Doctors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* Feature Component */
const Feature = ({ icon, title }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
      {icon}
    </div>
    <h3 className="font-semibold">{title}</h3>
  </div>
);

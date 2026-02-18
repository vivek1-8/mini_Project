import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    await axios.post("http://localhost:5000/api/auth/register", {
      ...formData,
    });

    navigate("/login");
  } catch (err) {
    setError(
      err.response?.data?.message || "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-subtle py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link to="/" className="flex justify-center items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Medi<span className="text-primary">Care</span>
              </span>
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-2xl border bg-card p-8 shadow-card animate-slide-up">
            <h1 className="text-3xl font-bold text-center">
              Create your account
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              Sign up to book appointments with doctors
            </p>

            {error && (
              <p className="mt-4 text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

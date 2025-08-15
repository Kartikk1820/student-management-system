"use client";
import { useState } from "react";
import api from "../../utils/authApi.js";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        let role = res.data.role;
        localStorage.setItem("role", role);

        router.push("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 p-2 rounded mb-4">
            {error}
          </p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />

        <label className="block text-gray-700 text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already Not have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}

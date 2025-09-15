"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function Login() {
  const router = useRouter();
  const { email, password, setEmail, setPassword } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "customer@wendys.com" && password === "12345678") {
      router.push("/");
    } else {
      alert("❌ Invalid credentials");
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

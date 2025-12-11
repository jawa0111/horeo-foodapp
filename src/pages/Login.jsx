import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login({
        username: form.username,
        password: form.password,
      });
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#D3D3D3' }}>
      {/* Left Section */}
      <div className="w-1/2 bg-cover bg-center" style={{
        backgroundImage: 'url(https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg?w=1380&t=st=1700000000~exp=1700003600~hmac=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }}>
        <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-white text-center p-8 max-w-lg">
            <h2 className="text-4xl font-bold mb-4">Horeo</h2>
            <p className="text-lg">Experience authentic European cuisine at its finest</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 px-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username/Email"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
                />
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0a3a9c] focus:ring-[#06236B] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm bg-gradient-to-r from-[#06236B] to-[#0a3a9c] bg-clip-text text-transparent hover:opacity-80 transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white font-medium rounded-full hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06236B]"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium bg-gradient-to-r from-[#06236B] to-[#0a3a9c] bg-clip-text text-transparent hover:opacity-80 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

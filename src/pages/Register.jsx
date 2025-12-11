import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../library/services/auth_service";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    try {
      await register({
        name: form.fullname,
        email: form.email,
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#D3D3D3' }}>
      {/* Left Section with background image */}
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

      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 px-10">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Aboard!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account to get started
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                type="text"
                required
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
              />
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                type="text"
                required
                placeholder="Username"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
              />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                required
                placeholder="Password"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
              />
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                required
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#06236B] placeholder-gray-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-[#06236B] to-[#0a3a9c] text-white font-medium rounded-full hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06236B] mt-4"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#06236B] font-medium hover:opacity-80 transition"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

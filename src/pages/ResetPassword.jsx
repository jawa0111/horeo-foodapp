import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../library/services/auth_service";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  // Get email from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) setToken(token);
    else navigate("/forgot-password");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setIsLoading(true);
    try {
      await resetPassword(token, password, confirmPassword); // ✅ now using token
      navigate("/login", {
        state: { message: "Password reset successful. Please login." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Illustration */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Reset Password Illustration"
          className="max-w-md"
        />
      </div>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 px-10">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Reset Password
          </h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="text-sm text-gray-500 mb-4">
            Resetting password for: <span className="font-medium">{email}</span>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-orange-500 text-white rounded-md ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

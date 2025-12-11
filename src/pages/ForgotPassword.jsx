import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../library/services/auth_service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return;

    setIsLoading(true);
    try {
      const data = await forgotPassword(email);
      console.log(data.message);
      // redirect to reset-password page with token in query
      navigate("/email-sent", { state: { email } });
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
          alt="Forget Password Illustration"
          className="max-w-md"
        />
      </div>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 px-10">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Forgot Password
          </h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
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
              {isLoading ? "Sending..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

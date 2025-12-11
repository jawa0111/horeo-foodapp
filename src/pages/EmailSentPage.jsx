import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function EmailSentPage() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Check your email 📩</h1>
        <p className="text-gray-600 mb-6">
          If an account exists for <span className="font-semibold">{email}</span>, 
          a password reset link has been sent.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Didn’t receive the email? Check your spam folder or try again.
        </p>
        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/readers/password`,
        { reader: { email } }
      );
      setMessage(res.data.message);
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <span className="absolute left-3 top-3.5 text-gray-500">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <input
          type="email"
          placeholder="you@example.com"
          className="pl-10 h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {loading ? "Sending..." : "Send Reset Instructions"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            messageType === "success" ? "text-green-500" : "text-[#E50913]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-[#4e4c4c]">
          Forgot Password?
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {/* Wrap form in Suspense */}
        <Suspense fallback={<p>Loading form...</p>}>
          <ForgotPasswordForm />
        </Suspense>

        <div className="mt-6 text-center text-sm text-gray-600">
          <Link
            href="/reader/sign_in"
            className="text-orange-600 font-medium hover:underline"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

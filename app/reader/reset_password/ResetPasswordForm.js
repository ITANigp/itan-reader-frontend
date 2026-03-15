"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("reset_password_token");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("info");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/readers/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reader: {
              password,
              password_confirmation: passwordConfirmation,
              reset_password_token: token,
            },
          }),
        }
      );

      if (res.ok) {
        setMessage("Password successfully reset! Redirecting to Sign In...");
        setMessageType("success");
        setTimeout(() => router.push("/reader/sign_in"), 3000);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to reset password.");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <p className="text-[#E50913] font-semibold text-lg">
          Invalid or expired password reset link. Please try again.
        </p>
        <div className="mt-4 text-sm text-gray-600">
          <Link
            href="/reader/forgot_password"
            className="text-orange-600 font-medium hover:underline"
          >
            Request a new password reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-[#4e4c4c]">
        Reset Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            className="h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-3.5 right-3 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            className="h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-3.5 right-3 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            messageType === "success" ? "text-green-500" : "text-[#E50913]"
          }`}
        >
          {message}
        </p>
      )}
    </>
  );
}

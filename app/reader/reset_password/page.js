"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("reset_password_token");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/readers/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reader: {
            password,
            password_confirmation: passwordConfirmation,
            reset_password_token: token,
          },
        }),
      });

      if (res.ok) {
        setMessage("Password successfully reset! Redirecting to Sign In...");
        setTimeout(() => router.push("/reader/sign_in"), 3000);
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600 text-lg">Invalid password reset link.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-2.5 rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

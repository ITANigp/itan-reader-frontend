"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../utils/auth/readerApi";

export default function TwoFactorAuthSettings() {
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [preferredMethod, setPreferredMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showEmailVerificationForm, setShowEmailVerificationForm] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");

  // Fetch 2FA status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/readers/two_factors/status");
        const data = response.data.data;
        setTwoFactorEnabled(data.two_factor_enabled);
        setPreferredMethod(data.preferred_method);
        setPhoneNumber(data.phone_number);
        setPhoneVerified(data.phone_verified);
      } catch (error) {
        setMessage("Failed to load 2FA status.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleEnableEmail = async () => {
    setLoading(true);
    try {
      const response = await api.post("/readers/two_factors/enable_email");
      setPreferredMethod("email");
      setMessage(response.data.status.message);
      setMessageType("success");
      setShowEmailVerificationForm(true); // show code input
    } catch (error) {
      setMessage(
        error.response?.data?.status?.message || "Failed to initiate 2FA via email."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

    const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/readers/two_factors/verify_email_code", {
        verification_code: emailVerificationCode,
      });
      setTwoFactorEnabled(true); // only now 2FA is active
      setShowEmailVerificationForm(false);
      setMessage(response.data.status.message);
      setMessageType("success");
    } catch (error) {
      setMessage(
        error.response?.data?.status?.message || "Invalid or expired code."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupSms = async (e) => {
    e.preventDefault();
    setIsSendingCode(true);
    try {
      const response = await api.post("/readers/two_factors/setup_sms", {
        phone_number: newPhoneNumber,
      });
      setMessage(response.data.status.message);
      setMessageType("success");
      setShowVerificationForm(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.status?.message ||
        "Failed to send SMS code. Please check the number.";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifySms = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/readers/two_factors/verify_sms", {
        verification_code: verificationCode,
      });
      setTwoFactorEnabled(true);
      setPreferredMethod("sms");
      setPhoneNumber(newPhoneNumber);
      setPhoneVerified(true);
      setMessage(response.data.status.message);
      setMessageType("success");
      setShowVerificationForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.status?.message ||
        "Invalid or expired code. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    try {
      const response = await api.post("/readers/two_factors/disable");
      setTwoFactorEnabled(false);
      setPreferredMethod("");
      setMessage(response.data.status.message);
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to disable 2FA. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            twoFactorEnabled
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {twoFactorEnabled
            ? `Enabled (${preferredMethod})`
            : "Disabled"}
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading 2FA status...</p>
      ) : (
        <>
          {message && (
            <div
              className={`p-2 mb-4 rounded ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {!twoFactorEnabled ? (
            <div className="space-y-4">
              <button
                onClick={handleEnableEmail}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                disabled={loading}
              >
                Enable via Email
              </button>
              {showEmailVerificationForm && (
                <form
                  onSubmit={handleVerifyEmail}
                  className="mt-4 p-4 border border-gray-300 rounded space-y-2"
                >
                  <label className="block text-gray-700">Enter Email Code</label>
                  <input
                    type="text"
                    value={emailVerificationCode}
                    onChange={(e) => setEmailVerificationCode(e.target.value)}
                    className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                    placeholder="6-digit code"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                  >
                    Verify
                  </button>
                </form>
              )}

              <form onSubmit={handleSetupSms} className="space-y-2">
                <input
                  type="tel"
                  placeholder="Enter phone number (+1234567890)"
                  className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                  disabled={isSendingCode}
                >
                  {isSendingCode ? "Sending..." : "Send SMS Code"}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                2FA is enabled via{" "}
                <span className="font-medium">{preferredMethod}</span>
              </p>
              {preferredMethod === "sms" && <p>Phone: {phoneNumber}</p>}
              <button
                onClick={handleDisable}
                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                disabled={loading}
              >
                Disable 2FA
              </button>
            </div>
          )}

          {showVerificationForm && (
            <form
              onSubmit={handleVerifySms}
              className="mt-4 p-4 border border-gray-300 rounded space-y-2"
            >
              <label className="block text-gray-700">Enter SMS Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                placeholder="6-digit code"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
              >
                Verify
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

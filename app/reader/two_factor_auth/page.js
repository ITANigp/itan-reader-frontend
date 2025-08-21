import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/auth/readerApi';

const TwoFactorAuthPage = () => {
  // State variables to manage the UI and data
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [preferredMethod, setPreferredMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  // === 1) Fetch 2FA Status on Component Mount ===
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/readers/2fa/status');
        const data = response.data.data;
        setTwoFactorEnabled(data.two_factor_enabled);
        setPreferredMethod(data.preferred_method);
        setPhoneNumber(data.phone_number);
        setPhoneVerified(data.phone_verified);
      } catch (error) {
        setMessage('Failed to load 2FA status.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // === 2) Handle Enabling 2FA via Email ===
  const handleEnableEmail = async () => {
    setLoading(true);
    try {
      const response = await api.post('/readers/2fa/enable_email');
      setTwoFactorEnabled(true);
      setPreferredMethod('email');
      setMessage(response.data.status.message);
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to enable 2FA. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // === 3) Handle Disabling 2FA ===
  const handleDisable = async () => {
    setLoading(true);
    try {
      const response = await api.delete('/readers/2fa/disable');
      setTwoFactorEnabled(false);
      setPreferredMethod('');
      setMessage(response.data.status.message);
      setMessageType('success');
    } catch (error) {
      setMessage('Failed to disable 2FA. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // === 4) Handle Submitting SMS Number to Backend ===
  const handleSetupSms = async (e) => {
    e.preventDefault();
    setIsSendingCode(true);
    try {
      const response = await api.post('/readers/2fa/setup_sms', {
        phone_number: newPhoneNumber,
      });
      setMessage(response.data.status.message);
      setMessageType('success');
      setShowVerificationForm(true); // Show the verification form on success
    } catch (error) {
      const errorMessage = error.response?.data?.status?.message || 'Failed to send SMS code. Please check the number.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSendingCode(false);
    }
  };

  // === 5) Handle Verifying the SMS Code ===
  const handleVerifySms = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/readers/2fa/verify_sms', {
        verification_code: verificationCode,
      });
      setTwoFactorEnabled(true);
      setPreferredMethod('sms');
      setPhoneNumber(newPhoneNumber);
      setPhoneVerified(true);
      setMessage(response.data.status.message);
      setMessageType('success');
      setShowVerificationForm(false); // Hide the verification form on success
    } catch (error) {
      const errorMessage = error.response?.data?.status?.message || 'Invalid or expired code. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Two-Factor Authentication</h1>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading 2FA status...</div>
        ) : (
          <>
            {message && (
              <div
                className={`p-3 rounded-lg text-sm mb-4 ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {message}
              </div>
            )}

            {!twoFactorEnabled ? (
              // UI for enabling 2FA
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-6">
                  2FA is currently <span className="font-semibold text-red-600">disabled</span>. Enable it for extra account security.
                </p>

                <div className="flex justify-center mb-6">
                  <button
                    onClick={handleEnableEmail}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                    disabled={loading}
                  >
                    Enable 2FA via Email
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">OR</span>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-4">
                  Set up 2FA via SMS with your phone number.
                </p>
                <form onSubmit={handleSetupSms} className="flex flex-col gap-4">
                  <input
                    type="tel"
                    placeholder="Enter phone number (+1234567890)"
                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
                    disabled={isSendingCode}
                  >
                    {isSendingCode ? 'Sending Code...' : 'Send Verification Code via SMS'}
                  </button>
                </form>
              </div>
            ) : (
              // UI for disabling 2FA
              <div className="text-center">
                <p className="text-lg text-gray-600 mb-6">
                  2FA is currently <span className="font-semibold text-green-600">enabled</span>.
                </p>
                <div className="mb-4 text-gray-700">
                  <p>Preferred Method: <span className="font-medium capitalize">{preferredMethod}</span></p>
                  {preferredMethod === 'sms' && <p>Phone Number: {phoneNumber}</p>}
                </div>
                <button
                  onClick={handleDisable}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"
                  disabled={loading}
                >
                  Disable 2FA
                </button>
              </div>
            )}

            {showVerificationForm && (
              <div className="mt-8 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Phone</h2>
                <p className="text-gray-600 mb-4">A code has been sent to your phone number. Please enter it below to verify.</p>
                <form onSubmit={handleVerifySms} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                    disabled={loading}
                  >
                    Verify Code
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuthPage;
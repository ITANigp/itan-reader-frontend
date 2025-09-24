"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/utils/auth/readerApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";


export default function SignUp() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("info");

    try {
      if (!recaptchaToken) {
        setMessage("reCAPTCHA not ready, please try again.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Send token with signup request
      const response = await api.post("/readers", {
        reader: {
          email,
          password,
          password_confirmation: passwordConfirmation,
          first_name: firstName,
          last_name: lastName,
        },
        recaptcha_token: recaptchaToken, // 👈 important
      });

      if (response?.data?.data) {
        setMessage(
          "Registration successful! Please check your email to confirm your account."
        );
        setMessageType("success");
        router.push(`/reader/confirm_email?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
      setMessageType("error");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("JWT Token stored:", localStorage.getItem("jwtToken"));
  }, []);

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white my-5">
      {/* Image + Text Area */}
      <div className="relative w-full md:w-1/2 flex justify-center items-start md:items-center md:h-screen p-0 md:p-4">
        <div className="relative w-full h-[50vh] md:h-[95vh] rounded-b-[2rem] md:rounded-[2rem] overflow-hidden">
          <Image
            src="/images/readers/registration/register-picture.png"
            alt="register"
            fill
            className="object-cover"
            priority
          />

          <h4 className="absolute left-8 md:left-4 top-4 text-md md:text-4xl text-red-600 font-bold z-10">
            ITAN
          </h4>

          <div className="absolute inset-0 flex items-start md:items-end justify-center md:justify-start px-4 pt-[3.5rem] md:pt-0 text-white z-10">
            <div className="text-left w-11/12 md:w-[400px]">
              <h2 className="text-2xl md:text-3xl font-semibold leading-snug">
                Dive into African stories that keep you hooked from page one.
              </h2>
              <p className="mt-2 mb-4 text-xs">
                Whether you're searching for inspiration, escape — we've got the
                perfect story waiting for you.
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/40 md:bg-transparent z-0" />
        </div>
      </div>

      {/* Form Section */}
      <div className="relative md:static -mt-32 md:mt-0 z-10 w-full md:w-1/2 px-6 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto bg-white md:bg-transparent md:shadow-none rounded-xl p-6 md:p-0">
          <h2 className="text-2xl md:text-3xl font-semibold text-left md:text-left mb-6">
            Welcome!
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                className="h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Enter Your First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                className="h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Enter Your Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                type="email"
                className="pl-10 h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="pl-10 h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Enter Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3.5 right-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                placeholder="Re-enter Password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="block mb-1 text-sm font-medium">
                Verify You’re Human
              </label>
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)} // save token
                />
              </div>
            </div>
            {message && (
              <p
                className={`text-sm text-center ${messageType === "success" ? "text-green-500" : "text-[#E50913]"}`}
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-2.5 rounded-lg text-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <div className="inline-flex items-center justify-center w-full my-4">
              <p className="h-[1px] w-full bg-gray-300" />
              <span className="px-3 text-sm text-gray-400">OR</span>
              <p className="h-[1px] w-full bg-gray-300" />
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full bg-gray-200 hover:bg-gray-300 text-[#4e4c4c] font-medium py-2.5 rounded-lg text-sm"
            >
              <Image
                src="/images/google.png"
                width={22}
                height={22}
                alt="Google Logo"
              />
              Continue with Google
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                href="/reader/sign_in"
                className="text-orange-600 font-medium"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}



// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { Eye, EyeOff } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

// import { useAuth } from "@/contexts/AuthContext";
// import { signInReader } from "@/utils/auth/readerApi";
// import Image from "next/image";


// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { setAuth } = useAuth();

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     // setMessage("");

//     try {
//       const reader = await signInReader(email, password);
//       localStorage.setItem("access_token", reader.data.token);
//       localStorage.setItem("currentUserId", reader.data.id);
//       console.log("Reader log in successfully: ", reader.data);
//       console.log("Reader's id: ", reader.data.id);
//       if (reader?.data?.id) {
//         setAuth(reader.data.token, reader.data.id);
//         router.push("/reader/home")
//       }
//     } catch (error) {
//       setMessage(
//         error.response?.data?.message ||
//           "Registration failed. Please try again."
//       );
//       console.log("Reader's registration failed: ", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="flex py-12 items-center">
//       <div className="relative">
//         <Image
//           src="/images/readers/registration/register-picture.png"
//           width={950}
//           height={1600}
//           alt="register"
//           className="ml-8"
//         />
//         <h2 className="absolute left-20 top-12 text-4xl text-red-600 font-bold">
//           ITAN
//         </h2>
//         <div className="absolute left-20 top-48 text-white w-[400px]">
//           <h2 className="text-4xl">
//             Dive into African stories that keep you hooked from page one.
//           </h2>
//           <p className="mt-3">
//             Whether you're searching for inspiration, escape — we've got the
//             perfect story waiting for you.
//           </p>
//         </div>
//       </div>

//       <div className="min-h-screen flex flex-col justify-center px-6 w-full">
//         <h2 className="ml-16 -mt-10 mb-4 text-3xl font-semibold ">
//           Welcome back!
//         </h2>

//         <form
//           onSubmit={handleSignIn}
//           className="space-y-4 max-w-md w-full mx-auto"
//         >
//           <label className="block mb-2 text-sm font-medium">
//             Email Address
//           </label>
//           <div className="relative">
//             <span className="absolute left-3 top-4 text-gray-500">
//               <FontAwesomeIcon icon={faEnvelope} />
//             </span>
//             <input
//               type="email"
//               id="email"
//               className="placeholder:text-gray-300 pl-10 h-[50px] bg-gray-50 border-0 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-blue-300 block w-full p-2.5"
//               placeholder="Enter Email Address"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <label className="block mb-2 text-sm font-medium">Password</label>
//           <div className="relative">
//             <span className="absolute left-3 top-3 text-gray-500">
//               <FontAwesomeIcon icon={faLock} />
//             </span>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               placeholder="Enter Passwords"
//               className="placeholder:text-gray-300 pl-10 h-[50px] bg-gray-50 border-0 border-gray-300 text-gray-900 rounded-lg focus:ring-1 focus:outline-none focus:ring-blue-300 block w-full p-2.5"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute top-4 right-3 text-gray-600"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-3 rounded-lg"
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "Sign In"}
//           </button>

//           <div className="inline-flex items-center justify-center w-full my-5">
//             <p className="h-[1px] w-full bg-gray-300" />
//             <span className="px-3 text-sm text-gray-400">OR</span>
//             <p className="h-[1px] w-full bg-gray-300" />
//           </div>

//           <button
//             type="button"
//             className="flex items-center justify-center gap-3 w-full bg-gray-200 hover:bg-gray-400 text-[#4e4c4c] font-medium py-3 rounded-lg"
//           >
//             <Image
//               src="/images/google.png"
//               width={24}
//               height={24}
//               alt="Google Logo"
//             />
//             Continue with Google
//           </button>

//           <p className="text-center text-sm text-gray-600 mt-4">
//             Don’t have an account?{" "}
//             <Link
//               href="/reader/sign_up"
//               className="text-orange-600 font-medium"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </section>
//   );
// }














"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "@/contexts/AuthContext";
import { signInReader } from "@/utils/auth/readerApi";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reader = await signInReader(email, password);
      localStorage.setItem("access_token", reader.data.token);
      localStorage.setItem("currentUserId", reader.data.id);
      if (reader?.data?.id) {
        setAuth(reader.data.token, reader.data.id);
        router.push("/reader/home");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Image & Tagline Section */}
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
                Whether you're searching for inspiration, escape — we've got the perfect story waiting for you.
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/40 md:bg-transparent z-0" />
        </div>
      </div>

      {/* Form Section */}
      <div className="relative md:static -mt-36 md:mt-0 z-10 w-full md:w-1/2 px-6 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto bg-white md:bg-transparent md:shadow-none rounded-xl p-6 md:p-0">
          <h2 className="text-2xl md:text-3xl font-semibold text-center md:text-left mb-4">
            Welcome back!
          </h2>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-4 text-gray-500">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  className="pl-10 h-[46px] text-sm w-full p-2.5 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
                  placeholder="Enter Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
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
            </div>

            {message && (
              <p className="text-sm text-[#E50913] text-center" aria-live="polite">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E50913] hover:bg-[#ba2129] text-white font-semibold py-2.5 rounded-lg text-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
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
              Don’t have an account?{" "}
              <Link href="/reader/sign_up" className="text-orange-600 font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

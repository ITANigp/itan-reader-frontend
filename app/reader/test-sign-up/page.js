export default function SignupPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left Section */}
      <div className="relative hidden md:block">
        <img
          src="/itan-image.jpg" // replace with the actual image path
          alt="Reading Woman"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 p-10 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">
            Discover worlds within pages with ITAN
          </h1>
          <p className="text-sm max-w-md">
            Whether you’re searching for inspiration, escape, or knowledge—we’ve
            got the perfect story waiting for you.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome!</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter Full name"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="email"
              placeholder="Enter Email Address"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="password"
              placeholder="Enter Passwords"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <button className="w-full bg-red-600 text-white py-2 rounded-md">
              Sign Up
            </button>
          </form>

          <div className="my-4 flex items-center">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <button className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2">
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button className="w-full border border-gray-300 py-2 mt-3 rounded-md flex items-center justify-center gap-2">
            <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
            Continue with Apple
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 font-semibold">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

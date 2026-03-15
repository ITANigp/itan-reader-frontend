import Link from "next/link";
import Image from "next/image";

export default function OnboardingLanding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 bg-white">
      <div className="w-full flex justify-end">
        <button className="text-orange-600 font-medium">Skip</button>
      </div>

      <Image
        src="/images/reader2.png"
        alt="Reading Woman"
        width={250}
        height={500}
        className="mb-4"
      />

      <div className="text-center">
        <h1 className="text-xl font-semibold">
          <span className="text-orange-600">Read & Listen:</span> A World of
          Stories Awaits
        </h1>
        <p className="text-gray-600 mt-2 max-w-sm mx-auto">
          Explore a vast collection of books and audiobooks at your fingertips.
          Dive into captivating stories, anytime, anywhere.
        </p>
      </div>

      <div className="w-full">
        <Link href="/signup">
          <button className="w-full bg-orange-600 text-white py-3 rounded-lg mt-6 font-medium">
            Let&apos;s Get Started
          </button>
        </Link>

        <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <Link href="/signin" className="text-orange-600 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

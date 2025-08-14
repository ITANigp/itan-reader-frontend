'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { getReaderProfile } from "@/utils/auth/readerApi";

const DashboardNav = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [reader, setReader] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const { data } = await getReaderProfile(token);
        setReader(data);
      } catch (err) {
        console.error("Failed to fetch reader profile", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-50 hidden md:block bg-white w-full border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-red-600">
              ITAN
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {["Home", "Library", "Blogs", "Pricing"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setActiveTab(item)}
                className={`text-base font-medium transition-colors ${
                  activeTab === item
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Right: Search + Profile Link */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for books using ISBN, Keywords, Tags..."
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              />
            </div>

            {/* Direct Profile Link */}
            <Link
              href="/reader/profile-page"
              className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
            >
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {reader
                  ? `${reader.first_name} ${reader.last_name}`
                  : "Loading..."}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;


'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { getReaderProfile, signOutReader } from "@/utils/auth/readerApi";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";


const DashboardNav = () => {
  // Use a different state for mobile menu to avoid conflicts
  const [activeTab, setActiveTab] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reader, setReader] = useState(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for detecting clicks outside the menus
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const [hasMounted, setHasMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [loadingReader, setLoadingReader] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);

    if (!storedToken) {
      setLoadingReader(false);
    }
  }, []);


  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const { data } = await getReaderProfile(token);
        setReader(data);
      } catch (err) {
        console.error("Failed to fetch reader profile", err);
      } finally {
        setLoadingReader(false);
      }
    };

    fetchProfile();
  }, [token]);

  
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const mainSegment = parts[0]?.toLowerCase(); 
    const subSegment = parts[1]?.toLowerCase(); 

    if (mainSegment === "library") {
      setActiveTab("Library");
    } else if (mainSegment === "reader" && subSegment === "profile-page") {
      setActiveTab("Profile");
    } else if (mainSegment === "bookstore") {
      setActiveTab("Home");
    } else {
      setActiveTab("Home");
    }
  }, [pathname]);

  // Effect to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Close mobile menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOutReader();
      window.location.href = "/reader/sign_in";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleBackArrowClick = () => {
    router.back();
  };

  return (
    <div>
      {/* Desktop & Tablet View */}
      <header className="hidden md:block bg-white w-full border-b border-gray-200 shadow-lg z-50 relative">
        <div className="w-full px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-20">
          <div className="flex items-center justify-between h-[88px]">
            <div className="-ml-1 sm:-ml-3 md:-ml-2 xl:-ml-6 2xl:-ml-12">
              <Link
                href="/"
                className="text-3xl font-bold text-red-600 flex items-center"
              >
                <img
                  src="/logo.svg"
                  alt="ITAN Logo"
                  className="h-28 w-auto max-h-[88px] object-contain"
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {hasMounted &&
                token &&
                ["Home", "Library", "Profile"].map((item) => (
                  <Link
                    key={item}
                    href={
                      item === "Home"
                        ? "/bookstore"
                        : item === "Profile"
                          ? "/reader/profile-page"
                          : `/${item.toLowerCase()}`
                    }
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

            <div
              className="hidden md:flex items-center space-x-6"
              ref={dropdownRef}
            >
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for books using ISBN, Keywords, Tags..."
                  className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                />
              </div>

              {loadingReader ? (
                <span className="text-sm text-gray-400">Loading...</span>
              ) : reader ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/blog"
                    className="text-red-600 hover:bg-red-700 hover:text-white hover:border-red-700  bg-gray-200 border-2 border-red-600  font-medium rounded-md py-1 px-2"
                  >
                    Blog
                  </Link>
                  <button
                    // onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {reader
                        ? `${reader.first_name} ${reader.last_name}`
                        : "Loading..."}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/blog"
                    className="text-red-600 hover:bg-red-700 hover:text-white hover:border-red-700  bg-gray-200 border-2 border-red-600  font-medium rounded-md py-1 px-2"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/reader/sign_in"
                    className="text-red-600 hover:bg-red-700 hover:text-white hover:border-red-700  bg-gray-200 border-2 border-red-600  font-medium rounded-md py-1 px-2"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {logoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Do you really want to logout from your account?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile View */}
      <header className="px-3 py-2 flex justify-between bg-white shadow-md md:hidden">
        <button onClick={handleBackArrowClick} className="p-2 -ml-2">
          <Image
            src="/images/back-arrow.png"
            width={20}
            height={20}
            alt="back arrow"
          />
        </button>
        {hasMounted && token ? (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2"
          >
            <Image src="/images/menu-3.png" width={20} height={20} alt="menu" />
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/blog"
              className="text-red-600 hover:bg-red-700 hover:text-white hover:border-red-700  bg-gray-200 border-2 border-red-600  font-medium rounded-md py-1 px-2 text-sm h-8"
            >
              Blog
            </Link>
            <Link
              href="/reader/sign_in"
              className="text-red-600 hover:bg-red-700 hover:text-white hover:border-red-700  bg-gray-200 border-2 border-red-600  font-medium rounded-md py-1 px-2 text-sm h-8"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-14 right-0 bg-white border rounded-md shadow-lg py-2 z-10"
            ref={mobileMenuRef}
          >
            <ul className="text-gray-700">
              {["Home", "Library", "Profile"].map((item) => (
                <li
                  key={item}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    (item === "Home" && pathname === "/") ||
                    pathname.toLowerCase() === `/${item.toLowerCase()}`
                      ? "text-red-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Link
                    href={
                      item === "Home"
                        ? "/bokkstore"
                        : item === "Profile"
                          ? "/reader/profile-page"
                          : `/${item.toLowerCase()}`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li className="px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100">
                <Link
                  href="/blog"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
};

export default DashboardNav;


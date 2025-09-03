"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <nav>
        <header className="flex items-center justify-between px-4 py-4 border-b md:px-6">
          <div className="text-red-600 text-xl font-bold">ITAN</div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-6 items-center">
            <input
              type="text"
              placeholder="Search for books..."
              className="px-4 py-2 rounded-md border border-gray-300 text-sm w-full md:w-96"
            />
            <Link
              href="/reader/sign_in"
              className="text-red-600 hover:bg-red-700 hover:text-white hover:border-0    bg-gray-200 border-2 border-b-0 border-red-600  font-medium rounded-md py-1 px-2"
            >
              Sign In
            </Link>
            <Link
              href="/reader/sign_up"
              className="text-white hover:bg-red-700  bg-red-600  font-medium rounded-md py-1 px-2"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md absolute w-full z-10">
            <nav className="flex flex-col items-center py-4 space-y-4">
              <Link
                href="/reader/sign_in"
                className="text-gray-700 hover:text-black font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/reader/sign_up"
                className="text-gray-700 hover:text-black font-medium"
              >
                Sign Up
              </Link>
              <input
                type="text"
                placeholder="Search for books..."
                className="px-4 py-2 rounded-md border border-gray-300 text-sm w-11/12"
              />
            </nav>
          </div>
        )}
      </nav>
      {children}
    </div>
  );
}

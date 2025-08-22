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
            <Link
              href="#"
              className="text-gray-700 hover:text-black font-medium"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-black font-medium"
            >
              Library
            </Link>
            <input
              type="text"
              placeholder="Search for books..."
              className="px-4 py-2 rounded-md border border-gray-300 text-sm w-full md:w-96"
            />
            <button className="px-4 py-2 text-gray-700 hover:text-black font-medium">
              Sign In
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Sign Up
            </button>
          </nav>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md absolute w-full z-10">
            <nav className="flex flex-col items-center py-4 space-y-4">
              <Link
                href="#"
                className="text-gray-700 hover:text-black font-medium"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-black font-medium"
              >
                Library
              </Link>
              <input
                type="text"
                placeholder="Search for books..."
                className="px-4 py-2 rounded-md border border-gray-300 text-sm w-11/12"
              />
              <button className="w-11/12 px-4 py-2 text-gray-700 hover:text-black font-medium border-t">
                Sign In
              </button>
              <button className="w-11/12 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Sign Up
              </button>
            </nav>
          </div>
        )}
      </nav>
      {children}
    </div>
  );
}

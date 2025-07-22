// "use client";
// import { useState, React } from 'react';
// import { Search, User } from "lucide-react";
// import Link from 'next/link';

// const DashboardNav = () => {
//   return (
//     <nav className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
//       <div className="text-xl font-bold text-red-600">ITAN</div>
//       <div className="flex items-center space-x-3">
//         <ul className="hidden md:flex space-x-6 text-sm font-medium">
//           <li className="text-red-600">
//             <Link href="/reader/home">Home</Link>
//           </li>
//           <li>
//             <Link href="/reader/library">Library</Link>
//           </li>
//         </ul>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search for books..."
//             className="pl-10 pr-4 py-1.5 border rounded-full text-sm"
//           />
//           <Search className="absolute top-1.5 left-3 h-4 w-4 text-gray-500" />
//         </div>
//         <User className="h-6 w-6 text-gray-700" />
//       </div>
//     </nav>
//   );
// }

// export default DashboardNav




'use client'

import { useState } from "react"
import Link from "next/link"
import { Search, User, Menu } from "lucide-react"

const DashboardNav = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="hidden md:block bg-white w-full border-b border-gray-200 shadow-lg z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-red-600">
              ITAN
            </Link>
          </div>

          {/* Mobile Search (only visible on mobile) */}
          <div className="flex-1 mx-4 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 w-full border border-gray-300 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              {["Home", "Library", "Blogs", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setActiveTab(item)}
                  className={`text-base font-medium transition-colors ${activeTab === item
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                    }`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search for books using ISBN, Keywords, Tags..."
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-md text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              />
            </div>

            {/* Profile Icon */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu (below header) */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-4">
            <nav className="flex flex-col space-y-2">
              {["Home", "Library", "Blogs", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => {
                    setActiveTab(item);
                    setMenuOpen(false);
                  }}
                  className={`text-sm font-medium px-4 ${activeTab === item
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                    }`}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>

  );
};

export default DashboardNav;

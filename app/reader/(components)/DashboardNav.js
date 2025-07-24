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
      <div className="w-full px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-20">
        <div className="flex items-center justify-between h-[88px]">

          {/* Logo with tighter spacing */}
          {/* <div className="-ml-4 sm:-ml-6 md:-ml-8 xl:-ml-12 2xl:-ml-20"> */}
          <div className="-ml-1 sm:-ml-3 md:-ml-2 xl:-ml-6 2xl:-ml-12">

            <Link href="/" className="text-3xl font-bold text-red-600 flex items-center">
              <img
                src="/logo.svg"
                alt="ITAN Logo"
                className="h-28 w-auto max-h-[88px] object-contain"
              />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">

            {/* Navigation */}
            <nav className="flex items-center gap-4 md:gap-6 lg:gap-8">
              {["Home", "Library", "Blogs", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/reader/home" : `/reader/${item.toLowerCase()}`}
                  onClick={() => setActiveTab(item)}
                  className={`text-sm lg:text-base font-medium transition-colors ${activeTab === item
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                    }`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="relative w-[200px] md:w-[260px] xl:w-[300px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ISBN, Keywords..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
              />
            </div>

            {/* Profile Icon */}
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Placeholder (not visible on md+) */}
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

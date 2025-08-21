import {
  FiUser,
  FiBox,
  FiClock,
  FiBell,
  FiSettings,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";
import { X } from "lucide-react";

export default function ProfileSidebar({ currentPage = "Profile", setShowLogoutConfirm, setIsSidebarOpen }) {
  const navItems = [
    { label: "Profile", href: "/reader/profile-page", icon: <FiUser /> },
    { label: "Orders", href: "/reader/orders", icon: <FiBox /> },
    { label: "Wishlist", href: "/reader/wishlist", icon: <FiHeart /> },
    { label: "History", href: "/reader/history", icon: <FiClock /> },
    { label: "Notifications", href: "/reader/notifications", icon: <FiBell /> },
    { label: "Settings", href: "/reader/settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      {/* Close button for mobile */}
      <div className="flex justify-end p-4 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <nav className="flex flex-col space-y-4 w-full">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`
              flex items-center space-x-2 py-2 px-6 rounded
              ${
                currentPage === item.label
                  ? "bg-green-200 text-green-700 font-semibold"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
            onClick={() => {
              // Close the sidebar on mobile when a link is clicked
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center space-x-2 text-red-600 font-semibold mt-4 px-6 py-2 rounded hover:bg-red-50"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
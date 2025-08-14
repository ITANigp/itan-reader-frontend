import { useAuth } from "../../../contexts/ProfileAuthContext";
import { useState } from "react";
import {
  FiUser,
  FiBox,
  FiClock,
  FiBell,
  FiSettings,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";

export default function ProfileSidebar({ currentPage = "Profile" }) {
  const { setReader } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setReader(null);
    // Clear tokens/session if needed
  };

  const navItems = [
    { label: "Profile", href: "/profile", icon: <FiUser /> },
    { label: "Orders", href: "/orders", icon: <FiBox /> },
    { label: "Wishlist", href: "/wishlist", icon: <FiHeart /> },
    { label: "History", href: "/history", icon: <FiClock /> },
    { label: "Notifications", href: "/notifications", icon: <FiBell /> },
    { label: "Settings", href: "/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      <nav className="space-y-4">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-2 py-1 rounded ${
              currentPage === item.label
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center space-x-2 text-red-600 font-semibold mt-4 px-2 py-1 rounded hover:bg-red-50"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </nav>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
        <div className="fixed inset-0 z-[999] bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-between space-x-4">
                <button
                onClick={() => setShowLogoutConfirm(false)}
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

    </>
  );
}

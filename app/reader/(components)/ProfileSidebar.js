import {
  FiUser,
  FiBox,
  FiClock,
  FiBell,
  FiSettings,
  FiHeart,
  FiLogOut,
} from "react-icons/fi";

export default function ProfileSidebar({ currentPage = "Profile", setShowLogoutConfirm }) {

  const navItems = [
    { label: "Profile", href: "/reader/profile-page", icon: <FiUser /> },
    { label: "Orders", href: "/reader/orders", icon: <FiBox /> },
    { label: "Wishlist", href: "/reader/wishlist", icon: <FiHeart /> },
    { label: "History", href: "/reader/history", icon: <FiClock /> },
    { label: "Notifications", href: "/reader/notifications", icon: <FiBell /> },
    { label: "Settings", href: "/reader/settings", icon: <FiSettings /> },
  ];

  return (
       <nav className="flex flex-col items-center md:items-start space-y-4">
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
  );
}

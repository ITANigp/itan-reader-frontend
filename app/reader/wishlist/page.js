'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/ProfileAuthContext";
import DashboardNav from "../(components)/DashboardNav";
import ProfileSidebar from "../(components)/ProfileSidebar";
import LogoutConfirmModal from "../(components)/LogoutConfirmModal";
import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";

export default function Wishlist() {
    const { setReader } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        setReader(null);
        localStorage.removeItem("access_token");
        router.push("/reader/sign_in");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative">
            <DashboardNav />
            <div className="flex flex-col p-2 sm:p-6 md:p-8 mt-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/reader/profile-page"
                            className="p-1 rounded hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-bold">Wishlist</h1>
                    </div>
                    {/* Hamburger toggle for mobile */}
                    <button
                        className="md:hidden p-2 rounded bg-gray-100"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex flex-col md:flex-row md:space-x-6">
                    {/* Mobile Sidebar Overlay */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                    )}
                    {/* Sidebar */}
                    <div
                        className={`
                            fixed inset-0 bg-white z-50 p-4 overflow-y-auto transform transition-transform duration-300
                            flex flex-col justify-center items-center
                            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                            md:relative md:w-64 md:h-auto md:translate-x-0 md:shadow md:block
                        `}
                    >
                        <ProfileSidebar currentPage="Wishlist" setShowLogoutConfirm={setShowLogoutConfirm} />
                    </div>
                    <div className="flex-1 mt-6 md:mt-0 md:ml-6">
                        <div className="bg-white rounded-xl shadow p-6">
                            <p>Your favorite items will be saved here.</p>
                        </div>
                    </div>
                </div>
            </div>
            <LogoutConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
}
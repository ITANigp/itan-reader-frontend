'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Menu, ArrowLeft } from "lucide-react";
import DashboardNav from "../(components)/DashboardNav";
import ProfileSidebar from "../(components)/ProfileSidebar";
import EditReaderProfile from "../(components)/EditProfileModal";
import { useAuth } from "../../../contexts/ProfileAuthContext";
import { getReaderProfile } from "@/utils/auth/readerApi";
import Link from "next/link";


export default function ProfilePage() {
  const { reader, setReader } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchReader = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const { data } = await getReaderProfile(token);
        setReader(data);
      }
    };
    fetchReader();
  }, [setReader]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Sticky Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex flex-col p-4 sm:p-6 md:p-8 mt-16">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold">Profile</h1>
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
            className={`absolute md:relative z-50 w-64 bg-white shadow p-4 transform transition-transform duration-300 
              md:translate-x-0 
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
              md:top-0 top-[60px]`} // adjust top to match Profile header height
            style={{ maxHeight: "calc(100vh - 60px)" }} // keep it from overflowing on mobile
          >
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 mt-6 md:mt-0 space-y-6 md:ml-0">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              {reader?.avatar ? (
                <img
                  src={reader.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold">
                  {reader?.first_name} {reader?.last_name}
                </p>
                <p className="text-sm text-gray-500">{reader?.email}</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow p-6 relative">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <button
                className="absolute top-4 right-4 text-sm text-red-600 hover:underline"
                onClick={() => setIsEditOpen(true)}
              >
                ✏ Edit
              </button>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                  <span className="text-gray-600">First Name</span>
                  <span>{reader?.first_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                  <span className="text-gray-600">Last Name</span>
                  <span>{reader?.last_name}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{reader?.email}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Address</h2>
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <div>
                  <span className="text-gray-600">Country</span>
                  <p>{reader?.country || "Nigeria"}</p>
                </div>
                <div>
                  <span className="text-gray-600">State</span>
                  <p>{reader?.state || "Lagos State"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditOpen && (
          <EditReaderProfile
            reader={reader}
            onClose={() => setIsEditOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

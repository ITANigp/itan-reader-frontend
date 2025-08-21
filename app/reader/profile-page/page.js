// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { User, Menu, ArrowLeft } from "lucide-react";
// import DashboardNav from "../(components)/DashboardNav";
// import ProfileSidebar from "../(components)/ProfileSidebar";
// import EditReaderProfile from "../(components)/EditProfileModal";
// import LogoutConfirmModal from "../(components)/LogoutConfirmModal";
// import { useAuth } from "../../../contexts/ProfileAuthContext";
// import { getReaderProfile } from "@/utils/auth/readerApi";
// import Link from "next/link";


// export default function ProfilePage() {
//   const { reader, setReader } = useAuth();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const router = useRouter();
  
//   useEffect(() => {
//     const fetchReader = async () => {
//       const token = localStorage.getItem("access_token");
//       if (token) {
//         const { data } = await getReaderProfile(token);
//         setReader(data);
//       }
//     };
//     fetchReader();
//   }, [setReader]);

//     // Define the logout logic in the parent component
//   const handleLogout = () => {
//     setReader(null);
//     localStorage.removeItem("access_token");
//     router.push("/reader/sign_in");
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50 relative">
//       {/* Sticky Navigation */}
//       <DashboardNav />

//       {/* Main Content */}
//       <div className="flex flex-col p-2 sm:p-6 md:p-8">
//         {/* Page Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <Link
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 router.back();
//               }}
//               className="p-1 rounded hover:bg-gray-100"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </Link>
//             <h1 className="text-3xl font-bold">Profile</h1>
//           </div>

//           {/* Hamburger toggle for mobile */}
//           <button
//             className="md:hidden p-2 rounded bg-gray-100"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row md:space-x-6">
//           {/* Mobile Sidebar Overlay */}
//           {isSidebarOpen && (
//             <div
//               className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             ></div>
//           )}

//           {/* Sidebar */}
//           <div
//             className={`
//               fixed inset-0 bg-white z-40 p-4 overflow-y-auto transform transition-transform duration-300
//               ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
//               md:relative md:w-64 md:h-auto md:translate-x-0 md:block md:p-0 md:shadow-none
//             `}
//           >
//             <ProfileSidebar currentPage="Profile" setShowLogoutConfirm={setShowLogoutConfirm}  setIsSidebarOpen={setIsSidebarOpen}  />
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 mt-6 md:mt-0 space-y-6 md:ml-0">
//             {/* Profile Card */}
//             <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
//               {reader?.avatar ? (
//                 <img
//                   src={reader.avatar}
//                   alt="Profile"
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
//                   <User className="w-8 h-8 text-gray-400" />
//                 </div>
//               )}
//               <div className="text-center sm:text-left">
//                 <p className="text-lg font-semibold">
//                   {reader?.first_name} {reader?.last_name}
//                 </p>
//                 <p className="text-sm text-gray-500">{reader?.email}</p>
//               </div>
//             </div>

//             {/* Personal Information */}
//             <div className="bg-white rounded-xl shadow p-6 relative">
//               <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
//               <button
//                 className="absolute top-4 right-4 text-sm text-red-600 hover:underline"
//                 onClick={() => setIsEditOpen(true)}
//               >
//                 ✏ Edit
//               </button>
//               <div className="space-y-3">
//                 <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
//                   <span className="text-gray-600">First Name</span>
//                   <span>{reader?.first_name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
//                   <span className="text-gray-600">Last Name</span>
//                   <span>{reader?.last_name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row justify-between">
//                   <span className="text-gray-600">Email</span>
//                   <span>{reader?.email}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Address */}
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold mb-4">Address</h2>
//               <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
//                 <div>
//                   <span className="text-gray-600">Country</span>
//                   <p>{reader?.country || "Nigeria"}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">State</span>
//                   <p>{reader?.state || "Lagos State"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Edit Profile Modal */}
//         {isEditOpen && (
//           <EditReaderProfile
//             reader={reader}
//             onClose={() => setIsEditOpen(false)}
//           />
//         )}

//         {/* Logout Confirmation Modal */}
//         <LogoutConfirmModal 
//           isOpen={showLogoutConfirm}
//           onClose={() => setShowLogoutConfirm(false)}
//           onConfirm={handleLogout}
//           />
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Menu, ArrowLeft, X } from "lucide-react"; // Added X to imports
import DashboardNav from "../(components)/DashboardNav";
import ProfileSidebar from "../(components)/ProfileSidebar";
import EditReaderProfile from "../(components)/EditProfileModal";
import LogoutConfirmModal from "../(components)/LogoutConfirmModal";
import { useAuth } from "../../../contexts/ProfileAuthContext";
import { getReaderProfile } from "@/utils/auth/readerApi";
import Link from "next/link";


export default function ProfilePage() {
  const { reader, setReader } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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

    // Define the logout logic in the parent component
  const handleLogout = () => {
    setReader(null);
    localStorage.removeItem("access_token");
    router.push("/reader/sign_in");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* Sticky Navigation */}
      <DashboardNav />

      {/* Main Content */}
      <div className="flex flex-col p-2 sm:p-6 md:p-8">
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
            onClick={() => setIsSidebarOpen(true)} // Change to always open
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsSidebarOpen(false)} // Changed to close the sidebar
            ></div>
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed inset-0 bg-white z-40 p-4 overflow-y-auto transform transition-transform duration-300
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              flex flex-col justify-center items-center // Add this for mobile centering
              md:relative md:w-64 md:h-auto md:translate-x-0 md:block md:p-0 md:shadow-none
            `}
          >
            <ProfileSidebar 
              currentPage="Profile" 
              setShowLogoutConfirm={setShowLogoutConfirm} 
              setIsSidebarOpen={setIsSidebarOpen} // Pass the state setter
            />
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

        {/* Logout Confirmation Modal */}
        <LogoutConfirmModal 
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          />
      </div>
    </div>
  );
}

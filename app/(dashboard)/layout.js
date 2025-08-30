// import DashboardNav from "@/app/reader/(components)/DashboardNav";

// export default function Layout({ children }) {
//   return (
//     <main className="bg-gray-100">
//       <DashboardNav />
//       {children}
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/app/reader/(components)/DashboardNav";

export default function Layout({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("currentUserId");

    if (!token || !userId) {
      // Show alert message
      alert("You must be signed in to access this page.");
      router.push("/reader/sign_in");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return <p className="text-center p-8">Checking authentication...</p>;
  }

  return (
    <main className="bg-gray-100 min-h-screen">
      <DashboardNav />
      {children}
    </main>
  );
}

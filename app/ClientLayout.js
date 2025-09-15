"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileAuthProvider } from "@/contexts/ProfileAuthContext";
import { LikeProvider } from "@/contexts/LikeContext";
import dynamic from "next/dynamic";
import "flowbite";
import { config } from "@fortawesome/fontawesome-svg-core";

const ReadersFooter = dynamic(
  () => import("@/app/reader/(components)/ReadersFooter"),
  { ssr: false }
);

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showFooter =
    pathname === "/" || pathname.startsWith("/bookstore") ? "" : "hidden";

  return (
    <main className="bg-gray-100">
      <AuthProvider>
        <ProfileAuthProvider>
          <LikeProvider>{children}</LikeProvider>
        </ProfileAuthProvider>
      </AuthProvider>
      <ReadersFooter hiddenPage={showFooter} />
    </main>
  );
}

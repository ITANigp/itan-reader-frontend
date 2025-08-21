"use client";

import { usePathname } from "next/navigation";
import "flowbite";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import {ProfileAuthProvider} from "@/contexts/ProfileAuthContext"
import { LikeProvider } from "@/contexts/LikeContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import dynamic from "next/dynamic";

// import ReadersFooter from "@/app/reader/(components)/ReadersFooter";
const ReadersFooter = dynamic(
  () => import("@/app/reader/(components)/ReadersFooter"),
  {
    ssr: false,
  }
);
export default function Layout({ children }) {
  const pathname = usePathname();

  // const signUpPage = pathname.endsWith("/reader/sign_up");
  // const signInPage = pathname.endsWith("/reader/sign_in");
  // const privacyPolicy = pathname.endsWith("/privacy-policies");
  // const termsPage = pathname.endsWith("/terms&conditions");
  // const homePage = pathname.endsWith("/home");
  // const libraryPage = pathname.endsWith("/library");
  
  // const hideRegPage =
  //   signUpPage ||
  //   signInPage ||
  //   termsPage ||
  //   privacyPolicy ||
  //   homePage ||
  //   libraryPage
  //     ? "hidden"
  //     : "";
 const showFooter = pathname === "/" || pathname.endsWith("/bookstore") ? "" : "hidden";
  
  return (
    <html lang="eng">
      <body>
        <main className="bg-gray-100">
          <AuthProvider>
            <ProfileAuthProvider>
            <LikeProvider>{children}</LikeProvider>
            </ProfileAuthProvider>
          </AuthProvider>
          {/* The dynamic component is now used here */}
          <ReadersFooter hiddenPage={showFooter} />
        </main>
      </body>
    </html>
  );
}

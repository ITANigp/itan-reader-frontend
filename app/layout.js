"use client";

import { usePathname } from "next/navigation";
import "flowbite";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LikeProvider } from "@/contexts/LikeContext";
import { config } from "@fortawesome/fontawesome-svg-core";

// Use dynamic import to fix the prerendering error
import dynamic from 'next/dynamic';

const ReadersFooter = dynamic(() => import("@/app/reader/(components)/ReadersFooter"), {
  ssr: false,
});

export default function Layout({ children }) {
  const pathname = usePathname();

  const signUpPage = pathname.endsWith("/reader/sign_up");
  const signInPage = pathname.endsWith("/reader/sign_in");
  const termsPage = pathname.endsWith("/terms&conditions");
  const privacyPolicy = pathname.endsWith("/privacy-policies");

  const hideRegPage =
    signUpPage || signInPage || termsPage || privacyPolicy ? "hidden" : "";

  return (
    <html lang="eng">
      <body>
        <main className="bg-gray-100">
          <AuthProvider>
            <LikeProvider>{children}</LikeProvider>
          </AuthProvider>
          {/* The dynamic component is now used here */}
          <ReadersFooter hiddenPage={hideRegPage} />
        </main>
      </body>
    </html>
  );
}

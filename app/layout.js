"use client";

import { usePathname } from "next/navigation";
import "flowbite";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LikeProvider } from "@/contexts/LikeContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import ReadersFooter from "@/app/reader/(components)/ReadersFooter";

export default function Layout({ children }) {
  const pathname = usePathname();

  // Define the pages where you want to hide the footer
  const hideFooterOnPages = [
    "/reader/sign_up",
    "/reader/sign_in",
    "/terms&conditions",
    "/privacy-policies",
  ];

  // Check if the current pathname is in the list of pages to hide the footer
  const shouldHideFooter = hideFooterOnPages.includes(pathname);

  return (
    <html lang="eng">
      <body>
        <main className="bg-gray-100">
          <AuthProvider>
            <LikeProvider>{children}</LikeProvider>
          </AuthProvider>
          {/* Conditionally render the footer. It will now only be hidden on the specified pages. */}
          {!shouldHideFooter && <ReadersFooter />}
        </main>
      </body>
    </html>
  );
}

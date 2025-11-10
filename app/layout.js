export const metadata = {
  title: "ITAN Global Bookstore | Home of African Literature",
  icons: {
    icon: "/images/itan-favicon.png",
  },
};

import "./globals.css";
import ClientLayout from "./ClientLayout";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Google Analytics Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

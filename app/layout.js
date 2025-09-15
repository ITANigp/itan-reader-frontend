export const metadata = {
  title: "ITAN Global Bookstore | Home of African Literature",
  icons: {
    icon: "/images/itan-favicon.png",
  },
};

import "./globals.css";
import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

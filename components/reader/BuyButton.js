"use client";

import { api } from "@/utils/auth/readerApi";
import { useRouter } from "next/navigation";

export default function BuyButton({
  bookId,
  contentType = "ebook", // Default to ebook, but allow overriding
  children = "Buy Book", // Allow custom button text or content
  className,
  onPurchaseSuccess, // Callback for successful purchase initiation
  onPurchaseError, // Callback for failed purchase initiation
}) {
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      const jwtToken = localStorage.getItem("access_token");
      if (!jwtToken) {
        // Handle case where no token is found, e.g., redirect to login
        console.error("No access token found. Please log in.");
        router.push("/login"); // Example: redirect to login page
        return;
      }

      const response = await api.post(
        "/purchases",
        {
          book_id: bookId,
          content_type: contentType,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment initiation success:", response.data);

      const { reference, authorization_url } = response.data.data;

      // Store reference for later status check
      localStorage.setItem("purchase_reference", reference);

      // Call the success callback if provided
      if (onPurchaseSuccess) {
        onPurchaseSuccess(response.data);
      }

      // Redirect to payment gateway
      window.location.href = authorization_url;
    } catch (error) {
      console.error(
        "Payment initiation failed:",
        error.response?.data || error.message
      );
      // Call the error callback if provided
      if (onPurchaseError) {
        onPurchaseError(error);
      }
    }
  };

  return (
    <button onClick={handlePurchase} className={className}>
      {children}
    </button>
  );
}
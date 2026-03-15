"use client";

import { useRouter } from "next/navigation";

export default function BuyButton({
  bookId = "e316f636-5cd3-4b57-a45a-9f6a70abe52a",
}) {
  const router = useRouter();

  const handlePurchase = async () => {
    try {
      const jwtToken = localStorage.getItem("access_token");
      const response = await api.post(
        "/purchases",
        {
          // amount: 3.5,
          book_id: bookId,
          content_type: "ebook", // or "audiobook"
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Payment success: ", response.data);

      const { reference, authorization_url } = response.data.data;

      // 👉 Store reference in localStorage or cookies for later status check
      localStorage.setItem("purchase_reference", reference);

      // 👉 Redirect to payment gateway
      window.location.href = authorization_url;
    } catch (error) {
      console.error(
        "Payment initiation failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <button
      onClick={handlePurchase}
      className="px-4 py-2 bg-green-600 text-white rounded m-40"
    >
      Buy Book
    </button>
  );
}

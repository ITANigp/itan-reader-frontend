"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/auth/readerApi";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Checking payment...");
  const [success, setSuccess] = useState(null); // null = loading, true = success, false = error

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      localStorage.getItem("purchase_reference");

    const jwtToken = localStorage.getItem("access_token");

    if (!reference || !jwtToken) {
      setStatus("Missing payment reference or token.");
      setSuccess(false);
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await api.get(`/purchases/check_status`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
          params: { reference },
        });

        const { purchase_status, book_title } = res.data.data;

        if (purchase_status === "completed") {
          setStatus(
            `✅ Payment successful for "${book_title}". Redirecting...`
          );
          setSuccess(true);

          // Save book info
          localStorage.setItem("purchaseBook", JSON.stringify(res.data.data));

          // Redirect after 2 seconds
          setTimeout(() => {
            router.push("/library");
          }, 3000);
        } else {
          setStatus("⚠️ Payment not completed.");
          setSuccess(false);
        }
      } catch (error) {
        setStatus("❌ Error checking payment status.");
        setSuccess(false);
        console.error(error.response?.data || error.message);
      }
    };

    checkPayment();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        {success === null && (
          <Loader2 className="animate-spin mx-auto text-indigo-600" size={48} />
        )}
        {success === true && (
          <CheckCircle2 className="text-green-500 mx-auto" size={48} />
        )}
        {success === false && (
          <XCircle className="text-red-500 mx-auto" size={48} />
        )}

        <h1 className="text-2xl font-bold mt-4 mb-2">Payment Status</h1>
        <p className="text-gray-600">{status}</p>

        {success === true && (
          <p className="mt-3 text-sm text-gray-500">
            Redirecting you to your Library...
          </p>
        )}
      </div>
    </div>
  );
}

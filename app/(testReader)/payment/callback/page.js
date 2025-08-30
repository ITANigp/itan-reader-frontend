"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PaymentCallback = dynamic(() => import("@/components/PaymentCallback"), {
  ssr: false,
});

export default function PaymentCallbackPage() {
  return (
    <div className="">
      <Suspense fallback={<p>Checking payment...</p>}>
        <PaymentCallback />
      </Suspense>
    </div>
  );
}

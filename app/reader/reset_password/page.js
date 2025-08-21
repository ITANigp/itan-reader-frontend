import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
        {/* Suspense ensures hooks like useSearchParams don't break SSR */}
        <Suspense fallback={<div>Loading password reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

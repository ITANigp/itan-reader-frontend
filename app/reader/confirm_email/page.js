"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmationEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("confirmation_token");
    const email = searchParams.get("email");

    const [status, setStatus] = useState(token ? "loading" : "pending");

    useEffect(() => {
        if (!token) {
            return;
        }

        const confirmEmail = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/readers/confirmation?confirmation_token=${token}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                if (response.ok) {
                    setStatus("success");
                    setTimeout(() => {
                        router.push("/reader/sign_in");
                    }, 3000); // Redirect after 3 seconds
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error("Confirmation error:", err);
                setStatus("error");
            }
        };

        confirmEmail();
    }, [token, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
                {status === "pending" && (
                    <>
                        <h1 className="text-2xl font-bold text-blue-600 mb-4">
                            Check Your Email
                        </h1>
                        <p className="text-gray-700">
                            We’ve sent a confirmation link {email && <>to <b>{email}</b></>} .
                            Please click the link in your inbox to activate your account.
                        </p>
                    </>
                )}

                {status === "loading" && (
                    <p className="text-gray-600 text-lg">Confirming your account...</p>
                )}

                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-bold text-green-600 mb-4">
                            🎉 Email Confirmed!
                        </h1>
                        <p className="text-gray-700">
                            Your account has been successfully confirmed. You can now log in
                            and start using Itan.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            ❌ Confirmation Failed
                        </h1>
                        <p className="text-gray-700">
                            The confirmation link is invalid or has already been used. Please
                            request a new confirmation email.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      Loading flipbook...
    </div>
  ),
});

function FlipbookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);

  const pdfUrl = searchParams.get("url");
  const bookTitle = searchParams.get("title") || "Book Reader";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAuthToken(token);
  }, []);

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">No PDF URL provided</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back + title */}
      <div className="bg-white shadow-sm border-b p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Book Details
          </button>
          <h1 className="text-xl font-semibold text-gray-800 truncate max-w-md">
            {bookTitle}
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Flipbook */}
      <div className="py-2">
        <PdfFlipbook
          pdfUrl={pdfUrl}
          authHeaders={
            authToken
              ? {
                  Authorization: `Bearer ${authToken}`,
                  Accept: "application/pdf",
                }
              : {}
          }
        />
      </div>
    </div>
  );
}

export default function FlipbookReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <FlipbookContent />
    </Suspense>
  );
}

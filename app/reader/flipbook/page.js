"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading flipbook...</p>,
});
const EpubReader = dynamic(() => import("@/components/EpubReader"), {
  ssr: false,
  loading: () => <p>Loading EPUB reader...</p>,
});

function FlipbookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [authToken, setAuthToken] = useState(null);

  const fileUrl = searchParams.get("url");
  const bookTitle = searchParams.get("title") || "Book Reader";
  const bookId = searchParams.get("bookId") || searchParams.get("id"); // Get the book ID from query params

  // Enhanced format detection: prefer explicit query param, otherwise infer from URL
  const explicitFormat = searchParams.get("format");
  const isEpub = (() => {
    if (!fileUrl) return false;
    if (explicitFormat && explicitFormat.toLowerCase() === "epub") return true;

    // Check filename and content-type indicators in URL
    const lower = fileUrl.toLowerCase();
    if (lower.includes(".epub")) return true;

    // Check for EPUB content type indicators in S3 URLs
    if (
      lower.includes("application%2fepub") ||
      lower.includes("application/epub") ||
      lower.includes("epub%2bzip") ||
      lower.includes("epub+zip")
    )
      return true;

    // Check for the filename parameter in S3 URLs
    if (lower.includes("filename%3d%22") && lower.includes(".epub%22"))
      return true;

    return false;
  })();

  useEffect(() => {
    // console.log(`File URL: ${fileUrl}`);
    // console.log(`Book ID: ${bookId}`);
    // console.log(`Detected format: ${isEpub ? "EPUB" : "PDF"}`);

    // Get auth token from localStorage
    const token = localStorage.getItem("access_token");
    setAuthToken(token);
  }, [fileUrl, bookId, isEpub]);

  if (!fileUrl) {
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
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b p-4">
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
          <div className="w-32"></div> {/* Spacer for layout balance */}
        </div>
      </div>

      {/* Flipbook container */}
      <div className="py-4">
        {isEpub ? (
          <EpubReader
            epubUrl={fileUrl} // Use the S3 URL directly for EPUB
            bookId={bookId} // Pass the actual book ID separately
            authHeaders={
              authToken
                ? {
                    Authorization: `Bearer ${authToken}`,
                    Accept: "application/epub+zip, application/octet-stream",
                  }
                : {}
            }
          />
        ) : (
          <PdfFlipbook
            pdfUrl={fileUrl}
            authHeaders={
              authToken
                ? {
                    Authorization: `Bearer ${authToken}`,
                    Accept: "application/pdf, application/octet-stream",
                  }
                : {}
            }
          />
        )}
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

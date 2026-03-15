"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import reader components to prevent SSR issues
const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading PDF reader...</p>,
});

const EpubReader = dynamic(() => import("@/components/EpubReader"), {
  ssr: false,
  loading: () => <p>Loading EPUB reader...</p>,
});

/**
 * Unified Book Reader component that supports multiple formats (PDF, EPUB)
 */
export default function BookReaderUnified({
  url,
  format,
  title = "Book",
  authToken = null,
  onClose = () => {},
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Common headers for authenticated requests
  const authHeaders = authToken
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : {};

  useEffect(() => {
    if (!url) {
      setError("No book URL provided");
      return;
    }

    setLoading(false);
    // Set the document title
    document.title = `Reading: ${title}`;

    return () => {
      document.title = "ITAN Reader"; // Reset title on unmount
    };
  }, [url, title]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading book reader...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-red-500 text-xl font-bold mb-4">
            Error Loading Book
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={onClose || (() => router.back())}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <button
            onClick={onClose || (() => router.back())}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-medium text-lg truncate px-4">{title}</h1>
          <div className="w-32"></div> {/* Spacer for layout balance */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        {format?.includes("pdf") && (
          <PdfFlipbook pdfUrl={url} authHeaders={authHeaders} />
        )}

        {format?.includes("epub") && (
          <EpubReader epubUrl={url} authHeaders={authHeaders} />
        )}

        {!format?.includes("pdf") && !format?.includes("epub") && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Unsupported Format
              </h3>
              <p className="text-gray-600 mb-4">
                The format "{format || "unknown"}" is not supported by the
                reader. Currently we support PDF and EPUB formats.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const EpubReader = dynamic(() => import("@/components/EpubReader"), {
  ssr: false,
  loading: () => <p>Loading EPUB reader...</p>,
});

function EpubReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [epubUrl, setEpubUrl] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [bookTitle, setBookTitle] = useState("Loading book...");

  useEffect(() => {
    // Get query parameters from URL
    const url = searchParams.get("url");
    const title = searchParams.get("title") || "Book";
    const token = localStorage.getItem("access_token");

    if (!url) {
      router.push("/reader/library"); // Redirect if no URL provided
      return;
    }

    setEpubUrl(url);
    setBookTitle(title);
    setAuthToken(token);

    // Set page title
    document.title = `Reading: ${title}`;
  }, [searchParams, router]);

  if (!epubUrl) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-medium text-lg truncate px-4">{bookTitle}</h1>
          <div className="w-32"></div> {/* Spacer for layout balance */}
        </div>
      </div>

      {/* EPUB reader container */}
      <div className="flex-grow">
        <EpubReader
          epubUrl={epubUrl}
          authHeaders={
            authToken
              ? {
                  Authorization: `Bearer ${authToken}`,
                  Accept: "application/epub+zip",
                }
              : {}
          }
        />
      </div>
    </div>
  );
}

export default function EpubReaderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      }
    >
      <EpubReaderContent />
    </Suspense>
  );
}

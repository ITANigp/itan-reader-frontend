"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";

// Dynamically import the unified reader
const BookReaderUnified = dynamic(
  () => import("@/components/BookReaderUnified"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        Loading book reader...
      </div>
    ),
  }
);

export default function ReadEpubPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get book ID from params
  const bookId = params.id;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/reader/sign_in");
      return;
    }

    // Fetch book data
    const fetchBookData = async () => {
      if (!bookId) {
        setError("No book ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch book data from API
        const token = localStorage.getItem("access_token");
        const response = await fetch(`/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load book: ${response.status}`);
        }

        const data = await response.json();
        setBookData(data);
      } catch (err) {
        console.error("Error loading book:", err);
        setError(`Failed to load book: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
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
          <p className="text-gray-600">Loading your book...</p>
        </div>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-red-500 text-xl font-semibold mb-4">
            Error Loading Book
          </h2>
          <p className="text-gray-700 mb-6">
            {error || "Book data not available"}
          </p>
          <button
            onClick={() => router.push("/reader/library")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <BookReaderUnified
      url={bookData.content_url}
      format="epub"
      title={bookData.title}
      authToken={localStorage.getItem("access_token")}
      onClose={() => router.push("/reader/library")}
    />
  );
}

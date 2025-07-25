"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/utils/auth/readerApi"; // Import your configured API instance
import axios from "axios"; // Still need axios import for axios.isAxiosError check

// Import the useAuth hook from your AuthContext file
import { useAuth } from "@/contexts/AuthContext"; // Adjust the path as per your project structure

// Dynamically import the PdfFlipbook component with ssr: false
const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading flipbook viewer...</p>, // Optional loading state
});

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";

// API_BASE_URL can be omitted if readerApi already has it configured,
// but kept for clarity in constructing specific endpoints.
const API_BASE_URL = "http://localhost:3000/api/v1";

export default function Library() {
  const router = useRouter();
  // Use the useAuth hook to get auth states and functions
  const { authToken, isLoggedIn, logout, isLoadingAuth } = useAuth();

  // State variables for different book categories
  const [boughtBooks, setBoughtBooks] = useState([]);
  const [currentReads, setCurrentReads] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // State to manage active tab

  // State for loading status of API calls and errors
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [errorFetchingBooks, setErrorFetchingBooks] = useState(null);

  // Function to fetch data using your custom 'api' instance
  const fetchData = async (endpoint, setStateFunction, tabName) => {
    if (!authToken) {
      console.log(
        `Skipping fetch for ${tabName}: No authentication token available.`
      );
      return;
    }

    console.log(
      `Attempting to fetch ${tabName} from: ${API_BASE_URL}${endpoint}`
    );
    try {
      // Use your imported 'api' instance
      const response = await api.get(endpoint, {
        // Pass endpoint directly, baseURL is in 'api' instance
        headers: {
          Authorization: `Bearer ${authToken}`, // Explicitly add token
        },
      });

      // *** THIS IS THE CRUCIAL CHANGE FOR ALL DATA FETCHES ***
      // Assuming API response structure is consistently { status: ..., data: [...] }
      if (response.data && Array.isArray(response.data.data)) {
        setStateFunction(response.data.data); // Correctly access the array inside 'data' property
        console.log(
          `SUCCESS: Fetched ${tabName.toLowerCase()}:`,
          response.data.data
        );
      } else {
        console.warn(
          `API response for ${tabName} did not contain an array in 'data' property:`,
          response.data
        );
        setStateFunction([]); // Default to empty array if unexpected structure
      }
    } catch (error) {
      console.error(`ERROR: Failed to fetch ${tabName}:`, error);
      setErrorFetchingBooks(`Failed to load ${tabName}. Please try again.`);
      if (axios.isAxiosError(error)) {
        // Still use axios.isAxiosError for type checking
        console.error("Axios error response details:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed or token expired. Logging out...");
          logout(); // Log out if token is invalid or expired
          router.push("/login"); // Redirect to login page
        }
      } else {
        console.error("Non-Axios error:", error.message);
      }
      setStateFunction([]); // Set to empty array on error
    }
  };

  // Function to update current read status (PATCH) using your custom 'api' instance
  const updateCurrentReadStatus = async (bookId, status) => {
    if (!authToken) {
      console.log(
        `Skipping update for book ${bookId}: No authentication token available.`
      );
      return;
    }

    console.log(`Attempting to PATCH book ${bookId} status to '${status}'`);
    try {
      // Use your imported 'api' instance
      const response = await api.patch(
        `/reader/current_reads/${bookId}`, // Pass relative path, baseURL is in 'api' instance
        { status },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Explicitly add token
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        `SUCCESS: Updated book ${bookId} to ${status}:`,
        response.data
      );
      // Re-fetch current reads and finished books to update the UI with latest status
      fetchData("/reader/current_reads", setCurrentReads, "Current Reads");
      fetchData("/reader/finished_books", setFinishedBooks, "Finished Books");
    } catch (error) {
      console.error(
        `ERROR: Failed to update current read status for book ${bookId}:`,
        error
      );
      setErrorFetchingBooks(`Failed to update book status.`);
      if (axios.isAxiosError(error)) {
        console.error("Axios error response details:", error.response?.data);
        console.error("Axios error status:", error.response?.status);
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed or token expired. Logging out...");
          logout();
          router.push("/login");
        }
      } else {
        console.error("Non-Axios error:", error.message);
      }
    }
  };

  // useEffect to fetch data when AuthContext is ready and authToken changes
  useEffect(() => {
    // Only attempt to fetch if AuthContext has finished loading and authToken is present
    if (!isLoadingAuth && authToken) {
      setIsLoadingBooks(true);
      setErrorFetchingBooks(null); // Clear previous errors

      // Use Promise.all to fetch all data concurrently
      Promise.all([
        fetchData("/purchases", setBoughtBooks, "Bought Books"),
        fetchData("/reader/current_reads", setCurrentReads, "Current Reads"),
        fetchData("/reader/finished_books", setFinishedBooks, "Finished Books"),
        fetchData("/likes", setWishlist, "Wishlist"),
      ]).finally(() => {
        setIsLoadingBooks(false); // All fetches (or their attempts) are complete
      });
    } else if (!isLoadingAuth && !authToken) {
      // If AuthContext is done loading and no token is found, clear books
      setBoughtBooks([]);
      setCurrentReads([]);
      setFinishedBooks([]);
      setWishlist([]);
      setIsLoadingBooks(false); // Finished trying to load (no token available)
      console.log("No authentication token found. User needs to log in.");
    }
  }, [authToken, isLoadingAuth]); // Depend on authToken and isLoadingAuth

  // Filter books based on the active tab
  const getFilteredBooks = () => {
    switch (activeTab) {
      case "All":
        const allBooks = [
          ...boughtBooks,
          ...currentReads,
          ...finishedBooks,
          ...wishlist,
        ];
        const uniqueBookIds = new Set();
        // Basic deduplication assuming 'id' is a unique identifier
        return allBooks.filter((book) => {
          if (book.id && !uniqueBookIds.has(book.id)) {
            uniqueBookIds.add(book.id);
            return true;
          }
          return false;
        });
      case "Wishlist":
        return wishlist;
      case "Current Reads":
        return currentReads;
      case "Finished Books":
        return finishedBooks;
      case "Ebook":
        // IMPORTANT: Assuming API returns a 'format' field with "ebook" for ebooks
        // Verify this field name and value with your backend's API response
        return boughtBooks.filter(
          (book) => book.format === "ebook" || book.format === "pdf"
        );
      case "Audiobooks":
        // IMPORTANT: Assuming API returns a 'format' field with "audiobook" for audiobooks
        // Verify this field name and value with your backend's API response
        return boughtBooks.filter(
          (book) => book.format === "audiobook" || book.format === "audio"
        );
      default:
        return boughtBooks;
    }
  };

  const displayedBooks = getFilteredBooks();

  // Handle various states: Authentication loading, not logged in, books loading, error
  if (isLoadingAuth) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Loading authentication status...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Please log in to view your library.
        <Button
          onClick={() => router.push("/login")}
          className="mt-4 bg-red-600"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {[
          "All",
          "Wishlist",
          "Current Reads",
          "Ebook",
          "Audiobooks",
          "Finished Books",
        ].map((tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-md shadow flex-shrink-0 whitespace-nowrap ${
              activeTab === tab
                ? "bg-red-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoadingBooks ? (
        <p className="col-span-full text-center text-gray-600 p-8">
          Loading your books...
        </p>
      ) : errorFetchingBooks ? (
        <p className="col-span-full text-center text-red-500 p-8">
          {errorFetchingBooks}
        </p>
      ) : displayedBooks.length === 0 ? (
        <p className="col-span-full text-center text-gray-600 p-8">
          No {activeTab.toLowerCase()} found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedBooks.map((book, index) => (
            <Card key={book.id || index} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 text-red-500 z-10">
                <Heart size={18} fill="white" />
              </div>
              <div className="relative">
                <img
                  src={book.cover || "/images/books/book4.png"}
                  alt={book.title || "Book Cover"}
                  className="w-full h-60 object-cover rounded-t-xl"
                />
                {/* Check book.format to determine if it's an audiobook/video */}
                {(book.format === "audiobook" || book.format === "video") && (
                  <PlayCircle
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full"
                    size={40}
                  />
                )}
              </div>
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold leading-tight line-clamp-2">
                  {book.title || "Untitled Book"}
                </h2>
                <p className="text-xs text-gray-500 mb-2">
                  By: {book.author || "Unknown Author"}
                </p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-red-500">
                      ★
                    </span>
                  ))}
                </div>
                {book.price && (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-red-600 mb-1">
                      ${book.price}
                    </div>
                    <Button
                      onClick={() => {
                        if (book.id) {
                          updateCurrentReadStatus(book.id, "in_progress");
                          // TODO: Integrate actual PDF/Audio viewer logic here
                          // Example: router.push(`/reader/${book.id}`);
                          console.log(
                            `Initiating read/listen for book: ${book.title}, ID: ${book.id}`
                          );
                        } else {
                          console.warn(
                            "Book ID is missing, cannot update status or read."
                          );
                        }
                      }}
                      className="w-full bg-[#E50913]"
                    >
                      Read/Listen
                    </Button>
                    {activeTab === "Current Reads" && book.id && (
                      <Button
                        onClick={() =>
                          updateCurrentReadStatus(book.id, "finished")
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 mt-2"
                      >
                        Mark as Finished
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

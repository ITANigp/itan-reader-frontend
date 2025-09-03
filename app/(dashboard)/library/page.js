"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/auth/readerApi";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBookOpen,
  FaStar,
  FaUserAlt,
  FaHeart,
  FaHeadphonesAlt,
} from "react-icons/fa";

// Flipbook loader (used on /reader/flipbook page)
const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading reader...</p>,
});

export default function Library() {
  const router = useRouter();
  const {
    authToken,
    isLoggedIn,
    logout,
    userId: currentUserId,
    isLoadingAuth,
  } = useAuth();

  const [activeTab, setActiveTab] = useState(0);

  const [boughtBooks, setBoughtBooks] = useState([]);
  const [currentReads, setCurrentReads] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [audioBooks, setAudioBooks] = useState([]);

  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [errorFetchingBooks, setErrorFetchingBooks] = useState(null);

  const TABS = [
    { label: "Bought Books", icon: <FaBookOpen className="text-lg" /> },
    { label: "Current Reads", icon: <FaStar className="text-lg" /> },
    { label: "Finished Books", icon: <FaUserAlt className="text-lg" /> },
    { label: "My Wishlist", icon: <FaHeart className="text-lg" /> },
    { label: "Audiobooks", icon: <FaHeadphonesAlt className="text-lg" /> },
  ];

  // ✅ Fixed: handleReadNow accepts bookData
  const handleReadNow = useCallback(
    async (bookData, bookId, purchaseId, readingToken) => {
      if (!isLoggedIn || !authToken || !currentUserId) {
        router.push("/reader/sign_up");
        return;
      }

      try {
        // Refresh reading token
        const tokenRes = await api.post(
          "/purchases/refresh_reading_token",
          {
            book_id: bookId,
            content_type: "ebook",
            // purchase_id: purchaseId || null,
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const reading_token =
          tokenRes.data?.reading_token || tokenRes.data?.data?.reading_token;

        if (!reading_token) throw new Error("No reading token received");

        // Get book content
        const contentRes = await api.get(
          `/books/${bookId}/content?direct_url=true`,
          { headers: { Authorization: `Bearer ${reading_token}` } }
        );

        const content = contentRes.data;

        if (content?.url) {
          // Navigate to flipbook with url + title
          const urlParams = new URLSearchParams();
          urlParams.set("url", content.url);
          urlParams.set("title", bookData.title);

          router.push(`/reader/flipbook?${urlParams.toString()}`);
        } else {
          alert("Book content unavailable.");
        }
      } catch (err) {
        console.error("Read error:", err);
        alert("Unable to read book. Please try again.");
      }
    },
    [isLoggedIn, authToken, currentUserId, router]
  );

  // Function to fetch data using your custom 'api' instance
  const fetchData = async (endpoint, setStateFunction, tabName) => {
    if (!authToken) {
      console.log(
        `Skipping fetch for ${tabName}: No authentication token available.`
      );
      return;
    }

    try {
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setStateFunction(response.data.data);
        console.log(
          `SUCCESS: Fetched ${tabName.toLowerCase()}:`,
          response.data.data
        );
      } else {
        console.warn(
          `API response for ${tabName} did not contain an array in 'data' property:`,
          response.data
        );
        setStateFunction([]);
      }
    } catch (error) {
      console.error(`ERROR: Failed to fetch ${tabName}:`, error);
      setErrorFetchingBooks(`Failed to load ${tabName}. Please try again.`);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed or token expired. Logging out...");
          logout();
          router.push("/login");
        }
      }
      setStateFunction([]);
    }
  };

  useEffect(() => {
    if (!isLoadingAuth && authToken) {
      setIsLoadingBooks(true);
      setErrorFetchingBooks(null);

      Promise.all([
        fetchData("/purchases", setBoughtBooks, "Bought Books"),
        fetchData("/reader/current_reads", setCurrentReads, "Current Reads"),
        fetchData("/reader/finished_books", setFinishedBooks, "Finished Books"),
        fetchData("/likes", setWishlist, "Wishlist"),
      ]).finally(() => {
        console.log("Display Bought Books: ", boughtBooks);
        setIsLoadingBooks(false);
      });
    } else if (!isLoadingAuth && !authToken) {
      setBoughtBooks([]);
      setCurrentReads([]);
      setFinishedBooks([]);
      setWishlist([]);
      setAudioBooks([]);
      setIsLoadingBooks(false);
      console.log("No authentication token found. User needs to log in.");
    }
  }, [authToken, isLoadingAuth]);

  useEffect(() => {
    console.log("📚 Bought Books:", boughtBooks);
  }, [boughtBooks]);

  // Handle initial loading and not-logged-in states
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

  // A generic render function to handle all tab contents based on the passed data
  const renderBooks = (
    booksToRender,
    isWishlist = false,
    isCurrentReads = false
  ) => {
    if (!Array.isArray(booksToRender) || booksToRender.length === 0) {
      const emptyMessage =
        activeTab === 0
          ? "You Haven't Bought Any Books Yet"
          : activeTab === 1
            ? "Your Current Reads library is currently empty."
            : activeTab === 2
              ? "No Finished Books Yet"
              : activeTab === 3
                ? "Your Wishlist is currently empty."
                : activeTab === 4
                  ? "Your Audio Book library is currently empty."
                  : "Your library is currently empty.";

      const subMessage =
        "Explore the store to add books and audio books to your library.";

      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700">
            {emptyMessage}
          </h2>
          <p className="text-md md:text-lg text-gray-500 max-w-md">
            {subMessage}
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-[1440px] mx-auto px-4 mt-14">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
          {booksToRender.map((item, index) => {
            const book = item.book ? item.book : item;
            if (!book) return null;

            return (
              <div
                key={book.id || index}
                className="relative bg-white p-2 rounded shadow-md flex-shrink-0 w-[150px] sm:w-[160px] md:w-[180px] scrollSnap-align-start"
              >
                {isWishlist && (
                  <div className="absolute top-1 right-1 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow">
                    <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center text-red-500">
                      <Heart />
                    </div>
                  </div>
                )}

                <div className="w-full h-[220px] md:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={`${book.cover_image_url}`}
                    alt={book.title || "Book Title"}
                    fill
                    className="object-cover rounded"
                  />
                  {(book.is_audiobook || book.is_video) && (
                    <PlayCircle
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full"
                      size={40}
                    />
                  )}
                </div>

                {/* {!isCurrentReads && !isWishlist && (
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-red-500 text-xs">
                        ★
                      </span>
                    ))}
                  </div>
                )} */}

                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author_name || "Anonymous"}
                </p>

                <div className="flex justify-between items-center mt-1">
                  {isCurrentReads ? (
                    <div className="flex flex-col justify-center items-center w-full">
                      <p className="text-xs text-gray-600 mb-1">
                        Page 25 of 283
                      </p>
                      <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-7 py-1 rounded">
                        Continue
                      </Button>
                    </div>
                  ) : activeTab === 4 ? (
                    <div className="flex flex-col justify-center items-center w-full">
                      <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-7 py-1 rounded">
                        Play Audio
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-teal-600 font-bold text-[16px]">
                        {/* ${book.ebook_price} */}
                      </span>
                      <div
                        onClick={() =>
                          handleReadNow(
                            book,
                            book.id,
                            item.id,
                            item.reading_token
                          )
                        }
                        className="text-green-500 py-1 px-3 rounded-md cursor-pointer"
                      >
                        Read
                      </div>
                      <Link
                        href={`/home/book-details/${book.id}`}
                        className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        View details
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Determine which books to display based on the active tab
  const displayedBooks = () => {
    switch (activeTab) {
      case 0:
        return boughtBooks;
      case 1:
        return currentReads;
      case 2:
        return finishedBooks;
      case 3:
        return wishlist;
      case 4:
        return audioBooks;
      default:
        return boughtBooks;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <select className="w-[259px] h-[52px] border-[3px] border-[#E50913] text-gray-800 px-[10px] rounded-[8px] text-sm bg-white focus:outline-none">
          <option>Browse Categories</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="w-full max-w-screen-xl px-4 mx-auto flex flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-center justify-center">
          {TABS.map((tab, i) => (
            <button
              key={i}
              className={`w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px] h-[60px] sm:h-[65px] md:h-[70px] lg:h-[75px] text-[10px] sm:text-xs md:text-sm rounded-[10px] sm:rounded-[11px] md:rounded-[12px] border flex flex-col items-center justify-center gap-1 transition-all duration-200 ease-in-out ${
                i === activeTab
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
              }`}
              style={{
                boxShadow: `6px 6px 12px -1px #00000020, -6px -6px 12px 1px #F2F9FF33`,
              }}
              onClick={() => setActiveTab(i)}
            >
              <span className="text-sm sm:text-base md:text-lg">
                {tab.icon}
              </span>
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoadingBooks ? (
        <div className="flex items-center justify-center w-full h-40">
          <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : errorFetchingBooks ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"
            />
          </svg>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-red-600">
            Oops! Something went wrong.
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-md mb-4">
            {errorFetchingBooks ||
              "We couldn’t load your library at the moment. Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      ) : (
        renderBooks(displayedBooks(), activeTab === 3, activeTab === 1)
      )}
    </div>
  );
}

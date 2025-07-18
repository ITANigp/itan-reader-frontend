"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/auth/readerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle } from "lucide-react";

const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
  loading: () => <p>Loading flipbook viewer...</p>,
});

const TABS = ["All", "Wishlist", "Ebook", "Audiobooks", "Finished Books"];

export default function Library() {
  const router = useRouter();
  const { authToken, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [wishlistBooks, setWishlistBooks] = useState([]);

  // Placeholder for other tabs
  const books = [
    {
      title: "Rise of the Jumbies",
      author: "Tracey Baptiste",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      title: "Glory",
      author: "NoViolet Bulawayo",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      title: "You made a Fool...",
      author: "Akwaeke Emezi",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: true,
    },
    {
      title: "Gaslight",
      author: "Femi Kayode",
      cover: "/images/books/book4.png",
      price: 25,
      isVideo: false,
    },
    {
      title: "Death of the Author",
      author: "Nnedi Okorafor",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      title: "The Lazarus Effect",
      author: "H.J. Golakai",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: false,
    },
    {
      title: "In Bed With Her Guy",
      author: "Yinka Akiran",
      cover: "/images/books/book4.png",
      price: 20,
      isVideo: false,
    },
    {
      title: "Really good, actually",
      author: "Monica Heisey",
      cover: "/images/books/book4.png",
      price: 27,
      isVideo: true,
    },
  ];

  useEffect(() => {
    if (TABS[activeTab] === "Finished Books" && isLoggedIn && authToken) {
      console.log("[Library] Fetching finished books from API", {
        activeTab: TABS[activeTab],
        isLoggedIn,
        authTokenPresent: !!authToken,
      });
      setLoading(true);
      setError(null);
      api
        .get("/reader/finished_books", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((res) => {
          console.log("[Library] API response for finished books:", res);
          setFinishedBooks(res.data.data || []);
        })
        .catch((err) => {
          console.error("[Library] Error fetching finished books:", err);
          if (err.response) {
            console.error("[Library] Error response data:", err.response.data);
          }
          setError(
            err.response?.data?.message || "Failed to load finished books."
          );
        })
        .finally(() => {
          setLoading(false);
          console.log("[Library] Finished books fetch process finished.");
        });
    } else if (TABS[activeTab] === "All") {
      // Fetch all books for the 'All' tab
      console.log("[Library] Fetching all books from /api/v1/books");
      // console.log("[Library] Fetching all books from /purchases");
      setLoading(true);
      setError(null);
      api
        .get("/purchases")
        // .get("/books/my_books")
        .then((res) => {
          console.log("[Library] API response for all books:", res);
          setAllBooks(res.data.data || []);
        })
        .catch((err) => {
          console.error("[Library] Error fetching all books:", err);
          if (err.response) {
            console.error("[Library] Error response data:", err.response.data);
          }
          setError(
            err.response?.data?.message || "Failed to load books."
          );
        })
        .finally(() => {
          setLoading(false);
          console.log("[Library] All books fetch process finished.");
        });
    } else if (TABS[activeTab] === "Wishlist" && isLoggedIn && authToken) {
      // Fetch wishlist books for the 'Wishlist' tab
      console.log("[Library] Fetching wishlist books from /likes");
      setLoading(true);
      setError(null);
      api
        .get("/likes", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((res) => {
          console.log("[Library] API response for wishlist books:", res.data);
          setWishlistBooks(res.data.data || []);
        })
        .catch((err) => {
          console.error("[Library] Error fetching wishlist books:", err);
          if (err.response) {
            console.error("[Library] Error response data:", err.response.data);
          }
          setError(
            err.response?.data?.message || "Failed to load wishlist books."
          );
        })
        .finally(() => {
          setLoading(false);
          console.log("[Library] Wishlist books fetch process finished.");
        });
    } else {
      if (TABS[activeTab] === "Finished Books") {
        console.warn("[Library] Not fetching finished books: not logged in or missing auth token", {
          isLoggedIn,
          authTokenPresent: !!authToken,
        });
      }
    }
  }, [activeTab, isLoggedIn, authToken]);

  const renderBooks = (booksToRender, isNestedBook = false) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {booksToRender.map((item, index) => {
        // If rendering finished books, extract book info from item.book
        const book = isNestedBook ? item.book : item;
        if (!book) return null;
        return (
          <Card key={book.id || index} className="relative">
            <div className="absolute top-2 right-2 text-red-500">
              <Heart size={18} fill="white" />
            </div>
            <div className="relative">
              <img
                src={book.cover_image_url || book.cover || "/images/placeholder.png"}
                alt={book.title}
                className="w-full h-60 object-cover rounded-t-xl"
              />
              {book.isVideo && (
                <PlayCircle
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full"
                  size={40}
                />
              )}
            </div>
            <CardContent className="p-4">
              <h2 className="text-sm font-semibold leading-tight">
                {book.title}
              </h2>
              <p className="text-xs text-gray-500 mb-2">By: {book.author || book.author_name}</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-red-500">★</span>
                ))}
              </div>
              {book.price && (
                <div className="mt-3">
                  <div className="text-sm font-semibold text-red-600 mb-1">
                    ${book.price}
                  </div>
                  <Button
                    onClick={() => <PdfFlipbook pdfUrl="/CYBERSECURITY.pdf" />}
                    className="w-full bg-[#E50913]"
                  >
                    Read Book
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      <div className="flex gap-4 mb-6">
        {TABS.map((tab, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-md shadow ${
              i === activeTab ? "bg-red-600 text-white" : "bg-white text-black"
            }`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      {TABS[activeTab] === "Finished Books" ? (
        loading ? (
          <div>Loading finished books...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : finishedBooks.length === 0 ? (
          <div>No finished books found.</div>
        ) : (
          renderBooks(finishedBooks, true)
        )
      ) : TABS[activeTab] === "All" ? (
        loading ? (
          <div>Loading books...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : allBooks.length === 0 ? (
          <div>No books found.</div>
        ) : (
          renderBooks(allBooks)
        )
      ) : TABS[activeTab] === "Wishlist" ? (
        loading ? (
          <div>Loading wishlist books...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : wishlistBooks.length === 0 ? (
          <div>No wishlist books found.</div>
        ) : (
          renderBooks(wishlistBooks, true)
        )
      ) : (
        renderBooks(books)
      )}
    </div>
  );
}

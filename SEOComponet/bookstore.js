"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookOpen,
  faTheaterMasks,
  faStar,
  faFingerprint,
  faBible,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import StarRating from "@/app/reader/(components)/StarRating";
import { getAllBook } from "@/utils/bookApi";

export default function HomeClient() {
  const [categorizedBooks, setCategorizedBooks] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBook();
        if (response && response.data) {
          const booksData = response.data;
          const newCategorizedBooks = {};

          booksData.forEach((bookWrapper) => {
            const book = bookWrapper.attributes;
            const bookId = bookWrapper.id;

            if (book?.categories?.length > 0) {
              const mainCategory = book.categories[0].main;
              if (mainCategory) {
                if (!newCategorizedBooks[mainCategory]) {
                  newCategorizedBooks[mainCategory] = [];
                }

                const authorName =
                  book.author?.name?.trim() !== ""
                    ? book.author.name
                    : "Unknown Author";

                newCategorizedBooks[mainCategory].push({
                  id: bookId,
                  title: book.title,
                  author: authorName,
                  price: book.ebook_price ? `$${book.ebook_price}` : "N/A",
                  image: book.cover_image_url || "/images/placeholder.png",
                  rating: book.average_rating || 0,
                });
              }
            }
          });
          setCategorizedBooks(newCategorizedBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const genres = [
    { genreName: "Romance", icon: faBook },
    { genreName: "Children Books", icon: faBookOpen },
    { genreName: "Literature & Fiction", icon: faTheaterMasks },
    { genreName: "Comics, Manga & Graphic Novels", icon: faStar },
    { genreName: "Mystery, Thriller & Suspense", icon: faFingerprint },
    { genreName: "Religion & Spirituality", icon: faBible },
    { genreName: "Speculative", icon: faWandMagicSparkles },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* ... your UI as it was ... */}
    </main>
  );
}

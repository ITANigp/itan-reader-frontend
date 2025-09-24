"use client";

import { useState, useEffect } from "react";
import { getReaderProfile } from "@/utils/auth/readerApi";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";
import FreeTrialTimer from "@/app/reader/(components)/FreeTrialTimer";

export default function Home() {
  const [userToken, setUserToken] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trialStart, setTrialStart] = useState(null);
  const [trialEnd, setTrialEnd] = useState(null);
  const [likedBookIds, setLikedBookIds] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLikedBooks = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {          
          const response = await fetch(`${BASE_URL}/likes`, {
            headers: { Authorization: `Bearer ${token}` },
          });          

          // Check if response is ok before trying to parse JSON
          if (!response.ok) {
            console.error(
              `API Error: ${response.status} - ${response.statusText}`
            );
            // Still set empty array to avoid blocking the UI
            setLikedBookIds([]);
            return;
          }

          // Check if response has content before parsing
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            console.error("API returned non-JSON response:", contentType);
            setLikedBookIds([]);
            return;
          }

          const responseText = await response.text();
          if (!responseText.trim()) {
            console.error("API returned empty response");
            setLikedBookIds([]);
            return;
          }

          // Now safely parse the JSON
          const result = JSON.parse(responseText);          

          // Extract liked book IDs from result.data array
          const likedBookIds = Array.isArray(result.data)
            ? result.data.map((like) => String(like.book.id))
            : [];          
          setLikedBookIds(likedBookIds);
        } catch (err) {
          console.error("Error fetching liked books:", err);
          // Still set empty array to avoid blocking the UI
          setLikedBookIds([]);
        }
      }
    };
    fetchLikedBooks();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const { data } = await getReaderProfile(token);
        setTrialStart(data.trial_start);
        setTrialEnd(data.trial_end);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) setUserToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/books`);
        const result = await response.json();
        // Extract main category names for each book
        const formattedBooks = result.data.map((book) => ({
          id: book.id,
          title: book.attributes.title,
          author: book.attributes.author.name,
          price: book.attributes.ebook_price,
          image: book.attributes.cover_image_url,
          mainCategories: Array.isArray(book.attributes.categories)
            ? book.attributes.categories.map((cat) => cat.main).filter(Boolean)
            : [],
        }));
        setBooks(formattedBooks);
      } catch (err) {
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  // Group books by main category names, ensuring each book appears only once per genre
  const booksByGenre = books.reduce((acc, book) => {
    const genres = book.mainCategories.length
      ? book.mainCategories
      : ["Itan Originals"];

    // Use a Set to deduplicate genres for this book
    const uniqueGenres = [...new Set(genres)];

    uniqueGenres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];

      // Check if this book already exists in this genre section
      const bookExists = acc[genre].some(
        (existingBook) => existingBook.id === book.id
      );

      // Only add the book if it doesn't already exist in this genre
      if (!bookExists) {
        acc[genre].push(book);
      }
    });
    return acc;
  }, {});

  return (
    <div className="bg-white pb-10 text-black text-[14px] font-sans">
      {/* Mobile-only timer, centered and contained */}
      <div className="flex sm:hidden w-full justify-center items-center pt-4 pb-2">
        <div className="max-w-[180px] w-full flex justify-center items-center">
          <FreeTrialTimer
            trial_start={trialStart}
            trial_end={trialEnd}
            mobile
          />
        </div>
      </div>
      {/* Desktop/Tablet timer, right-aligned */}
      <div className="hidden sm:flex justify-center md:justify-end items-center max-w-[1440px] mx-auto px-4 py-5">
        <FreeTrialTimer trial_start={trialStart} trial_end={trialEnd} />
      </div>

      {/* CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 pt-5 sm:mt-0">
        {/* Header */}
        {/* <div className="flex justify-between items-center py-3 mb-2 md:hidden">
          <button className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-base border border-gray-500 text-gray-500">
            ←
          </button>
        </div>
        {/* Hero */}
        <div className="mb-14">
          <div className="w-full h-40 md:h-60 xl:h-96 relative rounded-lg overflow-hidden">
            <Image
              src="/images/readers/home-hero.png"
              alt="Hero"
              fill
              className="object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <h1
                className="text-center text-white text-base sm:text-lg md:text-2xl font-bold leading-snug tracking-wide drop-shadow-lg bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,0.7)" }}
              >
                Explore Untold African Stories in the Most Immersive Way
              </h1>
            </div>
          </div>
        </div>
        {/* Genres */}
        <section className="mt-6 mb-16">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Genres
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100 md:gap-4 px-1 -mx-1">
            {[
              "Romance",
              "Fiction",
              "Adventure",
              "Sci-Fi",
              "Mystery",
              "Horror",
              "Fantasy",
              "Thriller",
              "Biography",
              "Historical",
              "Poetry",
              "Drama",
            ].map((genre, idx) => (
              <div
                key={idx}
                className="relative min-w-[160px] h-[90px] md:min-w-[200px] md:h-[110px] rounded overflow-hidden shrink-0"
              >
                <Image
                  src={`https://picsum.photos/200/100?random=${idx + 10}`}
                  alt={genre}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                  {genre}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Popular Trending */}
        {/* <section className="mt-8 w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[17px]">Popular Trending</h2>
            <span className="text-red-600 text-xs cursor-pointer">See more →</span>
          </div>

          <div
            className="flex gap-[10px] overflow-x-auto sm:gap-[10px] sm:h-[364px] sm:px-[20px] lg:grid lg:grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] lg:gap-[24px] lg:h-[550px] lg:px-[40px]"
            style={{
              maxWidth: '2776px',
            }}
          >
            {books.map((book, index) => (
              <div
                key={index}
                className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 shadow-md"
              >
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                    <LikeButton bookId={book.id} userToken={userToken} />
                  </div>
                </div>

                
                <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={book.image || `https://picsum.photos/150/220?random=${index + 20}`}
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-red-500 text-xs">★</span>
                  ))}
                </div>

                
                <p className="text-sm font-bold leading-snug">{book.title}</p>
                <p className="text-xs text-gray-500 mb-1">
                  By: {book?.author?.trim() ? book.author : "Jane Doe"}
                </p>

                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-teal-600 font-bold text-[16px]">
                    ${Number(book.price) / 100}
                  </span>
                  <Link
                    href={`/reader/home/book-details/${book.id}`}
                    className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section> */}
        {/* Ebooks based on genre */}
        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <section key={genre} className="mt-8 mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-[17px]">{genre}</h2>
              {/* You can add a 'See more' link or button here if needed */}
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {genreBooks.length ? (
                genreBooks.map((book, index) => {
                  const isLiked = likedBookIds.includes(String(book.id));                                    
                  return (
                    <div
                      key={`${genre}-${book.id}`}
                      className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                          <LikeButton
                            bookId={String(book.id)}
                            userToken={userToken}
                            section={genre}
                            isLiked={isLiked}
                          />
                        </div>
                      </div>
                      <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                        <Image
                          src={
                            book.image ||
                            `https://picsum.photos/150/220?random=${index + 20}`
                          }
                          alt={book.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-red-500 text-xs">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm font-bold leading-snug">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        By: {book?.author?.trim() ? book.author : "Jane Doe"}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-teal-600 font-bold text-[16px]">
                          ${Number(book.price)}
                        </span>
                        <Link
                          href={`/home/book-details/${book.id}`}
                          className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full hover:bg-red-700 transition-colors"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No books found in this genre.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

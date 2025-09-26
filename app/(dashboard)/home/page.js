"use client";

import { useState, useEffect } from "react";
import { getReaderProfile } from "@/utils/auth/readerApi";
import Image from "next/image";
import Link from "next/link";
import FreeTrialTimer from "@/app/reader/(components)/FreeTrialTimer";
import TrialEndedNotification from "@/components/TrialEndedNotification";
import LikeButton from "@/components/LikeButton";

export default function Home() {
  const [data, setData] = useState({
    books: [],
    likedBookIds: [],
    trialStart: null,
    trialEnd: null,
    userToken: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Centralized data fetching on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const storedToken = localStorage.getItem("access_token");
        if (!storedToken) {
          throw new Error("No access token found.");
        }

        const [profileResponse, booksResponse, likesResponse] =
          await Promise.all([
            getReaderProfile(storedToken),
            fetch(`${BASE_URL}/books`),
            fetch(`${BASE_URL}/likes`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            }),
          ]);

        const [profileData, booksResult, likesResult] = await Promise.all([
          profileResponse.data,
          booksResponse.json(),
          likesResponse.json(),
        ]);

        // Process fetched data
        const formattedBooks = booksResult.data.map((book) => ({
          id: book.id,
          title: book.attributes.title,
          author: book.attributes.author.name,
          price: book.attributes.ebook_price,
          image: book.attributes.cover_image_url,
          mainCategories: Array.isArray(book.attributes.categories)
            ? book.attributes.categories.map((cat) => cat.main).filter(Boolean)
            : [],
        }));

        const likedBookIds = Array.isArray(likesResult.data)
          ? likesResult.data.map((like) => String(like.book.id))
          : [];

        // Update state with all fetched data
        setData({
          books: formattedBooks,
          likedBookIds,
          trialStart: profileData.trial_start,
          trialEnd: profileData.trial_end,
          userToken: storedToken,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [BASE_URL]);

  const { books, likedBookIds, trialStart, trialEnd, userToken } = data;
  const isTrialActive = trialEnd && new Date(trialEnd) > new Date();

  // Notification effect (5 days max, once per day, 5 seconds each)
  useEffect(() => {
    if (!isTrialActive) {
      const today = new Date().toDateString();
      const storedData = JSON.parse(localStorage.getItem("shownDaysData")) || {
        days: [],
        count: 0,
      };

      if (!storedData.days.includes(today) && storedData.count < 5) {
        setShowNotification(true);
        const timeoutId = setTimeout(() => setShowNotification(false), 5000);

        const updatedData = {
          days: [...storedData.days, today],
          count: storedData.count + 1,
        };
        localStorage.setItem("shownDaysData", JSON.stringify(updatedData));

        return () => clearTimeout(timeoutId);
      }
    }
  }, [isTrialActive]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  // Group books by main category names, ensuring each book appears only once per genre
  const booksByGenre = books.reduce((acc, book) => {
    const genres = book.mainCategories.length
      ? book.mainCategories
      : ["Itan Originals"];
    genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      if (!acc[genre].some((b) => b.id === book.id)) {
        acc[genre].push(book);
      }
    });
    return acc;
  }, {});

  return (
    <div className="bg-white pb-10 text-black text-[14px] font-sans">
      {/* Conditionally render the FreeTrialTimer for mobile */}
      {isTrialActive && (
        <div className="flex sm:hidden w-full justify-center items-center pt-4 pb-2">
          <div className="max-w-[180px] w-full flex justify-center items-center">
            <FreeTrialTimer
              trial_start={trialStart}
              trial_end={trialEnd}
              mobile
            />
          </div>
        </div>
      )}

      {/* Conditionally render the FreeTrialTimer for desktop/tablet */}
      {isTrialActive && (
        <div className="hidden sm:flex justify-center md:justify-end items-center max-w-[1440px] mx-auto px-4 py-5">
          <FreeTrialTimer trial_start={trialStart} trial_end={trialEnd} />
        </div>
      )}

      {/* CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 pt-5 sm:mt-0">
        {/* Hero Section */}
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

      {/* Trial Ended Notification */}
      {!isTrialActive && showNotification && (
        <TrialEndedNotification onClose={() => setShowNotification(false)} />
      )}
    </div>
  );
}

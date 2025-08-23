"use client";

import { useState, useEffect } from "react";
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
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  // Group books by main category names
  const booksByGenre = books.reduce((acc, book) => {
    const genres = book.mainCategories.length
      ? book.mainCategories
      : ["Itan Originals"];
    genres.forEach((genre) => {
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(book);
    });
    return acc;
  }, {});

  return (
    <div className="bg-white pb-10 text-black text-[14px] font-sans">
      {/* <div className="hidden md:flex max-w-8xl mx-auto px-4 py-5 justify-end"> */}
      <div className="hidden sm:flex justify-center md:justify-end items-center max-w-[1440px] mx-auto px-4 py-5">
        <FreeTrialTimer />
      </div>

      {/* CONTAINER */}
      {/* <div className="max-w-7xl mx-auto px-4">  */}
      {/* <div className="max-w-8xl mx-auto px-4">  */}
      <div className="max-w-[1440px] mx-auto px-4 pt-5 sm:mt-0">
        {/* Header */}
        {/* <div className="flex justify-between items-center py-3 mb-2 md:hidden">
          <button className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-base border border-gray-500 text-gray-500">
            ←
          </button>
        </div>
        {/* Hero */}
        <div className="mb-14">
          <div className="w-full h-40 md:h-60 relative rounded-lg overflow-hidden">
            <Image
              src="https://picsum.photos/600/200?grayscale&random=1"
              alt="Hero"
              fill
              className="object-cover"
            />

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-center px-4">
              <h1 className="text-white text-base md:text-xl font-semibold leading-snug">
                Explore Untold African Stories in the Most Immersive Way
              </h1>
            </div>
          </div>
        </div>
        {/* Genres */}
        {/* <section className="mt-6 mb-16">
          <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Genres
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar md:gap-4 px-1 -mx-1">
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
        </section> */}
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
        {/* Popular Trending */}
        {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
          <section key={genre} className="mt-8 mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-[17px]">{genre}</h2>
              {/* You can add a 'See more' link or button here if needed */}
            </div>
            <div className="
                grid gap-4
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                2xl:grid-cols-7
              ">
              {genreBooks.length ? (
                genreBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative md:shadow-md"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-white rounded-full w-1 h-1 flex items-center justify-center">
                        <LikeButton
                          bookId={book.id}
                          userToken={userToken}
                          section={genre}
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
                ))
              ) : (
                <p className="text-gray-500">No books found in this genre.</p>
              )}
            </div>
          </section>
        ))}
        {/* Continue Reading */}
        {/* <section className="mt-8 mb-16"> */}
        {/* <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4">
            Continue Reading
          </h2> */}
        {/* <div
            className="flex gap-[10px] md:gap-[24px] overflow-x-auto no-scrollbar"
            style={{
              width: "100%",
              maxWidth: "1376px",
              height: "auto",
              opacity: 1,
            }}
          >
            {books.map((book, index) => (
              <div
                key={`continue-${index}`}
                className="w-[150px] sm:w-[130px] lg:w-[180px] bg-white p-2 rounded relative flex-shrink-0 md:shadow-md"
              > */}
        {/* Book Image */}
        {/* <div className="w-full h-[220px] lg:h-[260px] relative rounded overflow-hidden mb-2">
                  <Image
                    src={
                      book.image ||
                      `https://picsum.photos/150/220?random=${index + 20}`
                    }
                    alt={book.title}
                    fill
                    className="object-cover rounded"
                  />
                </div> */}

        {/* Page and continue Button */}
        {/* <div className="flex flex-col justify-center items-center mt-1">
                  <p className="text-xs text-gray-600 mb-1">Page 25 of 283</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-7 py-1 rounded">
                    Continue
                  </Button>
                </div> */}
        {/* </div> */}
        {/* ))} */}
        {/* </div> */}
        {/* </section> */}
      </div>
    </div>
  );
}

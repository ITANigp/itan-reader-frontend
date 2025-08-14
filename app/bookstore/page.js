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
  faBars, // Add faBars for mobile menu toggle
} from "@fortawesome/free-solid-svg-icons";
import StarRating from "@/app/reader/(components)/StarRating";
import { getAllBook } from "@/utils/bookApi";

export default function Home() {
  const [categorizedBooks, setCategorizedBooks] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

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

            if (book && book.categories && book.categories.length > 0) {
              const mainCategory = book.categories[0].main;
              if (mainCategory) {
                if (!newCategorizedBooks[mainCategory]) {
                  newCategorizedBooks[mainCategory] = [];
                }

                const authorName =
                  book.author &&
                  book.author.name &&
                  book.author.name.trim() !== ""
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
      <header className="flex items-center justify-between px-4 py-4 border-b md:px-6">
        <div className="text-red-600 text-xl font-bold">ITAN</div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:space-x-6 items-center">
          <Link href="#" className="text-gray-700 hover:text-black font-medium">
            Home
          </Link>
          <Link href="#" className="text-gray-700 hover:text-black font-medium">
            Library
          </Link>
          <input
            type="text"
            placeholder="Search for books..."
            className="px-4 py-2 rounded-md border border-gray-300 text-sm w-full md:w-96"
          />
          <button className="px-4 py-2 text-gray-700 hover:text-black font-medium">
            Sign In
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Sign Up
          </button>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full z-10">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link
              href="#"
              className="text-gray-700 hover:text-black font-medium"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-black font-medium"
            >
              Library
            </Link>
            <input
              type="text"
              placeholder="Search for books..."
              className="px-4 py-2 rounded-md border border-gray-300 text-sm w-11/12"
            />
            <button className="w-11/12 px-4 py-2 text-gray-700 hover:text-black font-medium border-t">
              Sign In
            </button>
            <button className="w-11/12 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Sign Up
            </button>
          </nav>
        </div>
      )}

      <section className="relative h-auto md:h-[700px] flex flex-col-reverse lg:flex-row items-center justify-between px-4 lg:px-20 py-10 bg-slate-300 overflow-hidden">
        <div className="max-w-xl text-center lg:text-left mt-8 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Get lost in tales only African writers can tell
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-gray-700">
            With voices that echo, characters that breathe, and plots that pull
            you in.
          </p>
          <button className="mt-6 px-5 py-2 bg-red-600 text-white text-base rounded-md hover:bg-red-700">
            Explore our Book Store
            <span className="ml-2">▼</span>
          </button>
        </div>

        <div className="h-auto lg:w-1/2 flex justify-center lg:justify-normal mt-10 lg:mt-0">
          <div className="">
            <Image
              src="/images/readers/landing/reader-landing-page.png"
              alt="Happy man reading a tablet"
              objectFit="contain"
              width={400}
              height={500}
              className="rounded-lg absolute right-0 bottom-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[650px] lg:h-[650px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-10 md:px-6 md:py-16">
        <h2 className="text-2xl font-semibold mb-6">Explore our Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.genreName}
              className="flex flex-col items-center justify-center border border-red-200 p-4 rounded-md text-center hover:shadow-md cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-2 text-base md:text-xl font-medium text-gray-700">
                <FontAwesomeIcon
                  icon={genre.icon}
                  size="2x"
                  className="text-gray-600"
                />
                <p>{genre.genreName}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {genres.map((genre, index) => {
        const booksForGenre = categorizedBooks[genre.genreName] || [];
        if (booksForGenre.length === 0) {
          return null;
        }

        const sectionBgColor = index % 2 === 0 ? "bg-blue-50" : "bg-pink-100";

        return (
          <section
            key={genre.genreName}
            className={`${sectionBgColor} px-4 py-10 md:px-6 md:py-16`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{genre.genreName}</h2>
              <Link href="#" className="text-red-600 text-sm font-medium">
                See more →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {booksForGenre.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-md shadow hover:shadow-lg p-4"
                >
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={200}
                    height={300}
                    className="mb-4 w-full h-auto"
                  />
                  {book.rating > 0 && <StarRating rating={book.rating} />}
                  <h3 className="font-semibold text-md mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
                  <p className="text-red-600 font-bold">{book.price}</p>
                  <Link
                    href={`/bookstore/${book.id}`}
                    className="block text-sm text-red-600 mt-2 hover:underline"
                  >
                    View details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className="text-center cursor-pointer bg-[#E50913] text-white py-2">
        <p>Back to top</p>
      </div>
    </main>
  );
}

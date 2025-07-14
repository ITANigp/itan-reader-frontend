"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { api } from "@/utils/auth/readerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Import the LikeButton component
import LikeButton from "@/components/LikeButton"; // Adjust path as per your project structure
import BuyButton from "@/components/reader/BuyButton";
import Link from "next/link";


export default function Home({ initialReaderToken, initialBookId }) {
  // Placeholder for userToken. In a real app, this would come from your auth context/store.
  const [userToken, setUserToken] = useState(initialReaderToken || null);
  const [authUrl, setAuthUrl] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate logging in to get a userToken (REMOVE IN PRODUCTION, USE ACTUAL AUTH)
  useEffect(() => {
    // This is a placeholder. In a real application, you would
    // get the user token from your authentication system (e.g., localStorage, context API, Redux).
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setUserToken(storedToken);
    } else {
      // Simulate a login if no token exists for demonstration purposes
      // This is not secure or how auth generally works.
      // For testing the LikeButton, you might manually set a token in localStorage
      // or implement a mock login.
      console.warn("No user token found. Like button will be disabled.");
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/books");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("All books from the Home: ", result)
        const formattedBooks = result.data.map((book) => ({
          id: book.id,
          type: book.type, // Keep type if needed
          title: book.attributes.title,
          author: book.attributes.author.name,
          price: book.attributes.ebook_price,
          image: book.attributes.cover_image_url,
          categories: book.attributes.categories,
          approval_status: book.attributes.approval_status,
          author_id: book.attributes.author.id, // Keep author ID if needed
          average_rating: book.attributes.average_rating,
          likes_count: book.attributes.likes_count,
        }));
        setBooks(formattedBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handlePurchase = async (bookIdToPurchase) => {
    // This function assumes `createPurchase` is globally available or imported
    // You might need to pass `readerToken` from the component's state or props
    // if `createPurchase` needs it.
    if (!userToken) {
      alert("Please log in to purchase a book.");
      return;
    }
    try {
      // This createPurchase function is not defined in the provided context.
      // You'll need to ensure it's imported or defined elsewhere.
      // For demonstration, let's assume it exists and takes userToken and bookId
      // const res = await createPurchase(userToken, bookIdToPurchase);
      // setAuthUrl(res.authorization_url);
      // window.location.href = res.authorization_url; // redirect to Paystack
      console.log(`Attempting to purchase book ID: ${bookIdToPurchase}`);
      alert(
        `Purchase functionality is not fully implemented yet. Book ID: ${bookIdToPurchase}`
      );
    } catch (err) {
      console.error("Purchase failed:", err);
      alert("Purchase failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading books...
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full h-64 md:h-96 relative">
        <Image
          src="/images/readers/home-hero.png"
          alt="Hero"
          fill
          className="object-cover"
        />
      </div>

      {/* Genres */}
      <section className="px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="relative h-40 rounded-lg overflow-hidden shadow-md"
              >
                <Image
                  src="/images/readers/home-hero.png"
                  alt="Genre" // Make this more specific if possible
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    Romance{" "}
                    {/* Placeholder, make dynamic if genre data is available */}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Popular Trending */}
      <section className="px-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Popular Trending</h2>
          <a href="#" className="text-sm text-red-500">
            See more →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          {books.map((book) => (
            <Card key={book.id} className="relative w-[200px]">
              {/* Integrate the LikeButton here */}
              <div className="absolute top-2 right-2 text-blue-500 w-6 h-6 cursor-pointer bg-slate-100 rounded-full p-1">
                <LikeButton bookId={book.id} userToken={userToken} />
              </div>
              <CardContent className="py-2">
                <Image
                  src={book.image}
                  alt={book.title}
                  width={150}
                  height={250}
                  className="mx-auto mb-3"
                />
                <h3 className="font-bold text-sm text-center">{book.title}</h3>
                <p className="text-xs text-center text-gray-500">
                  By: {book.author === " " ? "Unknown Author" : book.author}
                </p>
                <div className="text-center text-green-600 font-semibold mt-2">
                  {Number(book.price) // Check if it's a valid number after parsing
                    ? (Number(book.price) / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    : "Price N/A"}
                </div>
                <div className="flex justify-center mt-2">
                  <Link
                    href={`/reader/home/book-details/${book.id}`} // Ensure this matches your BookDetails page path
                    className="block text-sm text-red-600 mt-2 hover:underline"
                  >
                    View details
                  </Link>
                  <BuyButton
                    bookId={book.id}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Buy now
                  </BuyButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import BuyButton from "@/components/reader/BuyButton";
import ReviewForm from "@/components/ReviewForm";
import ReviewCard from "@/components/ReviewCard";

// ✅ import our API helper
import { getBookBySlug } from "@/utils/bookApi";

const DUMMY_JWT_TOKEN = "YOUR_JWT_TOKEN_HERE";
const CURRENT_LOGGED_IN_USER_ID = "SOME_CURRENT_USER_ID";

export default function BookDetails() {
  const params = useParams();
  // const bookSlug = params.slug;
  const bookSlug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  const router = useRouter();

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (!bookSlug) {
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const jsonResponse = await getBookBySlug(bookSlug, DUMMY_JWT_TOKEN);
         console.log("Book details response:", jsonResponse);

        if (!jsonResponse) {
          setError("Book data not found.");
          return;
        }

        setBookData({
          ...jsonResponse,
          unique_book_id: jsonResponse.id,
        });
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookSlug]);

  // ---- Review Handlers ----
  const handleReviewCreated = (newReview) => {
    setBookData((prev) =>
      prev
        ? {
            ...prev,
            reviews: [...(prev.reviews || []), newReview],
            reviews_count: (prev.reviews_count || 0) + 1,
          }
        : prev
    );
    setIsReviewModalOpen(false);
  };

  const handleReviewDeleted = (deletedReviewId) => {
    setBookData((prev) =>
      prev
        ? {
            ...prev,
            reviews: (prev.reviews || []).filter(
              (review) => review.id !== deletedReviewId
            ),
            reviews_count: (prev.reviews_count || 0) - 1,
          }
        : prev
    );
  };

  // ---- Loading & Error States ----
  if (loading)
    return <div className="text-center py-20">Loading book details...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  if (!bookData)
    return <div className="text-center py-20">No book data available.</div>;

  // ---- Book Data ----
const {
  title,
  description,
  ebook_price,
  cover_image_url,
  total_pages,
  categories,
  author,
  average_rating,
  reviews,
  reviews_count,
  ebook_file_size_human: size,
  publication_date
} = bookData;

  const authorName = author?.name?.trim() || "Unknown Author";
  const displayPrice = ebook_price ? `$ ${(ebook_price).toFixed(2)}` : "N/A";
  const displayGenre = categories?.length ? categories[0].main : "N/A";
  const displayPublicationDate = publication_date
    ? new Date(publication_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  const displayLength = total_pages ? `${total_pages} Pages` : "N/A";
  const displaySize = size ? `${size}` : "N/A";
  const displayRating = average_rating
    ? "★".repeat(Math.round(average_rating)) +
      "☆".repeat(5 - Math.round(average_rating))
    : "No ratings yet";

  return (
    <div className="space-y-10 px-4 sm:px-6 py-10 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="mx-auto md:mx-0">
          <Image
            src={cover_image_url || "/images/placeholder.png"}
            alt={title || "Book cover"}
            width={200}
            height={300}
            className="rounded object-cover w-full max-w-[200px] h-auto"
          />
        </div>
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
          <p className="text-gray-700">{authorName}</p>
          <div className="text-red-600 text-lg">
            {displayRating} ({reviews_count || 0} Ratings)
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <p
              className="bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
              onClick={() => router.push("/reader/sign_up")}
            >
              Read Now
            </p>
            <p
              className="bg-green-500 hover:bg-green-700 cursor-pointer text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
              onClick={() => router.push("/reader/sign_up")}
            >
              Write a Review
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <section>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          Book’s Description
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {description || "No description available."}
        </p>
      </section>

      {/* Book Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center border-t border-b py-4">
        <div>
          <strong>GENRE</strong>
          <p>{displayGenre}</p>
        </div>
        <div>
          <strong>PUBLICATION DATE</strong>
          <p>{displayPublicationDate}</p>
        </div>
        <div>
          <strong>LANGUAGE</strong>
          <p>English</p>
        </div>
        <div>
          <strong>LENGTH</strong>
          <p>{displayLength}</p>
        </div>
        <div>
          <strong>SIZE</strong>
          <p>{displaySize}</p>
        </div>
      </div>

      {/* Reviews */}
      <section>
        {reviews?.length ? (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Customer Reviews
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {reviews.map((review) => (
                <div className="min-w-[250px]" key={review.id}>
                  <ReviewCard
                    review={review}
                    currentUserIsOwner={
                      review.user_id === CURRENT_LOGGED_IN_USER_ID
                    }
                    onDeleteSuccess={handleReviewDeleted}
                    token={DUMMY_JWT_TOKEN}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </section>
    </div>
  );
}

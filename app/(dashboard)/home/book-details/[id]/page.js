"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
import { api } from "@/utils/auth/readerApi";
import axios from "axios";

import { useAuth } from "@/contexts/AuthContext";

export default function BookDetails() {
  const { isLoggedIn, userId: currentUserId, authToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const bookId = params.id;

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isTrialActive, setIsTrialActive] = useState(false);
  const [daysLeftInTrial, setDaysLeftInTrial] = useState(0);

  // Simulate trial logic (in future: move to context too)
  useEffect(() => {
    if (isLoggedIn) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 10); // Fake 10-day trial
      const today = new Date();
      const daysLeft = Math.ceil((trialEnd - today) / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        setIsTrialActive(true);
        setDaysLeftInTrial(daysLeft);
      } else {
        setIsTrialActive(false);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/books/${bookId}/storefront`);
        setBookData({
          ...response.data.data.attributes,
          unique_book_id: response.data.data.id,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("Book not found.");
          } else {
            setError(err.response?.data?.message || "Failed to fetch book.");
          }
        } else {
          setError("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleReadNow = useCallback(async () => {
    if (!isLoggedIn || !authToken || !currentUserId) {
      router.push("/reader/sign_up");
      return;
    }

    if (isTrialActive) {
      // console.log("reading_token beginning: ", reading_token);
      try {
        // Get purchase data from localStorage with proper error handling
        let purchaseData = {};
        let purchase_id = null;

        try {
          const storedData = localStorage.getItem("purchaseBook");
          if (storedData && storedData !== "[object Object]") {
            purchaseData = JSON.parse(storedData);
            purchase_id = purchaseData.id;
          }
        } catch (parseError) {
          console.warn(
            "Failed to parse purchase data from localStorage:",
            parseError
          );
          // Clear invalid data
          localStorage.removeItem("purchaseBook");
        }

        const tokenRes = await api.post(
          "/purchases/refresh_reading_token",
          {
            book_id: bookData.unique_book_id,
            content_type: "ebook",
            purchase_id: purchase_id,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("Full tokenRes:", tokenRes);
        const reading_token =
          tokenRes.data?.reading_token ||
          tokenRes.data?.data?.reading_token ||
          tokenRes.reading_token;
        console.log("reading_token", reading_token);

        if (!reading_token) {
          throw new Error("No reading token received from server");
        }

        const contentRes = await api.get(
          `/books/${bookData.unique_book_id}/content?direct_url=true`,
          {
            headers: {
              Authorization: `Bearer ${reading_token}`,
            },
          }
        );

        const content = contentRes.data;
        console.log("Full content response:", content);

        // Check if we have a PDF URL to open
        if (content?.url) {
          // Navigate to flipbook reader with the PDF URL (don't encode since it's already a valid URL)
          const urlParams = new URLSearchParams();
          urlParams.set('url', content.url);
          urlParams.set('title', bookData.title);
          
          router.push(`/reader/flipbook?${urlParams.toString()}`);
        } else if (content?.text) {
          // If it's text content, show in alert
          alert(
            `Reading "${bookData.title}":\n\n${content.text.substring(0, 200)}...`
          );
        } else {
          // Fallback - show available content structure
          const textContent =
            content?.content || JSON.stringify(content, null, 2);
          alert(
            `Reading "${bookData.title}":\n\n${textContent.substring(0, 200)}...`
          );
        }
      } catch (err) {
        console.error("Read error:", err);
        alert("Unable to read book. Please try again.");
      }
    } else {
      alert("Trial ended. Please purchase the book to continue reading.");
    }
  }, [bookData, isLoggedIn, authToken, currentUserId, isTrialActive, router]);

  const handleReviewCreated = useCallback((newReview) => {
    setBookData((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), newReview],
      reviews_count: (prev.reviews_count || 0) + 1,
    }));
    setIsReviewModalOpen(false);
  }, []);

  const handleReviewDeleted = useCallback((deletedId) => {
    setBookData((prev) => ({
      ...prev,
      reviews: (prev.reviews || []).filter((r) => r.id !== deletedId),
      reviews_count: (prev.reviews_count || 1) - 1,
    }));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;
  if (!bookData) return <div className="text-center py-20">No data.</div>;

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
    ebook_file_url,
    unique_book_id,
    created_at,
  } = bookData;

  console.log("Book Details inFo: ", bookData);

  const authorName = author?.name || "Unknown";
  const displayPrice = ebook_price
    ? `$${(ebook_price).toFixed(2)}`
    : "N/A";
  const displayGenre = categories?.[0]?.main || "N/A";
  const displayDate = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const displayRating =
    average_rating > 0
      ? "★".repeat(Math.round(average_rating)) +
        "☆".repeat(5 - Math.round(average_rating))
      : "No ratings yet";

  return (
    <div className="space-y-10 px-6 py-10">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Books
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={cover_image_url || "/images/placeholder.png"}
          alt={title}
          width={150}
          height={220}
          className="rounded object-cover"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-gray-700">{authorName}</p>
          <div className="text-red-600 text-lg">
            {displayRating} ({reviews_count || 0} Ratings)
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <Button onClick={handleReadNow}>
              {isLoggedIn
                ? isTrialActive
                  ? "Read Now (Trial)"
                  : "Purchase to Read"
                : "Read Now (Login)"}
            </Button>

            <BuyButton
              bookId={unique_book_id}
              className="bg-green-600 text-white"
            >
              Buy eBook ({displayPrice})
            </BuyButton>

            <Button variant="outline">Add to Wishlist</Button>

            {ebook_file_url && (
              <Button
                variant="secondary"
                onClick={() => window.open(ebook_file_url, "_blank")}
              >
                Read Sample
              </Button>
            )}

            <Dialog
              open={isReviewModalOpen}
              onOpenChange={setIsReviewModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" className="border">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Write a Review for "{title}"</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  bookId={unique_book_id}
                  onReviewCreated={handleReviewCreated}
                  token={authToken}
                  userId={currentUserId}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {isLoggedIn && isTrialActive && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center font-medium">
          🌟 You have {daysLeftInTrial} days left in your free trial! Read any
          book!
        </div>
      )}
      {isLoggedIn && !isTrialActive && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg text-center font-medium">
          ❗ Your trial has ended. Please purchase books to continue reading.
        </div>
      )}

      <section>
        <h3 className="text-xl font-semibold mb-2">Publisher’s Description</h3>
        <p className="text-gray-700 leading-relaxed">
          {description || "No description available."}
        </p>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center border-t border-b py-4">
        <div>
          <strong>GENRE</strong>
          <p>{displayGenre}</p>
        </div>
        <div>
          <strong>PUBLICATION DATE</strong>
          <p>{displayDate}</p>
        </div>
        <div>
          <strong>LANGUAGE</strong>
          <p>English</p>
        </div>
        <div>
          <strong>LENGTH</strong>
          <p>{total_pages} Pages</p>
        </div>
        <div>
          <strong>SIZE</strong>
          <p>409.4 kb</p>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {reviews?.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserIsOwner={review.user_id === currentUserId}
                onDeleteSuccess={handleReviewDeleted}
                token={authToken}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first!</p>
        )}
      </section>
    </div>
  );
}

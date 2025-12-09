"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import chunkText from "@/utils/chunkText";
import { api } from "@/utils/auth/readerApi";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function BookDetailsClient({ book }) {
  const router = useRouter();
  const { isLoggedIn, userId: currentUserId, authToken } = useAuth();

  const [bookData, setBookData] = useState(book);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [daysLeftInTrial, setDaysLeftInTrial] = useState(0);

  useEffect(() => {
    async function fetchTrialInfo() {
      if (!isLoggedIn || !authToken) return;
      try {
        let response;
        try {
          response = await api.get("/readers/profile", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        } catch {
          response = await api.get("/profile/me", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }
        const { trial_start, trial_end } = response.data.data || {};
        if (trial_start && trial_end) {
          const now = new Date();
          const end = new Date(trial_end);
          let daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
          setIsTrialActive(daysLeft > 0);
          setDaysLeftInTrial(daysLeft > 0 ? daysLeft : 0);
        }
      } catch {}
    }
    fetchTrialInfo();
  }, [isLoggedIn, authToken]);

  const startReading = useCallback(async () => {
    try {
      const tokenRes = await api.post(
        "/purchases/refresh_reading_token",
        { book_id: bookData.unique_book_id, content_type: "ebook" },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      const reading_token =
        tokenRes.data?.reading_token || tokenRes.data?.data?.reading_token;
      if (!reading_token) throw new Error("No reading token received");

      const contentRes = await api.get(
        `/books/${bookData.unique_book_id}/content?direct_url=true&optimize_for_frontend=true`,
        { headers: { Authorization: `Bearer ${reading_token}` } }
      );

      const content = contentRes.data;
      const fileUrl = content?.s3_url || content?.url;
      const format = content?.format || "unknown";

      if (fileUrl) {
        const params = new URLSearchParams({
          url: fileUrl,
          title: bookData.title,
          bookId: bookData.unique_book_id,
          format,
        });
        router.push(`/reader/flipbook?${params.toString()}`);
      }
    } catch (err) {
      alert("Unable to read book. " + err.message);
    }
  }, [authToken, router, bookData]);
  const handleReviewCreated = useCallback(
    (newReview) => {
      const processedReview = {
        ...newReview,
        id: newReview.id || `temp-${Date.now()}`,
        reader: {
          id: newReview.reader?.id || currentUserId,
          name: newReview.reader?.name || "You",
        },
      };

      setBookData((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), processedReview],
        reviews_count: (prev.reviews_count || 0) + 1,
      }));

      setIsReviewModalOpen(false);
    },
    [currentUserId]
  );

  const handleReviewDeleted = useCallback((id) => {
    setBookData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
      reviews_count: prev.reviews_count - 1,
    }));
  }, []);

  const {
    title,
    description,
    ebook_price,
    cover_image_url,
    total_pages,
    categories,
    author,
    average_rating,
    ebook_file_size_human,
    reviews,
    reviews_count,
    unique_book_id,
    created_at,
  } = bookData;

  const authorName = author?.name || "Unknown";
  const displayPrice = ebook_price ? `$${ebook_price.toFixed(2)}` : "N/A";
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
      <Link href="/home" className="text-blue-600 hover:underline">
        ← Back to home
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
            {displayRating} ({reviews_count} Ratings)
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {isLoggedIn && isTrialActive && (
              <Button onClick={startReading}>Read Now (Trial)</Button>
            )}

            <BuyButton
              bookId={unique_book_id}
              className="bg-green-600 text-white rounded-md px-2"
            >
              {isLoggedIn && !isTrialActive
                ? "Buy Now"
                : `Buy eBook (${displayPrice})`}
            </BuyButton>
            <Dialog
              open={isReviewModalOpen}
              onOpenChange={setIsReviewModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="ghost" className="border">
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent>
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

      {isTrialActive && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center font-medium">
          🌟 You have {daysLeftInTrial} days left in your free trial!
        </div>
      )}

      <section>
        <h3 className="text-xl font-semibold mb-2">Book’s Description</h3>
        <div className="text-gray-700 space-y-4">
          {description
            ? chunkText(description, 300).map((para, i) => (
                <p key={i}>{para}</p>
              ))
            : "No description available."}
        </div>
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
          <p>{ebook_file_size_human}</p>
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
                currentUserIsOwner={review.reader?.id === currentUserId}
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
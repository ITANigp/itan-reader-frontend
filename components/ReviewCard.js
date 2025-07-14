// components/ReviewCard.js
import React, { useState } from "react";
import { deleteReview } from "@/utils/bookApi"; // Adjust path
import { Card, CardContent } from "@/components/ui/card"; // Import Card components

// Add 'token' prop to the component
function ReviewCard({ review, currentUserIsOwner, onDeleteSuccess, token }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteReview(token, review.id); // Use the token passed as a prop
      if (onDeleteSuccess) {
        onDeleteSuccess(review.id);
      }
    } catch (err) {
      setError(err.message || "Failed to delete review.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card key={review.id} className="min-w-[300px]">
      <CardContent className="p-4 space-y-2">
        <p className="font-semibold">{review.title}</p>{" "}
        {/* Assuming review has a title */}
        <p className="text-sm text-gray-700">
          {review.comment || review.content}
        </p>{" "}
        {/* Use comment or content */}
        <div className="text-red-500">
          {"★".repeat(review.rating || 0)}
          {"☆".repeat(5 - (review.rating || 0))}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}{" "}
          by {review.user_name || "Anonymous"}
        </p>
        {currentUserIsOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </CardContent>
    </Card>
  );
}

export default ReviewCard;

// components/ReviewForm.js
import React, { useState } from "react";
import { createReview } from "@/utils/bookApi"; // Adjust path as needed

// Add 'token' prop to the component
function ReviewForm({ bookId, onReviewCreated, token }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const reviewData = {
      book_id: bookId,
    };
    if (rating !== "") {
      reviewData.rating = parseInt(rating);
    }
    if (comment.trim() !== "") {
      reviewData.comment = comment.trim();
    }

    if (rating === "" && comment.trim() === "") {
      setError("Please provide either a rating or a comment.");
      setLoading(false);
      return;
    }

    try {
      // Use the token passed as a prop
      const newReview = await createReview(token, reviewData);
      setSuccess(true);
      setRating("");
      setComment("");
      if (onReviewCreated) {
        onReviewCreated(newReview);
      }
    } catch (err) {
      setError(err.message || "Failed to create review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {" "}
      {/* Removed border/shadow as it's now in a dialog */}
      <div className="mb-4">
        <label
          htmlFor="rating"
          className="block text-sm font-medium text-gray-700"
        >
          Rating (1-5, optional):
        </label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Comment (optional):
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm mb-2">
          Review created successfully!
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 w-full"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default ReviewForm;

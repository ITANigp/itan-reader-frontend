import React, { useState, useEffect } from "react";
import { api } from "@/utils/auth/readerApi";

/**
 * LikeButton Component
 *
 * A reusable React component for liking and unliking a book.
 * It handles the UI state (liked/unliked, loading, error) and
 * interacts with the backend API.
 *
 * Props:
 * - bookId: The UUID of the book to like/unlike. (string, required)
 * - userToken: The JWT token of the authenticated user. (string | null, required)
 * If null, the button will prompt the user to log in.
 *
 * Usage:
 * <LikeButton bookId="some-book-uuid-123" userToken={yourUserJwtToken} />
 */
const LikeButton = ({ bookId, userToken }) => {
  // State to track if the current user has liked this book
  const [isLiked, setIsLiked] = useState(false);
  // State to store the ID of the 'like' record, needed for DELETE requests
  const [likeId, setLikeId] = useState(null);
  // State to manage loading status during API calls
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // useEffect to fetch the initial like status when the component mounts
  // or when bookId/userToken changes.
  useEffect(() => {
    const fetchInitialLikeStatus = async () => {
      if (!bookId) {
        setError("Book ID is missing.");
        setIsLoading(false);
        return;
      }

      // If no user token, we can't check like status for this user
      if (!userToken) {
        setIsLiked(false);
        setLikeId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // IMPORTANT: The GET /likes/:bookId endpoint should return a 200 OK
        // with the like data if found, or a 404 Not Found if not liked.
        const response = await api.get(`/likes/${bookId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        // If the request succeeds (Axios only resolves for 2xx status codes by default)
        if (response.status === 200) {
          const data = response.data; // Axios puts response data on .data property
          setIsLiked(true); // User has liked the book
          setLikeId(data.id); // Store the like ID for unliking
        }
      } catch (err) {
        // Axios errors have a 'response' object if it's an HTTP error
        if (err.response && err.response.status === 404) {
          // If the status endpoint returns 404, it means no like found
          setIsLiked(false); // User has NOT liked the book
          setLikeId(null); // No like ID to store
        } else {
          // Handle other errors (network issues, 401 Unauthorized, 5xx server errors, etc.)
          const errorMessage = err.response?.data?.message || err.message;
          setError(`Error fetching like status: ${errorMessage}`);
          console.error("Error fetching initial like status:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialLikeStatus();
  }, [bookId, userToken]); // Re-run effect if bookId or userToken changes

  // Function to handle the like/unlike toggle
  const handleLikeToggle = async () => {
    if (!userToken) {
      setError("Please log in to like or unlike a book.");
      return;
    }

    if (isLoading) return; // Prevent multiple clicks while an operation is in progress

    setIsLoading(true);
    setError(null);

    try {
      if (isLiked) {
        // User wants to UNLIKE the book (DELETE request)
        if (!likeId) {
          setError("Cannot unlike: Like ID is missing. Please refresh.");
          setIsLoading(false);
          return;
        }

        // CORRECTED: DELETE request should target the specific 'like' record by its ID
        const response = await api.delete(`/likes/${likeId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.status === 204 || response.status === 200) {
          // 204 No Content is common for successful DELETE
          setIsLiked(false);
          setLikeId(null); // Clear likeId as the like record no longer exists
          console.log("Book unliked successfully!");
        } else {
          // This else block might be redundant if Axios throws for non-2xx statuses
          const errorData = response.data;
          setError(
            `Failed to unlike book: ${errorData?.message || response.statusText || response.status}`
          );
          console.error("Failed to unlike book:", errorData);
        }
      } else {
        // User wants to LIKE the book (POST request)
        // CORRECTED: Pass the data payload directly as the second argument for Axios POST
        const response = await api.post(
          `/likes`,
          { book_id: bookId }, // Data payload for the request body
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          // 201 Created is common for successful POST
          const data = response.data;
          // Assuming your POST endpoint returns the newly created like's ID
          setIsLiked(true);
          setLikeId(data.id || data.like_id); // Use 'id' or 'like_id' based on backend response
          console.log("Book liked successfully!", data);
        } else {
          // This else block might be redundant if Axios throws for non-2xx statuses
          const errorData = response.data;
          setError(
            `Failed to like book: ${errorData?.message || response.statusText || response.status}`
          );
          console.error("Failed to like book:", errorData);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Network error: ${errorMessage}`);
      console.error("Network error during like/unlike:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the button/icon
  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={handleLikeToggle}
        disabled={isLoading || !userToken} // Disable if loading or not authenticated
        className={`
          relative p-1 rounded-full transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${
            isLiked
              ? "text-red-500 bg-red-100 hover:bg-red-200 focus:ring-red-500"
              : "text-gray-400 bg-gray-100 hover:bg-gray-200 focus:ring-gray-400"
          }
          ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        `}
        title={
          userToken
            ? isLiked
              ? "Unlike this book"
              : "Like this book"
            : "Log in to like"
        }
      >
        {isLoading ? (
          // Simple loading spinner (Tailwind CSS based)
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          // Heart icon (using a simple SVG for demonstration)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isLiked ? "red" : "none"} // Fill with red if liked, else none
            viewBox="0 0 24 24"
            stroke={isLiked ? "red" : "currentColor"} // Stroke with red if liked, else currentColor
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
      {!userToken && !isLoading && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Log in to like this book.
        </p>
      )}
    </div>
  );
};

export default LikeButton;

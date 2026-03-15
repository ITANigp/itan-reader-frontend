import React, { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/utils/auth/readerApi";
import { useAuth } from "@/contexts/AuthContext";
import { useLike } from "@/contexts/LikeContext";

const LikeButton = ({ bookId, onLikeChange, section = "default" }) => {
  const { authToken } = useAuth();
  const { likeCache, updateLikeStatus } = useLike();
  const [isLiked, setIsLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Only allow API calls from specific sections to prevent infinite loops
  const canFetchApi = section === "popular-trending" || section === "default";

  // Memoize the token to prevent unnecessary re-renders
  const memoizedToken = useMemo(() => authToken, [authToken]);

  // Get cached data for this book - don't memoize to ensure fresh cache checks
  const cachedData = likeCache[bookId];

  const fetchLikeStatus = useCallback(async () => {
    if (!canFetchApi) {
      // console.log(
      //   `LikeButton: [${section}] Fetch blocked - not authorized section`
      // );
      return;
    }

    // Check cache first before making API call
    const currentCachedData = likeCache[bookId];
    if (currentCachedData) {
      // console.log(
      //   `LikeButton: [${section}] Using cached data for ${bookId}`,
      //   currentCachedData
      // );
      setIsLiked(currentCachedData.isLiked);
      setLikeId(currentCachedData.likeId || currentCachedData.likeCount);
      setIsLoading(false);
      return;
    }

    // console.log(
    //   `LikeButton: [${section}] Fetching like status for book ${bookId}`
    // );
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/likes/${bookId}`, {
        headers: { Authorization: `Bearer ${memoizedToken}` },
      });

      // console.log(
      //   `LikeButton: [${section}] Response for ${bookId}:`,
      //   response.data
      // );

      if (response.status === 200) {
        const data = response.data;
        setIsLiked(true);
        setLikeId(data.id);

        // Update cache - use callback to prevent dependency issues
        updateLikeStatus(bookId, true, data.id);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Book not liked - this is normal
        setIsLiked(false);
        setLikeId(null);

        // Update cache
        updateLikeStatus(bookId, false, null);
      } else {
        const errorMessage = err.response?.data?.message || err.message;
        setError(`Error fetching like status: ${errorMessage}`);
        console.error("Error fetching initial like status:", err);
      }
    } finally {
      // console.log(`LikeButton: [${section}] Finished loading for ${bookId}`);
      setIsLoading(false);
    }
  }, [
    bookId,
    memoizedToken,
    canFetchApi,
    section,
    updateLikeStatus,
    likeCache,
  ]);

  // Initialize state ONLY when bookId changes - avoid cache dependency
  useEffect(() => {
    // console.log(`LikeButton: [${section}] useEffect triggered for ${bookId}`, {
    //   cachedData: !!cachedData,
    //   memoizedToken: !!memoizedToken,
    //   bookId,
    //   canFetchApi,
    // });

    if (canFetchApi && memoizedToken && bookId) {
      // Only fetch if this section is authorized and we have token and bookId
      // console.log(
      //   `LikeButton: [${section}] Checking for ${bookId} (authorized section)`
      // );
      fetchLikeStatus();
    } else if (!canFetchApi) {
      // Other sections wait for cache or show default state
      // console.log(`LikeButton: [${section}] Read-only mode for ${bookId}`);
      setIsLiked(false);
      setLikeId(null);
      setIsLoading(false);
    } else {
      // No token or bookId - set defaults
      setIsLiked(false);
      setLikeId(null);
      setIsLoading(false);
    }
  }, [bookId, memoizedToken]); // REMOVED cachedData and fetchLikeStatus to prevent loops

  // Separate effect to update from cache when available
  useEffect(() => {
    if (cachedData) {
      console.log(
        `LikeButton: [${section}] Cache updated for ${bookId}`,
        cachedData
      );
      setIsLiked(cachedData.isLiked);
      setLikeId(cachedData.likeId || cachedData.likeCount);
      setIsLoading(false);
    }
  }, [cachedData, bookId, section]); // Watch only cache changes

  // Remove the second useEffect completely to prevent loops

  const handleLikeToggle = useCallback(async () => {
    if (!memoizedToken) {
      setError("Please log in to like books");
      return;
    }

    if (isLoading) {
      // console.log(`LikeButton: Already loading for ${bookId}, skipping...`);
      return;
    }

    // console.log(
    //   `LikeButton: Toggle like for ${bookId}, current state: ${isLiked}`
    // );

    setIsLoading(true);
    setError(null);

    try {
      if (isLiked) {
        // Unlike
        if (!likeId) {
          setError("Cannot unlike: Like ID is missing. Please refresh.");
          setIsLoading(false);
          return;
        }

        // console.log(`LikeButton: Unliking ${bookId} with likeId ${likeId}`);
        const response = await api.delete(`/likes/${likeId}`, {
          headers: { Authorization: `Bearer ${memoizedToken}` },
        });

        if (response.status === 204 || response.status === 200) {
          setIsLiked(false);
          setLikeId(null);
          updateLikeStatus(bookId, false, null);
          // console.log(`LikeButton: Successfully unliked ${bookId}!`);
        }
      } else {
        // Like
        // console.log(`LikeButton: Liking ${bookId}`);
        const response = await api.post(
          "/likes",
          { book_id: bookId },
          { headers: { Authorization: `Bearer ${memoizedToken}` } }
        );

        if (response.status === 201 || response.status === 200) {
          const data = response.data;
          // console.log(`LikeButton: Like response for ${bookId}:`, data);

          const newLikeId = data.like_id || data.id;
          setIsLiked(true);
          setLikeId(newLikeId);
          updateLikeStatus(bookId, true, newLikeId);
          // console.log(
          //   `LikeButton: Successfully liked ${bookId}! ID: ${newLikeId}`
          // );
        }
      }

      onLikeChange?.(bookId, !isLiked);
    } catch (err) {
      console.error(
        `LikeButton: Error for ${bookId}:`,
        err.response?.status,
        err.message
      );
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Network error: ${errorMessage}`);
    } finally {
      // console.log(`LikeButton: Finished processing for ${bookId}`);
      setIsLoading(false);
    }
  }, [
    bookId,
    isLiked,
    likeId,
    memoizedToken,
    isLoading,
    onLikeChange,
    updateLikeStatus,
  ]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLikeToggle}
        disabled={!memoizedToken || isLoading}
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
          memoizedToken
            ? isLiked
              ? "Unlike this book"
              : "Like this book"
            : "Log in to like"
        }
      >
        {isLoading ? (
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isLiked ? "red" : "none"}
            viewBox="0 0 24 24"
            stroke={isLiked ? "red" : "currentColor"}
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
      {!memoizedToken && !isLoading && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Log in to like this book.
        </p>
      )}
    </div>
  );
};

export default LikeButton;

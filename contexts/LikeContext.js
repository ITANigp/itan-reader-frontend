"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getBatchLikeStatus } from "@/utils/bookApi";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [likeCache, setLikeCache] = useState({}); // { bookId: { isLiked, likeId } }
  const [loadingBooks, setLoadingBooks] = useState(new Set());

  const fetchBatchLikeStatus = useCallback(
    async (bookIds) => {
      if (!authToken || !bookIds.length) return;

      // Use functional update to access current cache without dependency
      setLikeCache((currentCache) => {
        const uncachedBooks = bookIds.filter((id) => !currentCache[id]);
        if (!uncachedBooks.length) return currentCache;

        setLoadingBooks((prev) => new Set([...prev, ...uncachedBooks]));

        // Perform async operation
        (async () => {
          try {
            const batchStatus = await getBatchLikeStatus(
              uncachedBooks,
              authToken
            );

            setLikeCache((prev) => ({
              ...prev,
              ...batchStatus,
            }));
          } catch (error) {
            console.error("Batch like status error:", error);
          } finally {
            setLoadingBooks((prev) => {
              const newSet = new Set(prev);
              uncachedBooks.forEach((id) => newSet.delete(id));
              return newSet;
            });
          }
        })();

        return currentCache; // Return unchanged cache from this update
      });
    },
    [authToken]
  );

  const updateLikeStatus = useCallback((bookId, isLiked, likeId) => {
    // ← Add likeId parameter
    setLikeCache((prev) => ({
      ...prev,
      [bookId]: { isLiked, likeId }, // ← Now likeId is properly defined
    }));
  }, []);

  return (
    <LikeContext.Provider
      value={{
        likeCache,
        fetchBatchLikeStatus,
        updateLikeStatus,
        loadingBooks,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLike must be used within a LikeProvider");
  }
  return context;
};

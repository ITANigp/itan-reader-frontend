import axios from "axios";
import { api } from "@/utils/auth/readerApi";

const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Refresh reading token for purchased book
 */
export async function refreshReadingToken(readerToken, purchaseId) {
  try {
    const response = await api.post(
      `/purchases/refresh_reading_token`,
      { purchase_id: purchaseId },
      { headers: { Authorization: `Bearer ${readerToken}` } }
    );

    return response.data.reading_token;
  } catch (error) {
    console.error("Error refreshing reading token:", error);
    throw error;
  }
}

/**
 * Fetch book content using a reading token
 */
export async function getBookContent(readingToken, bookId) {
  try {
    const response = await api.get(`/books/${bookId}/content`, {
      headers: { Authorization: `Bearer ${readingToken}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error accessing book content:", error);
    throw error;
  }
}

/**
 * Fetch all books
 */
export async function getAllBook() {
  try {
    const response = await axios.get(`${BASE_API}/books/`);
    console.log("Fetched All Books: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching All Books:", error);
    throw error;
  }
}

/**
 * Get like status for multiple books
 */
export async function getBatchLikeStatus(bookIds, userToken) {
  if (!userToken || !bookIds.length) return {};

  try {
    const response = await api.post(
      "/likes/batch_status",
      { book_ids: bookIds },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return response.data; // { book_id: like_status }
  } catch (error) {
    console.error("Error fetching batch like status:", error);
    return {};
  }
}

/**
 * Helper for authenticated API requests
 */
async function apiRequest(endpoint, method, token, data = null) {
  const config = {
    method,
    url: endpoint,
    headers: { Authorization: `Bearer ${token}` },
    data,
  };

  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      throw new Error(
        error.response.data.message ||
          `API Error: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      console.error("API Request Error:", error.request);
      throw new Error(
        "No response received from API. Please check your network or server."
      );
    } else {
      console.error("Axios Setup Error:", error.message);
      throw new Error(`Error setting up API request: ${error.message}`);
    }
  }
}

/**
 * Reviews API
 */
export async function createReview(token, reviewData) {
  return await apiRequest("reviews", "POST", token, { review: reviewData });
}

export async function deleteReview(token, reviewId) {
  return await apiRequest(`reviews/${reviewId}`, "DELETE", token);
}

export async function getBookReviews(token, bookId) {
  return await apiRequest(`books/${bookId}/reviews`, "GET", token);
}

/**
 * Fetch detailed book info by slug
 * Includes: description, publication_date, total_pages, size, reviews
 */
export async function getBookBySlug(bookSlug, token = null) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    // const response = await api.get(`/books/by-slug/${bookSlug}/`, { headers });
     const response = await api.get(`/books/by-slug/${encodeURIComponent(bookSlug)}`, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching book by slug:", error);
    throw error;
  }
}


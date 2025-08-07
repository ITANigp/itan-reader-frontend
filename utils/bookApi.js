import axios from "axios";
import { api } from "@/utils/auth/readerApi"

const BASE_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function refreshReadingToken(readerToken, purchaseId) {

  try {
    const response = await api.post(
      `/purchases/refresh_reading_token`,
      {
    
        headers: {
          Authorization: `Bearer ${readerToken}`
        },
        body: JSON.stringify({ purchase_id: purchaseId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to refresh reading token");
    }

    const data = await response.json();
    return data.reading_token;
  } catch (error) {
    console.error("Error refreshing reading token:", error);
    throw error;
  }
}

export async function getBookContent(readingToken, bookId) {
  try {
    const response = await api.get(`/books/${bookId}/content`, {
      headers: {
        Authorization: `Bearer ${readingToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to access book content");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error accessing book content:", error);
    throw error;
  }
}

// Get all the book

export async function getAllBook() {
  try {
    const response = await axios.get(`${BASE_API}/books/`);

    const data = response.data; // ✅ Correct for Axios
    console.log("Fetched All Books: ", data);

    return data;
  } catch (error) {
    console.error("Error fetching All Books:", error);
    throw error;
  }
}

// Batch like status
export const getBatchLikeStatus = async (bookIds, userToken) => {
  if (!userToken || !bookIds.length) return {};
  
  try {
    const response = await api.post('/likes/batch_status', 
      { book_ids: bookIds },
      { headers: { Authorization: `Bearer ${userToken}` }}
    );
    return response.data; // Returns { book_id: like_status }
  } catch (error) {
    console.error('Error fetching batch like status:', error);
    return {};
  }
};

// Api for Book Review

/**
 * Helper function for making authenticated API requests with Axios.
 * @param {string} endpoint - The API endpoint (e.g., 'reviews', 'reviews/some-uuid').
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'DELETE').
 * @param {string} token - The JWT token for authorization.
 * @param {object} [data=null] - The request body data for POST/PUT.
 * @returns {Promise<object>} - The response data.
 */
async function apiRequest(endpoint, method, token, data = null) {
  const config = {
    method: method,
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    // For POST/PUT, data goes into `data` property for axios
    data: data,
  };

  try {
    const response = await api.request(config);
    return response.data; // Axios wraps the actual response data in .data
  } catch (error) {
    // Axios error handling provides error.response for server errors
    if (error.response) {
      // Server responded with a status other than 2xx range
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      throw new Error(error.response.data.message || `API Error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Request Error:', error.request);
      throw new Error('No response received from API. Please check your network connection or API server status.');
    } else {
      // Something else happened while setting up the request
      console.error('Axios Setup Error:', error.message);
      throw new Error(`Error setting up API request: ${error.message}`);
    }
  }
}

/**
 * Creates a new review.
 * @param {string} token - The JWT token.
 * @param {object} reviewData - Object containing book_id, optional rating, and optional comment.
 * @returns {Promise<object>} - The created review object.
 */
export async function createReview(token, reviewData) {
  // Axios expects the body directly, not wrapped in { review: ... }
  // unless your backend specifically expects that nesting.
  // Based on your initial prompt, it seems it expects { "review": { ... } }
  return await apiRequest('reviews', 'POST', token, { review: reviewData });
}

/**
 * Deletes a review by its ID.
 * @param {string} token - The JWT token.
 * @param {string} reviewId - The UUID of the review to delete.
 * @returns {Promise<void>}
 */
export async function deleteReview(token, reviewId) {
  // Axios will resolve for 2xx status codes, and reject for others.
  // A 204 No Content response will result in response.data being empty.
  return await apiRequest(`reviews/${reviewId}`, 'DELETE', token);
}

// Example: Fetching reviews for a book
export async function getBookReviews(token, bookId) {
  // Assuming your API has an endpoint like GET /api/v1/books/:book_id/reviews
  return await apiRequest(`books/${bookId}/reviews`, 'GET', token);
}



import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_KEY = "access_token"; // consistent key name for JWT

// Enable axios debugging in development
const isDebug = process.env.NODE_ENV === "development";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// Add request interceptor for debugging (only in development)
if (isDebug) {
  api.interceptors.request.use(
    (request) => {
      // Don't log password data
      const logData =
        request.data && request.url.includes("sign_in")
          ? {
              ...request.data,
              reader: { ...request.data.reader, password: "[REDACTED]" },
            }
          : request.data;

      console.log("API Request:", {
        url: request.url,
        method: request.method,
        data: logData,
      });
      return request;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );
}

// Automatically redirect to sign-in if token is expired/invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      // Don't redirect during sign-in attempts
      !error.config.url.includes("/sign_in")
    ) {
      // Remove token and redirect to sign-in page
      localStorage.removeItem(TOKEN_KEY);
      if (typeof window !== "undefined") {
        window.location.href = "/reader/sign_in";
      }
    }
    return Promise.reject(error);
  }
);

// Helper to store token
const storeToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    console.warn("JWT token missing in response");
  }
};

// Helper to get token
// const getToken = () => {
//   return localStorage.getItem(TOKEN_KEY);
// };

// Register a reader
export const registerReader = async (
  email,
  password,
  password_confirmation,
  first_name,
  last_name,
  recaptcha_token // 🔹 added here
) => {
  try {
    const response = await api.post("/readers", {
      reader: {
        email,
        password,
        password_confirmation,
        first_name,
        last_name,
      },
      recaptcha_token, // 🔹 send captcha token
    });

    const token =
      response.data?.data?.token ||
      response.headers?.authorization?.split(" ")[1];
    storeToken(token);

    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data?.message || error.message || "Unknown error"
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
};


// Sign in a reader
export const signInReader = async (email, password, recaptcha_token) => {
  try {
    const response = await api.post("/readers/sign_in", {
      reader: { email, password, rememberable_options: true },
      recaptcha_token, // 🔹 include captcha in payload
    });

    const token =
      response.data?.data?.token ||
      response.headers?.authorization?.split(" ")[1];
    storeToken(token);

    return response.data;
  } catch (error) {
    // Only log details in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("Auth API response:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }

    // Standardize error handling - throw objects with type and message
    if (error?.response?.status === 401) {
      const errorMessage = error?.response?.data?.error || "";

      if (
        errorMessage.includes("Invalid Email or password") ||
        errorMessage.includes("no reader found") ||
        !error?.response?.data?.success
      ) {
        // Create a standardized error object
        throw {
          type: "USER_NOT_FOUND",
          message:
            "No account found with this email address. Please check your email or sign up.",
        };
      } else if (errorMessage.includes("confirm your email")) {
        throw {
          type: "EMAIL_NOT_CONFIRMED",
          message: "You need to confirm your email address before signing in.",
        };
      }
    }

    // For other errors
    throw {
      type: "AUTH_ERROR",
      message:
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Authentication failed. Please try again.",
      originalError: error, // Include the original error for debugging
    };
  }
};


// Get current logged-in reader profile
export const getReaderProfile = async (token) => {
  try {
    // const token = getToken();

    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await api.get("/readers/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch reader profile:",
      error.response?.data || error
    );
    throw error;
  }
};

// Create a new reader profile
export const createReaderProfile = async (profileData, profileImage) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await api.post(
      "/readers/profile",
      {
        reader: {
          ...profileData,
          profile_image: profileImage,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to create reader profile:",
      error.response?.data || error
    );
    throw error;
  }
};

// Update existing reader profile
export const updateReaderProfile = async (profileData, profileImage) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const response = await api.put(
      "/readers/profile",
      {
        reader: {
          ...profileData,
          profile_image: profileImage,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update reader profile:",
      error.response?.data || error
    );
    throw error;
  }
};

// Updated signOutReader function
export const signOutReader = async () => {
  try {
    // Get token before removing it for the request
    const token = getToken();

    // Make the API call with the token
    await api.delete("/readers/sign_out", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear all auth-related data
    localStorage.removeItem(TOKEN_KEY);

    // Clear any other reader-related data from localStorage
    // Add any other keys that might contain user state
    localStorage.removeItem("reader_profile");
    localStorage.removeItem("reader_settings");

    // If using sessionStorage for any reader data, clear that too
    sessionStorage.clear();

    // Force reload the application to reset all in-memory state
    // This ensures no lingering state from the previous user remains
    window.location.href = "/readers/sign_in";

    return { success: true };
  } catch (error) {
    console.error("Sign-out failed:", error.response?.data || error);

    // Even if the API call fails, clear local storage and redirect
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/readers/sign_in";

    throw error;
  }
};

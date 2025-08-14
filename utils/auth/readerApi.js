import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TOKEN_KEY = "access-token"; // consistent key name for JWT

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

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
  last_name
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
    });

    // Token might be in response.data.data.token OR in Authorization header
    const token =
      response.data?.data?.token || response.headers?.authorization?.split(" ")[1];
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
export const signInReader = async (email, password) => {
  try {
    const response = await api.post("/readers/sign_in", {
      reader: { email, password, rememberable_options: true },
    });

    const token =
      response.data?.data?.token || response.headers?.authorization?.split(" ")[1];
    storeToken(token);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error);
    throw error;
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
    console.error("Failed to fetch reader profile:", error.response?.data || error);
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
    console.error("Failed to create reader profile:", error.response?.data || error);
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
    console.error("Failed to update reader profile:", error.response?.data || error);
    throw error;
  }
};


// Sign out a reader
export const signOutReader = async () => {
  try {
    await api.delete("/readers/sign_out", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    localStorage.removeItem(TOKEN_KEY);
    return { success: true };
  } catch (error) {
    console.error("Sign-out failed:", error.response?.data || error);
    throw error;
  }
};

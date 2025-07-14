"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const id = localStorage.getItem("currentUserId");

    if (token && id) {
      setAuthToken(token);
      setUserId(id);
      setIsLoggedIn(true);
    } else {
      setAuthToken(null);
      setUserId(null);
      setIsLoggedIn(false);
    }
  }, []);

  const setAuth = (token, id) => {
    if (token && id) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUserId", id);
      setAuthToken(token);
      setUserId(id);
      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUserId");
    setAuthToken(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, authToken, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

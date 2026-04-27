"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [internalAccess, setInternalAccess] = useState(false);
  const [trialStart, setTrialStart] = useState(null);
  const [trialEnd, setTrialEnd] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const persistReaderSessionMeta = ({
    internalAccess: nextInternalAccess,
    trialStart: nextTrialStart,
    trialEnd: nextTrialEnd,
  } = {}) => {
    const normalizedInternalAccess = Boolean(nextInternalAccess);

    localStorage.setItem("internal_access", String(normalizedInternalAccess));

    if (nextTrialStart) {
      localStorage.setItem("trial_start", nextTrialStart);
    } else {
      localStorage.removeItem("trial_start");
    }

    if (nextTrialEnd) {
      localStorage.setItem("trial_end", nextTrialEnd);
    } else {
      localStorage.removeItem("trial_end");
    }

    setInternalAccess(normalizedInternalAccess);
    setTrialStart(nextTrialStart || null);
    setTrialEnd(nextTrialEnd || null);
  };

  useEffect(() => {
    localStorage.removeItem("reader_profile");

    const token = localStorage.getItem("access_token");
    const id = localStorage.getItem("currentUserId");
    const storedInternalAccess = localStorage.getItem("internal_access");
    const storedTrialStart = localStorage.getItem("trial_start");
    const storedTrialEnd = localStorage.getItem("trial_end");

    if (token && id) {
      setAuthToken(token);
      setUserId(id);
      setIsLoggedIn(true);

      if (storedInternalAccess === null) {
        localStorage.setItem("internal_access", "false");
        setInternalAccess(false);
      } else {
        setInternalAccess(storedInternalAccess === "true");
      }

      setTrialStart(storedTrialStart || null);
      setTrialEnd(storedTrialEnd || null);
    } else {
      setAuthToken(null);
      setUserId(null);
      setIsLoggedIn(false);
      setInternalAccess(false);
      setTrialStart(null);
      setTrialEnd(null);
    }

    setIsLoadingAuth(false);
  }, []);

  const setAuth = (token, id, metadata = {}) => {
    if (token && id) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("currentUserId", id);
      localStorage.removeItem("reader_profile");

      persistReaderSessionMeta(metadata);

      setAuthToken(token);
      setUserId(id);
      setIsLoggedIn(true);
    }
  };

  const setReaderAccessState = (metadata = {}) => {
    persistReaderSessionMeta(metadata);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUserId");
    localStorage.removeItem("internal_access");
    localStorage.removeItem("trial_start");
    localStorage.removeItem("trial_end");
    localStorage.removeItem("reader_profile");

    setAuthToken(null);
    setUserId(null);
    setIsLoggedIn(false);
    setInternalAccess(false);
    setTrialStart(null);
    setTrialEnd(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        authToken,
        internalAccess,
        trialStart,
        trialEnd,
        isLoadingAuth,
        setAuth,
        setReaderAccessState,
        logout,
      }}
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

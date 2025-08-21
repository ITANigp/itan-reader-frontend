// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const ProfileAuthProvider = ({ children }) => {
  const [reader, setReader] = useState(null); // Set after login

  return (
    <AuthContext.Provider value={{ reader, setReader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

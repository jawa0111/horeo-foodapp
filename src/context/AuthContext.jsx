import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginService,
  getProfile,
} from "../library/services/auth_service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user profile from backend
      getProfile()
        .then((response) => {
          setUser({ isAuthenticated: true, ...response.data });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      setUser({
        isAuthenticated: true,
        id: data.id,
        name: data.name,
        email: data.email,
        username: data.username,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

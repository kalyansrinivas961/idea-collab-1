import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";
import { normalizeUser } from "../utils/user.js";
import { toast } from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/users/me")
      .then((res) => {
        setUser(normalizeUser(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(normalizeUser(userData));
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("An error occurred during logout");
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => normalizeUser({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


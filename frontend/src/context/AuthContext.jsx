import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";
import { normalizeUser } from "../utils/user.js";

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
    localStorage.removeItem("token");
    setUser(null);
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


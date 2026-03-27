import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUserActivity } from "../hooks/useUserActivity.js";

const ProtectedRouteContent = ({ children }) => {
  // Use the activity hook here when the user is confirmed to be logged in
  useUserActivity();
  return children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-slate-500 mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <ProtectedRouteContent>{children}</ProtectedRouteContent>;
};

export default ProtectedRoute;


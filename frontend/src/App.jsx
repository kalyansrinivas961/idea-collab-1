import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AddIdeaPage from "./pages/AddIdeaPage.jsx";
import IdeasListPage from "./pages/IdeasListPage.jsx";
import IdeaDetailsPage from "./pages/IdeaDetailsPage.jsx";
import CollaborationRequestsPage from "./pages/CollaborationRequestsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import FollowersPage from "./pages/FollowersPage.jsx";
import FollowingPage from "./pages/FollowingPage.jsx";
import FollowRequestsPage from "./pages/FollowRequestsPage.jsx";
import SavedIdeasPage from "./pages/SavedIdeasPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotificationHistoryPage from "./pages/NotificationHistoryPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ReportDetailsPage from "./pages/ReportDetailsPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import QAListPage from "./pages/QAListPage.jsx";
import PostProblemPage from "./pages/PostProblemPage.jsx";
import ProblemDetailPage from "./pages/ProblemDetailPage.jsx";
import SharedIdeaPage from "./pages/SharedIdeaPage.jsx";
import SharingHistoryPage from "./pages/SharingHistoryPage.jsx";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-ideas"
            element={
              <ProtectedRoute>
                <SavedIdeasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/follow-requests"
            element={
              <ProtectedRoute>
                <FollowRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followers"
            element={
              <ProtectedRoute>
                <FollowersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <FollowingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ideas"
            element={
              <ProtectedRoute>
                <IdeasListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ideas/new"
            element={
              <ProtectedRoute>
                <AddIdeaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ideas/:id"
            element={
              <ProtectedRoute>
                <IdeaDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/share/:token" element={<SharedIdeaPage />} />
          <Route
            path="/sharing-history"
            element={
              <ProtectedRoute>
                <SharingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa"
            element={
              <ProtectedRoute>
                <QAListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa/post"
            element={
              <ProtectedRoute>
                <PostProblemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qa/problem/:id"
            element={
              <ProtectedRoute>
                <ProblemDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaborations"
            element={
              <ProtectedRoute>
                <CollaborationRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <ReportDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

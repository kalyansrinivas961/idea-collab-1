# IdeaCollab-Idea Sharing And Collaboration Platform

## Frontend

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>IdeaCollab</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body class="bg-slate-50">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### package.json

```json
{
  "name": "ideacollab-frontend",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-oauth/google": "^0.13.4",
    "axios": "^1.7.2",
    "clsx": "^2.1.1",
    "emoji-picker-react": "^4.17.1",
    "framer-motion": "^12.36.0",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.577.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hot-toast": "^2.6.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^6.23.1",
    "socket.io-client": "^4.8.3",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@vitejs/plugin-react-swc": "^3.7.0",
    "autoprefixer": "^10.4.19",
    "jsdom": "^27.4.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.21",
    "vitest": "^4.0.18"
  }
}
```

### postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### tailwind.config.js

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Listen on all addresses (0.0.0.0)
    allowedHosts: ["sherrie-nonmystical-maynard.ngrok-free.dev"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
```

### App.jsx

```jsx
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
```

### index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.dark body {
  background-color: #020617; /* slate-950 */
  color: #f8fafc; /* slate-50 */
}

@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .highlight-new {
    animation: highlightFade 3s ease-out forwards;
  }

  @keyframes highlightFade {
    0% {
      background-color: rgba(99, 102, 241, 0.15);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
    }
    100% {
      background-color: transparent;
      box-shadow: 0 0 0 0px transparent;
    }
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

### main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
```

### AIChatBox.jsx

```jsx
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const AIChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Hide AI Chatbox on messages page to avoid overlap with chat input
  if (window.location.pathname.startsWith("/messages")) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm your IdeaCollab AI assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Prepare history for Gemini (alternating user/model roles)
      const formattedHistory = chatHistory.slice(-10); // Keep last 10 exchanges

      const { data } = await api.post("/ai/chat", {
        message: userMessage.text,
        history: formattedHistory,
      });

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update history for next exchange
      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userMessage.text }] },
        { role: "model", parts: [{ text: data.response }] },
      ]);
    } catch (err) {
      console.error("AI Chat error:", err);
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.message ||
        "Sorry, I encountered an error processing your request. Please try again later.";
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `**Error:** ${errorMsg}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed right-6 md:right-8 z-50 flex flex-col items-end transition-all duration-300 ${
        user ? "bottom-20 md:bottom-8" : "bottom-6 md:bottom-8"
      }`}
    >
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[calc(100vw-48px)] sm:w-96 h-[500px] max-h-[70vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  AI Assistant
                </h3>
                <p className="text-indigo-100 text-[10px] uppercase tracking-wider font-medium">
                  Powered by Groq
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none prose prose-slate prose-sm dark:prose-invert"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800">
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 dark:border dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all placeholder:text-slate-400 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-slate-800 dark:bg-slate-700 text-white rotate-90"
            : "bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white"
        }`}
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatBox;
```

### CommentSection.jsx

```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import VoiceInput from "./VoiceInput";

const CommentSection = ({ idea, onUpdate }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVoiceTranscript = (transcript) => {
    setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      // The socket event will handle the update, but we can also optimistically update
      // or just wait for the socket if we prefer.
      // However, the previous implementation relied on the response data.
      // If the response data (comments array) is missing populated fields, it might cause issues.
      // Ideally, we rely on the socket for the "full" update, or we ensure the API returns full data.

      const { data } = await api.post(`/ideas/${idea._id}/comments`, { text });

      // If we are using socket, we might not strictly need this if the socket is fast enough.
      // But to be responsive, we update local state.
      // Ensure data (comments) has user details if possible.
      // If not, we might see a flash of "Unknown User" until socket update arrives.

      onUpdate({ ...idea, comments: data });
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete comment?")) return;
    try {
      const { data } = await api.delete(
        `/ideas/${idea._id}/comments/${commentId}`,
      );
      onUpdate({ ...idea, comments: data });
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mt-4 transition-colors">
      <h2 className="font-semibold text-slate-800 dark:text-white mb-4">
        Comments ({idea.comments?.length || 0})
      </h2>

      {/* Comment List */}
      <div className="space-y-6 mb-6">
        {idea.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
              {comment.user?.avatarUrl ? (
                <img
                  src={comment.user.avatarUrl}
                  alt={comment.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {comment.user?.name?.charAt(0) || "?"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-slate-900 dark:text-white">
                    {comment.user?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
              {user &&
                (user._id === comment.user?._id ||
                  user._id === idea.owner?._id) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-xs text-red-500 mt-1 hover:underline"
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        ))}
        {(!idea.comments || idea.comments.length === 0) && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No comments yet.
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      {!user ? (
        <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400">
          Please{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium"
          >
            login
          </Link>{" "}
          to join the discussion.
        </div>
      ) : (
          idea.canComment !== undefined
            ? idea.canComment
            : idea.allowedCommenters !== "none" || user._id === idea.owner?._id
        ) ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {user?.name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 dark:border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition dark:text-white resize-none pr-20"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute right-2 top-2 flex items-center">
              <VoiceInput onTranscript={handleVoiceTranscript} />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full disabled:opacity-50 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400">
          Comments are turned off for this post.
        </div>
      )}
    </div>
  );
};

export default CommentSection;
```

### ConfirmationModal.jsx

```jsx
import React from "react";
import { AlertCircle, X } from "lucide-react";

/**
 * A reusable confirmation modal component for critical actions.
 *
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Title of the modal
 * @param {string} message - Main description/question for the user
 * @param {string} confirmText - Text for the primary action button
 * @param {string} cancelText - Text for the cancel button
 * @param {function} onConfirm - Callback when the primary action is clicked
 * @param {function} onCancel - Callback when the modal is closed or cancelled
 * @param {boolean} isDanger - If true, the primary action button will be red
 * @param {boolean} isLoading - If true, shows a spinner on the primary button
 */
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-transparent dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${isDanger ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"}`}
            >
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-[1.5] px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 shadow-red-100 dark:shadow-none"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
```

### DashboardStats.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const DashboardStats = () => {
  const { user } = useAuth();
  const [ideaCount, setIdeaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user's ideas to get the count
      api
        .get(`/ideas/user/${user._id}`)
        .then((res) => {
          setIdeaCount(res.data.length);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch idea count", err);
          setLoading(false);
        });
    }
  }, [user]);

  const stats = [
    {
      label: "Ideas Shared",
      value: loading ? "-" : ideaCount,
      icon: (
        <svg
          className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      bg: "bg-indigo-50 dark:bg-indigo-900/30",
    },
    {
      label: "Saved Ideas",
      value: user?.savedIdeas?.length || 0,
      icon: (
        <svg
          className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      ),
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
    },
    {
      label: "Followers",
      value: user?.followers?.length || 0,
      icon: (
        <svg
          className="w-6 h-6 text-purple-600 dark:text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      bg: "bg-purple-50 dark:bg-purple-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors"
        >
          <div className={`p-3 rounded-lg ${stat.bg}`}>{stat.icon}</div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
```

### Footer.jsx

```jsx
import React from "react";
import { Link } from "react-router-dom";
import { getLegalConfig } from "../config/legal.js";

const Footer = ({ locale }) => {
  const year = new Date().getFullYear();
  const cfg = getLegalConfig(locale);

  // Hide footer on chat page to maximize space
  if (window.location.pathname.startsWith("/messages")) return null;

  return (
    <footer
      role="contentinfo"
      aria-label="Legal and regulatory information"
      className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 py-8 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              IC
            </span>
            <span className="font-bold text-slate-800 dark:text-white tracking-tight">
              IdeaCollab
            </span>
          </div>

          <nav
            aria-label="Legal"
            className="flex flex-wrap justify-center gap-x-8 gap-y-2"
          >
            <Link
              to="/terms"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {cfg.tosLabel}
            </Link>
            <Link
              to="/privacy"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {cfg.privacyLabel}
            </Link>
          </nav>

          <div className="text-sm font-medium text-slate-400 dark:text-slate-500">
            &copy; {year} {cfg.companyName}. {cfg.copyrightPrefix}
          </div>
        </div>
        {cfg.regulatoryDisclosure && (
          <p
            className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left"
            aria-label="Regulatory disclosure"
          >
            {cfg.regulatoryDisclosure}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
```

### Layout.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  User,
  Menu,
  X,
  LayoutDashboard,
  PlusSquare,
  Lightbulb,
  Users,
  HelpCircle,
  Handshake,
  UserPlus,
  LogOut,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import toast from "react-hot-toast";
import AIChatBox from "./AIChatBox";
import Footer from "./Footer.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
import { getNotificationUrl } from "../utils/notification";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [followRequestCount, setFollowRequestCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchUnreadMessageCount = () => {
    api
      .get("/messages/unread-count")
      .then((res) => setUnreadMessageCount(res.data.count))
      .catch((err) =>
        console.error("Failed to fetch unread message count", err),
      );
  };

  const fetchUnreadNotifCount = () => {
    api
      .get("/notifications/unread-count")
      .then((res) => setUnreadNotifCount(res.data.count))
      .catch((err) =>
        console.error("Failed to fetch unread notification count", err),
      );
  };

  const fetchPendingCount = () => {
    api
      .get("/collaborations/requests/pending-count")
      .then((res) => setPendingCount(res.data.count))
      .catch((err) => console.error("Failed to fetch notification count", err));
  };

  const fetchFollowRequestCount = async () => {
    try {
      const res = await api.get("/users/follow-requests/pending");
      setFollowRequestCount(res.data.length);
    } catch (err) {
      console.error("Failed to fetch follow request count", err);
    }
  };

  useEffect(() => {
    if (user) {
      socket.emit("join", user._id);
      fetchUnreadMessageCount();
      fetchUnreadNotifCount();
      fetchPendingCount();
      fetchFollowRequestCount();

      const handleNewRequest = () => {
        setPendingCount((prev) => prev + 1);
      };

      const handleChatMessage = (message) => {
        // Instant Message Notification
        // Only show toast if NOT on the ChatPage or NOT viewing this specific conversation
        const isChatPage = window.location.pathname === "/messages";
        // We can't easily know the selectedUser in Layout without complex state sharing,
        // but we can at least show notifications when not on the ChatPage.

        if (!isChatPage) {
          const toastOptions = {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: "12px",
              background: "#1e293b", // Slate-800
              color: "#fff",
              fontSize: "14px",
              maxWidth: "350px",
              padding: "12px",
              border: "1px solid rgba(99, 102, 241, 0.2)", // Indigo border
            },
          };

          const content = (
            <div className="flex items-center gap-3">
              <img
                src={
                  message.sender.avatarUrl || "https://via.placeholder.com/40"
                }
                alt={message.sender.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-0.5">
                  {message.conversationId ? "Group Message" : "New Message"}
                </p>
                <p className="font-semibold text-sm truncate">
                  {message.sender.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {message.content ||
                    (message.attachment ? "Sent an attachment" : "New message")}
                </p>
              </div>
              <Link
                to="/messages"
                onClick={() => toast.dismiss()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-sm"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </Link>
            </div>
          );

          toast(content, toastOptions);
        }

        setUnreadMessageCount((prev) => prev + 1);
      };

      const handleNewNotification = (data) => {
        // Instant Toast Notification with Sub-second Latency
        const toastOptions = {
          duration: 5000,
          position: "top-right",
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
            fontSize: "14px",
            maxWidth: "400px",
            padding: "16px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        };

        const content = (
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                data.type === "success"
                  ? "bg-emerald-500"
                  : data.type === "error"
                    ? "bg-red-500"
                    : data.type === "warning"
                      ? "bg-amber-500"
                      : "bg-indigo-500"
              }`}
            >
              {data.type === "success" && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {data.type === "error" && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {(data.type === "info" || !data.type) && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight mb-1">
                {data.title || "New Notification"}
              </p>
              <p className="text-xs text-slate-300 leading-normal">
                {data.message}
              </p>
              <div className="mt-2 flex gap-2">
                <Link
                  to={getNotificationUrl(data)}
                  onClick={() => toast.dismiss()}
                  className="text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition"
                >
                  View Details
                </Link>
                <button
                  onClick={() => toast.dismiss()}
                  className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        );

        if (data.type === "success") toast.success(content, toastOptions);
        else if (data.type === "error") toast.error(content, toastOptions);
        else toast(content, toastOptions);

        setUnreadNotifCount((prev) => prev + 1);
      };

      const handleFollowRequest = () => {
        setFollowRequestCount((prev) => prev + 1);
        toast.info("New follow request received", {
          icon: "👤",
          duration: 4000,
        });
      };

      const handleMessagesRead = () => {
        fetchUnreadMessageCount();
      };

      const handleFollowProcessed = () => {
        fetchFollowRequestCount();
      };

      socket.on("collaboration:request", handleNewRequest);
      socket.on("chat:message", handleChatMessage);
      socket.on("notification:new", handleNewNotification);
      socket.on("follow:request", handleFollowRequest);
      window.addEventListener("messages:read", handleMessagesRead);
      window.addEventListener("follow:processed", handleFollowProcessed);

      return () => {
        socket.off("collaboration:request", handleNewRequest);
        socket.off("chat:message", handleChatMessage);
        socket.off("notification:new", handleNewNotification);
        socket.off("follow:request", handleFollowRequest);
        window.removeEventListener("messages:read", handleMessagesRead);
        window.removeEventListener("follow:processed", handleFollowProcessed);
      };
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-slate-950">
      <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2"
            aria-label="IdeaCollab Home"
          >
            <span className="h-8 w-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
              IC
            </span>
            <span className="font-semibold text-lg text-slate-800 dark:text-white">
              IdeaCollab
            </span>
          </Link>
          {user && (
            <div className="flex items-center gap-2 md:gap-6">
              <nav
                className="hidden md:flex items-center gap-4 text-sm"
                aria-label="Desktop Navigation"
              >
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/ideas"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                  }
                >
                  Ideas
                </NavLink>
                <NavLink
                  to="/qa"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                  }
                >
                  Q&A
                </NavLink>
                <NavLink
                  to="/collaborations"
                  className={({ isActive }) =>
                    `flex items-center font-medium transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"}`
                  }
                >
                  Collaborations
                  {pendingCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              </nav>
              <div className="flex items-center gap-1 md:gap-3">
                <NavLink
                  to="/notifications"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center relative p-2 min-w-[44px] min-h-[44px] justify-center transition-colors"
                  title="Notifications"
                  aria-label={`${unreadNotifCount} unread notifications`}
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                      {unreadNotifCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/messages"
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center relative p-2 min-w-[44px] min-h-[44px] justify-center transition-colors"
                  title="Messages"
                  aria-label={`${unreadMessageCount} unread messages`}
                >
                  <MessageSquare className="w-6 h-6" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                      {unreadMessageCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/profile"
                  className="hidden md:flex text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 min-w-[44px] min-h-[44px] justify-center items-center transition-colors"
                  title="Profile"
                  aria-label="My Profile"
                >
                  <User className="w-6 h-6" />
                </NavLink>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="hidden md:flex text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 min-w-[44px] min-h-[44px] justify-center items-center transition-colors"
                    title="Admin Dashboard"
                    aria-label="Admin Dashboard"
                  >
                    <ShieldCheck className="w-6 h-6" />
                  </NavLink>
                )}
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="hidden md:flex text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 min-w-[44px] min-h-[44px] justify-center items-center transition-colors"
                  title="Logout"
                  aria-label="Logout Account"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Sidebar Overlay */}
      {user && (
        <div
          className={`md:hidden fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-white">
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white min-w-[44px] min-h-[44px]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav
              className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]"
              aria-label="Mobile Sidebar Navigation"
            >
              <NavLink
                to="/ideas/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`
                }
              >
                <PlusSquare className="w-5 h-5" />
                Add Idea
              </NavLink>
              <NavLink
                to="/collaborations"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                }
              >
                <div className="flex items-center gap-3">
                  <Handshake className="w-5 h-5" />
                  Collaborations
                </div>
                {pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/follow-requests"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                }
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5" />
                  Follow Requests
                </div>
                {followRequestCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {followRequestCount}
                  </span>
                )}
              </NavLink>
              <div className="pt-4 mt-4 border-t dark:border-slate-800">
                <NavLink
                  to="/followers"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                  }
                >
                  <Users className="w-5 h-5" />
                  Followers
                </NavLink>
                <NavLink
                  to="/following"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                  }
                >
                  <UserPlus className="w-5 h-5" />
                  Following
                </NavLink>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`
                    }
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Moderation
                  </NavLink>
                )}
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-8"
              >
                <LogOut className="w-5 h-5" />
                Logout Account
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {user && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex items-center justify-around px-2 py-1 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] transition-colors duration-300"
          aria-label="Mobile Bottom Navigation"
        >
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`
            }
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              Home
            </span>
          </NavLink>
          <NavLink
            to="/ideas"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`
            }
          >
            <Lightbulb className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              Ideas
            </span>
          </NavLink>
          <NavLink
            to="/qa"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`
            }
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              Q&A
            </span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[64px] min-h-[56px] transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`
            }
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              Profile
            </span>
          </NavLink>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] transition-colors ${isMobileMenuOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
            aria-label="More options"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              More
            </span>
          </button>
        </nav>
      )}

      <main
        className={`flex-1 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 ${window.location.pathname.startsWith("/messages") ? "p-0" : ""} ${user ? "pb-[64px] md:pb-0" : ""}`}
      >
        <div
          className={`${window.location.pathname.startsWith("/messages") ? "max-w-full px-0 py-0 h-full" : "max-w-6xl mx-auto px-4 py-6"}`}
        >
          {children}
        </div>
      </main>
      <Footer />
      <AIChatBox />

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access your ideas and collaborations."
        confirmText="Logout"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default Layout;
```

### LikeButton.jsx

```jsx
import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const LikeButton = ({ idea }) => {
  const { user } = useAuth();

  const [likes, setLikes] = useState(idea.likes || []);

  useEffect(() => {
    setLikes(idea.likes || []);
  }, [idea.likes]);

  const likesCount = likes.length;
  const hasLiked = user && likes.includes(user._id);

  const handleToggleLike = async (e) => {
    e.stopPropagation(); // Prevent navigating if inside a clickable card
    if (!user) {
      alert("Please login to like");
      return;
    }
    try {
      const { data } = await api.put(`/ideas/${idea._id}/like`);
      setLikes(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
        hasLiked
          ? "bg-rose-50 border-rose-200 text-rose-600"
          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
      }`}
      title={hasLiked ? "Unlike" : "Like"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={hasLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span className="text-xs font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
```

### ProtectedRoute.jsx

```jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-slate-500 mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### RecommendedUsers.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const RecommendedUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/search") // Empty query returns all/some users
      .then((res) => {
        // Filter out current user and take top 3
        const others = res.data.filter((u) => u._id !== user?._id).slice(0, 3);
        setUsers(others);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch recommended users", err);
        setLoading(false);
      });
  }, [user]);

  if (loading || users.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 dark:text-white">
          Who to follow
        </h2>
        <Link
          to="/users"
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u._id} className="flex items-center gap-3">
            <Link to={`/users/${u._id}`}>
              <img
                src={u.avatarUrl || "https://via.placeholder.com/150"}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/users/${u._id}`}
                className="block truncate font-medium text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
              >
                {u.name}
              </Link>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {u.headline || u.role || "Member"}
              </p>
            </div>
            {/* Could add a follow button here later */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedUsers;
```

### ReportModal.jsx

```jsx
import React, { useState } from "react";
import api from "../api/client";

const ReportModal = ({ ideaId, onClose, onReportSuccess, isOpen }) => {
  const [category, setCategory] = useState("spam");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (context.length < 500) {
      setError(
        `Context must be at least 500 characters. Current length: ${context.length}`,
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/reports", {
        ideaId,
        category,
        context,
      });
      setReferenceNumber(res.data.referenceNumber);
      if (onReportSuccess) onReportSuccess(res.data.referenceNumber);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (referenceNumber) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm shadow-emerald-100 dark:shadow-none">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">
            Report Received
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">
            Thank you for helping us keep IdeaCollab safe. Your report has been
            submitted to our moderation team.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 mb-8 transition-colors">
            <span className="text-[10px] text-slate-500 dark:text-slate-500 block uppercase tracking-[0.2em] font-black mb-2">
              Reference Number
            </span>
            <span className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
              {referenceNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 dark:bg-indigo-600 text-white rounded-xl py-3.5 font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">
            Report Content
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Reason for Reporting
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none"
              >
                <option value="spam">Spam / Deceptive content</option>
                <option value="harassment">Harassment / Hate speech</option>
                <option value="misinformation">Misinformation</option>
                <option value="illegal">Illegal content / Activities</option>
                <option value="copyright">Copyright violation</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Additional Context
              </label>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${context.length < 500 ? "text-slate-400" : "text-emerald-500"}`}
              >
                {context.length} / 500 characters
              </span>
            </div>
            <textarea
              required
              rows="6"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Please provide detailed information about why this content should be removed. (Minimum 500 characters)"
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white resize-none"
            />
            <div className="mt-3 flex gap-2 items-start text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed italic">
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Your report will be reviewed by our moderation team. Abuse of
                the reporting system may result in account suspension.
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || context.length < 500}
              className="px-8 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-red-100 dark:shadow-none active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
```

### SaveButton.jsx

```jsx
import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const SaveButton = ({ idea }) => {
  const { user, updateUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.savedIdeas) {
      setIsSaved(user.savedIdeas.includes(idea._id));
    }
  }, [user, idea._id]);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to save ideas");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put(`/users/saved-ideas/${idea._id}`);
      // data is the updated array of saved idea IDs
      updateUser({ savedIdeas: data });
      setIsSaved(data.includes(idea._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
        isSaved
          ? "bg-indigo-50 border-indigo-200 text-indigo-600"
          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
      }`}
      title={isSaved ? "Unsave" : "Save"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span className="text-xs font-medium">{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default SaveButton;
```

### UserList.jsx

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client.js";
import socket from "../api/socket.js";

const UserList = ({ users, type, onRemove }) => {
  const handleAction = async (targetUserId, name) => {
    const actionText =
      type === "followers" ? "remove this follower" : "unfollow this user";
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    try {
      const endpoint =
        type === "followers"
          ? `/users/${targetUserId}/follower`
          : `/users/${targetUserId}/unfollow`;

      await api.delete(endpoint);
      toast.success(
        type === "followers" ? "Follower removed" : `Unfollowed ${name}`,
      );
      if (onRemove) onRemove(targetUserId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
        No {type} yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 transition-colors"
        >
          <Link
            to={`/users/${user._id}`}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <div className="relative flex-shrink-0">
              <img
                src={
                  user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                }
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-white truncate transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
                {user.role || "Member"}
              </p>
            </div>
          </Link>

          <button
            onClick={() => handleAction(user._id, user.name)}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 transition-all min-h-[36px]"
          >
            {type === "followers" ? "Remove" : "Unfollow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
```

### UserListModal.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const UserListModal = ({ userId, type, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/users/${userId}/${type}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, type]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="p-5 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
            {type}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-300 dark:text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No {type} yet.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center gap-4 group">
                <Link
                  to={`/users/${user._id}`}
                  onClick={onClose}
                  className="relative flex-shrink-0"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                    }
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/users/${user._id}`}
                    onClick={onClose}
                    className="font-bold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block truncate transition-colors"
                  >
                    {user.name}
                  </Link>
                  {user.headline ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {user.headline}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-0.5">
                      {user.role || "Innovator"}
                    </p>
                  )}
                </div>
                <Link
                  to={`/users/${user._id}`}
                  onClick={onClose}
                  className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
```

### VoiceInput.jsx

```jsx
import React from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "../hooks/useVoiceToText";

const VoiceInput = ({ onTranscript, className = "" }) => {
  const { isListening, toggleListening, isSupported } =
    useVoiceToText(onTranscript);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-lg transition-all relative ${
        isListening
          ? "bg-red-100 text-red-600 animate-pulse"
          : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
      } ${className}`}
      title={isListening ? "Stop listening" : "Start voice-to-text"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInput;
```

### AddIdeaPage.jsx

```jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import EmojiPicker from "emoji-picker-react";
import VoiceInput from "../components/VoiceInput.jsx";

const AddIdeaPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    allowedCommenters: "anyone",
  });
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // AI Description Assistance States
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [descriptionHistory, setDescriptionHistory] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const suggestionTimeoutRef = useRef(null);
  const [aiUsageStats, setAiUsageStats] = useState({
    clicks: 0,
    accepted: 0,
    modes: {},
  });
  const [abVariant, setAbVariant] = useState(Math.random() > 0.5 ? "A" : "B");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Character limit check
    if (name === "description" && value.length > 2000) return;

    setForm({ ...form, [name]: value });

    // Real-time suggestions logic
    if (name === "description") {
      if (suggestionTimeoutRef.current)
        clearTimeout(suggestionTimeoutRef.current);

      if (value.length > 20 && value.length % 50 === 0) {
        // Trigger suggestions every 50 chars after initial 20
        suggestionTimeoutRef.current = setTimeout(() => {
          handleAISuggestion(value);
        }, 1500);
      } else {
        setAiSuggestion("");
      }
    }
  };

  const handleAISuggestion = async (text) => {
    try {
      const res = await api.post("/ai/enhance-description", {
        text,
        mode: "suggest",
        title: form.title,
        category: form.category,
      });
      setAiSuggestion(res.data.enhancedText);
    } catch (err) {
      console.error("AI Suggestion failed:", err);
    }
  };

  const handleVoiceTranscript = (field, transcript) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]} ${transcript}` : transcript,
    }));
    toast.success(`Transcribed to ${field}`);
  };

  const handleEnhance = async (mode) => {
    setIsAIProcessing(true);
    setShowAIMenu(false);
    setError("");

    // Track usage
    setAiUsageStats((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
      modes: { ...prev.modes, [mode]: (prev.modes[mode] || 0) + 1 },
    }));

    try {
      const res = await api.post("/ai/enhance-description", {
        text: form.description,
        mode,
        title: form.title,
        category: form.category,
      });

      const enhancedText = res.data.enhancedText;

      // Save history for revert
      setDescriptionHistory((prev) => [...prev, form.description]);

      setForm((prev) => ({ ...prev, description: enhancedText }));
    } catch (err) {
      setError("AI assistance failed. Please try again.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleRevert = () => {
    if (descriptionHistory.length > 0) {
      const lastDescription = descriptionHistory[descriptionHistory.length - 1];
      setForm((prev) => ({ ...prev, description: lastDescription }));
      setDescriptionHistory((prev) => prev.slice(0, -1));
    }
  };

  const acceptSuggestion = () => {
    setForm((prev) => ({
      ...prev,
      description: prev.description + " " + aiSuggestion,
    }));
    setAiSuggestion("");
    setAiUsageStats((prev) => ({ ...prev, accepted: prev.accepted + 1 }));
  };

  const handleEmojiClick = (emojiObject) => {
    setForm((prev) => ({
      ...prev,
      description: prev.description + emojiObject.emoji,
    }));
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("tags", form.tags); // Controller will split this string
      formData.append("visibility", form.visibility);
      formData.append("allowedCommenters", form.allowedCommenters);

      // Include AI analytics data for tracking
      formData.append(
        "aiAnalytics",
        JSON.stringify({
          usage: aiUsageStats,
          variant: abVariant,
          enhanced: descriptionHistory.length > 0,
        }),
      );

      attachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await api.post("/ideas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Idea shared successfully!");
      navigate(`/ideas/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
          Share a new idea
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Describe your startup or project and invite collaborators.
        </p>
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors focus:bg-white dark:focus:bg-slate-700 pr-10"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <VoiceInput
                  onTranscript={(t) => handleVoiceTranscript("title", t)}
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Description
              </label>
              <div className="flex items-center gap-2">
                {descriptionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRevert}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
                  >
                    Revert
                  </button>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    disabled={isAIProcessing}
                    aria-haspopup="true"
                    aria-expanded={showAIMenu}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                      isAIProcessing
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                        : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    }`}
                  >
                    {isAIProcessing ? (
                      <div className="w-3 h-3 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    )}
                    AI Assist
                  </button>

                  {showAIMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fade-in-up"
                      role="menu"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleEnhance("grammar")}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none"
                      >
                        Grammar Correction
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleEnhance("professional")}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none"
                      >
                        Make Professional
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleEnhance("creative")}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none"
                      >
                        Make Creative
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleEnhance("concise")}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none"
                      >
                        Make Concise
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleEnhance("expand")}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none"
                      >
                        Expand to Narrative
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <textarea
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 transition-colors dark:text-white focus:bg-white dark:focus:bg-slate-700 ${isAIProcessing ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
                placeholder="Describe your startup or project in detail..."
                required
              />
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <VoiceInput
                  onTranscript={(t) => handleVoiceTranscript("description", t)}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-slate-400 hover:text-yellow-500 transition"
                  title="Add emoji"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>

              {aiSuggestion && (
                <div className="absolute left-0 right-0 -bottom-10 bg-indigo-600 dark:bg-indigo-500 text-white text-[11px] p-2 rounded-lg flex items-center justify-between shadow-lg animate-fade-in-up z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[9px] bg-white/20 px-1.5 py-0.5 rounded">
                      AI Suggestion
                    </span>
                    <span className="italic truncate max-w-[150px] sm:max-w-[250px]">
                      "{aiSuggestion}"
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={acceptSuggestion}
                      className="bg-white text-indigo-700 px-2 py-0.5 rounded font-bold hover:bg-indigo-50 transition"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion("")}
                      className="text-white/80 hover:text-white transition"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-[10px] ${form.description.length > 2000 ? "text-red-500 font-bold" : "text-slate-400 dark:text-slate-500"}`}
              >
                {form.description.length} / 2000 characters
              </span>
              {isAIProcessing && (
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium animate-pulse flex items-center gap-1">
                  <div className="w-1 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                  AI is refining your content...
                </span>
              )}
            </div>
            {showEmojiPicker && (
              <div className="absolute right-0 top-12 z-10 shadow-xl rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? "dark"
                      : "light"
                  }
                />
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Attachments (Images, Docs)
            </label>
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 text-center transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
              >
                Click to upload files
              </button>
              <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
                Max 5 files (Images, PDF, Docs)
              </span>
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm transition-colors"
                  >
                    <span className="truncate text-slate-700 dark:text-slate-300 max-w-[80%]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors focus:bg-white dark:focus:bg-slate-700 pr-10"
                  placeholder="FinTech, EdTech, AI..."
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <VoiceInput
                    onTranscript={(t) => handleVoiceTranscript("category", t)}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors focus:bg-white dark:focus:bg-slate-700 pr-10"
                  placeholder="React, AI, Startup..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <VoiceInput
                    onTranscript={(t) => handleVoiceTranscript("tags", t)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition min-h-[44px] px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Post Settings
            </button>
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-semibold">
                Visibility
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {form.visibility} • {form.allowedCommenters} comments
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition shadow-sm"
          >
            {loading ? "Creating..." : "Share Idea"}
          </button>
        </form>

        {/* Post Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in transition-colors border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Post settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Visibility Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
                    Who can see your post?
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={form.visibility === "public"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Anyone
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Anyone on or off IdeaCollab
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="visibility"
                        value="connections"
                        checked={form.visibility === "connections"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Connections only
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Connections on IdeaCollab
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={form.visibility === "private"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Private
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Only you can see this post
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Comment Control Section */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
                    Comment control
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="allowedCommenters"
                        value="anyone"
                        checked={form.allowedCommenters === "anyone"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Anyone
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="allowedCommenters"
                        value="connections"
                        checked={form.allowedCommenters === "connections"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Connections only
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <input
                        type="radio"
                        name="allowedCommenters"
                        value="none"
                        checked={form.allowedCommenters === "none"}
                        onChange={handleChange}
                        className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                      />
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        No one
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddIdeaPage;
```

### AdminDashboardPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/client";
import {
  ShieldAlert,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  MessageSquare,
  User as UserIcon,
  ChevronRight,
  AlertTriangle,
  FileText,
  RefreshCw,
  BarChart3,
  Mic,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VoiceInput from "../components/VoiceInput";

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    console.log("Fetching reports...");
    setLoading(true);
    try {
      const res = await api.get("/reports");
      console.log("Reports fetched successfully:", res.data.length);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await api.put(`/reports/${reportId}/status`, { status: newStatus });
      setReports(
        reports.map((r) =>
          r._id === reportId ? { ...r, status: newStatus } : r,
        ),
      );
      toast.success(`Report ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
  };

  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === "all" || r.status === activeTab;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      (r.referenceNumber &&
        r.referenceNumber.toLowerCase().includes(searchLower)) ||
      (r.reporter?.name &&
        r.reporter.name.toLowerCase().includes(searchLower)) ||
      (r.idea?.title && r.idea.title.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock size={14} /> Pending Review
          </span>
        );
      case "resolved":
        return (
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle size={14} /> Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <XCircle size={14} /> Dismissed
          </span>
        );
      default:
        return (
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const getAccentColor = (status) => {
    switch (status) {
      case "pending":
        return "border-l-amber-500";
      case "resolved":
        return "border-l-emerald-500";
      case "dismissed":
        return "border-l-slate-400";
      default:
        return "border-l-indigo-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                <ShieldAlert className="text-red-600" size={28} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                Moderation Hub
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg ml-1">
              Review and manage reported content to maintain community
              standards.
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500" />
                Report Statistics
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: "Total Reports",
                    val: stats.total,
                    icon: FileText,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50 dark:bg-indigo-900/20",
                  },
                  {
                    label: "Pending Review",
                    val: stats.pending,
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-50 dark:bg-amber-900/20",
                  },
                  {
                    label: "Resolved",
                    val: stats.resolved,
                    icon: CheckCircle,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50 dark:bg-emerald-900/20",
                  },
                  {
                    label: "Dismissed",
                    val: stats.dismissed,
                    icon: XCircle,
                    color: "text-slate-600",
                    bg: "bg-slate-100 dark:bg-slate-800",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl flex items-center gap-4 ${s.bg}`}
                  >
                    <s.icon className={`${s.color} w-6 h-6 flex-shrink-0`} />
                    <div className="flex-1 flex justify-between items-center">
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                        {s.label}
                      </p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">
                        {s.val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Controls Bar */}
            <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full md:w-auto overflow-x-auto">
                {["all", "pending", "resolved", "dismissed"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 md:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${
                      activeTab === t
                        ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-md"
                        : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:max-w-sm group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <VoiceInput
                    onTranscript={(text) => setSearch(text)}
                    className="p-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Reports Content */}
            {loading && reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <BarChart3
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600"
                    size={24}
                  />
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide">
                  FETCHING MODERATION QUEUE...
                </p>
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    onClick={(e) => {
                      // Only navigate if we're not clicking a button or a link
                      if (e.target.closest("button") || e.target.closest("a"))
                        return;
                      navigate(`/admin/reports/${report._id}`);
                    }}
                    className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border dark:border-slate-800 hover:shadow-lg hover:border-indigo-500/50 transition-all border-l-4 ${getAccentColor(report.status)} cursor-pointer group/card`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        {/* Left: Metadata & Content */}
                        <div className="flex-1 min-w-0 space-y-5">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-mono text-xs font-bold tracking-tighter text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50 uppercase">
                              {report.referenceNumber}
                            </span>
                            {getStatusBadge(report.status)}
                            <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-auto">
                              <Clock size={14} />
                              {new Date(report.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 group-hover/card:text-indigo-600 transition-colors">
                              {report.idea?.title || "Archived Content"}
                              {report.idea && (
                                <Link
                                  to={`/ideas/${report.idea._id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                  title="View Idea"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/30">
                                {report.category}
                              </span>
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                <UserIcon size={12} />
                                Reported by:{" "}
                                <span className="font-bold text-slate-700 dark:text-slate-200">
                                  {report.reporter?.name || "System"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {report.context && (
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 max-h-40 overflow-y-auto overflow-x-auto md:overflow-x-hidden">
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic break-words whitespace-pre-wrap">
                                "{report.context}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right: Moderator Actions */}
                        <div className="lg:w-56 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1 lg:block hidden">
                            Moderator Actions
                          </p>
                          <button
                            onClick={() =>
                              handleStatusUpdate(report._id, "dismissed")
                            }
                            disabled={report.status === "dismissed"}
                            className="w-full py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <XCircle size={14} /> Dismiss Report
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(report._id, "resolved")
                            }
                            disabled={report.status === "resolved"}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 dark:shadow-none"
                          >
                            <CheckCircle size={14} /> Mark as Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
                  <ShieldAlert size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                  No Reports Found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                  {activeTab === "all"
                    ? "The moderation queue is clear. Great job!"
                    : `There are no ${activeTab} reports to show.`}
                </p>
                {activeTab !== "all" && (
                  <button
                    onClick={() => setActiveTab("all")}
                    className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
                  >
                    View All Reports
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
```

### ChangePasswordPage.jsx

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout.jsx";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "newPassword") {
      checkStrength(e.target.value);
    }
  };

  const checkStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    setPasswordCriteria(criteria);

    const validCount = Object.values(criteria).filter(Boolean).length;
    setStrength(validCount); // 0 to 5
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (strength < 5) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStrength(0);
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });

      // Optional: Redirect after success
      // setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          Change Password
        </h1>

        {error && (
          <div
            className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-colors"
        >
          <div className="mb-4">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="newPassword"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="password-requirements"
            />

            {/* Strength Meter */}
            <div className="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>

            <div
              id="password-requirements"
              className="mt-4 text-xs text-slate-500 dark:text-slate-400"
            >
              <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Password must contain:
              </p>
              <ul className="grid grid-cols-2 gap-2">
                <li
                  className={
                    passwordCriteria.length
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-400 dark:text-slate-600"
                  }
                >
                  {passwordCriteria.length ? "✓" : "○"} 8+ Characters
                </li>
                <li
                  className={
                    passwordCriteria.uppercase
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-400 dark:text-slate-600"
                  }
                >
                  {passwordCriteria.uppercase ? "✓" : "○"} Uppercase
                </li>
                <li
                  className={
                    passwordCriteria.lowercase
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-400 dark:text-slate-600"
                  }
                >
                  {passwordCriteria.lowercase ? "✓" : "○"} Lowercase
                </li>
                <li
                  className={
                    passwordCriteria.number
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-400 dark:text-slate-600"
                  }
                >
                  {passwordCriteria.number ? "✓" : "○"} Number
                </li>
                <li
                  className={
                    passwordCriteria.special
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-400 dark:text-slate-600"
                  }
                >
                  {passwordCriteria.special ? "✓" : "○"} Special Char
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-all active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePasswordPage;
```

### ChatPage.jsx

```jsx
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import socket from "../api/socket";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceInput from "../components/VoiceInput";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    messageId: null,
    isSender: false,
  });
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [translationModal, setTranslationModal] = useState({
    show: false,
    messageId: null,
    content: "",
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [forwardModal, setForwardModal] = useState({
    show: false,
    message: null,
  });
  const [activeMenu, setActiveMenu] = useState(null); // track which message menu is open
  const [menuPlacement, setMenuPlacement] = useState("bottom"); // 'top' or 'bottom'
  const [newlyArrivedIds, setNewlyArrivedIds] = useState(new Set()); // set of message IDs to highlight

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // For "New Chat" modal/list
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);

  // For "Create Group" modal
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchConversations();
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      if (selectedUser.isGroup) {
        fetchGroupMessages(selectedUser._id);
        // Join group room
        socket.emit("join:group", selectedUser._id);
      } else {
        fetchMessages(selectedUser._id);
      }
      setPartnerTyping(false);

      // Clear highlight and unread count for selected user
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedUser._id ||
          (c.isGroup && c._id === selectedUser._id)
            ? { ...c, isNew: false, unreadCount: 0 }
            : c,
        ),
      );
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, partnerTyping]);

  useEffect(() => {
    const handleMessage = (message) => {
      // If the message is from the selected user (or group), append it
      const isRelevant =
        selectedUser &&
        ((selectedUser.isGroup &&
          message.conversationId === selectedUser._id) ||
          (!selectedUser.isGroup &&
            message.sender._id === selectedUser._id &&
            !message.conversationId));

      if (isRelevant) {
        setMessages((prev) => [...prev, message]);

        // Add to newly arrived set for 3s highlight
        setNewlyArrivedIds((prev) => {
          const next = new Set(prev);
          next.add(message._id);
          return next;
        });
        setTimeout(() => {
          setNewlyArrivedIds((prev) => {
            const next = new Set(prev);
            next.delete(message._id);
            return next;
          });
        }, 3000);

        if (!selectedUser.isGroup) markMessagesRead(selectedUser._id);
        setPartnerTyping(false); // Stop typing indicator if message received
      }

      // Update conversations list for real-time reordering and highlighting
      setConversations((prev) => {
        const conversationId = message.conversationId || message.sender._id;
        const existingConvIndex = prev.findIndex(
          (c) =>
            c._id === conversationId ||
            (c.isGroup && c._id === message.conversationId),
        );

        let updatedConv;
        let newConversations = [...prev];

        if (existingConvIndex > -1) {
          // Update existing conversation and move to top
          const conv = newConversations[existingConvIndex];
          updatedConv = {
            ...conv,
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            unreadCount: isRelevant ? 0 : (conv.unreadCount || 0) + 1,
            isNew: !isRelevant, // Highlight if not currently open
          };
          newConversations.splice(existingConvIndex, 1);
        } else {
          // New conversation, add to top
          updatedConv = {
            _id: conversationId,
            name: message.sender.name,
            avatarUrl: message.sender.avatarUrl,
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            unreadCount: 1,
            isNew: true,
          };
        }

        return [updatedConv, ...newConversations];
      });
    };

    const handleGroupCreated = (group) => {
      fetchConversations();
    };

    const handleTyping = ({ senderId }) => {
      if (
        selectedUser &&
        !selectedUser.isGroup &&
        senderId === selectedUser._id
      ) {
        setPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (
        selectedUser &&
        !selectedUser.isGroup &&
        senderId === selectedUser._id
      ) {
        setPartnerTyping(false);
      }
    };

    const handleRead = ({ readerId }) => {
      if (
        selectedUser &&
        !selectedUser.isGroup &&
        readerId === selectedUser._id
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === user._id || msg.sender === user._id
              ? { ...msg, read: true }
              : msg,
          ),
        );
      }
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    const handleMessageUpdated = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg,
        ),
      );

      // Also update last message in conversations
      setConversations((prev) =>
        prev.map((conv) => {
          const convId =
            updatedMessage.conversationId || updatedMessage.sender._id;
          if (
            conv._id === convId ||
            (conv.isGroup && conv._id === updatedMessage.conversationId)
          ) {
            return { ...conv, lastMessage: updatedMessage };
          }
          return conv;
        }),
      );
    };

    socket.on("chat:message", handleMessage);
    socket.on("group:created", handleGroupCreated);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("chat:read", handleRead);
    socket.on("chat:message_deleted", handleMessageDeleted);
    socket.on("chat:message_updated", handleMessageUpdated);

    // Close menu on outside click
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest(".message-menu-container")) {
        setActiveMenu(null);
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setReplyingTo(null);
        setEditingMessage(null);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("group:created", handleGroupCreated);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("chat:read", handleRead);
      socket.off("chat:message_deleted", handleMessageDeleted);
      socket.off("chat:message_updated", handleMessageUpdated);
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUser, activeMenu]);

  const markMessagesRead = async (senderId) => {
    try {
      await api.put("/messages/read", { senderId });
      window.dispatchEvent(new Event("messages:read"));
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data);

      // Initialize activity status from fetched data
      const initialStatus = {};
      res.data.forEach((conv) => {
        if (!conv.isGroup) {
          initialStatus[conv._id] =
            conv.presenceStatus || (conv.isOnline ? "online" : "offline");
        }
      });
      setUserActivityStatus((prev) => ({ ...prev, ...initialStatus }));

      // Join all group rooms
      res.data
        .filter((c) => c.isGroup)
        .forEach((group) => {
          socket.emit("join:group", group._id);
        });
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const resFollowers = await api.get(`/users/${user._id}/followers`);
      const resFollowing = await api.get(`/users/${user._id}/following`);
      const allContacts = [...resFollowers.data, ...resFollowing.data];
      const uniqueContacts = Array.from(
        new Map(allContacts.map((item) => [item._id, item])).values(),
      );
      setContacts(uniqueContacts);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
      markMessagesRead(userId);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const fetchGroupMessages = async (groupId) => {
    try {
      const res = await api.get(`/messages/group/${groupId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch group messages", err);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    try {
      const res = await api.post("/messages/group", {
        name: groupName,
        members: selectedMembers,
      });
      setConversations((prev) => [res.data, ...prev]);
      setSelectedUser(res.data);
      setShowCreateGroup(false);
      setGroupName("");
      setSelectedMembers([]);
      socket.emit("join:group", res.data._id);
    } catch (err) {
      console.error("Failed to create group", err);
      alert("Failed to create group");
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleClearChat = async () => {
    if (!selectedUser) return;
    try {
      await api.post("/messages/clear", { partnerId: selectedUser._id });
      setMessages([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Failed to clear chat", err);
    }
  };

  const handleDeleteMessage = async (messageId, type) => {
    try {
      await api.delete(`/messages/${messageId}?type=${type}`);
      // Remove locally immediately for better UX
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      setDeleteModal({ show: false, messageId: null, isSender: false });
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const confirmDelete = (messageId, isSender) => {
    setDeleteModal({ show: true, messageId, isSender });
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();
    if (!editingMessage || !editingMessage.content.trim()) return;

    try {
      const res = await api.put(`/messages/${editingMessage._id}`, {
        content: editingMessage.content,
      });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === res.data._id ? res.data : msg)),
      );
      setEditingMessage(null);
      toast.success("Message updated");
    } catch (err) {
      console.error("Failed to edit message", err);
      toast.error("Failed to update message");
    }
  };

  const handleTranslateMessage = async (targetLanguage) => {
    if (!translationModal.messageId) return;
    setIsTranslating(true);
    try {
      const res = await api.post(
        `/messages/${translationModal.messageId}/translate`,
        {
          targetLanguage,
        },
      );
      setTranslationModal((prev) => ({
        ...prev,
        translated: res.data.translation,
      }));
      toast.success("Translated successfully");
    } catch (err) {
      console.error("Translation failed", err);
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { icon: "📋" });
  };

  const toggleMessageMenu = (e, messageId) => {
    if (activeMenu === messageId) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const menuHeight = 250; // approximate max height of menu

      if (rect.bottom + menuHeight > windowHeight) {
        setMenuPlacement("top");
      } else {
        setMenuPlacement("bottom");
      }
      setActiveMenu(messageId);
    }
  };

  const handleForwardMessage = async (targetUser) => {
    if (!forwardModal.message) return;

    try {
      const formData = new FormData();
      if (targetUser.isGroup) {
        formData.append("conversationId", targetUser._id);
      } else {
        formData.append("receiverId", targetUser._id);
      }

      formData.append(
        "content",
        `[Forwarded]: ${forwardModal.message.content}`,
      );

      // If original had attachment, we'd need to handle that too, but for simplicity let's do text

      await api.post("/messages", formData);
      setForwardModal({ show: false, message: null });
      toast.success(`Message forwarded to ${targetUser.name}`);
    } catch (err) {
      console.error("Forward failed", err);
      toast.error("Failed to forward message");
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Keyboard Shortcuts
    if (e.key === "Escape") {
      setReplyingTo(null);
      setEditingMessage(null);
    }

    if (selectedUser) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", {
          receiverId: selectedUser._id,
          senderId: user._id,
        });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop_typing", {
          receiverId: selectedUser._id,
          senderId: user._id,
        });
      }, 2000);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setNewMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !selectedUser) return;

    // Optimistic Update Data
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      sender: { _id: user._id, name: user.name, avatarUrl: user.avatarUrl },
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: "sending", // custom field for UI
      attachment: attachment
        ? {
            url: URL.createObjectURL(attachment),
            fileType: attachment.type.startsWith("image/")
              ? "image"
              : "document",
            originalName: attachment.name,
            isLocal: true, // flag to use local blob URL
          }
        : null,
    };

    // Add optimistically
    setMessages((prev) => [...prev, optimisticMessage]);
    const currentMessage = newMessage;
    const currentAttachment = attachment;

    setNewMessage("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const formData = new FormData();
      if (selectedUser.isGroup) {
        formData.append("conversationId", selectedUser._id);
      } else {
        formData.append("receiverId", selectedUser._id);
      }

      if (currentMessage.trim()) formData.append("content", currentMessage);
      if (currentAttachment) formData.append("attachment", currentAttachment);
      if (replyingTo) formData.append("replyTo", replyingTo._id);

      const res = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear replyingTo state after successful send
      setReplyingTo(null);

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...res.data, status: "delivered" } : msg,
        ),
      );

      // Move current conversation to top
      setConversations((prev) => {
        const existingConvIndex = prev.findIndex(
          (c) => c._id === selectedUser._id,
        );
        const newConvs = [...prev];
        if (existingConvIndex > -1) {
          const updatedConv = {
            ...newConvs[existingConvIndex],
            lastMessage: res.data,
            updatedAt: new Date().toISOString(),
          };
          newConvs.splice(existingConvIndex, 1);
          return [updatedConv, ...newConvs];
        } else {
          // If not found, it might be a new contact chat, so add to top
          return [selectedUser, ...prev];
        }
      });

      // Stop typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      if (!selectedUser.isGroup) {
        socket.emit("stop_typing", {
          receiverId: selectedUser._id,
          senderId: user._id,
        });
      }
    } catch (err) {
      console.error("Failed to send message", err);
      // Mark as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg,
        ),
      );
    }
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-slate-900 md:rounded-xl shadow-sm border-0 md:border overflow-hidden h-[calc(100vh-64px-56px)] md:h-[calc(100vh-140px)] landscape:h-[calc(100vh-64px)] flex flex-col md:flex-row -mx-4 md:mx-0 transition-colors duration-300 relative">
        {/* Sidebar (Conversation List) */}
        <div
          className={`w-full md:w-1/3 lg:w-1/4 border-r dark:border-slate-800 flex-col ${selectedUser ? "hidden md:flex" : "flex"} h-full bg-white dark:bg-slate-900 transition-colors`}
        >
          <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20 min-h-[64px] landscape:min-h-[50px] landscape:py-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-white landscape:text-lg tracking-tight">
              Messages
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-2xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm active:scale-90"
                title="Create Group"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setShowContacts(!showContacts)}
                className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90"
                title="New Chat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide overscroll-contain">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  Syncing chats...
                </p>
              </div>
            ) : showCreateGroup ? (
              <div className="p-4 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    New Group
                  </h3>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mb-5">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 dark:bg-slate-800 dark:text-white"
                    placeholder="e.g. Design Sync"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                    Select Members
                  </label>
                  <div className="max-h-[40vh] overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl divide-y divide-slate-50 dark:divide-slate-800 shadow-inner">
                    {contacts.map((contact) => (
                      <div
                        key={contact._id}
                        onClick={() => toggleMemberSelection(contact._id)}
                        className={`flex items-center gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedMembers.includes(contact._id) ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedMembers.includes(contact._id) ? "bg-indigo-600 border-indigo-600 scale-110 shadow-sm" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"}`}
                        >
                          {selectedMembers.includes(contact._id) && (
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <img
                          src={
                            contact.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`
                          }
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate">
                            {contact.name}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {contact.role || "Member"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedMembers.length === 0}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
                >
                  Create Group
                </button>
              </div>
            ) : showContacts ? (
              <div className="p-2 animate-fade-in-up">
                <div className="flex justify-between items-center px-3 mb-4 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Select Contact
                  </span>
                  <button
                    onClick={() => setShowContacts(false)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition"
                  >
                    Back
                  </button>
                </div>
                <div className="space-y-1">
                  {contacts.map((contact) => (
                    <div
                      key={contact._id}
                      onClick={() => {
                        setSelectedUser(contact);
                        setShowContacts(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="relative">
                        <img
                          src={
                            contact.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`
                          }
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 dark:text-white text-sm truncate">
                          {contact.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate italic">
                          {contact.headline || contact.role || "Member"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {contacts.length === 0 && (
                  <div className="text-center py-12 px-6">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      No followers found
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Follow people to start chatting!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => setSelectedUser(conv)}
                    className={`flex items-center gap-4 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-all relative border-l-4 ${selectedUser?._id === conv._id ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-600" : "border-transparent"}`}
                  >
                    <div className="relative flex-shrink-0">
                      {conv.isGroup ? (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg">
                          <svg
                            className="w-7 h-7 landscape:w-6 landscape:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={
                              conv.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=random`
                            }
                            alt={conv.name}
                            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3
                          className={`text-sm md:text-base landscape:text-xs truncate pr-2 tracking-tight ${conv.unreadCount > 0 || conv.isNew ? "font-black text-indigo-900 dark:text-indigo-400" : "font-bold text-slate-800 dark:text-slate-200"}`}
                        >
                          {conv.name}
                        </h3>
                        <span
                          className={`text-[10px] landscape:text-[9px] whitespace-nowrap font-bold uppercase tracking-wider ${conv.unreadCount > 0 || conv.isNew ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}
                        >
                          {conv.lastMessage
                            ? new Date(
                                conv.lastMessage.createdAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "12:45 PM"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`text-xs landscape:text-[10px] truncate leading-relaxed font-medium ${conv.unreadCount > 0 || conv.isNew ? "text-slate-900 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {conv.lastMessage ? (
                            <>
                              <span className="opacity-50">
                                {conv.lastMessage.sender._id === user._id
                                  ? "You: "
                                  : ""}
                              </span>
                              {conv.lastMessage.content ||
                                (conv.lastMessage.attachment
                                  ? "Sent an attachment"
                                  : "...")}
                            </>
                          ) : (
                            <span>
                              {conv.isGroup
                                ? `${conv.members?.length || 0} members`
                                : conv.headline || "Member"}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {(conv.unreadCount > 0 || conv.isNew) && (
                      <div className="absolute right-4 bottom-4 min-w-[20px] h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg shadow-indigo-200 dark:shadow-none animate-pulse">
                        {conv.unreadCount || 1}
                      </div>
                    )}
                  </div>
                ))}
                {conversations.length === 0 && !loading && (
                  <div className="text-center py-20 px-8 flex flex-col items-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 text-slate-200 dark:text-slate-700 border border-dashed border-slate-200 dark:border-slate-800">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                      No chats yet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center leading-relaxed">
                      Connect with other innovators to start collaborating on
                      amazing ideas.
                    </p>
                    <button
                      onClick={() => setShowContacts(true)}
                      className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      Find People
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="chat-area"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-950/30 fixed inset-0 z-[70] md:relative md:z-auto h-full transition-all duration-300`}
            >
              {/* Header */}
              <div className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b dark:border-slate-800 flex items-center justify-between shadow-sm z-20 sticky top-0 min-h-[72px] landscape:min-h-[56px]">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="md:hidden text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 -ml-1 min-w-[48px] min-h-[48px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl transition-all active:scale-90"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div
                    className="relative flex-shrink-0 group cursor-pointer"
                    onClick={() => {
                      /* Show user profile */
                    }}
                  >
                    {selectedUser.isGroup ? (
                      <div className="w-12 h-12 landscape:w-10 landscape:h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg">
                        <svg
                          className="w-7 h-7 landscape:w-6 landscape:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <>
                        <img
                          src={
                            selectedUser.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`
                          }
                          alt={selectedUser.name}
                          className="w-12 h-12 landscape:w-10 landscape:h-10 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-800 transition-transform group-active:scale-95"
                        />
                      </>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-black text-slate-800 dark:text-white text-base md:text-lg landscape:text-sm leading-tight truncate pr-1 tracking-tight">
                      {selectedUser.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {partnerTyping ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] md:text-xs landscape:text-[9px] text-indigo-600 dark:text-indigo-400 font-black animate-pulse uppercase tracking-widest">
                            typing
                          </span>
                          <div className="flex gap-0.5">
                            <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] md:text-xs landscape:text-[9px] font-bold uppercase tracking-wider truncate text-slate-400 dark:text-slate-500">
                          {selectedUser.isGroup
                            ? `${selectedUser.members?.length || 0} participants`
                            : selectedUser.role || "Member"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                  <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowClearConfirm(!showClearConfirm)}
                      className="p-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>

                    {showClearConfirm && (
                      <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 animate-fade-in-up">
                        <button
                          onClick={handleClearChat}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 font-bold transition-colors"
                        >
                          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                          Clear Entire Chat
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          View Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth landscape:p-3 landscape:space-y-4">
                {messages.map((msg, index) => {
                  const isMe =
                    msg.sender._id === user._id || msg.sender === user._id;
                  const msgDate = new Date(msg.createdAt);
                  const dateString = msgDate.toDateString();
                  const prevMsg = messages[index - 1];
                  const prevDateString = prevMsg
                    ? new Date(prevMsg.createdAt).toDateString()
                    : null;
                  const showDate = dateString !== prevDateString;
                  const isToday = dateString === new Date().toDateString();

                  return (
                    <React.Fragment key={index}>
                      {showDate && (
                        <div className="flex justify-center my-8">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                            {isToday ? "Today" : dateString}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2 group relative animate-fade-in-up`}
                      >
                        {!isMe && selectedUser.isGroup && (
                          <img
                            src={
                              msg.sender.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=random`
                            }
                            alt=""
                            className="w-6 h-6 rounded-full border border-white dark:border-slate-800 shadow-sm mb-1"
                          />
                        )}

                        <div
                          className={`relative flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%] landscape:max-w-[90%]`}
                        >
                          {selectedUser.isGroup && !isMe && (
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase tracking-tight landscape:text-[9px]">
                              {msg.sender.name}
                            </span>
                          )}

                          {/* Reply Context */}
                          {msg.replyTo && (
                            <div
                              className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-4 ${isMe ? "bg-indigo-700/50 border-indigo-300" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600"} italic max-w-full truncate opacity-80 cursor-pointer landscape:text-[10px] landscape:py-1`}
                              onClick={() => {
                                const element = document.getElementById(
                                  `msg-${msg.replyTo._id}`,
                                );
                                if (element) {
                                  element.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  element.classList.add(
                                    "ring-4",
                                    "ring-indigo-400/50",
                                  );
                                  setTimeout(
                                    () =>
                                      element.classList.remove(
                                        "ring-4",
                                        "ring-indigo-400/50",
                                      ),
                                    2000,
                                  );
                                }
                              }}
                            >
                              <span className="block font-bold text-[10px] uppercase opacity-60 landscape:text-[8px]">
                                Replying to {msg.replyTo.sender?.name || "User"}
                              </span>
                              {msg.replyTo.content}
                            </div>
                          )}

                          <div
                            id={`msg-${msg._id}`}
                            className={`relative rounded-2xl px-4 py-3 text-sm shadow-sm transition-all duration-500 hover:shadow-md ${
                              isMe
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none"
                            } ${
                              newlyArrivedIds.has(msg._id)
                                ? "highlight-new scale-[1.02]"
                                : ""
                            } landscape:px-3 landscape:py-2 landscape:text-xs`}
                          >
                            {/* Attachment Display */}
                            {msg.attachment && (
                              <div className="mb-3 rounded-xl overflow-hidden bg-black/5 dark:bg-black/20 ring-1 ring-black/5 dark:ring-white/5">
                                {msg.attachment.fileType === "image" ? (
                                  <img
                                    src={
                                      msg.attachment.isLocal
                                        ? msg.attachment.url
                                        : msg.attachment.url.startsWith("http")
                                          ? msg.attachment.url
                                          : `${SERVER_URL}${msg.attachment.url}`
                                    }
                                    alt="attachment"
                                    className="max-w-full h-auto object-cover max-h-72 w-full hover:scale-105 transition-transform duration-500 cursor-pointer"
                                  />
                                ) : (
                                  <a
                                    href={
                                      msg.attachment.isLocal
                                        ? msg.attachment.url
                                        : msg.attachment.url.startsWith("http")
                                          ? msg.attachment.url
                                          : `${SERVER_URL}${msg.attachment.url}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-4 transition-colors ${isMe ? "text-white hover:bg-white/10" : "text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                                  >
                                    <div
                                      className={`p-2.5 rounded-xl ${isMe ? "bg-white/20" : "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800"}`}
                                    >
                                      <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </div>
                                    <div className="min-w-0">
                                      <span className="block font-black truncate text-xs tracking-tight">
                                        {msg.attachment.originalName ||
                                          "Document"}
                                      </span>
                                      <span
                                        className={`block text-[10px] uppercase font-black opacity-60 mt-0.5 tracking-widest`}
                                      >
                                        {msg.attachment.fileSize || "1.2 MB"}
                                      </span>
                                    </div>
                                  </a>
                                )}
                              </div>
                            )}

                            {/* Text Content */}
                            {editingMessage?._id === msg._id ? (
                              <form
                                onSubmit={handleEditMessage}
                                className="min-w-[200px]"
                              >
                                <textarea
                                  autoFocus
                                  value={editingMessage.content}
                                  onChange={(e) =>
                                    setEditingMessage({
                                      ...editingMessage,
                                      content: e.target.value,
                                    })
                                  }
                                  className={`w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none ${isMe ? "text-white placeholder:text-white/50" : "text-slate-800 dark:text-white placeholder:text-slate-400"}`}
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingMessage(null)}
                                    className="text-[10px] uppercase font-black opacity-70 hover:opacity-100 tracking-widest"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="text-[10px] uppercase font-black bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors tracking-widest"
                                  >
                                    Save
                                  </button>
                                </div>
                              </form>
                            ) : (
                              msg.content && (
                                <div className="space-y-1">
                                  <p className="leading-relaxed whitespace-pre-wrap break-words font-semibold tracking-tight">
                                    {msg.content}
                                  </p>
                                  {msg.isEdited && (
                                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">
                                      (Edited)
                                    </span>
                                  )}
                                </div>
                              )
                            )}

                            <div
                              className={`text-[10px] mt-1.5 flex justify-end items-center gap-1.5 ${isMe ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"} font-black tabular-nums tracking-wider uppercase`}
                            >
                              {msgDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {isMe && (
                                <span className="flex items-center">
                                  {msg.status === "failed" ? (
                                    <svg
                                      className="w-3.5 h-3.5 text-red-300"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth="3"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  ) : msg.status === "sending" ? (
                                    <div className="w-3 h-3 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                                  ) : msg.read ? (
                                    <div className="flex -space-x-1.5">
                                      <svg
                                        className="w-4 h-4 text-blue-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      <svg
                                        className="w-4 h-4 text-blue-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="3"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 opacity-60"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth="3"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Menu Trigger (⋮) */}
                        <div
                          className={`relative message-menu-container flex items-center transition-all duration-200`}
                        >
                          <button
                            onClick={(e) => toggleMessageMenu(e, msg._id)}
                            className={`p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-2xl transition-all min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${activeMenu === msg._id ? "opacity-100 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "opacity-100 md:opacity-0 group-hover:opacity-100"}`}
                            aria-haspopup="true"
                            aria-expanded={activeMenu === msg._id}
                            title="Message options"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {activeMenu === msg._id && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  scale: 0.95,
                                  y: menuPlacement === "top" ? 10 : -10,
                                }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute z-[100] min-w-[160px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 overflow-hidden ${isMe ? "right-0" : "left-0"} ${menuPlacement === "top" ? "bottom-12" : "top-12"} ${isMe ? (menuPlacement === "top" ? "origin-bottom-right" : "origin-top-right") : menuPlacement === "top" ? "origin-bottom-left" : "origin-top-left"}`}
                                role="menu"
                                aria-orientation="vertical"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "ArrowDown" ||
                                    e.key === "ArrowUp"
                                  ) {
                                    e.preventDefault();
                                    const items =
                                      e.currentTarget.querySelectorAll(
                                        '[role="menuitem"]',
                                      );
                                    const index = Array.from(items).indexOf(
                                      document.activeElement,
                                    );
                                    let nextIndex =
                                      e.key === "ArrowDown"
                                        ? index + 1
                                        : index - 1;
                                    if (nextIndex < 0)
                                      nextIndex = items.length - 1;
                                    if (nextIndex >= items.length)
                                      nextIndex = 0;
                                    items[nextIndex].focus();
                                  }
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setReplyingTo(msg);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                                  role="menuitem"
                                >
                                  <svg
                                    className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5"
                                    />
                                  </svg>
                                  Reply
                                </button>

                                {isMe && !msg.attachment && (
                                  <button
                                    onClick={() => {
                                      setEditingMessage({
                                        _id: msg._id,
                                        content: msg.content,
                                      });
                                      setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg
                                      className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    copyToClipboard(msg.content);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                                  role="menuitem"
                                >
                                  <svg
                                    className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                  </svg>
                                  Copy
                                </button>

                                {msg.content && (
                                  <button
                                    onClick={() => {
                                      setTranslationModal({
                                        show: true,
                                        messageId: msg._id,
                                        content: msg.content,
                                      });
                                      setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg
                                      className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                      />
                                    </svg>
                                    Translate
                                  </button>
                                )}

                                {msg.content && (
                                  <button
                                    onClick={() => {
                                      setForwardModal({
                                        show: true,
                                        message: msg,
                                      });
                                      setActiveMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg
                                      className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                      />
                                    </svg>
                                    Forward
                                  </button>
                                )}

                                <div className="h-px bg-slate-100 my-1"></div>

                                <button
                                  onClick={() => {
                                    confirmDelete(msg._id, isMe);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors group/item font-medium"
                                  role="menuitem"
                                >
                                  <svg
                                    className="w-4 h-4 text-red-400 group-hover/item:text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-slate-800 sticky bottom-0 z-20 landscape:p-2">
                {/* Replying To Preview */}
                {replyingTo && (
                  <div className="mb-3 flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm p-3 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm animate-fade-in-up">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-600 p-2 rounded-xl shadow-md">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] text-indigo-400 dark:text-indigo-300 font-bold uppercase tracking-wider">
                          Replying to {replyingTo.sender?.name || "User"}
                        </span>
                        <span className="block text-xs text-indigo-900 dark:text-indigo-100 truncate max-w-[300px] font-medium italic">
                          "{replyingTo.content}"
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Attachment Preview */}
                {attachment && (
                  <div className="mb-3 flex items-center gap-3 bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm p-2.5 rounded-2xl w-fit border border-indigo-100 dark:border-indigo-800 shadow-sm animate-fade-in-up">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 pr-2">
                      <span className="block text-xs text-indigo-900 dark:text-indigo-100 truncate max-w-[180px] font-bold">
                        {attachment.name}
                      </span>
                      <span className="block text-[10px] text-indigo-400 dark:text-indigo-300 font-bold uppercase">
                        Ready to send
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAttachment(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-[2rem] relative border border-transparent focus-within:border-indigo-500/50 focus-within:bg-white dark:focus-within:bg-slate-700 transition-all shadow-inner-sm landscape:p-1.5"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90"
                      title="Attach file"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 text-slate-500 dark:text-slate-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all relative min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-90"
                      title="Add emoji"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-6 z-50 shadow-2xl rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-fade-in-up">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={
                          document.documentElement.classList.contains("dark")
                            ? "dark"
                            : "light"
                        }
                        width={320}
                        height={400}
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                      />
                    </div>
                  )}

                  <div className="relative flex-1">
                    <textarea
                      value={newMessage}
                      onChange={handleInputChange}
                      placeholder="Type a message..."
                      rows="1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-slate-800 dark:text-white placeholder:text-slate-400 font-medium py-3.5 px-2 min-h-[52px] text-sm md:text-base landscape:py-2 landscape:min-h-[44px] pr-10"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <VoiceInput onTranscript={handleVoiceTranscript} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim() && !attachment}
                    className="bg-indigo-600 text-white p-3.5 rounded-full hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-90 flex items-center justify-center group"
                  >
                    <svg
                      className="w-6 h-6 transform group-active:translate-x-1 group-active:-translate-y-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30 dark:bg-slate-950/30"
            >
              <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-100 dark:text-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                Your Conversations
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs leading-relaxed font-medium">
                Select a teammate from the sidebar or start a new group chat to
                begin collaborating.
              </p>
              <button
                onClick={() => setShowContacts(true)}
                className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                New Message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      {/* Modals and Overlays */}
      {forwardModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/20 transition-colors">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Forward Message
              </h3>
              <button
                onClick={() => setForwardModal({ show: false, message: null })}
                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700 mb-4">
                "{forwardModal.message?.content}"
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Choose Contact
              </p>
              {contacts.map((contact) => (
                <button
                  key={contact._id}
                  onClick={() => handleForwardMessage(contact)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 group"
                >
                  <img
                    src={
                      contact.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shadow-sm border dark:border-slate-700"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400">
                      {contact.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {contact.type === "group" ? "Group" : "User"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border dark:border-slate-700">
                    <svg
                      className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {translationModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/20 transition-colors">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Translate Message
              </h3>
              <button
                onClick={() =>
                  setTranslationModal({
                    show: false,
                    messageId: null,
                    content: "",
                  })
                }
                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700">
                "{translationModal.content}"
              </div>

              {translationModal.translated && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl text-sm text-indigo-900 dark:text-indigo-200 font-medium border border-indigo-100 dark:border-indigo-800 animate-fade-in">
                  <span className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">
                    Translation:
                  </span>
                  {translationModal.translated}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {[
                  "English",
                  "Spanish",
                  "French",
                  "German",
                  "Chinese",
                  "Hindi",
                  "Arabic",
                ].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslateMessage(lang)}
                    disabled={isTranslating}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-600 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isTranslating ? "Translating..." : lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="p-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">
                Delete Message?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select how you want to delete this message.
              </p>
            </div>
            <div className="p-2 flex flex-col gap-2">
              {deleteModal.isSender && (
                <button
                  onClick={() =>
                    handleDeleteMessage(deleteModal.messageId, "everyone")
                  }
                  className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 transition group"
                >
                  <span className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold text-sm">
                      Delete for everyone
                    </div>
                    <div className="text-[10px] text-red-400">
                      Remove for all participants
                    </div>
                  </div>
                </button>
              )}
              <button
                onClick={() => handleDeleteMessage(deleteModal.messageId, "me")}
                className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-3 text-slate-700 dark:text-slate-200 transition group"
              >
                <span className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold text-sm">Delete for me</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Remove from your device only
                  </div>
                </div>
              </button>
            </div>
            <div className="p-3 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end transition-colors">
              <button
                onClick={() =>
                  setDeleteModal({
                    show: false,
                    messageId: null,
                    isSender: false,
                  })
                }
                className="px-4 py-2 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
```

### CollaborationRequestsPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const CollaborationRequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchData = () => {
    api
      .get("/collaborations/requests")
      .then((res) => {
        setIncoming(res.data.incoming || []);
        setOutgoing(res.data.outgoing || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async (id, status) => {
    await api.put(`/collaborations/requests/${id}`, { status });
    fetchData();
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            Incoming requests
          </h1>
          <div className="space-y-3 text-sm">
            {incoming.map((req) => (
              <div
                key={req._id}
                className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {req.sender?.name}
                    </span>{" "}
                    wants to join{" "}
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {req.idea?.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic">
                    "{req.message}"
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Status:
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        req.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : req.status === "accepted"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRespond(req._id, "accepted")}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req._id, "rejected")}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {incoming.length === 0 && (
              <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  No incoming collaboration requests.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
            Outgoing requests
          </h1>
          <div className="space-y-3 text-sm">
            {outgoing.map((req) => (
              <div
                key={req._id}
                className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="font-bold text-slate-800 dark:text-white mb-1 truncate">
                  {req.idea?.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                  To:{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {req.receiver?.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic leading-relaxed">
                  "{req.message}"
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Status:
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      req.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        : req.status === "accepted"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
            {outgoing.length === 0 && (
              <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  You have not sent any requests yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationRequestsPage;
```

### DashboardPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import socket from "../api/socket.js";
import Layout from "../components/Layout.jsx";
import { Link } from "react-router-dom";
import { Users, Search } from "lucide-react";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import RecommendedUsers from "../components/RecommendedUsers.jsx";

const DashboardPage = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    api
      .get("/ideas")
      .then((res) => {
        setIdeas(res.data.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const handleNewIdea = (newIdea) => {
      setIdeas((prev) => [newIdea, ...prev].slice(0, 10));
    };

    socket.on("idea:created", handleNewIdea);

    return () => {
      socket.off("idea:created", handleNewIdea);
    };
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening in your creative network today.
        </p>
      </div>

      <DashboardStats />

      {/* Community Search Entry */}
      <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Find Collaborators
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Search for developers, designers, and creators in the community.
            </p>
          </div>
        </div>
        <Link
          to="/users"
          className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none"
        >
          <Search size={16} />
          Search Creators
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="font-bold text-xl mb-1">Have a brilliant idea?</h2>
              <p className="text-indigo-100 text-sm opacity-90">
                Share it with the community and start building your dream team.
              </p>
            </div>
            <Link
              to="/ideas/new"
              className="w-full md:w-auto text-center bg-white dark:bg-white/10 text-indigo-600 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-white/20 transition shadow-sm min-h-[44px] flex items-center justify-center border border-transparent dark:border-white/20"
            >
              Share an Idea
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-slate-800 dark:text-white">
              Latest Ideas
            </h2>
            <Link
              to="/ideas"
              className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Skeleton Loader
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse"
                >
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              ))
            ) : ideas.length > 0 ? (
              ideas.map((idea) => (
                <Link
                  key={idea._id}
                  to={`/ideas/${idea._id}`}
                  className="block bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {idea.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {idea.category}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {idea.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          idea.owner?.avatarUrl ||
                          "https://via.placeholder.com/30"
                        }
                        alt={idea.owner?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {idea.owner?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <div
                        className="flex items-center gap-1 text-xs"
                        onClick={(e) => e.preventDefault()}
                      >
                        <LikeButton idea={idea} />
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs"
                        onClick={(e) => e.preventDefault()}
                      >
                        <SaveButton idea={idea} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-700">
                <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-1">
                  No ideas yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                  Be the first to share something amazing!
                </p>
                <Link
                  to="/ideas/new"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
                >
                  Share an idea &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <RecommendedUsers />

          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 rounded-xl p-5 border border-indigo-100 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-semibold text-indigo-900 dark:text-indigo-400 mb-3 flex items-center gap-2">
              <span>💡</span>
              <span>Pro Tips</span>
            </h2>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>
                  Define your problem statement clearly to attract the right
                  talent.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>
                  Update your profile skills to get better recommendations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span>
                <span>
                  Engage with other creators by commenting on their ideas.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default DashboardPage;
```

### FollowersPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import UserList from "../components/UserList.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const FollowersPage = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api
        .get(`/users/${user._id}/followers`)
        .then((res) => setFollowers(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRemove = (id) => {
    setFollowers((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Followers
        </h1>
        {loading ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Loading followers...
          </div>
        ) : (
          <UserList
            users={followers}
            type="followers"
            onRemove={handleRemove}
          />
        )}
      </div>
    </Layout>
  );
};

export default FollowersPage;
```

### FollowingPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import UserList from "../components/UserList.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const FollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api
        .get(`/users/${user._id}/following`)
        .then((res) => setFollowing(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRemove = (id) => {
    setFollowing((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Following
        </h1>
        {loading ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Loading following...
          </div>
        ) : (
          <UserList
            users={following}
            type="following"
            onRemove={handleRemove}
          />
        )}
      </div>
    </Layout>
  );
};

export default FollowingPage;
```

### FollowRequestsPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FollowRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/users/follow-requests/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch follow requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    try {
      await api.put(`/users/follow-requests/${requestId}`, { status });
      toast.success(`Request ${status}`);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      window.dispatchEvent(new Event("follow:processed"));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Follow Requests
        </h1>

        {loading ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">
            Loading requests...
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 transition-colors"
              >
                <Link
                  to={`/users/${req.sender._id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <img
                    src={
                      req.sender.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(req.sender.name)}&background=random`
                    }
                    alt={req.sender.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">
                      {req.sender.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {req.sender.role || "Member"}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(req._id, "accepted")}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "rejected")}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-slate-800 dark:text-white font-medium">
              No pending requests
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              When someone wants to follow you, their request will appear here.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FollowRequestsPage;
```

### ForgotPasswordPage.jsx

```jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";
import Footer from "../components/Footer.jsx";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Backup Code, 4: New Password
  const [resetToken, setResetToken] = useState("");
  const [backupCode, setBackupCode] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBackupCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-backup-code", {
        email,
        backupCode,
      });
      setResetToken(res.data.resetToken);
      setMessage("Backup code verified! Please set your new password.");
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid backup code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload =
        step === 4
          ? { email, resetToken, newPassword, mode: "backup_code" }
          : { email, otp, newPassword };

      const res = await api.post("/auth/reset-password", payload);
      setMessage(res.data.message);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {step === 1 &&
                "Enter your email address and we'll send you a verification code."}
              {step === 2 && `Enter the 6-digit code sent to ${email}.`}
              {step === 3 && "Enter one of your 8-10 character backup codes."}
              {step === 4 && "Choose a new secure password for your account."}
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">
                    Or use backup code
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-3 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Use Backup Code
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={() => setStep(4)} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white text-center font-bold tracking-[0.5em]"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
              >
                Verify Code
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 py-2 transition-colors"
              >
                ← Back to email
              </button>
            </form>
          ) : step === 3 ? (
            <form onSubmit={handleVerifyBackupCode} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Backup Code
                </label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white text-center font-mono uppercase tracking-widest"
                  placeholder="ABC123XY"
                  maxLength="10"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Verifying..." : "Verify Backup Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 py-2 transition-colors"
              >
                ← Use email verification instead
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/login"
              className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
```

### IdeaDetailsPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";
import CommentSection from "../components/CommentSection.jsx";
import ReportModal from "../components/ReportModal.jsx";
import socket from "../api/socket.js";

const IdeaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchIdea = () => {
    setLoading(true);
    api
      .get(`/ideas/${id}`)
      .then((res) => setIdea(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load idea"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIdea();

    socket.on("idea:updated", (updatedIdea) => {
      if (updatedIdea._id === id) {
        setIdea(updatedIdea);
      }
    });

    return () => {
      socket.off("idea:updated");
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this idea?")) return;
    try {
      await api.delete(`/ideas/${id}`);
      navigate("/ideas");
    } catch {
      setError("Failed to delete idea");
    }
  };

  const handleRequest = async () => {
    setRequestStatus("");
    try {
      await api.post("/collaborations/requests", {
        ideaId: id,
        message: requestMessage,
      });
      setRequestStatus("Request sent");
      setRequestMessage("");
    } catch (err) {
      setRequestStatus(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleReportSuccess = (referenceNumber) => {
    setShowReportModal(false);
    toast.success(`Report submitted! Reference: ${referenceNumber}`, {
      duration: 6000,
      icon: "🛡️",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
          Loading idea...
        </div>
      </Layout>
    );
  }

  if (!idea) {
    return (
      <Layout>
        <div className="text-center mt-10">
          <div className="text-slate-500 dark:text-slate-400 mb-2">
            Idea not found
          </div>
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              Error: {error}
            </div>
          )}
          <Link
            to="/ideas"
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm block mt-4"
          >
            Back to Ideas
          </Link>
        </div>
      </Layout>
    );
  }

  const isOwner = user && idea.owner && idea.owner._id === user._id;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
        )}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-1">
                {idea.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link
                  to={`/users/${idea.owner?._id}`}
                  className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {idea.owner?.name}
                </Link>
                <span>•</span>
                <span>{idea.category}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 h-fit border border-emerald-100 dark:border-emerald-800">
                {idea.status}
              </span>
              {user && !isOwner && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 transition-colors bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/30 shadow-sm dark:shadow-none"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4a1 1 0 01-.8 1.6H6a1 1 0 01-1-1V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Report
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {idea.description}
          </p>
          {idea.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Attachments Display */}
          {idea.attachments?.length > 0 && (
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
                Attachments
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {idea.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={`${import.meta.env.VITE_API_URL}${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition bg-white dark:bg-slate-900"
                  >
                    {file.fileType === "image" ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${file.url}`}
                        alt={file.originalName}
                        className="h-24 w-full object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="h-24 w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded mb-2 text-indigo-400 dark:text-indigo-300">
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate w-full text-center font-medium">
                      {file.originalName}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
            <LikeButton idea={idea} />
            <SaveButton idea={idea} />
          </div>
        </div>

        <ReportModal
          ideaId={id}
          onClose={() => setShowReportModal(false)}
          isOpen={showReportModal}
          onReportSuccess={handleReportSuccess}
        />

        <CommentSection idea={idea} onUpdate={setIdea} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 md:col-span-2 transition-colors">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-2">
              Collaborators
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to={`/users/${idea.owner?._id}`}
                  className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  {idea.owner?.name}
                </Link>{" "}
                (Owner)
              </li>
              {idea.collaborators?.map((c) => (
                <li key={c._id}>
                  <Link
                    to={`/users/${c._id}`}
                    className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              {(!idea.collaborators || idea.collaborators.length === 0) && (
                <li className="text-slate-500 dark:text-slate-500 text-xs italic">
                  No collaborators yet.
                </li>
              )}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3 h-fit transition-colors">
            {isOwner ? (
              <>
                <h2 className="font-semibold text-slate-800 dark:text-white mb-2">
                  Owner actions
                </h2>
                <button
                  onClick={handleDelete}
                  className="w-full text-sm rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition min-h-[44px]"
                >
                  Delete idea
                </button>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-slate-800 dark:text-white mb-2">
                  Collaborate
                </h2>
                <textarea
                  rows="3"
                  placeholder="Explain how you can contribute..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 dark:text-white transition-colors"
                />
                <button
                  onClick={handleRequest}
                  className="w-full text-sm rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 transition shadow-sm font-medium min-h-[44px]"
                >
                  Send collaboration request
                </button>
                {requestStatus && (
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {requestStatus}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IdeaDetailsPage;
```

### IdeasListPage - Copy.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const IdeasListPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchIdeas = () => {
    if (activeTab === "saved") {
      api
        .get("/users/saved-ideas")
        .then((res) => setIdeas(res.data))
        .catch(() => {});
      return;
    }

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api
      .get("/ideas", { params })
      .then((res) => setIdeas(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchIdeas();
  }, [search, category, activeTab]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800">
          {activeTab === "saved" ? "Saved Ideas" : "Explore Ideas"}
        </h1>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {activeTab === "all" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchIdeas();
          }}
          className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border mb-4"
        >
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-48 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Apply
          </button>
        </form>
      )}

      <div className="space-y-3">
        {ideas.map((idea) => (
          <Link
            key={idea._id}
            to={`/ideas/${idea._id}`}
            className="block bg-white rounded-xl p-4 shadow-sm border hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                {idea.title}
              </h3>
              <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">
                {idea.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-2">
              {idea.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">
                  {idea.owner?.name}
                </span>
                <LikeButton idea={idea} />
                <SaveButton idea={idea} />
              </div>
              <span>{idea.collaborators?.length || 0} collaborators</span>
            </div>
          </Link>
        ))}
        {ideas.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-sm text-slate-500 text-center border">
            {activeTab === "saved"
              ? "You haven't saved any ideas yet."
              : "No ideas match the current filters."}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IdeasListPage;
```

### IdeasListPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const IdeasListPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchIdeas = () => {
    if (activeTab === "saved") {
      api
        .get("/users/saved-ideas")
        .then((res) => setIdeas(res.data))
        .catch(() => {});
      return;
    }

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api
      .get("/ideas", { params })
      .then((res) => setIdeas(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchIdeas();
  }, [search, category, activeTab]);

  useEffect(() => {
    const handleNewIdea = (newIdea) => {
      // Only add to list if we are on "all" tab
      if (activeTab !== "all") return;

      // Check if it matches current filters
      const matchesSearch =
        !search || newIdea.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !category || newIdea.category.toLowerCase() === category.toLowerCase();

      if (matchesSearch && matchesCategory) {
        setIdeas((prev) => [newIdea, ...prev]);
      }
    };

    socket.on("idea:created", handleNewIdea);
    return () => socket.off("idea:created", handleNewIdea);
  }, [activeTab, search, category]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          {activeTab === "saved" ? "Saved Ideas" : "Explore Ideas"}
        </h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Saved
          </button>
        </div>
      </div>

      {activeTab === "all" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchIdeas();
          }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 transition-colors"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-white min-h-[44px]"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <input
              type="text"
              placeholder="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 dark:text-white min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition min-h-[44px]"
          >
            Apply
          </button>
        </form>
      )}

      <div className="space-y-3">
        {ideas.map((idea) => (
          <Link
            key={idea._id}
            to={`/ideas/${idea._id}`}
            className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {idea.title}
              </h3>
              <span className="text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5">
                {idea.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
              {idea.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {idea.owner?.name}
                </span>
                <LikeButton idea={idea} />
                <SaveButton idea={idea} />
              </div>
              <span>{idea.collaborators?.length || 0} collaborators</span>
            </div>
          </Link>
        ))}
        {ideas.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-sm text-slate-500 dark:text-slate-400 text-center border border-slate-100 dark:border-slate-800">
            {activeTab === "saved"
              ? "You haven't saved any ideas yet."
              : "No ideas match the current filters."}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IdeasListPage;
```

### LoginPage.jsx

```jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        identifier: form.identifier,
        password: form.password,
      };

      const res = await api.post("/auth/login", payload);
      toast.success("Welcome back! Login successful.");
      setMessage("Login successful! Redirecting...");
      login(res.data.token, res.data.user);

      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      toast.success(`Welcome ${res.data.user.name}!`);
      setMessage("Login successful! Redirecting...");
      login(res.data.token, res.data.user);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.message ||
        err.message ||
        "Google login failed";
      setError(`Google Login Error: ${errorMsg}`);
      console.error("Frontend Google Login Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue to IdeaCollab.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {message}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme={
                document.documentElement.classList.contains("dark")
                  ? "filled_black"
                  : "outline"
              }
              size="large"
              shape="pill"
              width="100%"
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="identifier"
                  placeholder="email@example.com"
                  value={form.identifier}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  title="Forgot password?"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-4 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-.79.23-1.57.66-2.32M6.6 6.6C8.12 5.57 9.98 5 12 5c5 0 9 4 9 7 0 1.1-.43 2.23-1.2 3.27M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
            New to IdeaCollab?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
```

### NotificationHistoryPage.jsx

```jsx
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import api from "../api/client";
import socket from "../api/socket";
import { Link, useNavigate } from "react-router-dom";
import { getNotificationUrl } from "../utils/notification";

const NotificationHistoryPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = {
          page: currentPage,
          limit: 10,
          ...filters,
        };

        const res = await api.get("/notifications", { params });

        if (reset) {
          setNotifications(res.data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...res.data.notifications]);
        }

        setTotalPages(res.data.totalPages);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, page],
  );

  useEffect(() => {
    fetchNotifications(true);
  }, [filters]); // Refetch when filters change

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(false);
    }
  }, [page]);

  useEffect(() => {
    const handleNewNotification = (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(notifications.map((n) => n._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const markAsRead = async (idsToMark) => {
    try {
      await api.put("/notifications/read", { ids: idsToMark });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          idsToMark.includes(n._id) ? { ...n, isRead: true } : n,
        ),
      );

      // Recalculate unread count (approximate or refetch)
      const readCount = notifications.filter(
        (n) => idsToMark.includes(n._id) && !n.isRead,
      ).length;
      setUnreadCount((prev) => Math.max(0, prev - readCount));

      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const deleteNotifications = async (idsToDelete) => {
    if (!window.confirm("Are you sure you want to delete these notifications?"))
      return;

    try {
      await api.post("/notifications/delete", { ids: idsToDelete });

      setNotifications((prev) =>
        prev.filter((n) => !idsToDelete.includes(n._id)),
      );
      setSelectedIds([]);
      // Should probably refetch to fill the gap, but for now just remove
    } catch (err) {
      console.error("Failed to delete notifications", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <span className="text-blue-500">ℹ️</span>;
      case "success":
        return <span className="text-green-500">✅</span>;
      case "warning":
        return <span className="text-yellow-500">⚠️</span>;
      case "error":
        return <span className="text-red-500">❌</span>;
      default:
        return <span className="text-gray-500">🔔</span>;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Notification History{" "}
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                {unreadCount}
              </span>
            )}
          </h1>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <>
                <button
                  onClick={() => markAsRead(selectedIds)}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-sm transition-colors"
                >
                  Mark Read ({selectedIds.length})
                </button>
                <button
                  onClick={() => deleteNotifications(selectedIds)}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 text-sm transition-colors"
                >
                  Delete ({selectedIds.length})
                </button>
              </>
            )}
            <button
              onClick={() => markAsRead(notifications.map((n) => n._id))}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-sm transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center transition-colors">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
            className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm flex-grow w-full md:w-auto bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          >
            <option value="">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
          <span className="text-slate-400 dark:text-slate-500 hidden md:inline">
            -
          </span>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm w-full md:w-auto bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>

        {/* Notification List */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center">
            <input
              type="checkbox"
              checked={
                selectedIds.length === notifications.length &&
                notifications.length > 0
              }
              onChange={handleSelectAll}
              className="mr-3 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Select All
            </span>
          </div>

          {notifications.length === 0 && !loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No notifications found.
            </div>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`border-b border-slate-100 dark:border-slate-800 last:border-0 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    !notification.isRead
                      ? "bg-indigo-50/30 dark:bg-indigo-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification._id)}
                      onChange={() => handleSelectOne(notification._id)}
                      className="mt-1.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 relative z-10"
                    />
                    <div className="mt-1 text-xl">
                      {getIcon(notification.type)}
                    </div>
                    <div
                      className="flex-grow cursor-pointer"
                      onClick={() => {
                        if (!notification.isRead)
                          markAsRead([notification._id]);
                        navigate(getNotificationUrl(notification));
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3
                          className={`text-sm font-semibold transition-colors ${!notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}
                        >
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 ml-2 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead([notification._id]);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 p-1 font-medium transition-colors"
                        title="Mark as Read"
                      >
                        {notification.isRead ? "Read" : "Mark Read"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotifications([notification._id]);
                        }}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 font-medium transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {loading && (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              Loading...
            </div>
          )}

          {!loading && page < totalPages && (
            <div className="p-4 text-center border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NotificationHistoryPage;
```

### PostProblemPage.jsx

```jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Code, Sparkles, ChevronDown, RotateCcw } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import toast from "react-hot-toast";
import VoiceInput from "../components/VoiceInput.jsx";

const PostProblemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    tags: "",
    code: "",
    language: "javascript",
  });

  // AI Assistance States
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [descriptionHistory, setDescriptionHistory] = useState([]);
  const menuRef = useRef(null);

  const handleVoiceTranscript = (field, transcript) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]} ${transcript}` : transcript,
    }));
    toast.success(`Transcribed to ${field}`);
  };

  const handleEnhance = async (mode) => {
    if (!formData.description && mode !== "generate") {
      return toast.error("Please enter a brief description first");
    }

    setIsAIProcessing(true);
    setShowAIMenu(false);

    try {
      const res = await api.post("/ai/enhance-description", {
        text: formData.description,
        mode,
        title: formData.title,
        category: formData.category,
      });

      const enhancedText = res.data.enhancedText;

      // Save history for revert
      setDescriptionHistory((prev) => [...prev, formData.description]);

      setFormData((prev) => ({ ...prev, description: enhancedText }));
      toast.success(
        `Content ${mode === "expand" ? "expanded" : "refined"} by AI!`,
      );
    } catch (err) {
      console.error("AI assistance failed:", err);
      toast.error("AI assistance failed. Please try again.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleRevert = () => {
    if (descriptionHistory.length > 0) {
      const lastDescription = descriptionHistory[descriptionHistory.length - 1];
      setFormData((prev) => ({ ...prev, description: lastDescription }));
      setDescriptionHistory((prev) => prev.slice(0, -1));
      toast.success("Reverted to previous version");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return toast.error("Title and description are required");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        codeSnippets: formData.code
          ? [{ language: formData.language, code: formData.code }]
          : [],
      };

      await api.post("/qa/problems", payload);
      toast.success("Problem posted successfully!");
      navigate("/qa");
    } catch (err) {
      console.error("Post Problem Error:", err);
      toast.error(err.response?.data?.message || "Failed to post problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
            Post a Problem
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Explain your challenge clearly to get the best solutions.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 transition-colors"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Problem Title
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. How to implement real-time notifications with Socket.io?"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm dark:text-white pr-10"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <VoiceInput
                  onTranscript={(t) => handleVoiceTranscript("title", t)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm outline-none dark:text-white"
              >
                <option value="technical">Technical</option>
                <option value="operational">Operational</option>
                <option value="programming">Programming</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. react, node, socket.io"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm dark:text-white pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <VoiceInput
                    onTranscript={(t) => handleVoiceTranscript("tags", t)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Detailed Description
              </label>

              <div className="flex items-center gap-2">
                {descriptionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRevert}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                    title="Revert to previous version"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    disabled={isAIProcessing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                      isAIProcessing
                        ? "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                        : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50"
                    }`}
                  >
                    {isAIProcessing ? (
                      <div className="w-3.5 h-3.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles
                        size={14}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    )}
                    AI NARRATE
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${showAIMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showAIMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 mb-1">
                        AI Transformation
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEnhance("expand")}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition flex items-center justify-between group"
                      >
                        Expand to Narrative
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                          Recommended
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnhance("professional")}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition"
                      >
                        Make Professional
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnhance("creative")}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition"
                      >
                        Make Creative
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnhance("concise")}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition"
                      >
                        Make Concise
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative group">
              <textarea
                placeholder="Describe your problem in detail... (Hint: Write a brief summary and use AI Narrate to expand it!)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium min-h-[220px] text-sm resize-none dark:text-white pr-10 ${
                  isAIProcessing ? "opacity-60 grayscale-[0.5]" : ""
                }`}
                required
              />
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <VoiceInput
                  onTranscript={(t) => handleVoiceTranscript("description", t)}
                />
              </div>
              {isAIProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px] rounded-xl z-10">
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 animate-pulse tracking-tight">
                    AI is crafting your narrative...
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code
                  size={16}
                  className="text-indigo-500 dark:text-indigo-400"
                />
                Code Snippet (Optional)
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <div className="relative">
              <textarea
                placeholder="// Paste your code here..."
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="w-full bg-slate-900 text-slate-100 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono text-sm min-h-[150px] pr-10"
              />
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <VoiceInput
                  onTranscript={(t) => handleVoiceTranscript("code", t)}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Publish Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PostProblemPage;
```

### PrivacyPage.jsx

```jsx
import React from "react";
import Layout from "../components/Layout.jsx";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <section
          aria-labelledby="privacy-heading"
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors"
        >
          <h1
            id="privacy-heading"
            className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b dark:border-slate-800 pb-4"
          >
            Privacy Policy
          </h1>

          <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              At IdeaCollab, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our application.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information that you provide directly to us when you
                create an account, post ideas, or communicate with other users.
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-slate-200">
                    Personal Information:
                  </strong>{" "}
                  Name, email address, password, professional headline, skills,
                  and profile picture.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-slate-200">
                    User Content:
                  </strong>{" "}
                  Ideas, descriptions, comments, and messages you share on the
                  platform.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-slate-200">
                    Authentication Data:
                  </strong>{" "}
                  If you use Google Login, we collect your Google ID and basic
                  profile information as authorized by your Google account
                  settings.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>
                  Personalize your experience and suggest relevant collaborators
                  or ideas.
                </li>
                <li>
                  Communicate with you about updates, security alerts, and
                  support messages.
                </li>
                <li>
                  Monitor and analyze usage patterns to enhance platform
                  performance.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                3. Data Sharing and Disclosure
              </h2>
              <p>
                Your profile information (name, skills, bio) and any ideas you
                post publicly are visible to other registered users of the
                platform. We do not sell your personal data to third parties. We
                may share information:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>With your consent or at your direction.</li>
                <li>
                  To comply with legal obligations or protect the rights and
                  safety of our users.
                </li>
                <li>
                  With service providers who perform functions on our behalf
                  (e.g., email delivery, database hosting).
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                4. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                personal information from unauthorized access, alteration, or
                destruction. This includes encryption of sensitive data and
                secure server configurations. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                5. Your Choices and Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>
                  Access, update, or delete your profile information at any time
                  through your account settings.
                </li>
                <li>Opt-out of certain communications.</li>
                <li>Request a copy of the personal data we hold about you.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                6. Changes to This Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </div>

            <div className="border-t dark:border-slate-800 pt-6 mt-10">
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                Last updated: March 14, 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
```

### ProblemDetailPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Check,
  MessageSquare,
  Trash2,
  Reply,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import toast from "react-hot-toast";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewMessage] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubloading] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // ID of solution being replied to
  const [replyText, setReplyText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/qa/problems/${id}`);
      setProblem(res.data);
      const solRes = await api.get(`/qa/problems/${id}/solutions`);
      setSolutions(solRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Problem Error:", err);
      toast.error("Failed to load problem");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const handleDeleteProblem = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/qa/problems/${id}`);
      toast.success("Question deleted successfully");
      navigate("/qa");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete question");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleVoteProblem = async (type) => {
    if (!currentUser) return toast.error("Please login to vote");
    try {
      const res = await api.post(`/qa/problems/${id}/vote`, { type });
      setProblem(res.data);
    } catch (err) {
      toast.error("Voting failed");
    }
  };

  const handleVoteSolution = async (solId, type) => {
    if (!currentUser) return toast.error("Please login to vote");
    try {
      const res = await api.post(`/solutions/${solId}/vote`, { type });
      setSolutions((prev) => prev.map((s) => (s._id === solId ? res.data : s)));
    } catch (err) {
      toast.error("Voting failed");
    }
  };

  const handleAcceptSolution = async (solId) => {
    try {
      const res = await api.post(`/solutions/${solId}/accept`);
      setProblem(res.data.problem);
      // Update all solutions to reflect new acceptance state
      const solRes = await api.get(`/qa/problems/${id}/solutions`);
      setSolutions(solRes.data);
      toast.success("Solution status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSubmitSolution = async (e, isReply = false) => {
    if (e) e.preventDefault();
    const content = isReply ? replyText : newSolution;
    if (!content.trim()) return toast.error("Please provide a solution");

    if (!isReply && isAuthor) {
      return toast.error(
        "You cannot post a solution to your own question. Use replies to respond to others.",
      );
    }

    setSubloading(true);
    try {
      const res = await api.post(`/qa/problems/${id}/solutions`, {
        problemId: id,
        content,
        codeSnippets: !isReply && code ? [{ language, code }] : [],
        parentReply: isReply ? replyTo : null,
      });

      const newSol = { ...res.data, author: currentUser };
      setSolutions((prev) => [...prev, newSol]);

      if (isReply) {
        setReplyText("");
        setReplyTo(null);
      } else {
        setNewMessage("");
        setCode("");
      }
      toast.success(isReply ? "Reply posted!" : "Solution posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post response");
    } finally {
      setSubloading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center py-40">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );

  if (!problem)
    return (
      <Layout>
        <div className="text-center py-40">
          <h2 className="text-2xl font-bold text-slate-800">
            Problem not found
          </h2>
          <Link
            to="/qa"
            className="text-indigo-600 font-bold mt-4 inline-block hover:underline"
          >
            Back to Q&A
          </Link>
        </div>
      </Layout>
    );

  const problemAuthorId = problem.author?._id || problem.author;
  const isAuthor = currentUser?._id === problemAuthorId;

  // Group solutions by parentReply to support threading
  const topLevelSolutions = solutions.filter((s) => !s.parentReply);
  const replies = solutions.filter((s) => s.parentReply);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/qa"
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm flex items-center gap-1 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Q&A
          </Link>

          <div className="flex items-center gap-4">
            {isAuthor && (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-xs font-bold transition-all border border-red-100 dark:border-red-900/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Question
              </button>
            )}
          </div>
        </div>

        {/* Problem Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Voting Sidebar */}
          <div className="flex flex-row md:flex-col items-center gap-2 justify-center md:justify-start">
            <button
              onClick={() => handleVoteProblem("upvote")}
              className={`p-2 rounded-xl border transition-all ${problem.upvotes.includes(currentUser?._id) ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-indigo-200 dark:hover:border-indigo-800 hover:text-indigo-600 dark:hover:text-indigo-400"}`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              {problem.upvotes.length - problem.downvotes.length}
            </span>
            <button
              onClick={() => handleVoteProblem("downvote")}
              className={`p-2 rounded-xl border transition-all ${problem.downvotes.includes(currentUser?._id) ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-100" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400"}`}
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5 ${
                  problem.isResolved
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                    : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
                }`}
              >
                {problem.isResolved ? (
                  <>
                    <Check className="w-3 h-3" strokeWidth={3} />
                    Resolved
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
                    Open
                  </>
                )}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {problem.category}
              </span>
            </div>

            <h1 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 leading-tight">
              {problem.title}
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {problem.description}
              </p>
            </div>

            {problem.codeSnippets.length > 0 && (
              <div className="mb-8 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                  <span>{problem.codeSnippets[0].language}</span>
                </div>
                <pre className="bg-slate-900 text-indigo-300 p-6 overflow-x-auto font-mono text-sm">
                  <code>{problem.codeSnippets[0].code}</code>
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100 dark:border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={
                    problem.author.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(problem.author.name)}`
                  }
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50 dark:ring-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {problem.author.name}
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-lg text-[10px] font-bold">
                      ★ {problem.author.reputation}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Posted on {new Date(problem.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-slate-800 dark:text-white">
                  {problem.views}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              {solutions.length}{" "}
              {solutions.length === 1 ? "Solution" : "Solutions"}
            </h3>
          </div>

          {/* Post Solution Form (Hidden for author unless replying) */}
          {!isAuthor || replyTo ? (
            <div
              id="response-form"
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8"
            >
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <MessageSquare size={18} />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  {replyTo ? "Post a Reply" : "Post a Solution"}
                </h4>
              </div>

              {replyTo && (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                  <p className="text-xs text-indigo-700 font-medium">
                    Replying to{" "}
                    {solutions.find((s) => s._id === replyTo)?.author?.name}'s
                    solution
                  </p>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => handleSubmitSolution(e, !!replyTo)}
                className="space-y-4"
              >
                <textarea
                  value={replyTo ? replyText : newSolution}
                  onChange={(e) =>
                    replyTo
                      ? setReplyText(e.target.value)
                      : setNewMessage(e.target.value)
                  }
                  placeholder={
                    replyTo
                      ? "Type your reply..."
                      : "Explain your solution in detail..."
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm min-h-[120px] dark:text-white resize-none"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Reply className="w-4 h-4" />
                    )}
                    {replyTo ? "Post Reply" : "Post Solution"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center mb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                As the author, you cannot post a solution to your own question.
                <br />
                You can still reply to solutions provided by others.
              </p>
            </div>
          )}

          <div className="space-y-8">
            {topLevelSolutions.map((solution) => (
              <div key={solution._id} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-row md:flex-col items-center gap-2 justify-center md:justify-start">
                    <button
                      onClick={() => handleVoteSolution(solution._id, "upvote")}
                      className={`p-1.5 rounded-lg transition-all ${solution.upvotes.includes(currentUser?._id) ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" : "text-slate-300 dark:text-slate-600 hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {solution.upvotes.length - solution.downvotes.length}
                    </span>
                    <button
                      onClick={() =>
                        handleVoteSolution(solution._id, "downvote")
                      }
                      className={`p-1.5 rounded-lg transition-all ${solution.downvotes.includes(currentUser?._id) ? "text-red-500 bg-red-50 dark:bg-red-900/30" : "text-slate-300 dark:text-slate-600 hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    {solution.isAccepted && (
                      <div
                        className="mt-2 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded-lg"
                        title="Accepted Solution"
                      >
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex-1 bg-white dark:bg-slate-900 border rounded-2xl p-6 transition-all ${solution.isAccepted ? "border-emerald-500 dark:border-emerald-600 shadow-sm" : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"}`}
                  >
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6 whitespace-pre-wrap">
                      {solution.content}
                    </p>

                    {solution.codeSnippets?.length > 0 && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 text-[9px] font-bold uppercase tracking-widest">
                          {solution.codeSnippets[0].language}
                        </div>
                        <pre className="bg-slate-900 text-indigo-300 p-4 font-mono text-xs overflow-x-auto">
                          <code>{solution.codeSnippets[0].code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            solution.author.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.author.name)}`
                          }
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-800 dark:text-white">
                            {solution.author.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                            {new Date(solution.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setReplyTo(
                              solution._id === replyTo ? null : solution._id,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all uppercase tracking-wider"
                        >
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                        {isAuthor && (
                          <button
                            onClick={() => handleAcceptSolution(solution._id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${solution.isAccepted ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50" : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"}`}
                          >
                            {solution.isAccepted
                              ? "Revoke Acceptance"
                              : "Accept Solution"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {replyTo === solution._id && (
                  <div className="ml-12 md:ml-16 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <Reply className="w-3 h-3" />
                      Replying to {solution.author.name}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[100px] mb-4 dark:text-white"
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setReplyTo(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitSolution(null, true)}
                        disabled={submitting}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting && (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                <div className="ml-12 md:ml-16 space-y-4">
                  {replies
                    .filter((r) => r.parentReply === solution._id)
                    .map((reply) => (
                      <div
                        key={reply._id}
                        className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6"
                      >
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              reply.author.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.name)}`
                            }
                            alt=""
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <div>
                            <span className="block text-[10px] font-bold text-slate-800 dark:text-white">
                              {reply.author.name}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Question"
        message="Are you sure you want to permanently delete this question and all its solutions? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteProblem}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDanger={true}
        isLoading={isDeleting}
      />
    </Layout>
  );
};

export default ProblemDetailPage;
```

### ProfilePage.jsx

```jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Camera,
  Shield,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Sun,
  Moon,
  Bell,
  Lock,
  Eye,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Layout from "../components/Layout";
import ConfirmationModal from "../components/ConfirmationModal";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-hot-toast";
import { calculateProfileCompletion } from "../utils/user";
import { jsPDF } from "jspdf";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState("appearance");
  const [newBackupCodes, setNewBackupCodes] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // App Settings State
  const [appSettings, setAppSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: "English",
    twoFactorAuth: false,
  });

  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    headline: user?.headline || "",
    role: user?.role || "",
    skills: (user?.skills || []).join(", "),
  });

  const [socialForm, setSocialForm] = useState({
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    twitter: user?.socialLinks?.twitter || "",
    portfolio: user?.socialLinks?.portfolio || "",
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: user?.privacySettings?.showEmail ?? false,
    showLocation: user?.privacySettings?.showLocation ?? true,
    allowDirectMessages: user?.privacySettings?.allowDirectMessages ?? true,
    profileVisibility: user?.privacySettings?.profileVisibility || "public",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await api.get("/users/activity");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    }
  };

  // Handlers
  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (e) => {
    setSocialForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAppSettingChange = (key) => {
    setAppSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Setting updated", {
      icon: <CheckCircle2 className="text-green-500" size={16} />,
      style: {
        borderRadius: "12px",
        background: theme === "dark" ? "#1e293b" : "#fff",
        color: theme === "dark" ? "#fff" : "#1e293b",
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(profileForm).forEach((key) =>
      formData.append(key, profileForm[key]),
    );
    formData.append("socialLinks", JSON.stringify(socialForm));
    formData.append("privacySettings", JSON.stringify(privacySettings));
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
      toast.success("Profile updated successfully");
      fetchActivity(); // Refresh activity log
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    setIsRegenerating(true);
    try {
      const res = await api.post("/auth/regenerate-backup-codes");
      setNewBackupCodes(res.data.backupCodes);
      toast.success("Backup codes regenerated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to regenerate backup codes",
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const downloadTXT = () => {
    if (!newBackupCodes) return;
    const content = `IdeaCollab Backup Codes\n\nGenerated for: ${user.email}\nDate: ${new Date().toLocaleString()}\n\nCodes:\n${newBackupCodes.join("\n")}\n\nWARNING: Keep these codes safe. Previous codes are now invalid.`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "ideacollab-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = () => {
    if (!newBackupCodes) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("IdeaCollab Backup Codes", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated for: ${user.email}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 42);
    doc.setFontSize(14);
    doc.text("Your New Backup Codes:", 20, 55);

    doc.setFontSize(12);
    newBackupCodes.forEach((code, index) => {
      doc.text(`${index + 1}. ${code}`, 30, 65 + index * 8);
    });

    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(
      "WARNING: These codes replace all your previous backup codes.",
      20,
      150,
    );
    doc.text("Previous codes will no longer work.", 20, 157);

    doc.save("ideacollab-backup-codes.pdf");
  };

  // Components
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap ${
        activeTab === id
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span>{label}</span>
    </button>
  );

  if (!user) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-slate-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            We couldn't load your profile information. Please try logging in
            again.
          </p>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div
              className={`relative group cursor-pointer rounded-full p-1 border-4 transition-all ${
                isDragging
                  ? "border-indigo-500 scale-105"
                  : "border-white dark:border-slate-800"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleAvatarClick}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md">
                <img
                  src={
                    preview ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* User Info Header */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
                  {user?.name}
                </h1>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                  <BarChart3 size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-medium tracking-wider uppercase">
                    Reputation: {user?.reputation || 0}
                  </span>
                </div>
              </div>
              <p className="text-base text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                {user?.headline || "Add a professional headline"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                {user?.location && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <MapPin size={16} />
                    <span>{user?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Briefcase size={16} />
                  <span>{user?.role || "Member"}</span>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: "Followers", value: stats?.followersCount || 0 },
                { label: "Following", value: stats?.followingCount || 0 },
                { label: "Ideas", value: stats?.ideasCount || 0 },
                {
                  label: "Collaborations",
                  value: stats?.collaborationsCount || 0,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800"
                >
                  <div className="text-xl font-semibold text-slate-800 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max md:min-w-0">
            <TabButton id="profile" icon={UserIcon} label="Personal Info" />
            <TabButton
              id="activity"
              icon={Activity}
              label="Activity Timeline"
            />
            <TabButton id="stats" icon={BarChart3} label="Insights" />
            <TabButton id="security" icon={Shield} label="Security" />
            <TabButton id="settings" icon={Settings} label="Settings" />
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                      <UserIcon className="text-indigo-600" size={24} />
                      Basic Information
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Professional Headline
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="headline"
                              value={profileForm.headline}
                              onChange={handleProfileChange}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                              placeholder="e.g. Senior UX Designer"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Primary Role
                          </label>
                          <select
                            name="role"
                            value={profileForm.role}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                          >
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Product Manager">
                              Product Manager
                            </option>
                            <option value="Entrepreneur">Entrepreneur</option>
                            <option value="Investor">Investor</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Location
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="location"
                              value={profileForm.location}
                              onChange={handleProfileChange}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                              placeholder="City, Country"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Bio
                        </label>
                        <div className="relative">
                          <textarea
                            name="bio"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none dark:text-white"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Skills (comma separated)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="skills"
                            value={profileForm.skills}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                            placeholder="React, Node.js, Design Thinking"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                          <Globe className="text-indigo-600" size="20" />
                          Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            {
                              name: "github",
                              label: "GitHub URL",
                              icon: Github,
                            },
                            {
                              name: "linkedin",
                              label: "LinkedIn URL",
                              icon: Linkedin,
                            },
                            {
                              name: "twitter",
                              label: "Twitter URL",
                              icon: Twitter,
                            },
                            {
                              name: "portfolio",
                              label: "Portfolio URL",
                              icon: ExternalLink,
                            },
                          ].map((social) => (
                            <div key={social.name} className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {social.label}
                              </label>
                              <div className="relative">
                                <social.icon
                                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                  size={18}
                                />
                                <input
                                  type="text"
                                  name={social.name}
                                  value={socialForm[social.name]}
                                  onChange={handleSocialChange}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                                  placeholder={`${social.label}...`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle2 size={18} />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <Activity className="text-indigo-600" size={24} />
                    Recent Activity
                  </h2>
                  <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {activities.length > 0 ? (
                      activities.map((log, i) => (
                        <div
                          key={log._id}
                          className="relative flex gap-6 group"
                        >
                          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-50 dark:border-indigo-900/30 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-200 capitalize">
                                {log.action.replace("_", " ")}
                              </span>
                              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {new Date(log.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                              {log.action === "update_profile" &&
                                "You updated your professional profile information."}
                              {log.action === "request_follow" &&
                                `You requested to follow ${log.targetUser?.name}.`}
                              {log.action === "accept_follow" &&
                                `You accepted ${log.targetUser?.name}'s follow request.`}
                              {log.action === "create_idea" &&
                                "You published a new innovation idea."}
                              {log.action === "like_idea" &&
                                "You liked an interesting idea."}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Activity
                          className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                          size={48}
                        />
                        <p className="text-slate-400 dark:text-slate-500 font-medium">
                          No recent activity to show.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2">
                      <BarChart3 className="text-indigo-600" size={24} />
                      Account Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">
                          Collaboration Impact
                        </h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-slate-800 dark:text-white">
                            {stats?.collaborationsCount || 0}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                            Projects
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                          Number of ideas where you are a primary collaborator.
                        </p>
                      </div>
                      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
                          Idea Reach
                        </h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-slate-800 dark:text-white">
                            {stats?.totalLikes || 0}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                            Engagements
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                          Total likes received across all your shared ideas.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                      <Shield className="text-indigo-600" size={24} />
                      Security & Recovery
                    </h2>

                    <div className="space-y-8">
                      {/* Backup Codes Section */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                              Backup Recovery Codes
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Use these codes to recover your account if you
                              lose access to your email.
                            </p>
                          </div>
                          <button
                            onClick={handleRegenerateBackupCodes}
                            disabled={isRegenerating}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isRegenerating ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <Lock size={16} />
                                Regenerate Codes
                              </>
                            )}
                          </button>
                        </div>

                        {newBackupCodes ? (
                          <div className="animate-fade-in space-y-6">
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-4">
                              <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
                                <strong>Warning:</strong> These are your new
                                backup codes. All previous codes have been
                                invalidated. Please save them now as they will
                                not be shown again.
                              </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {newBackupCodes.map((code, idx) => (
                                <div
                                  key={idx}
                                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-center font-mono text-sm tracking-wider text-slate-700 dark:text-slate-300 select-all"
                                >
                                  {code}
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                              <button
                                onClick={downloadTXT}
                                className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus size={14} className="rotate-45" />
                                Download TXT
                              </button>
                              <button
                                onClick={downloadPDF}
                                className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={14} />
                                Download PDF
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                            <Lock
                              className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
                              size={40}
                            />
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Your backup codes are securely stored. <br />
                              Click regenerate if you've lost your previous set.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Password Management */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                              Password Management
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Change your account password regularly to stay
                              secure.
                            </p>
                          </div>
                          <Link
                            to="/change-password"
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                          >
                            Change Password
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-0 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row min-h-[600px]">
                    {/* Settings Sidebar */}
                    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-4 md:p-6 overflow-x-auto scrollbar-hide">
                      <div className="flex md:flex-col gap-1.5 min-w-max md:min-w-0">
                        {[
                          { id: "appearance", label: "Appearance", icon: Eye },
                          {
                            id: "notifications",
                            label: "Notifications",
                            icon: Bell,
                          },
                          {
                            id: "privacy",
                            label: "Privacy & Safety",
                            icon: Shield,
                          },
                          { id: "account", label: "Account", icon: UserIcon },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setSettingsActiveTab(tab.id)}
                            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-2.5 md:py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                              settingsActiveTab === tab.id
                                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <tab.icon size={18} className="flex-shrink-0" />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* Settings Content */}
                    <main className="flex-1 p-8">
                      {settingsActiveTab === "appearance" && (
                        <div className="space-y-6 animate-fade-in">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                              Theme Preference
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                              Choose how IdeaCollab looks to you.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button
                                onClick={() =>
                                  theme === "dark" && toggleTheme()
                                }
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                  theme === "light"
                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-xl ${theme === "light" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                                  >
                                    <Sun size={20} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                                      Light Mode
                                    </p>
                                  </div>
                                </div>
                                {theme === "light" && (
                                  <CheckCircle2
                                    className="text-indigo-600"
                                    size={18}
                                  />
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  theme === "light" && toggleTheme()
                                }
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                  theme === "dark"
                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10"
                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-xl ${theme === "dark" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                                  >
                                    <Moon size={20} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                                      Dark Mode
                                    </p>
                                  </div>
                                </div>
                                {theme === "dark" && (
                                  <CheckCircle2
                                    className="text-indigo-600"
                                    size={18}
                                  />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                              Accessibility
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                  <Smartphone size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                                    Reduced Motion
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Minimize animations
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "notifications" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Notifications
                          </h3>
                          <div className="space-y-4">
                            {[
                              {
                                key: "emailNotifications",
                                label: "Email Notifications",
                                desc: "Receive updates via email",
                                icon: Globe,
                              },
                              {
                                key: "pushNotifications",
                                label: "Push Notifications",
                                desc: "Get real-time alerts",
                                icon: Bell,
                              },
                            ].map((item) => (
                              <div
                                key={item.key}
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                    <item.icon size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={appSettings[item.key]}
                                    onChange={() =>
                                      handleAppSettingChange(item.key)
                                    }
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "privacy" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Privacy & Safety
                          </h3>
                          <div className="space-y-4">
                            {[
                              {
                                key: "showEmail",
                                label: "Public Email",
                                desc: "Show email on your profile",
                              },
                              {
                                key: "showLocation",
                                label: "Public Location",
                                desc: "Display city and country",
                              },
                              {
                                key: "allowDirectMessages",
                                label: "Direct Messages",
                                desc: "Allow users to message you",
                              },
                            ].map((item) => (
                              <div
                                key={item.key}
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl"
                              >
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                                    {item.label}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.desc}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handlePrivacyToggle(item.key)}
                                  className={`w-11 h-6 rounded-full transition-colors relative ${
                                    privacySettings[item.key]
                                      ? "bg-indigo-600"
                                      : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                                >
                                  <div
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                      privacySettings[item.key]
                                        ? "left-6"
                                        : "left-1"
                                    }`}
                                  ></div>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "account" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Account Security
                          </h3>
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                  <Lock size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                                    Two-Factor Auth
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Add extra layer of security
                                  </p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={appSettings.twoFactorAuth}
                                  onChange={() =>
                                    handleAppSettingChange("twoFactorAuth")
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                              <Link
                                to="/change-password"
                                className="block w-full text-center py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                              >
                                Manage Password
                              </Link>
                            </div>
                          </div>

                          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-red-600 mb-6 flex items-center gap-2">
                              <AlertCircle size={20} />
                              Danger Zone
                            </h2>
                            <div className="space-y-4">
                              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="font-bold text-red-900 dark:text-red-400 text-sm">
                                    Logout
                                  </h3>
                                  <p className="text-xs text-red-600 dark:text-red-500">
                                    Sign out of your account on this device.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setIsLogoutModalOpen(true)}
                                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95"
                                >
                                  Logout
                                </button>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="font-bold text-red-900 dark:text-red-400 text-sm">
                                    Delete Account
                                  </h3>
                                  <p className="text-xs text-red-600 dark:text-red-500">
                                    Permanently remove your account and all
                                    data.
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    toast.error(
                                      "Account deletion requires admin confirmation.",
                                    )
                                  }
                                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </main>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Completion Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Profile Strength
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{
                      strokeDashoffset:
                        364.4 -
                        364.4 * (calculateProfileCompletion(user) / 100),
                    }}
                    className="text-indigo-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">
                    {calculateProfileCompletion(user)}%
                  </span>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { label: "Avatar Uploaded", done: !!user?.avatarUrl },
                  { label: "Bio Written", done: !!user?.bio },
                  { label: "Skills Defined", done: user?.skills?.length > 0 },
                  {
                    label: "Socials Linked",
                    done: Object.values(user?.socialLinks || {}).some(
                      (v) => !!v,
                    ),
                  },
                ].map((task, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${task.done ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"}`}
                    >
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                    <span
                      className={
                        task.done
                          ? "text-slate-700 dark:text-slate-300 font-medium"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    >
                      {task.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Member Since
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Status
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                      user?.status === "Active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : user?.status === "Suspended"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {user?.status || "Active"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Verification
                  </span>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Shield size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access your ideas and collaborations."
        confirmText="Logout"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDanger={true}
      />
    </Layout>
  );
};

export default ProfilePage;
```

### QAListPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const QAListPage = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProblems = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (tags) params.tags = tags;

    api
      .get("/qa/problems", { params })
      .then((res) => {
        setProblems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Problems Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProblems();
  }, [search, category, tags]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Q&A Section
            </h1>
            <p className="text-slate-500 text-sm">
              Solve technical problems or post your challenges.
            </p>
          </div>
          <Link
            to="/qa/post"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Post a Problem
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 dark:text-slate-200 text-sm outline-none"
          >
            <option value="">All Categories</option>
            <option value="technical">Technical</option>
            <option value="operational">Operational</option>
            <option value="programming">Programming</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tags (e.g. react, node)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm outline-none dark:text-white"
          />
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : problems.length > 0 ? (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/qa/problem/${problem._id}`}
                className="block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden md:flex flex-col items-center gap-1 min-w-[60px] py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {problem.upvotes.length - problem.downvotes.length}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Votes
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          problem.isResolved
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {problem.isResolved ? "Resolved" : "Open"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        • {problem.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2 truncate">
                      {problem.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            problem.author.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(problem.author.name)}`
                          }
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {problem.author.name}
                        </span>
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {problem.author.reputation}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-300 dark:text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No problems found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto mt-1">
              Try adjusting your filters or search terms to find what you're
              looking for.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QAListPage;
```

### RegisterPage.jsx

```jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { jsPDF } from "jspdf";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Founder",
    skills: "",
    googleId: "",
    avatarUrl: "",
  });
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const downloadTXT = () => {
    if (!backupCodes) return;
    const content = `IdeaCollab Backup Codes\n\nGenerated for: ${form.email}\nDate: ${new Date().toLocaleString()}\n\nCodes:\n${backupCodes.join("\n")}\n\nWARNING: Keep these codes safe. They can be used to reset your password.`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "ideacollab-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = () => {
    if (!backupCodes) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("IdeaCollab Backup Codes", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated for: ${form.email}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 42);
    doc.setFontSize(14);
    doc.text("Your Backup Codes:", 20, 55);

    doc.setFontSize(12);
    backupCodes.forEach((code, index) => {
      doc.text(`${index + 1}. ${code}`, 30, 65 + index * 8);
    });

    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text("WARNING: These codes are for one-time use only.", 20, 150);
    doc.text("Store them securely and never share them with anyone.", 20, 157);

    doc.save("ideacollab-backup-codes.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: isGoogleSignup ? undefined : form.password,
        googleId: form.googleId || undefined,
        avatarUrl: form.avatarUrl || undefined,
        role: form.role,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await api.post("/auth/register", payload);
      toast.success("Account created successfully!");

      // Call login immediately to store token
      login(res.data.token, res.data.user);

      if (res.data.backupCodes) {
        setBackupCodes(res.data.backupCodes);
        setMessage(
          "Account created! PLEASE SAVE YOUR BACKUP CODES. You will only see them once.",
        );
      } else {
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackupCodesDone = () => {
    const token = localStorage.getItem("token"); // Assuming it might be there, but let's be safe
    // If we have backup codes, we probably just got them from the response
    // We need to ensure login() was called if it wasn't already
    navigate("/dashboard");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/google/verify", {
        credential: credentialResponse.credential,
      });

      if (res.data.isNewUser) {
        // User doesn't exist, fill form
        setForm((prev) => ({
          ...prev,
          name: res.data.profile.name || "",
          email: res.data.profile.email || "",
          googleId: res.data.profile.googleId || "",
          avatarUrl: res.data.profile.avatarUrl || "",
        }));
        setIsGoogleSignup(true);
        setMessage(
          "Google profile linked! Please complete your profile details below.",
        );
      } else {
        // User already exists, log in
        toast.success(`Welcome back ${res.data.user.name}!`);
        setMessage("Account exists! Logging you in...");
        login(res.data.token, res.data.user);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.details ||
        err.response?.data?.message ||
        err.message ||
        "Google registration failed";
      setError(`Google Registration Error: ${errorMsg}`);
      console.error(
        "Frontend Google Registration Error:",
        err.response?.data || err,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              Join IdeaCollab
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create your profile and start collaborating on ideas.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {message}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={
                document.documentElement.classList.contains("dark")
                  ? "filled_black"
                  : "outline"
              }
              size="large"
              shape="pill"
              text="signup_with"
              width="100%"
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">
                Or register with email
              </span>
            </div>
          </div>

          {backupCodes ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <svg
                    className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-amber-800 dark:text-amber-300 font-bold">
                      Important: Save these codes!
                    </h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      You will only see these codes once. If you lose your
                      password and can't access your email, these codes are the
                      ONLY way to recover your account.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {backupCodes.map((code, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-center font-mono text-sm tracking-wider text-slate-700 dark:text-slate-300 select-all"
                    >
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={downloadTXT}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download TXT
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>

              <button
                onClick={handleBackupCodesDone}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                I've saved my codes
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white ${
                      isGoogleSignup
                        ? "bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-60"
                        : ""
                    }`}
                    required
                    readOnly={isGoogleSignup}
                  />
                </div>
              </div>

              {!isGoogleSignup && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white appearance-none"
                  >
                    <option>Founder</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>Investor</option>
                    <option>Student</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Skills
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="React, UI/UX..."
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          )}
          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
```

### ReportDetailsPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/client";
import {
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  User as UserIcon,
  ExternalLink,
  ChevronLeft,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Hash,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchReportDetails = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      toast.error("Failed to load report details");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/reports/${id}/status`, { status: newStatus });
      setReport({ ...report, status: newStatus });
      toast.success(`Report status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update report status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50">
            <Clock size={14} /> Pending Review
          </span>
        );
      case "resolved":
        return (
          <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50">
            <CheckCircle size={14} /> Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
            <XCircle size={14} /> Dismissed
          </span>
        );
      default:
        return (
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800/50">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold tracking-wide">
            Loading Report Details...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Moderation Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Report Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                      <ShieldAlert className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        Report Review
                      </h1>
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                        {report.referenceNumber}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="space-y-8">
                  {/* Category & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Violation Category
                      </p>
                      <p className="text-sm font-black text-red-600 dark:text-red-400 uppercase">
                        {report.category}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Submission Date
                      </p>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {new Date(report.createdAt).toLocaleDateString(
                          undefined,
                          { dateStyle: "long" },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Complaint Context */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare size={16} className="text-indigo-500" />
                      Complaint Context
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic whitespace-pre-wrap break-words">
                        "{report.context}"
                      </p>
                    </div>
                  </div>

                  {/* Moderator Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-indigo-500" />
                      Take Action
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleStatusUpdate("dismissed")}
                        disabled={updating || report.status === "dismissed"}
                        className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2.5"
                      >
                        <XCircle size={16} /> DISMISS REPORT
                      </button>
                      <button
                        onClick={() => handleStatusUpdate("resolved")}
                        disabled={updating || report.status === "resolved"}
                        className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10 dark:shadow-none"
                      >
                        <CheckCircle size={16} /> MARK AS RESOLVED
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Idea Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-widest">
                Reported Content
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <h4 className="text-base font-black text-slate-800 dark:text-white mb-2 line-clamp-2">
                    {report.idea?.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">
                    {report.idea?.description}
                  </p>
                  <Link
                    to={`/ideas/${report.idea?._id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-slate-800 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all border border-indigo-100 dark:border-indigo-900/50 uppercase"
                  >
                    View Original Idea <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-widest">
                People Involved
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img
                    src={
                      report.reporter?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name)}&background=random`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Reporter
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {report.reporter?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img
                    src={
                      report.idea?.owner?.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(report.idea?.owner?.name)}&background=random`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Content Owner
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {report.idea?.owner?.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDetailsPage;
```

### SavedIdeasPage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const SavedIdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/saved-ideas")
      .then((res) => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">
          Saved Ideas
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          Loading saved ideas...
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.length > 0 ? (
            ideas.map((idea) => (
              <Link
                key={idea._id}
                to={`/ideas/${idea._id}`}
                className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {idea.title}
                  </h3>
                  <span className="text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5">
                    {idea.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                  {idea.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {idea.owner?.name}
                    </span>
                    <LikeButton idea={idea} />
                    <SaveButton idea={idea} />
                  </div>
                  <span>{idea.collaborators?.length || 0} collaborators</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-sm text-slate-500 dark:text-slate-400 text-center border border-slate-100 dark:border-slate-800">
              You haven't saved any ideas yet.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default SavedIdeasPage;
```

### TermsPage.jsx

```jsx
import React from "react";
import Layout from "../components/Layout.jsx";

const TermsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <section
          aria-labelledby="terms-heading"
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors"
        >
          <h1
            id="terms-heading"
            className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b dark:border-slate-800 pb-4"
          >
            Terms of Service
          </h1>

          <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using IdeaCollab, you agree to be bound by
                these Terms of Service. If you do not agree to all of these
                terms, do not use this application.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                2. User Accounts
              </h2>
              <p>
                To use certain features of the service, you must register for an
                account. You are responsible for maintaining the confidentiality
                of your account credentials and for all activities that occur
                under your account.
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>You must be at least 13 years old to use this service.</li>
                <li>
                  You agree to provide accurate and complete information during
                  registration.
                </li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                3. User Content
              </h2>
              <p>
                You retain ownership of the ideas, comments, and other content
                you post on IdeaCollab. However, by posting content, you grant
                IdeaCollab a worldwide, non-exclusive, royalty-free license to
                use, copy, reproduce, process, adapt, modify, publish, transmit,
                and display such content.
              </p>
              <p className="mt-2">
                You are solely responsible for the content you post and ensure
                that it does not violate any third-party rights, including
                intellectual property or privacy rights.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                4. Prohibited Conduct
              </h2>
              <p>
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Harassing, threatening, or intimidating other users.</li>
                <li>Posting spam, malware, or any other malicious content.</li>
                <li>
                  Attempting to interfere with the proper functioning of the
                  service.
                </li>
                <li>
                  Using the service for any illegal or unauthorized purpose.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                5. Intellectual Property
              </h2>
              <p>
                The IdeaCollab name, logo, and all original content and features
                are the exclusive property of IdeaCollab and its licensors.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                6. Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to the
                service immediately, without prior notice or liability, for any
                reason, including if you breach the Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
                7. Limitation of Liability
              </h2>
              <p>
                In no event shall IdeaCollab be liable for any indirect,
                incidental, special, consequential, or punitive damages arising
                out of or in connection with your use of the service.
              </p>
            </div>

            <div className="border-t dark:border-slate-800 pt-6 mt-10">
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                Last updated: March 14, 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TermsPage;
```

### UserProfilePage.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Shield,
  Activity,
  BarChart3,
  Briefcase,
  ExternalLink,
  MessageCircle,
  UserPlus,
  UserMinus,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import { useAuth } from "../context/AuthContext.jsx";
import { normalizeUser, calculateProfileCompletion } from "../utils/user.js";
import { toast } from "react-hot-toast";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  // States
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  // Interaction states
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (currentUser && profileUser) {
      setIsFollowing(currentUser.following?.includes(profileUser._id));
    }
  }, [currentUser, profileUser]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [userRes, statsRes, activityRes, ideasRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/users/stats/${id}`),
        api.get(`/users/activity/${id}`),
        api.get(`/ideas/user/${id}`),
      ]);

      const normalized = normalizeUser(userRes.data);
      setProfileUser(normalized);
      setStats(statsRes.data);
      setActivities(activityRes.data);
      setUserIdeas(ideasRes.data);
      setIsRequested(userRes.data.isRequested || false);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
      setError(
        err.response?.status === 403
          ? "You are not authorized to view this profile."
          : "User not found",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await api.put(`/users/${profileUser._id}/follow`);

      if (res.data.status === "requested") {
        setIsRequested(true);
        toast.success("Follow request sent");
      } else if (res.data.status === "request_cancelled") {
        setIsRequested(false);
        toast.info("Follow request cancelled");
      } else if (res.data.status === "unfollowed") {
        updateUser({ following: res.data.following });
        setIsFollowing(false);
        toast.info("Unfollowed");
        // Update stats locally
        setStats((prev) => ({
          ...prev,
          followersCount: prev.followersCount - 1,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-red-50 dark:border-red-900/30">
          <Shield className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
          >
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  if (!profileUser)
    return (
      <Layout>
        <div className="text-center mt-20 text-slate-500 dark:text-slate-400 font-bold">
          User profile not found.
        </div>
      </Layout>
    );

  const isMe = currentUser?._id === profileUser._id;

  // Components
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
        activeTab === id
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
                <img
                  src={
                    profileUser.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=random`
                  }
                  alt={profileUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* User Info Header */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                  {profileUser.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      profileUser.status === "Active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : profileUser.status === "Suspended"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {profileUser.status}
                  </span>
                </div>
              </div>
              <p className="text-lg text-indigo-600 dark:text-indigo-400 font-semibold mb-4">
                {profileUser.headline || `${profileUser.role} at Idea Collab`}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                {profileUser.privacySettings?.showEmail && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <Mail size={16} />
                    <span>{profileUser.email}</span>
                  </div>
                )}
                {profileUser.privacySettings?.showLocation &&
                  profileUser.location && (
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <MapPin size={16} />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Briefcase size={16} />
                  <span>{profileUser.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Clock size={16} />
                  <span>
                    Joined{" "}
                    {new Date(profileUser.createdAt).toLocaleDateString(
                      undefined,
                      { month: "long", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {!isMe && (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                        isFollowing
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          : isRequested
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700"
                      }`}
                    >
                      {followLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : isFollowing ? (
                        <UserMinus size={18} />
                      ) : (
                        <UserPlus size={18} />
                      )}
                      {isFollowing
                        ? "Unfollow"
                        : isRequested
                          ? "Requested"
                          : "Follow"}
                    </button>
                    {profileUser.privacySettings?.allowDirectMessages && (
                      <Link
                        to={`/messages?user=${profileUser._id}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                      >
                        <MessageCircle size={18} />
                        Message
                      </Link>
                    )}
                  </>
                )}
                {isMe && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
                  >
                    Edit My Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: "Followers", value: stats?.followersCount || 0 },
                { label: "Following", value: stats?.followingCount || 0 },
                { label: "Ideas", value: stats?.ideasCount || 0 },
                { label: "Collabs", value: stats?.collaborationsCount || 0 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-center min-w-[80px] border border-transparent dark:border-slate-700 transition-colors"
                >
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <TabButton id="profile" icon={Activity} label="Overview" />
          <TabButton id="ideas" icon={Globe} label="Shared Ideas" />
          <TabButton id="activity" icon={Activity} label="Activity" />
          <TabButton id="insights" icon={BarChart3} label="Insights" />
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* About Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Shield
                        className="text-indigo-600 dark:text-indigo-400"
                        size={24}
                      />
                      About {profileUser.name.split(" ")[0]}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                      {profileUser.bio || "This user hasn't shared a bio yet."}
                    </p>

                    <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                      Top Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skills.length > 0 ? (
                        profileUser.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700 transition-colors"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-sm italic">
                          No skills listed.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Social Section */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                      <Globe
                        className="text-indigo-600 dark:text-indigo-400"
                        size={24}
                      />
                      Connect
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "github",
                          label: "GitHub",
                          icon: Github,
                          color:
                            "hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        },
                        {
                          name: "linkedin",
                          label: "LinkedIn",
                          icon: Linkedin,
                          color:
                            "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                        },
                        {
                          name: "twitter",
                          label: "Twitter",
                          icon: Twitter,
                          color:
                            "hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20",
                        },
                        {
                          name: "portfolio",
                          label: "Portfolio",
                          icon: ExternalLink,
                          color:
                            "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                        },
                      ].map((social) => {
                        const url = profileUser.socialLinks?.[social.name];
                        if (!url) return null;
                        return (
                          <a
                            key={social.name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group ${social.color}`}
                          >
                            <social.icon
                              size={20}
                              className="text-slate-400 dark:text-slate-500 group-hover:text-current"
                            />
                            <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-current">
                              {social.label}
                            </span>
                            <ExternalLink
                              size={14}
                              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        );
                      })}
                      {!Object.values(profileUser.socialLinks || {}).some(
                        (v) => !!v,
                      ) && (
                        <p className="text-slate-400 dark:text-slate-500 text-sm italic col-span-full">
                          No social links provided.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "ideas" && (
                <motion.div
                  key="ideas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                      <Globe
                        className="text-indigo-600 dark:text-indigo-400"
                        size={24}
                      />
                      Shared Innovation Ideas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userIdeas.length > 0 ? (
                        userIdeas.map((idea) => (
                          <Link
                            key={idea._id}
                            to={`/ideas/${idea._id}`}
                            className="group block bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-5 border border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-xl dark:hover:shadow-none transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="px-3 py-1 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100 dark:border-slate-700">
                                {idea.category}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {new Date(idea.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                              {idea.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                              {idea.description}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100/50 dark:border-slate-700/50">
                              <span className="flex items-center gap-1">
                                ❤️ {idea.likes?.length || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                🤝 {idea.collaborators?.length || 0}
                              </span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full py-12 text-center">
                          <Globe
                            className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                            size={48}
                          />
                          <p className="text-slate-400 dark:text-slate-500 font-bold">
                            No ideas shared publicly yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <Activity
                      className="text-indigo-600 dark:text-indigo-400"
                      size={24}
                    />
                    Recent Activity
                  </h2>
                  <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {activities.length > 0 ? (
                      activities.map((log, i) => (
                        <div
                          key={log._id}
                          className="relative flex gap-6 group"
                        >
                          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-50 dark:border-indigo-900/30 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                                {log.action.replace("_", " ")}
                              </span>
                              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {new Date(log.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                              {log.action === "update_profile" &&
                                `${profileUser.name} updated their professional profile.`}
                              {log.action === "request_follow" &&
                                `${profileUser.name} requested to follow ${log.targetUser?.name}.`}
                              {log.action === "accept_follow" &&
                                `${profileUser.name} accepted a new follow request.`}
                              {log.action === "create_idea" &&
                                `${profileUser.name} published a new innovation idea.`}
                              {log.action === "like_idea" &&
                                `${profileUser.name} liked an interesting project.`}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Activity
                          className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
                          size={48}
                        />
                        <p className="text-slate-400 dark:text-slate-500 font-medium">
                          No recent activity to show.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "insights" && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                      <BarChart3
                        className="text-indigo-600 dark:text-indigo-400"
                        size={24}
                      />
                      Contribution Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">
                          Collaboration Impact
                        </h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">
                            {stats?.collaborationsCount || 0}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                            Projects
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                          Number of ideas where this user is an active
                          collaborator.
                        </p>
                      </div>
                      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">
                          Community Reach
                        </h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900 dark:text-white">
                            {stats?.totalLikes || 0}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                            Engagements
                          </span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                          Total community likes received across all shared
                          ideas.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Completion Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Profile Strength
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{
                      strokeDashoffset:
                        364.4 -
                        364.4 * (calculateProfileCompletion(profileUser) / 100),
                    }}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {calculateProfileCompletion(profileUser)}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium px-4">
                This user has completed{" "}
                {calculateProfileCompletion(profileUser)}% of their professional
                profile.
              </p>
            </div>

            {/* Verification Widget */}
            <div className="bg-indigo-600 dark:bg-indigo-900/30 rounded-3xl p-6 shadow-lg shadow-indigo-100 dark:shadow-none text-white border border-transparent dark:border-indigo-800/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 dark:bg-indigo-600/30 rounded-xl">
                  <Shield size={20} />
                </div>
                <h3 className="text-lg font-bold">Verified Member</h3>
              </div>
              <p className="text-indigo-100 dark:text-indigo-300 text-sm leading-relaxed mb-6">
                {profileUser.name} is a verified innovator on Idea Collab,
                contributing to high-impact projects.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                <Clock size={14} />
                <span>Active contributor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
```

### UserPage.jsx

```jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User as UserIcon,
  ShieldCheck,
  Mail,
  MapPin,
} from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const searchTimeoutRef = useRef(null);

  const fetchUsers = async (query = "", pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/users/search?query=${query}&page=${pageNum}&limit=12`,
      );
      const { users: newUsers, pages, total } = res.data;

      if (append) {
        setUsers((prev) => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setHasMore(pageNum < pages);
      setTotalUsers(total);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(value, 1, false);
    }, 500);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUsers(search, nextPage, true);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <UserIcon
                className="text-indigo-600 dark:text-indigo-400"
                size={28}
              />
              Community Network
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Connect with {totalUsers} talented creators across the platform.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by name, role, email or skills..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-800 dark:text-white shadow-sm text-lg"
          />
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col items-center text-center group"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-xl border-2 border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-95">
                  <img
                    src={
                      user.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                    }
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {user.reputation > 50 && (
                  <div
                    className="absolute -top-1 -right-1 bg-amber-400 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-100 dark:border-slate-800"
                    title="High Reputation"
                  >
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                {user.name}
              </h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full inline-block">
                {user.role || "Member"}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 h-10 leading-relaxed italic">
                {user.headline || user.bio || "Crafting something amazing..."}
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 mb-6 min-h-[32px]">
                {user.skills &&
                  user.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-bold border border-slate-100 dark:border-slate-700"
                    >
                      #{skill}
                    </span>
                  ))}
                {user.skills && user.skills.length > 3 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold self-center">
                    +{user.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="inline-flex items-center justify-center w-full bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-2xl text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-sm">
                  View Profile
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading / Load More / No Results States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-400 mb-4"></div>
            <p className="font-bold text-sm uppercase tracking-widest">
              Searching...
            </p>
          </div>
        )}

        {!loading && hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-8 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm active:scale-95"
            >
              Load More Creators
            </button>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-24 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="mb-6 text-slate-200 dark:text-slate-800">
              <Search size={64} className="mx-auto" strokeWidth={1} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              No creators found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Try searching for a different name, role, or skill set.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UsersPage;
```

## Backend

### aiController.js

```js
const Groq = require("groq-sdk");

// Check if API key is loaded
if (!process.env.GROQ_API_KEY) {
  console.error(
    "CRITICAL ERROR: GROQ_API_KEY is not defined in the environment!",
  );
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const getAIResponse = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key is missing. Please check your .env file.");
    }

    // System prompt to set context
    const systemInstruction = `You are the IdeaCollab AI Assistant. 
    IdeaCollab is a platform where users can post startup ideas, collaborate with others, and find developers or designers.
    Your goal is to help users navigate the platform and provide advice on their business ideas.
    Keep your responses helpful, concise, and professional. Use Markdown for formatting if needed.`;

    // Format history for Groq (expects { role, content })
    // history might be in Gemini format { role, parts: [{ text }] } or standard { role, content }
    const formattedHistory = (history || []).map((h) => {
      if (h.parts && h.parts[0]) {
        return {
          role: h.role === "model" ? "assistant" : "user",
          content: h.parts[0].text,
        };
      }
      return {
        role: h.role === "model" ? "assistant" : h.role,
        content: h.content || h.text,
      };
    });

    const messages = [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: message },
    ];

    console.log("Sending message to Groq (llama-3.3-70b-versatile):", message);
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    console.log("Received response from Groq:", response);

    res.json({ response });
  } catch (error) {
    console.error("Groq AI Full Error Details:", {
      message: error.message,
      stack: error.stack,
      apiKeyPresent: !!process.env.GROQ_API_KEY,
    });
    res.status(500).json({
      message: "AI processing failed",
      details: error.message,
    });
  }
};

const enhanceDescription = async (req, res) => {
  const { text, mode, title, category } = req.body;

  if (!text && mode !== "generate") {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    let systemInstruction = `You are an expert startup consultant and copywriter for IdeaCollab. 
    Your goal is to help users improve their startup idea descriptions. 
    Always maintain a high standard of quality, clarity, and engagement.
    Keep the output within 2000 characters.`;

    let userPrompt = "";

    switch (mode) {
      case "professional":
        userPrompt = `Rewrite this startup idea description to be more professional, formal, and suitable for investors: "${text}"`;
        break;
      case "creative":
        userPrompt = `Rewrite this startup idea description to be more creative, visionary, and inspiring: "${text}"`;
        break;
      case "concise":
        userPrompt = `Make this startup idea description more concise and punchy, while keeping all key information: "${text}"`;
        break;
      case "expand":
        userPrompt = `Expand this brief startup idea or problem description into a comprehensive, engaging narrative. 
        Provide detailed context, potential use cases, and elaborate on the core value proposition. 
        The original text is: "${text}". 
        Title: "${title || "N/A"}". 
        Category: "${category || "N/A"}". 
        Return ONLY the expanded description, no conversational text.`;
        break;
      case "grammar":
        userPrompt = `Correct the grammar, spelling, and punctuation of this description without changing its meaning: "${text}"`;
        break;
      case "suggest":
        userPrompt = `The user is writing a description for an idea titled "${title || "N/A"}" in the category "${category || "N/A"}". They have written: "${text}". Provide 2-3 short, contextually relevant sentences to complete or continue their thought. Return ONLY the suggested additions, no conversational text.`;
        break;
      case "generate":
        userPrompt = `Generate a compelling startup idea description based on the title "${title || "Untitled"}" and category "${category || "General"}".`;
        break;
      default:
        userPrompt = `Refine and improve this startup idea description for better clarity and impact: "${text}"`;
    }

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";

    // For suggestions, we might want to clean up the output
    let finalResponse = response.trim();
    if (mode === "suggest") {
      // Remove quotes if the AI added them
      finalResponse = finalResponse.replace(/^["']|["']$/g, "");
    }

    res.json({
      enhancedText: finalResponse,
      metadata: {
        mode,
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-versatile",
      },
    });
  } catch (error) {
    console.error("Groq AI Enhancement Error:", error);
    res
      .status(500)
      .json({
        message: "Failed to enhance description",
        details: error.message,
      });
  }
};

module.exports = { getAIResponse, enhanceDescription };
```

### authController.js

```js
const User = require("../models/User");
const BackupCode = require("../models/BackupCode");
const EmailOtp = require("../models/EmailOtp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const emailValidator = require("email-validator");
const dns = require("dns").promises;
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { createNotification } = require("./notificationController");
const { formatUserResponse } = require("../utils/userUtils");
const {
  generateBackupCodes,
  hashBackupCode,
} = require("../utils/backupCodeUtils");
const ActivityLog = require("../models/ActivityLog");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Basic syntax check
    if (!emailValidator.validate(email)) {
      return res.status(400).json({
        exists: false,
        valid: false,
        message: "Invalid email format",
      });
    }

    // 2. Database check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        exists: true,
        valid: true,
        message: "Email already registered",
      });
    }

    // 3. Domain/MX record check (Advanced verification)
    const domain = email.split("@")[1];
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({
          exists: false,
          valid: false,
          message: "Email domain does not exist or cannot receive emails",
        });
      }
    } catch (dnsError) {
      console.error("DNS MX Resolve Error:", dnsError);
      return res.status(400).json({
        exists: false,
        valid: false,
        message: "Invalid email domain",
      });
    }

    res.json({
      exists: false,
      valid: true,
      message: "Email is valid and available",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !emailValidator.validate(email)) {
      return res
        .status(400)
        .json({ message: "A valid email address is required" });
    }

    // Rate limiting check (e.g., max 3 requests per 10 mins) - simplified for now
    const recentOtp = await EmailOtp.findOne({
      email,
      createdAt: { $gt: new Date(Date.now() - 60000) }, // 1 minute cooldown
    });

    if (recentOtp) {
      return res
        .status(429)
        .json({
          message:
            "Please wait at least 60 seconds before requesting another code.",
        });
    }

    // Generate 6-digit secure OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store in DB (upsert)
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true },
    );

    // Professional HTML Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
          <p style="color: #6b7280; font-size: 14px;">Connect. Create. Collaborate.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; text-align: center;">
          <h2 style="color: #111827; margin-top: 0;">Verification Code</h2>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Please use the following code to verify your email address:</p>
          <div style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 5px; margin-bottom: 24px; padding: 15px; background: white; border: 2px dashed #e5e7eb; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} IdeaCollab. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email with fallback logging
    try {
      const sent = await sendEmail({
        email,
        subject: "Verification Code - IdeaCollab",
        message: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent,
      });

      if (!sent) {
        throw new Error("Email delivery returned false status");
      }

      console.log(`[OTP GENERATED] Success for ${email}`);
      res.json({ message: "Verification code sent to your email" });
    } catch (emailError) {
      console.error(
        `[OTP FAILURE] Delivery failed for ${email}:`,
        emailError.message,
      );

      // If email fails, we still keep the OTP in DB for 10 mins,
      // but inform the user about the delivery failure.
      res.status(503).json({
        message:
          "We're having trouble delivering the code. Please try again later or contact support.",
        technical: emailError.message,
      });
    }
  } catch (error) {
    console.error(`[OTP CRITICAL] Error in sendOtp for ${email}:`, error);
    res.status(500).json({
      message: "An internal error occurred. Please try again later.",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await EmailOtp.findOne({ email, otp });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // Success - we'll delete the record later after registration
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, headline, skills, googleId, avatarUrl } =
    req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create user (password is optional if googleId is present)
    const userData = {
      name,
      email,
      password, // Might be undefined for Google signups
      role,
      headline,
      skills,
    };

    // Only add googleId and avatarUrl if they are provided
    if (googleId) userData.googleId = googleId;
    if (avatarUrl) userData.avatarUrl = avatarUrl;

    const user = await User.create(userData);

    if (user) {
      // Generate initial backup codes
      const rawBackupCodes = generateBackupCodes();
      const hashedBackupCodes = await Promise.all(
        rawBackupCodes.map(async (code) => ({
          user: user._id,
          hashedCode: await hashBackupCode(code),
        })),
      );

      await BackupCode.insertMany(hashedBackupCodes);

      // Mark as generated
      user.backupCodesGenerated = true;
      await user.save();

      // Log the generation
      await ActivityLog.create({
        user: user._id,
        action: "generate_backup_codes",
        metadata: { source: "registration" },
      });

      res.status(201).json({
        token: generateToken(user._id),
        user: formatUserResponse(user),
        backupCodes: rawBackupCodes, // Only returned once
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleVerify = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      // User exists, so return token (login)
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatarUrl) user.avatarUrl = picture;
        await user.save();
      }
      return res.json({
        isNewUser: false,
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } else {
      // User doesn't exist, return profile info to autofill registration
      return res.json({
        isNewUser: true,
        profile: {
          name,
          email,
          googleId,
          avatarUrl: picture,
        },
      });
    }
  } catch (error) {
    console.error("Google Verification Error:", error);
    res
      .status(401)
      .json({ message: "Google verification failed", details: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but hasn't linked Google yet, link it
      if (!user.googleId) {
        user.googleId = googleId;
        // Optionally update picture if they don't have one
        if (!user.avatarUrl) user.avatarUrl = picture;
        await user.save();
      }

      console.log(`[AUTH SUCCESS] Google Login: ${email} (${user._id})`);
    } else {
      // SECURITY FIX: Prevent auto-registration during login flow
      console.warn(
        `[AUTH FAILURE] Unrecognized Google account attempt: ${email}`,
      );
      return res.status(401).json({
        message: "This Google account is not registered. Please sign up first.",
        errorCode: "USER_NOT_FOUND",
      });
    }

    res.json({
      token: generateToken(user._id),
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Detailed Google Login Error:", {
      message: error.message,
      stack: error.stack,
      audience: process.env.GOOGLE_CLIENT_ID,
      token_provided: !!credential,
    });
    res.status(401).json({
      message: "Google authentication failed",
      details: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !emailValidator.validate(email)) {
      return res
        .status(400)
        .json({ message: "A valid email address is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res
        .status(200)
        .json({
          message:
            "If an account exists with that email, we've sent instructions to reset your password.",
        });
    }

    // Rate limiting check
    const recentOtp = await EmailOtp.findOne({
      email,
      createdAt: { $gt: new Date(Date.now() - 60000) },
    });

    if (recentOtp) {
      return res
        .status(429)
        .json({
          message:
            "Please wait at least 60 seconds before requesting another code.",
        });
    }

    // Generate 6-digit secure OTP for password reset
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store in DB (upsert)
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true },
    );

    // Professional HTML Email Template for Password Reset
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; text-align: center;">
          <h2 style="color: #111827; margin-top: 0;">Password Reset Code</h2>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Please use the following code to reset your password:</p>
          <div style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 5px; margin-bottom: 24px; padding: 15px; background: white; border: 2px dashed #e5e7eb; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">This code will expire in 10 minutes.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email,
      subject: "Password Reset Code - IdeaCollab",
      message: `Your password reset code is: ${otp}`,
      html: htmlContent,
    });

    res.json({ message: "Password reset code sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyBackupCode = async (req, res) => {
  const { email, backupCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all unused backup codes for this user
    const userBackupCodes = await BackupCode.find({
      user: user._id,
      usedStatus: false,
    });

    // Compare with bcrypt
    let foundCode = null;
    for (const codeRecord of userBackupCodes) {
      const isMatch = await bcrypt.compare(backupCode, codeRecord.hashedCode);
      if (isMatch) {
        foundCode = codeRecord;
        break;
      }
    }

    if (!foundCode) {
      // Check if it's already used for a better error message
      const allBackupCodes = await BackupCode.find({ user: user._id });
      for (const record of allBackupCodes) {
        if (
          record.usedStatus &&
          (await bcrypt.compare(backupCode, record.hashedCode))
        ) {
          return res
            .status(400)
            .json({ message: "This backup code has already been used" });
        }
      }
      return res.status(400).json({ message: "Invalid backup code" });
    }

    // Atomic update to mark as used
    foundCode.usedStatus = true;
    foundCode.usedAt = new Date();
    await foundCode.save();

    // Log the usage
    await ActivityLog.create({
      user: user._id,
      action: "use_backup_code",
      metadata: { codeId: foundCode._id },
    });

    // Provide a short-lived token for password reset
    const resetToken = jwt.sign(
      { id: user._id, type: "backup_code_reset" },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.json({
      message: "Backup code validated successfully",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.regenerateBackupCodes = async (req, res) => {
  try {
    const user = req.user;

    // 1. Invalidate all previous backup codes
    await BackupCode.deleteMany({ user: user._id });

    // 2. Generate new set
    const rawBackupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      rawBackupCodes.map(async (code) => ({
        user: user._id,
        hashedCode: await hashBackupCode(code),
      })),
    );

    await BackupCode.insertMany(hashedBackupCodes);

    // 3. Update User model
    user.backupCodesGenerated = true;
    await user.save();

    // 4. Log the regeneration
    await ActivityLog.create({
      user: user._id,
      action: "regenerate_backup_codes",
      metadata: { source: "user_request" },
    });

    res.json({
      message: "New backup codes generated successfully",
      backupCodes: rawBackupCodes, // Only returned once
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword, mode, resetToken } = req.body;

  try {
    let user;

    if (mode === "backup_code") {
      // Verify reset token
      if (!resetToken) {
        return res
          .status(400)
          .json({
            message: "Reset token is required for backup code recovery",
          });
      }

      try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.type !== "backup_code_reset") {
          return res.status(400).json({ message: "Invalid reset token type" });
        }
        user = await User.findById(decoded.id);
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Reset token expired or invalid" });
      }
    } else {
      // 1. Verify OTP
      const otpRecord = await EmailOtp.findOne({ email, otp });
      if (!otpRecord) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification code" });
      }

      // 2. Find user
      user = await User.findOne({ email });

      // Cleanup OTP
      await EmailOtp.deleteOne({ _id: otpRecord._id });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Enforce password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // 4. Update password
    user.password = newPassword;
    await user.save();

    // 5. Log the action
    await ActivityLog.create({
      user: user._id,
      action: "reset_password",
      metadata: { method: mode === "backup_code" ? "backup_code" : "otp" },
    });

    // 6. Send notification email
    const successHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
          <h2 style="color: #111827; margin-top: 0;">Password Reset Successful</h2>
          <p style="color: #374151; font-size: 16px;">Hello ${user.name},</p>
          <p style="color: #374151; font-size: 16px;">Your password has been successfully reset. You can now log in with your new password.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you did not perform this action, please contact our support team immediately.</p>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>&copy; ${new Date().getFullYear()} IdeaCollab. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Successful - IdeaCollab",
        message: `Hello ${user.name},\n\nYour password has been successfully reset. If you did not perform this action, please contact support immediately.\n\nBest regards,\nIdeaCollab Team`,
        html: successHtml,
      });
    } catch (emailError) {
      console.error("Failed to send password reset success email:", emailError);
    }

    res.json({
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Enforce password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    user.password = newPassword;
    await user.save();

    // Send email notification
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Changed - Idea Collab",
        message: `Hello ${user.name},\n\nYour password was successfully changed. If you did not make this change, please contact support immediately.\n\nBest regards,\nIdea Collab Team`,
      });
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError);
      // Don't fail the request if email fails
    }

    // Create persistent notification
    await createNotification(req, {
      recipient: user._id,
      type: "success",
      title: "Password Changed",
      message: "Your password has been successfully updated.",
      relatedId: user._id,
      relatedModel: "User",
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ email: identifier });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        headline: user.headline,
        skills: user.skills,
        location: user.location,
        bio: user.bio,
        socialLinks: user.socialLinks,
        savedIdeas: user.savedIdeas || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### chatController.js

```js
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

exports.sendMessage = async (req, res) => {
  const { receiverId, conversationId, content, replyTo } = req.body;
  const file = req.file;

  if (!content && !file) {
    return res
      .status(400)
      .json({ message: "Message content or attachment required" });
  }

  try {
    const messageData = {
      sender: req.user._id,
      content: content || "",
      replyTo: replyTo || undefined,
    };

    if (file) {
      const isImage = file.mimetype.startsWith("image/");
      const fileType = isImage ? "image" : "document";

      messageData.attachment = {
        url: `/uploads/${file.filename}`,
        fileType,
        originalName: file.originalname,
      };
    }

    // Handle Group Message
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Group not found" });
      }
      if (!conversation.members.includes(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You are not a member of this group" });
      }

      messageData.conversationId = conversationId;
      const message = await Message.create(messageData);
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name avatarUrl")
        .populate({
          path: "replyTo",
          populate: { path: "sender", select: "name" },
        });

      // Update last message in conversation
      conversation.lastMessage = message._id;
      await conversation.save();

      // Emit to group room
      req.io
        .to(`group:${conversationId}`)
        .emit("chat:message", populatedMessage);

      return res.status(201).json(populatedMessage);
    }

    // Handle 1-on-1 Message
    if (receiverId) {
      messageData.receiver = receiverId;
      const message = await Message.create(messageData);
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name avatarUrl")
        .populate({
          path: "replyTo",
          populate: { path: "sender", select: "name" },
        });

      // Find or Create 1-on-1 Conversation to track reordering
      let conversation = await Conversation.findOne({
        isGroup: false,
        members: { $all: [req.user._id, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          isGroup: false,
          members: [req.user._id, receiverId],
          lastMessage: message._id,
        });
      } else {
        conversation.lastMessage = message._id;
        // Trigger updatedAt change for sorting
        conversation.markModified("updatedAt");
        await conversation.save();
      }

      // Emit to receiver's room
      req.io.to(receiverId).emit("chat:message", populatedMessage);

      return res.status(201).json(populatedMessage);
    }

    return res.status(400).json({ message: "Receiver or Group ID required" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !members || members.length === 0) {
    return res
      .status(400)
      .json({ message: "Group name and members are required" });
  }

  try {
    // Add creator to members if not already included
    const memberIds = [...new Set([...members, req.user._id.toString()])];

    const group = await Conversation.create({
      name,
      isGroup: true,
      admin: req.user._id,
      members: memberIds,
    });

    const populatedGroup = await group.populate("members", "name avatarUrl");

    // Notify members (optional, can be done via socket)
    memberIds.forEach((memberId) => {
      if (memberId !== req.user._id.toString()) {
        req.io.to(memberId).emit("group:created", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const groups = await Conversation.find({ members: req.user._id })
      .populate("lastMessage")
      .populate({
        path: "members",
        select: "name avatarUrl headline role",
      })
      .sort({ updatedAt: -1 });

    const formattedConversations = groups.map((conv) => {
      if (conv.isGroup) {
        return {
          _id: conv._id,
          name: conv.name,
          avatarUrl: conv.avatarUrl,
          isGroup: true,
          type: "group",
          lastMessage: conv.lastMessage,
          updatedAt: conv.updatedAt,
        };
      } else {
        const otherUser = conv.members.find(
          (m) => m._id.toString() !== req.user._id.toString(),
        );
        return {
          _id: otherUser?._id,
          conversationId: conv._id,
          name: otherUser?.name,
          avatarUrl: otherUser?.avatarUrl,
          headline: otherUser?.headline,
          role: otherUser?.role,
          type: "user",
          lastMessage: conv.lastMessage,
          updatedAt: conv.updatedAt,
        };
      }
    });

    res.json(formattedConversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({
      conversationId: groupId,
      deletedBy: { $ne: req.user._id },
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatarUrl")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "name" },
      });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
      deletedBy: { $ne: req.user._id },
      conversationId: { $exists: false }, // Ensure only 1-on-1 messages
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatarUrl")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "name" },
      });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name avatarUrl")
      .populate({
        path: "replyTo",
        populate: { path: "sender", select: "name" },
      });

    // Emit socket update
    const room = message.conversationId
      ? `group:${message.conversationId}`
      : message.receiver.toString();
    req.io.to(room).emit("chat:message_updated", populatedMessage);
    // Also emit to sender (in case they are on multiple devices)
    req.io
      .to(req.user._id.toString())
      .emit("chat:message_updated", populatedMessage);

    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.translateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { targetLanguage } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check if translation already exists
    if (message.translations && message.translations.get(targetLanguage)) {
      return res.json({
        translation: message.translations.get(targetLanguage),
      });
    }

    // Use Groq/AI to translate (as specified in previous task context, Groq is available)
    const Groq = require("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage}. Detect the source language automatically. Return ONLY the translated text.`,
        },
        {
          role: "user",
          content: message.content,
        },
      ],
      model: "llama3-8b-8192",
    });

    const translatedText = completion.choices[0]?.message?.content?.trim();

    if (!message.translations) message.translations = new Map();
    message.translations.set(targetLanguage, translatedText);
    await message.save();

    res.json({ translation: translatedText });
  } catch (error) {
    console.error("Translation Error:", error);
    res
      .status(500)
      .json({ message: "Translation failed", details: error.message });
  }
};

// ... keep existing delete/clear/read methods ...
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { type } = req.query; // 'me' or 'everyone'

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isSender = message.sender.toString() === req.user._id.toString();

    // If type is 'everyone' and user is sender, delete for everyone
    if (type === "everyone") {
      if (!isSender) {
        return res
          .status(403)
          .json({
            message: "You can only delete your own messages for everyone",
          });
      }
      await Message.deleteOne({ _id: messageId });

      if (message.conversationId) {
        req.io
          .to(`group:${message.conversationId}`)
          .emit("chat:message_deleted", { messageId });
      } else {
        req.io.emit("chat:message_deleted", { messageId }); // Broad implementation, could be optimized
      }

      return res.json({ message: "Message unsent" });
    }

    // Default or type='me': Delete for me
    await Message.updateOne(
      { _id: messageId },
      { $addToSet: { deletedBy: req.user._id } },
    );
    return res.json({ message: "Message deleted for you" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.clearChat = async (req, res) => {
  const { partnerId, groupId } = req.body;

  try {
    if (groupId) {
      // Clear group chat for user
      await Message.updateMany(
        { conversationId: groupId },
        { $addToSet: { deletedBy: req.user._id } },
      );
    } else {
      // Clear 1-on-1 chat
      await Message.updateMany(
        {
          $or: [
            { sender: req.user._id, receiver: partnerId },
            { sender: partnerId, receiver: req.user._id },
          ],
          conversationId: { $exists: false },
        },
        {
          $addToSet: { deletedBy: req.user._id },
        },
      );
    }

    res.json({ message: "Chat cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    // Count unread 1-on-1 messages
    const oneOnOneCount = await Message.countDocuments({
      receiver: req.user._id,
      read: false,
    });

    // Count unread group messages
    // This is trickier without a "readBy" array in messages or a separate UserConversation state.
    // For now, let's stick to 1-on-1 unread count or implement basic group unread if feasible.
    // Given the constraints, I'll stick to 1-on-1 count for the badge to ensure stability.

    res.json({ count: oneOnOneCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { senderId, groupId } = req.body;
  try {
    if (groupId) {
      // Mark group messages as read?
      // Current schema only has boolean `read`. This works for 1-on-1 but not groups (one person reading shouldn't mark for all).
      // For groups, we need `readBy: [UserId]`.
      // I'll skip group read receipts for this iteration to keep it simple, or just not support it yet.
      return res.json({
        message: "Group read receipts not fully supported yet",
      });
    }

    const result = await Message.updateMany(
      {
        sender: senderId,
        receiver: req.user._id,
        read: false,
      },
      { $set: { read: true } },
    );

    if (result.modifiedCount > 0) {
      req.io.to(senderId).emit("chat:read", {
        readerId: req.user._id,
      });
    }

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### collaborationController.js

```js
const CollaborationRequest = require("../models/CollaborationRequest");
const Idea = require("../models/Idea");
const { createNotification } = require("./notificationController");

// Send a collaboration request
exports.createRequest = async (req, res) => {
  const { ideaId, message } = req.body;

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to your own idea" });
    }

    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      sender: req.user._id,
      idea: ideaId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already pending" });
    }

    // Check if already a collaborator
    if (idea.collaborators.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are already a collaborator" });
    }

    const request = new CollaborationRequest({
      sender: req.user._id,
      receiver: idea.owner,
      idea: ideaId,
      message,
    });

    const createdRequest = await request.save();

    // Populate for response
    await createdRequest.populate("sender", "name avatarUrl headline");
    await createdRequest.populate("idea", "title");

    // Create persistent notification
    await createNotification(req, {
      recipient: idea.owner,
      type: "info",
      title: "Collaboration Request",
      message: `${req.user.name} requested to collaborate on "${idea.title}"`,
      relatedId: createdRequest._id,
      relatedModel: "CollaborationRequest",
    });

    // Optional: Emit socket event to receiver (Handled by createNotification now, but 'collaboration:request' might be used for badge count)
    // We keep 'collaboration:request' if frontend relies on it specifically for badge count,
    // OR we update frontend to use notification count.
    // The Layout.jsx uses 'collaboration:request' to increment pendingCount.
    // So we should keep emitting it OR update createNotification to support custom events.
    // Since createNotification emits 'notification:new', we might need both.
    // SECURITY FIX: Only emit to recipient if it's NOT the sender
    if (idea.owner.toString() !== req.user._id.toString()) {
      req.io
        .to(idea.owner.toString())
        .emit("collaboration:request", createdRequest);
    }

    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests received by the current user
exports.getRequestsForMe = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ receiver: req.user._id })
      .populate("sender", "name avatarUrl headline role")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests sent by the current user
exports.getRequestsByMe = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ sender: req.user._id })
      .populate("receiver", "name avatarUrl")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body; // "accepted" or "rejected"
  const { id } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await CollaborationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const idea = await Idea.findById(request.idea);
      if (idea) {
        if (!idea.collaborators.includes(request.sender)) {
          idea.collaborators.push(request.sender);
          await idea.save();
        }
      }

      // Notify sender
      await createNotification(req, {
        recipient: request.sender,
        type: "success",
        title: "Request Accepted",
        message: `Your request to collaborate on "${request.idea.title}" was accepted`,
        relatedId: request.idea,
        relatedModel: "Idea",
      });
    } else if (status === "rejected") {
      // Notify sender
      await createNotification(req, {
        recipient: request.sender,
        type: "error",
        title: "Request Rejected",
        message: `Your request to collaborate on "${request.idea.title}" was rejected`,
        relatedId: request.idea,
        relatedModel: "Idea",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests (incoming and outgoing) for the current user
exports.getAllRequests = async (req, res) => {
  try {
    const incoming = await CollaborationRequest.find({ receiver: req.user._id })
      .populate("sender", "name avatarUrl headline role")
      .populate("idea", "title")
      .sort({ createdAt: -1 });

    const outgoing = await CollaborationRequest.find({ sender: req.user._id })
      .populate("receiver", "name avatarUrl")
      .populate("idea", "title")
      .sort({ createdAt: -1 });

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRequestCount = async (req, res) => {
  try {
    const count = await CollaborationRequest.countDocuments({
      receiver: req.user._id,
      status: "pending",
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### ideaController.js

```js
const Idea = require("../models/Idea");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const jwt = require("jsonwebtoken");

const getUserFromToken = async (req) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.id).select("-password");
    } catch (error) {
      return null;
    }
  }
  return null;
};

exports.createIdea = async (req, res) => {
  const { title, description, category, tags, visibility, allowedCommenters } =
    req.body;
  const files = req.files;

  try {
    const attachments = files
      ? files.map((file) => {
          const isImage = file.mimetype.startsWith("image/");
          return {
            url: `/uploads/${file.filename}`,
            fileType: isImage ? "image" : "document",
            originalName: file.originalname,
          };
        })
      : [];

    // Parse tags if it comes as string (multipart/form-data sends array as individual fields or stringified)
    // When using FormData, arrays often need manual parsing if sent as comma-separated string
    let parsedTags = tags;
    if (typeof tags === "string") {
      parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const idea = new Idea({
      title,
      description,
      category,
      tags: parsedTags,
      visibility: visibility || "public",
      allowedCommenters: allowedCommenters || "anyone",
      owner: req.user._id,
      attachments,
    });

    const createdIdea = await idea.save();

    // Populate owner for the socket event
    await createdIdea.populate("owner", "name headline role avatarUrl status");

    // Emit real-time event
    req.io.emit("idea:created", createdIdea);

    res.status(201).json(createdIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    // Check comment permissions
    const isOwner = idea.owner.toString() === req.user._id.toString();

    if (!isOwner) {
      if (idea.allowedCommenters === "none") {
        return res
          .status(403)
          .json({ message: "Comments are disabled for this idea" });
      }
      if (idea.allowedCommenters === "connections") {
        // Check if current user follows the idea owner
        // user.following is array of ObjectIds.
        // We need to compare string values or use .equals()
        const isFollowing = req.user.following.some(
          (id) => id.toString() === idea.owner.toString(),
        );

        if (!isFollowing) {
          return res
            .status(403)
            .json({ message: "Only connections can comment on this idea" });
        }
      }
    }

    const comment = {
      user: req.user._id,
      text,
    };

    idea.comments.push(comment);
    await idea.save();

    // Notify owner if commenter is not owner
    if (idea.owner.toString() !== req.user._id.toString()) {
      await createNotification(req, {
        recipient: idea.owner,
        type: "info",
        title: "New Comment",
        message: `${req.user.name} commented on "${idea.title}"`,
        relatedId: idea._id,
        relatedModel: "Idea",
      });
    }

    await idea.populate("comments.user", "name avatarUrl");

    // Emit updated idea
    // Note: We might want to emit just the comment, but idea:updated covers it
    const updatedIdea = await Idea.findById(idea._id)
      .populate("owner", "name headline role avatarUrl status")
      .populate("collaborators", "name role avatarUrl status")
      .populate("comments.user", "name avatarUrl status");

    req.io.emit("idea:updated", updatedIdea);

    res.status(201).json(idea.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });

    const comment = idea.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() !== req.user._id.toString() &&
      idea.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    idea.comments.pull(req.params.commentId);
    await idea.save();

    const updatedIdea = await Idea.findById(idea._id)
      .populate("owner", "name headline role avatarUrl")
      .populate("collaborators", "name role avatarUrl")
      .populate("comments.user", "name avatarUrl");

    req.io.emit("idea:updated", updatedIdea);

    res.json(idea.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeas = async (req, res) => {
  const { search, category } = req.query;

  try {
    const user = await getUserFromToken(req);
    let query = {};

    if (user) {
      // Ensure user.following is an array
      const following = user.following || [];

      // Logged in: show public OR (connections AND following owner) OR own ideas
      query.$or = [
        { visibility: "public" },
        {
          visibility: "connections",
          owner: { $in: following },
        },
        { owner: user._id },
      ];
    } else {
      // Not logged in: show only public
      query = { visibility: "public" };
    }

    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };

      if (query.$or) {
        // If we already have an $or for visibility, we need to AND it with the search
        query = {
          $and: [
            query, // The visibility logic
            searchCondition,
          ],
        };
      } else {
        // If query was just { visibility: "public" }
        query = { ...query, ...searchCondition };
      }
    }

    if (category) {
      // If query became complex with $and, we add category to that
      if (query.$and) {
        query.$and.push({ category: { $regex: category, $options: "i" } });
      } else {
        query.category = { $regex: category, $options: "i" };
      }
    }

    console.log(
      `[GET IDEAS] User: ${user ? user.email : "Guest"}, Query: ${JSON.stringify(query)}`,
    );

    const ideas = await Idea.find(query)
      .populate("owner", "name headline role avatarUrl status")
      .populate("collaborators", "name role avatarUrl status")
      .sort({ createdAt: -1 });

    console.log(`[GET IDEAS] Found ${ideas.length} ideas.`);
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeasByUser = async (req, res) => {
  try {
    const query = { owner: req.params.userId };
    const isOwner = req.user._id.toString() === req.params.userId;

    if (!isOwner) {
      const isFollowing = req.user.following.includes(req.params.userId);

      if (isFollowing) {
        // Show public and connections
        query.visibility = { $in: ["public", "connections"] };
      } else {
        // Show only public
        query.visibility = "public";
      }
    }

    const ideas = await Idea.find(query)
      .populate("owner", "name headline role avatarUrl")
      .populate("collaborators", "name role avatarUrl")
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate("owner", "name headline role avatarUrl status")
      .populate("collaborators", "name role avatarUrl status")
      .populate("comments.user", "name avatarUrl status");

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const user = await getUserFromToken(req);
    let canView = false;
    let canComment = false;

    if (idea.visibility === "public") {
      canView = true;
    } else if (user) {
      const isOwner = idea.owner._id.toString() === user._id.toString();
      if (isOwner) {
        canView = true;
      } else if (idea.visibility === "connections") {
        // Check if user follows owner
        if (user.following.includes(idea.owner._id)) {
          canView = true;
        }
      }
    }

    if (!canView) {
      return res
        .status(403)
        .json({ message: "You do not have permission to view this idea" });
    }

    // Determine if user can comment
    if (user) {
      const isOwner = idea.owner._id.toString() === user._id.toString();
      if (isOwner) {
        canComment = true;
      } else {
        if (idea.allowedCommenters === "anyone") {
          canComment = true;
        } else if (idea.allowedCommenters === "connections") {
          if (user.following.includes(idea.owner._id)) {
            canComment = true;
          }
        }
      }
    }

    const ideaObj = idea.toObject();
    ideaObj.canComment = canComment;

    res.json(ideaObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateIdea = async (req, res) => {
  const { title, description, category, tags, visibility, allowedCommenters } =
    req.body;

  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check ownership
    if (idea.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this idea" });
    }

    idea.title = title || idea.title;
    idea.description = description || idea.description;
    idea.category = category || idea.category;
    idea.tags = tags || idea.tags;
    if (visibility) idea.visibility = visibility;
    if (allowedCommenters) idea.allowedCommenters = allowedCommenters;

    const updatedIdea = await idea.save();

    await updatedIdea.populate("owner", "name headline role avatarUrl status");
    await updatedIdea.populate("collaborators", "name role avatarUrl status");

    req.io.emit("idea:updated", updatedIdea);

    res.json(updatedIdea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check ownership
    if (idea.owner.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this idea" });
    }

    await idea.deleteOne();

    req.io.emit("idea:deleted", req.params.id);

    res.json({ message: "Idea removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Check if already liked
    const userIdStr = req.user._id.toString();
    const index = idea.likes.findIndex((id) => id.toString() === userIdStr);
    const alreadyLiked = index !== -1;

    if (!alreadyLiked) {
      // Like
      idea.likes.push(req.user._id);
    } else {
      // Unlike
      idea.likes.splice(index, 1);
    }

    const updated = await idea.save();

    // Populate for consistent event payload
    await updated.populate("owner", "name headline role avatarUrl");
    await updated.populate("collaborators", "name role avatarUrl");

    // Send notification to owner if liked by someone else and it's a new like
    if (
      !alreadyLiked &&
      idea.owner._id.toString() !== req.user._id.toString()
    ) {
      await createNotification(req, {
        recipient: idea.owner._id,
        type: "info",
        title: "New Like",
        message: `${req.user.name} liked your idea "${idea.title}"`,
        relatedId: idea._id,
        relatedModel: "Idea",
      });
    }

    // Emit real-time update
    if (req.io) {
      req.io.emit("idea:updated", updated);
    }

    res.json(updated.likes);
  } catch (err) {
    next(err);
  }
};
```

### notificationController.js

```js
const Notification = require("../models/Notification");

// Helper function to create notification (can be used by other controllers)
exports.createNotification = async (
  req,
  { recipient, type, title, message, relatedId, relatedModel },
) => {
  try {
    // SECURITY FIX: Prevent self-notification
    if (req.user && recipient.toString() === req.user._id.toString()) {
      console.log(
        `[NOTIFICATION SKIP] Prevented self-notification for user: ${req.user.email}`,
      );
      return null;
    }

    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      relatedId,
      relatedModel,
    });

    // Emit socket event
    if (req.io) {
      req.io.to(recipient.toString()).emit("notification:new", notification);
    }

    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Get notifications with filtering, sorting, and pagination
exports.getNotifications = async (req, res) => {
  try {
    const {
      type,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    const query = { recipient: req.user._id };

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search in title or message
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Chronological (newest first)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      notifications,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // Array of IDs, or empty for "mark all"

    const query = { recipient: req.user._id };
    if (ids && ids.length > 0) {
      query._id = { $in: ids };
    } else {
      query.isRead = false; // Only mark unread ones if marking all
    }

    await Notification.updateMany(query, { isRead: true });

    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notifications
exports.deleteNotifications = async (req, res) => {
  try {
    const { ids } = req.body; // Array of IDs

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No notifications selected" });
    }

    await Notification.deleteMany({
      recipient: req.user._id,
      _id: { $in: ids },
    });

    res.json({ message: "Notifications deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### qaController.js

```js
const Problem = require("../models/Problem");
const Solution = require("../models/Solution");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { createNotification } = require("./notificationController");

// Reputation constants
const REPUTATION_UPVOTE_PROBLEM = 2;
const REPUTATION_UPVOTE_SOLUTION = 5;
const REPUTATION_ACCEPT_SOLUTION = 15;

/**
 * Helper to log activity
 */
const logActivity = async (userId, action, metadata = {}) => {
  try {
    await ActivityLog.create({ user: userId, action, metadata });
  } catch (error) {
    console.error("Activity Logging Error:", error);
  }
};

/**
 * Update user reputation
 */
const updateReputation = async (userId, amount) => {
  try {
    await User.findByIdAndUpdate(userId, { $inc: { reputation: amount } });
  } catch (error) {
    console.error("Reputation Update Error:", error);
  }
};

/**
 * Create a new problem
 */
exports.createProblem = async (req, res) => {
  const { title, description, tags, category, codeSnippets } = req.body;

  try {
    const problem = await Problem.create({
      title,
      description,
      tags,
      category,
      codeSnippets,
      author: req.user._id,
    });

    await logActivity(req.user?._id || "system", "create_problem", {
      problemId: problem._id,
    });

    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a problem (Soft-delete with cascade and audit logging)
 */
exports.deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Deletion Rights: Only author can delete
    if (problem.author.toString() !== req.user?._id?.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this problem" });
    }

    // Soft-delete problem
    problem.isDeleted = true;
    problem.deletedAt = new Date();
    await problem.save();

    // Cascade deletion of solutions (soft-delete)
    await Solution.updateMany(
      { problemId: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );

    // Audit logging
    await logActivity(req.user?._id || "system", "delete_problem", {
      problemId: id,
      deletedAt: problem.deletedAt,
      title: problem.title,
    });

    res.json({
      message: "Problem and associated solutions deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a solution (Soft-delete with audit logging)
 */
exports.deleteSolution = async (req, res) => {
  const { id } = req.params;

  try {
    const solution = await Solution.findById(id);
    if (!solution)
      return res.status(404).json({ message: "Solution not found" });

    // Deletion Rights: Only author can delete
    if (solution.author.toString() !== req.user?._id?.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this solution" });
    }

    // Soft-delete solution
    solution.isDeleted = true;
    solution.deletedAt = new Date();
    await solution.save();

    // Audit logging
    await logActivity(req.user?._id || "system", "delete_solution", {
      solutionId: id,
      deletedAt: solution.deletedAt,
      content: solution.content.substring(0, 50),
    });

    res.json({ message: "Solution deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all problems with search and filters
 */
exports.getProblems = async (req, res) => {
  const { search, tags, category, sort } = req.query;
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (tags) {
    query.tags = { $in: tags.split(",") };
  }
  if (category) {
    query.category = category;
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "votes") {
    sortQuery = { upvotes: -1 };
  } else if (sort === "views") {
    sortQuery = { views: -1 };
  }

  try {
    const problems = await Problem.find(query)
      .populate("author", "name avatarUrl reputation")
      .sort(sortQuery);
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get problem by ID
 */
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate("author", "name avatarUrl reputation")
      .populate("acceptedSolution");

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Increment views
    problem.views += 1;
    await problem.save();

    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vote on a problem
 */
exports.voteProblem = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'upvote' or 'downvote'

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const userId = req.user._id;
    const hasUpvoted = problem.upvotes.includes(userId);
    const hasDownvoted = problem.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        problem.upvotes.pull(userId);
        await updateReputation(problem.author, -REPUTATION_UPVOTE_PROBLEM);
      } else {
        problem.upvotes.push(userId);
        if (hasDownvoted) problem.downvotes.pull(userId);
        await updateReputation(problem.author, REPUTATION_UPVOTE_PROBLEM);
      }
    } else {
      if (hasDownvoted) {
        problem.downvotes.pull(userId);
      } else {
        problem.downvotes.push(userId);
        if (hasUpvoted) {
          problem.upvotes.pull(userId);
          await updateReputation(problem.author, -REPUTATION_UPVOTE_PROBLEM);
        }
      }
    }

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Submit a solution
 */
exports.createSolution = async (req, res) => {
  const { content, codeSnippets, parentReply } = req.body;
  const problemId = req.body.problemId || req.params.problemId;

  try {
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Solution content is required" });
    }

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID is required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.error(`[SOLUTION ERROR] Problem not found: ${problemId}`);
      return res.status(404).json({ message: "Problem not found" });
    }

    // Self-Reply Restriction: Prevent author from replying to their own question
    // This applies only if it's a top-level reply (parentReply is null)
    const currentUserId = req.user?._id;
    const authorId = problem.author._id || problem.author;

    if (!parentReply && authorId.toString() === currentUserId?.toString()) {
      return res
        .status(403)
        .json({
          message:
            "You cannot reply to your own question. Use the edit feature for updates.",
        });
    }

    // Permission check for nested replies:
    // User can reply to others' reactions (solutions) even on their own question.
    if (parentReply) {
      const parentSolution = await Solution.findById(parentReply);
      if (!parentSolution)
        return res.status(404).json({ message: "Parent reply not found" });

      // Prevent replying to own solutions/replies
      const parentAuthorId = parentSolution.author._id || parentSolution.author;
      if (parentAuthorId.toString() === currentUserId?.toString()) {
        return res
          .status(403)
          .json({ message: "You cannot reply to your own response." });
      }
    }

    const solution = await Solution.create({
      problemId,
      content,
      codeSnippets,
      parentReply,
      author: currentUserId,
    });

    // Create notification for problem author (if not the one replying)
    if (authorId.toString() !== currentUserId?.toString()) {
      await createNotification(req, {
        recipient: authorId,
        type: "info",
        title: parentReply ? "New Reply" : "New Solution",
        message: parentReply
          ? `${req.user?.name || "Someone"} replied to a solution on your problem: ${problem.title}`
          : `${req.user?.name || "Someone"} submitted a solution to your problem: ${problem.title}`,
        relatedId: problem._id,
        relatedModel: "Problem",
      });
    }

    // If it's a reply to someone's solution, notify the solution author
    if (parentReply) {
      const parentSolution = await Solution.findById(parentReply);
      if (parentSolution) {
        const parentAuthorId =
          parentSolution.author._id || parentSolution.author;
        if (parentAuthorId.toString() !== currentUserId?.toString()) {
          await createNotification(req, {
            recipient: parentAuthorId,
            type: "info",
            title: "New Reply",
            message: `${req.user?.name || "Someone"} replied to your solution on: ${problem.title}`,
            relatedId: problem._id,
            relatedModel: "Problem",
          });
        }
      }
    }

    await logActivity(currentUserId || "system", "create_solution", {
      problemId,
      solutionId: solution._id,
      isNested: !!parentReply,
    });

    res.status(201).json(solution);
  } catch (error) {
    console.error(
      `[SOLUTION CRITICAL] Error creating solution for ${problemId}:`,
      error,
    );
    res
      .status(500)
      .json({ message: "Failed to post solution due to internal error" });
  }
};

/**
 * Get solutions for a problem
 */
exports.getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ problemId: req.params.problemId })
      .populate("author", "name avatarUrl reputation")
      .sort({ upvotes: -1, createdAt: 1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vote on a solution
 */
exports.voteSolution = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const solution = await Solution.findById(id);
    if (!solution)
      return res.status(404).json({ message: "Solution not found" });

    const userId = req.user._id;
    const hasUpvoted = solution.upvotes.includes(userId);
    const hasDownvoted = solution.downvotes.includes(userId);

    if (type === "upvote") {
      if (hasUpvoted) {
        solution.upvotes.pull(userId);
        await updateReputation(solution.author, -REPUTATION_UPVOTE_SOLUTION);
      } else {
        solution.upvotes.push(userId);
        if (hasDownvoted) solution.downvotes.pull(userId);
        await updateReputation(solution.author, REPUTATION_UPVOTE_SOLUTION);
      }
    } else {
      if (hasDownvoted) {
        solution.downvotes.pull(userId);
      } else {
        solution.downvotes.push(userId);
        if (hasUpvoted) {
          solution.upvotes.pull(userId);
          await updateReputation(solution.author, -REPUTATION_UPVOTE_SOLUTION);
        }
      }
    }

    await solution.save();
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Accept a solution
 */
exports.acceptSolution = async (req, res) => {
  const { id } = req.params;

  try {
    const solution = await Solution.findById(id).populate("problemId");
    if (!solution)
      return res.status(404).json({ message: "Solution not found" });

    const problem = solution.problemId;
    if (problem.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the problem author can accept a solution" });
    }

    // Toggle acceptance
    if (solution.isAccepted) {
      solution.isAccepted = false;
      problem.isResolved = false;
      problem.acceptedSolution = undefined;
      await updateReputation(solution.author, -REPUTATION_ACCEPT_SOLUTION);
      await logActivity(req.user?._id || "system", "revoke_solution", {
        solutionId: id,
        problemId: problem._id,
      });
    } else {
      // Un-accept previous solution if any
      if (problem.acceptedSolution) {
        const prevSolution = await Solution.findById(problem.acceptedSolution);
        if (prevSolution) {
          prevSolution.isAccepted = false;
          await prevSolution.save();
          await updateReputation(
            prevSolution.author,
            -REPUTATION_ACCEPT_SOLUTION,
          );
        }
      }

      solution.isAccepted = true;
      problem.isResolved = true;
      problem.acceptedSolution = solution._id;
      await updateReputation(solution.author, REPUTATION_ACCEPT_SOLUTION);
      await logActivity(req.user?._id || "system", "accept_solution", {
        solutionId: id,
        problemId: problem._id,
      });

      // Notify solution author
      await createNotification(req, {
        recipient: solution.author,
        type: "success",
        title: "Solution Accepted!",
        message: `Your solution was accepted for: ${problem.title}`,
        relatedId: problem._id,
        relatedModel: "Problem",
      });
    }

    await solution.save();
    await problem.save();

    res.json({ problem, solution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### reportController.js

```js
const Report = require("../models/Report");
const Idea = require("../models/Idea");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Create a new report
exports.createReport = async (req, res) => {
  const { ideaId, category, context } = req.body;

  // 1. Mandatory context validation (500 character minimum as requested)
  if (!context || context.length < 500) {
    return res.status(400).json({
      message: "Context is mandatory and must be at least 500 characters long.",
      currentLength: context ? context.length : 0,
    });
  }

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // 2. Prevent duplicate reports from same user within 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      idea: ideaId,
      createdAt: { $gte: last24Hours },
    });

    if (existingReport) {
      return res.status(400).json({
        message:
          "You have already reported this idea in the last 24 hours. Please wait for moderation.",
      });
    }

    // 3. Generate reference number
    const referenceNumber = `REP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const report = new Report({
      reporter: req.user._id,
      idea: ideaId,
      category,
      context,
      referenceNumber,
    });

    const savedReport = await report.save();

    // 4. Automated Notification System (Moderation Team Alert)
    // For this project, let's assume all users with role 'admin' are moderators.
    const admins = await User.find({ role: "admin" });

    // Alert via dashboard notifications and email
    const notificationPromises = admins.map((admin) =>
      createNotification(req, {
        recipient: admin._id,
        type: "error", // High priority
        title: "New Content Report",
        message: `A new report (${referenceNumber}) has been submitted for idea: "${idea.title}"`,
        relatedId: savedReport._id,
        relatedModel: "Report",
      }),
    );

    // Alert via email (Mock/Real depending on SMTP)
    const emailPromises = admins.map((admin) =>
      sendEmail({
        email: admin.email,
        subject: `[MODERATION] New Report: ${referenceNumber}`,
        message: `A new report has been submitted.\n\nIdea: ${idea.title}\nCategory: ${category}\nReporter: ${req.user.name}\nReference: ${referenceNumber}\n\nPlease review in the dashboard.`,
        html: `<h3>New Content Report</h3>
               <p><strong>Reference:</strong> ${referenceNumber}</p>
               <p><strong>Idea:</strong> ${idea.title}</p>
               <p><strong>Category:</strong> ${category}</p>
               <p><strong>Reporter:</strong> ${req.user.name}</p>
               <p><strong>Context:</strong> ${context}</p>
               <hr>
               <p>Please log in to the moderation dashboard to take action.</p>`,
      }),
    );

    // We don't block the response for notifications/emails
    Promise.all([...notificationPromises, ...emailPromises]).catch((err) =>
      console.error("Moderator alert failed:", err),
    );

    res.status(201).json({
      message: "Report received successfully.",
      referenceNumber: savedReport.referenceNumber,
      report: savedReport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports (Moderator only)
exports.getAllReports = async (req, res) => {
  console.log(
    `[REPORTS FETCH] Fetching all reports for user: ${req.user._id} with role: ${req.user.role}`,
  );

  if (req.user.role !== "admin") {
    console.warn(
      `[REPORTS FETCH] Access denied for user: ${req.user._id} with role: ${req.user.role}`,
    );
    return res.status(403).json({ message: "Access denied. Moderators only." });
  }

  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    console.log(
      `[REPORTS FETCH] Successfully fetched ${reports.length} reports`,
    );
    res.json(reports);
  } catch (error) {
    console.error(`[REPORTS FETCH] Error fetching reports:`, error);
    res.status(500).json({ message: error.message });
  }
};

// Update report status (Moderator only)
exports.updateReportStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Moderators only." });
  }

  const { status } = req.body;
  if (!["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({ message: `Report status updated to ${status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single report by ID (Moderator only)
exports.getReportById = async (req, res) => {
  console.log(
    `[REPORT FETCH] Fetching report ID: ${req.params.id} for user: ${req.user._id}`,
  );

  if (req.user.role !== "admin") {
    console.warn(
      `[REPORT FETCH] Access denied for user: ${req.user._id} with role: ${req.user.role}`,
    );
    return res.status(403).json({ message: "Access denied. Moderators only." });
  }

  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name email avatarUrl")
      .populate({
        path: "idea",
        select: "title description owner visibility category createdAt",
        populate: {
          path: "owner",
          select: "name email avatarUrl",
        },
      });

    if (!report) {
      console.warn(`[REPORT FETCH] Report not found: ${req.params.id}`);
      return res.status(404).json({ message: "Report not found" });
    }

    console.log(
      `[REPORT FETCH] Successfully fetched report: ${report.referenceNumber}`,
    );
    res.json(report);
  } catch (error) {
    console.error(`[REPORT FETCH] Error fetching report:`, error);
    res.status(500).json({ message: error.message });
  }
};
```

### userController.js

```js
const User = require("../models/User");
const FollowRequest = require("../models/FollowRequest");
const ActivityLog = require("../models/ActivityLog");
const { createNotification } = require("./notificationController");
const { formatUserResponse } = require("../utils/userUtils");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(formatUserResponse(user));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "name avatarUrl headline role",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "name avatarUrl headline role",
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivityLog = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const logs = await ActivityLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("targetUser", "name avatarUrl");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const user = await User.findById(userId);

    // Count user's ideas
    const Idea = require("../models/Idea");
    const ideasCount = await Idea.countDocuments({ owner: userId });

    // Count total likes on user's ideas
    const ideas = await Idea.find({ owner: userId }, "likes");
    const totalLikes = ideas.reduce(
      (sum, idea) => sum + (idea.likes?.length || 0),
      0,
    );

    // Count collaborations
    const collaborationsCount = await Idea.countDocuments({
      collaborators: userId,
    });

    res.json({
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      ideasCount,
      totalLikes,
      collaborationsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleSaveIdea = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const ideaId = req.params.id;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize savedIdeas if it doesn't exist
    if (!user.savedIdeas) {
      user.savedIdeas = [];
    }

    const index = user.savedIdeas.indexOf(ideaId);

    if (index === -1) {
      // Add to saved
      user.savedIdeas.push(ideaId);
    } else {
      // Remove from saved
      user.savedIdeas.splice(index, 1);
    }

    await user.save();
    res.json(user.savedIdeas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedIdeas = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedIdeas",
      populate: { path: "owner", select: "name avatarUrl" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.savedIdeas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  const query = req.query.query || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const searchRegex = new RegExp(query, "i");
    const searchQuery = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { headline: searchRegex },
        { skills: { $in: [searchRegex] } },
      ],
    };

    const users = await User.find(searchQuery)
      .select("name avatarUrl headline role skills email")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    name,
    headline,
    role,
    skills,
    location,
    bio,
    socialLinks,
    privacySettings,
  } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.headline = headline !== undefined ? headline : user.headline;
      user.role = role || user.role;

      // Handle skills array if it comes as a string or array
      if (skills !== undefined) {
        user.skills = Array.isArray(skills)
          ? skills
          : skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      }

      user.location = location !== undefined ? location : user.location;
      user.bio = bio !== undefined ? bio : user.bio;

      if (socialLinks) {
        let links = socialLinks;
        if (typeof socialLinks === "string") {
          try {
            links = JSON.parse(socialLinks);
          } catch (e) {
            console.error("Failed to parse socialLinks", e);
          }
        }
        user.socialLinks = { ...user.socialLinks, ...links };
      }

      if (privacySettings) {
        let privacy = privacySettings;
        if (typeof privacySettings === "string") {
          try {
            privacy = JSON.parse(privacySettings);
          } catch (e) {
            console.error("Failed to parse privacySettings", e);
          }
        }
        user.privacySettings = { ...user.privacySettings, ...privacy };
      }

      if (req.file) {
        const baseUrl =
          process.env.VITE_API_URL || `${req.protocol}://${req.get("host")}`;
        user.avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.save();

      // Log update activity
      await ActivityLog.create({
        user: user._id,
        action: "update_profile",
      });

      res.json(formatUserResponse(updatedUser));
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Role-based access control (example: only Active users can view profiles)
    // You can extend this based on requirements
    if (user.status === "Suspended" && req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "This account has been suspended." });
    }

    // Check privacy settings
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing =
      req.user &&
      user.followers.some((id) => id.toString() === req.user._id.toString());
    const isConnection = isFollowing; // Simplify for now

    const visibility = user.privacySettings?.profileVisibility || "public";

    if (!isOwner && visibility === "private") {
      return res.status(403).json({ message: "This profile is private." });
    }

    if (!isOwner && visibility === "connections" && !isConnection) {
      return res
        .status(403)
        .json({ message: "This profile is only visible to connections." });
    }

    // Prepare response object
    const userObj = user.toObject();

    // Check if there is a pending follow request from current user
    let isRequested = false;
    if (req.user) {
      const FollowRequest = require("../models/FollowRequest");
      const request = await FollowRequest.findOne({
        sender: req.user._id,
        receiver: user._id,
        status: "pending",
      });
      isRequested = !!request;
    }
    userObj.isRequested = isRequested;

    // Apply granular privacy filters
    if (!isOwner) {
      if (!user.privacySettings?.showEmail) {
        delete userObj.email;
      }
      if (!user.privacySettings?.showLocation) {
        delete userObj.location;
      }
    }

    // Role-based information for admins
    if (req.user && req.user.role === "admin") {
      const Report = require("../models/Report");
      const reportsAgainstUser = await Report.countDocuments({
        idea: {
          $in: await require("../models/Idea").find({ owner: user._id }, "_id"),
        },
      });
      userObj.moderationInfo = {
        reportsCount: reportsAgainstUser,
        isSuspended: user.status === "Suspended",
      };
    }

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Initialize arrays if undefined
    if (!currentUser.following) currentUser.following = [];
    if (!userToFollow.followers) userToFollow.followers = [];

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === userToFollow._id.toString(),
    );

    if (isFollowing) {
      // Unfollow - immediate
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow._id.toString(),
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString(),
      );

      await currentUser.save();
      await userToFollow.save();

      return res.json({
        status: "unfollowed",
        following: currentUser.following,
        followersCount: userToFollow.followers.length,
      });
    } else {
      // Check for existing pending request
      const existingRequest = await FollowRequest.findOne({
        sender: currentUser._id,
        receiver: userToFollow._id,
        status: "pending",
      });

      if (existingRequest) {
        // Cancel request if they click again while pending
        await existingRequest.deleteOne();
        return res.json({
          status: "request_cancelled",
          message: "Follow request cancelled",
        });
      }

      // Create private follow request
      const followRequest = await FollowRequest.create({
        sender: currentUser._id,
        receiver: userToFollow._id,
        status: "pending",
      });

      // Log activity
      await ActivityLog.create({
        user: currentUser._id,
        action: "request_follow",
        targetUser: userToFollow._id,
      });

      // Create persistent notification for receiver
      await createNotification(req, {
        recipient: userToFollow._id,
        type: "info",
        title: "New Follow Request",
        message: `${currentUser.name} wants to follow you`,
        relatedId: followRequest._id,
        relatedModel: "FollowRequest",
      });

      // Emit socket event for real-time update
      if (req.io) {
        req.io.to(userToFollow._id.toString()).emit("follow:request", {
          requestId: followRequest._id,
          sender: {
            _id: currentUser._id,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
          },
        });
      }

      return res.json({
        status: "requested",
        message: "Follow request sent",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowRequests = async (req, res) => {
  try {
    const requests = await FollowRequest.find({
      receiver: req.user._id,
      status: "pending",
    }).populate("sender", "name avatarUrl headline role");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateFollowRequestStatus = async (req, res) => {
  const { status } = req.body; // "accepted" or "rejected"
  const { requestId } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await FollowRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Follow request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const sender = await User.findById(request.sender);
      const receiver = await User.findById(request.receiver);

      if (sender && receiver) {
        if (
          !sender.following.some(
            (id) => id.toString() === receiver._id.toString(),
          )
        ) {
          sender.following.push(receiver._id);
          await sender.save();
        }
        if (
          !receiver.followers.some(
            (id) => id.toString() === sender._id.toString(),
          )
        ) {
          receiver.followers.push(sender._id);
          await receiver.save();
        }

        // Log activity
        await ActivityLog.create({
          user: req.user._id,
          action: "accept_follow",
          targetUser: sender._id,
        });

        // Notify sender that request was accepted
        await createNotification(req, {
          recipient: sender._id,
          type: "success",
          title: "Follow Request Accepted",
          message: `${receiver.name} accepted your follow request`,
          relatedId: receiver._id,
          relatedModel: "User",
        });
      }
    } else {
      // Log rejection
      await ActivityLog.create({
        user: req.user._id,
        action: "reject_follow",
        targetUser: request.sender,
      });
    }

    res.json({ message: `Request ${status} successfully`, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowUserExplicit = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow)
      return res.status(404).json({ message: "User not found" });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString(),
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString(),
    );

    await currentUser.save();
    await userToUnfollow.save();

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: "unfollow",
      targetUser: userToUnfollow._id,
    });

    res.json({
      message: "Unfollowed successfully",
      following: currentUser.following,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFollower = async (req, res) => {
  try {
    const followerToRemove = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!followerToRemove)
      return res.status(404).json({ message: "User not found" });

    // Remove current user from their following
    followerToRemove.following = followerToRemove.following.filter(
      (id) => id.toString() !== currentUser._id.toString(),
    );
    // Remove them from current user's followers
    currentUser.followers = currentUser.followers.filter(
      (id) => id.toString() !== followerToRemove._id.toString(),
    );

    await currentUser.save();
    await followerToRemove.save();

    // Log activity
    await ActivityLog.create({
      user: currentUser._id,
      action: "remove_follower",
      targetUser: followerToRemove._id,
    });

    res.json({
      message: "Follower removed successfully",
      followers: currentUser.followers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### ActivityLog.js

```js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "follow",
        "unfollow",
        "remove_follower",
        "request_follow",
        "accept_follow",
        "reject_follow",
        "create_idea",
        "update_profile",
        "like_idea",
        "comment_idea",
        "create_problem",
        "delete_problem",
        "create_solution",
        "delete_solution",
        "vote_problem",
        "vote_solution",
        "generate_backup_codes",
        "regenerate_backup_codes",
        "use_backup_code",
        "reset_password",
      ],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true },
);

activityLogSchema.index({ user: 1, action: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
```

### BackupCode.js

```js
const mongoose = require("mongoose");

const backupCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hashedCode: {
      type: String,
      required: true,
    },
    usedStatus: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Indexing for faster lookups per user
backupCodeSchema.index({ user: 1, usedStatus: 1 });

module.exports = mongoose.model("BackupCode", backupCodeSchema);
```

### CollaborationRequest.js

```js
const mongoose = require("mongoose");

const collaborationRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idea: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "CollaborationRequest",
  collaborationRequestSchema,
);
```

### Conversation.js

```js
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", conversationSchema);
```

### EmailOtp.js

```js
const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires in 10 minutes (600 seconds)
  },
});

module.exports = mongoose.model("EmailOtp", emailOtpSchema);
```

### FollowRequest.js

```js
const mongoose = require("mongoose");

const followRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Prevent duplicate pending requests
followRequestSchema.index(
  { sender: 1, receiver: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

module.exports = mongoose.model("FollowRequest", followRequestSchema);
```

### Idea.js

```js
const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
    },
    allowedCommenters: {
      type: String,
      enum: ["anyone", "connections", "none"],
      default: "anyone",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attachments: [
      {
        url: String,
        fileType: String,
        originalName: String,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Idea", ideaSchema);
```

### Message.js

```js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for group chats
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    content: {
      type: String,
      default: "",
    },
    attachment: {
      url: String,
      fileType: String, // 'image', 'document', etc.
      originalName: String,
    },
    read: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
    deletedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
```

### Notification.js

```js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"],
      default: "info",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // Dynamic reference based on context (User, Idea, etc.)
    },
    relatedModel: {
      type: String,
      // e.g., 'User', 'Idea', 'CollaborationRequest'
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
```

### Problem.js

```js
const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true }, // Rich text content
    codeSnippets: [
      {
        language: { type: String, default: "javascript" },
        code: { type: String },
      },
    ],
    attachments: [
      {
        url: { type: String },
        fileType: { type: String },
        originalName: { type: String },
      },
    ],
    tags: [{ type: String }], // Technology stack, industry, etc.
    category: { type: String, required: true }, // operational, technical, etc.
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isResolved: { type: Boolean, default: false },
    acceptedSolution: { type: mongoose.Schema.Types.ObjectId, ref: "Solution" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Add text index for search
problemSchema.index({ title: "text", description: "text", tags: "text" });

// Middleware to filter out deleted problems
problemSchema.pre(/^find/, function (next) {
  if (this.getOptions().withDeleted) {
    return next();
  }
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Problem", problemSchema);
```

### Report.js

```js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "spam",
        "harassment",
        "misinformation",
        "illegal",
        "copyright",
        "other",
      ],
    },
    context: {
      type: String,
      required: true,
      minlength: 10, // Requirement was 500 characters, let's stick to user request in logic but schema can be more flexible
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    referenceNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

// Indexing for efficient moderation queries
reportSchema.index({ idea: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
```

### Solution.js

```js
const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    content: { type: String, required: true }, // Rich text content
    codeSnippets: [
      {
        language: { type: String, default: "javascript" },
        code: { type: String },
      },
    ],
    attachments: [
      {
        url: { type: String },
        fileType: { type: String },
        originalName: { type: String },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAccepted: { type: Boolean, default: false },
    parentReply: { type: mongoose.Schema.Types.ObjectId, ref: "Solution" }, // For threaded replies
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// Middleware to filter out deleted solutions
solutionSchema.pre(/^find/, function (next) {
  if (this.getOptions().withDeleted) {
    return next();
  }
  this.where({ isDeleted: { $ne: true } });
  next();
});

module.exports = mongoose.model("Solution", solutionSchema);
```

### User.js

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String }, // Optional for Google users
    googleId: { type: String, unique: true, sparse: true },
    role: { type: String, default: "Developer" }, // Developer, Designer, etc.
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    avatarUrl: { type: String, default: "" },
    headline: { type: String, default: "" }, // Professional headline
    skills: [{ type: String }],
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    privacySettings: {
      showEmail: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true },
      allowDirectMessages: { type: Boolean, default: true },
      profileVisibility: {
        type: String,
        enum: ["public", "connections", "private"],
        default: "public",
      },
    },
    savedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Idea" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reputation: { type: Number, default: 0 },
    backupCodesGenerated: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Handle Google-only accounts
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

### aiRoutes.js

```js
const express = require("express");
const router = express.Router();
const {
  getAIResponse,
  enhanceDescription,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// Protected route - only logged in users can chat with AI
router.post("/chat", protect, getAIResponse);
router.post("/enhance-description", protect, enhanceDescription);

module.exports = router;
```

### authRoutes.js

```js
const express = require("express");
const {
  registerUser,
  loginUser,
  googleLogin,
  googleVerify,
  verifyEmail,
  sendOtp,
  verifyOtp,
  changePassword,
  forgotPassword,
  resetPasswordWithOtp,
  verifyBackupCode,
  regenerateBackupCodes,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  passwordChangeLimiter,
  otpLimiter,
  backupCodeLimiter,
} = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.post("/google/verify", googleVerify);
router.post("/verify-email", verifyEmail);
router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/verify-backup-code", backupCodeLimiter, verifyBackupCode);
router.post("/regenerate-backup-codes", protect, regenerateBackupCodes);
router.put("/password", protect, passwordChangeLimiter, changePassword);

module.exports = router;
```

### chatRoutes.js

```js
const express = require("express");
const {
  sendMessage,
  getMessages,
  getConversations,
  getUnreadCount,
  markMessagesAsRead,
  deleteMessage,
  clearChat,
  createGroup,
  getGroupMessages,
  editMessage,
  translateMessage,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `chat-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx|txt/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Allowed file types: Images, PDF, DOC, DOCX, TXT"));
    }
  },
});

router.post("/", protect, upload.single("attachment"), sendMessage);
router.post("/group", protect, createGroup);
router.post("/clear", protect, clearChat);
router.get("/conversations", protect, getConversations);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read", protect, markMessagesAsRead);
router.put("/:messageId", protect, editMessage);
router.post("/:messageId/translate", protect, translateMessage);
router.delete("/:messageId", protect, deleteMessage);
router.get("/group/:groupId", protect, getGroupMessages);
router.get("/:userId", protect, getMessages);

module.exports = router;
```

### collaborationRoutes.js

```js
const express = require("express");
const {
  createRequest,
  getRequestsForMe,
  getRequestsByMe,
  updateRequestStatus,
  getAllRequests,
  getPendingRequestCount,
} = require("../controllers/collaborationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/requests", protect, createRequest);
router.get("/requests", protect, getAllRequests); // Combined endpoint for frontend
router.get("/requests/pending-count", protect, getPendingRequestCount);
router.get("/requests/received", protect, getRequestsForMe);
router.get("/requests/sent", protect, getRequestsByMe);
router.put("/requests/:id", protect, updateRequestStatus);

module.exports = router;
```

### ideaRoutes.js

```js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  toggleLike,
  addComment,
  deleteComment,
  getIdeasByUser,
} = require("../controllers/ideaController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `idea-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp|pdf|doc|docx|txt|ppt|pptx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error("Allowed file types: Images, PDF, DOC, DOCX, TXT, PPT"));
    }
  },
});

router
  .route("/")
  .get(getIdeas)
  .post(protect, upload.array("attachments", 5), createIdea);
router.route("/user/:userId").get(protect, getIdeasByUser);
router
  .route("/:id")
  .get(getIdeaById)
  .put(protect, updateIdea)
  .delete(protect, deleteIdea);

router.route("/:id/like").put(protect, toggleLike);
router.route("/:id/comments").post(protect, addComment);
router.route("/:id/comments/:commentId").delete(protect, deleteComment);

module.exports = router;
```

### notificationRoutes.js

```js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead,
  deleteNotifications,
  getUnreadCount,
} = require("../controllers/notificationController");

router.use(protect); // All routes require authentication

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read", markAsRead);
router.post("/delete", deleteNotifications); // Using POST for delete with body

module.exports = router;
```

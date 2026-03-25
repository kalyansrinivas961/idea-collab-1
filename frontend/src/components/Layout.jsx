import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import toast from "react-hot-toast";
import AIChatBox from "./AIChatBox";
import Footer from "./Footer.jsx";
import { getNotificationUrl } from "../utils/notification";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [followRequestCount, setFollowRequestCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchUnreadMessageCount = () => {
    api
      .get("/messages/unread-count")
      .then((res) => setUnreadMessageCount(res.data.count))
      .catch((err) => console.error("Failed to fetch unread message count", err));
  };

  const fetchUnreadNotifCount = () => {
    api
      .get("/notifications/unread-count")
      .then((res) => setUnreadNotifCount(res.data.count))
      .catch((err) => console.error("Failed to fetch unread notification count", err));
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
        const isChatPage = window.location.pathname === '/messages';
        // We can't easily know the selectedUser in Layout without complex state sharing, 
        // but we can at least show notifications when not on the ChatPage.
        
        if (!isChatPage) {
          const toastOptions = {
            duration: 4000,
            position: "top-right",
            style: {
              borderRadius: '12px',
              background: '#1e293b', // Slate-800
              color: '#fff',
              fontSize: '14px',
              maxWidth: '350px',
              padding: '12px',
              border: '1px solid rgba(99, 102, 241, 0.2)', // Indigo border
            },
          };

          const content = (
            <div className="flex items-center gap-3">
              <img 
                src={message.sender.avatarUrl || "https://via.placeholder.com/40"} 
                alt={message.sender.name} 
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-0.5">
                  {message.conversationId ? 'Group Message' : 'New Message'}
                </p>
                <p className="font-semibold text-sm truncate">{message.sender.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {message.content || (message.attachment ? 'Sent an attachment' : 'New message')}
                </p>
              </div>
              <Link 
                to="/messages" 
                onClick={() => toast.dismiss()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full transition shadow-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            maxWidth: '400px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        };

        const content = (
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              data.type === 'success' ? 'bg-emerald-500' :
              data.type === 'error' ? 'bg-red-500' :
              data.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
            }`}>
              {data.type === 'success' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {data.type === 'error' && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {(data.type === 'info' || !data.type) && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight mb-1">{data.title || 'New Notification'}</p>
              <p className="text-xs text-slate-300 leading-normal">{data.message}</p>
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

        if (data.type === 'success') toast.success(content, toastOptions);
        else if (data.type === 'error') toast.error(content, toastOptions);
        else toast(content, toastOptions);

        setUnreadNotifCount((prev) => prev + 1);
      };
      
      const handleFollowRequest = () => {
        setFollowRequestCount((prev) => prev + 1);
        toast.info("New follow request received", {
          icon: "👤",
          duration: 4000
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
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
              IC
            </span>
            <span className="font-semibold text-lg text-slate-800">IdeaCollab</span>
          </Link>
          {user && (
            <div className="flex items-center gap-2 md:gap-6">
              <nav className="hidden md:flex items-center gap-4 text-sm">
                <NavLink to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium">
                  Dashboard
                </NavLink>
                <NavLink to="/ideas/new" className="text-slate-600 hover:text-indigo-600 font-medium">
                  Add Idea
                </NavLink>
                <NavLink to="/ideas" className="text-slate-600 hover:text-indigo-600 font-medium">
                  Ideas
                </NavLink>
                <NavLink to="/users" className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
                  Community
                </NavLink>
                <NavLink to="/qa" className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
                  Q&A
                </NavLink>
                <NavLink to="/collaborations" className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
                  Collaborations
                  {pendingCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/notifications" className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
                  Notifications
                  {unreadNotifCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {unreadNotifCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/follow-requests" className="text-slate-600 hover:text-indigo-600 flex items-center font-medium">
                  Requests
                  {followRequestCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {followRequestCount}
                    </span>
                  )}
                </NavLink>
              </nav>
              <div className="flex items-center gap-1 md:gap-3">
                <NavLink to="/messages" className="text-slate-600 hover:text-indigo-600 flex items-center relative p-2 min-w-[44px] min-h-[44px] justify-center" title="Messages">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {unreadMessageCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {unreadMessageCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/profile" className="text-slate-600 hover:text-indigo-600 p-2 min-w-[44px] min-h-[44px] justify-center flex items-center" title="Profile">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </NavLink>
                {/* Hamburger Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-slate-600 hover:text-indigo-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg animate-fade-in-down fixed w-full z-40 top-[61px]">
          <nav className="flex flex-col p-4 space-y-1">
            <NavLink 
              to="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Dashboard
            </NavLink>
            <NavLink 
              to="/ideas/new" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add Idea
            </NavLink>
            <NavLink 
              to="/ideas" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              Ideas
            </NavLink>
            <NavLink 
              to="/users" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Community
            </NavLink>
            <NavLink 
              to="/qa" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Q&A
            </NavLink>
            <NavLink 
              to="/collaborations" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Collaborations
              </div>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </NavLink>
            <NavLink 
              to="/notifications" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                Notifications
              </div>
              {unreadNotifCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadNotifCount}</span>
              )}
            </NavLink>
            <NavLink 
              to="/profile" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </NavLink>
            <NavLink 
              to="/followers" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Followers
            </NavLink>
            <NavLink 
              to="/following" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Following
            </NavLink>
            <NavLink 
              to="/follow-requests" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Follow Requests
              </div>
              {followRequestCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{followRequestCount}</span>
              )}
            </NavLink>
            <button 
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </nav>
        </div>
      )}
      <main className={`flex-1 bg-slate-50 ${window.location.pathname.startsWith('/messages') ? 'p-0' : ''}`}>
        <div className={`${window.location.pathname.startsWith('/messages') ? 'max-w-full px-0 py-0 h-full' : 'max-w-6xl mx-auto px-4 py-6'}`}>{children}</div>
      </main>
      <Footer />
      <AIChatBox />
    </div>
  );
};

export default Layout;

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
  ArrowRight
} from "lucide-react";
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
                <NavLink to="/notifications" className="text-slate-600 hover:text-indigo-600 flex items-center relative p-2 min-w-[44px] min-h-[44px] justify-center" title="Notifications" aria-label="Notifications">
                  <Bell className="w-6 h-6" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {unreadNotifCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/messages" className="text-slate-600 hover:text-indigo-600 flex items-center relative p-2 min-w-[44px] min-h-[44px] justify-center" title="Messages" aria-label="Messages">
                  <MessageSquare className="w-6 h-6" />
                  {unreadMessageCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                      {unreadMessageCount}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/profile" className="text-slate-600 hover:text-indigo-600 p-2 min-w-[44px] min-h-[44px] justify-center flex items-center" title="Profile" aria-label="Profile">
                  <User className="w-6 h-6" />
                </NavLink>
                {/* Hamburger Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-slate-600 hover:text-indigo-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/ideas/new" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PlusSquare className="w-5 h-5" />
              Add Idea
            </NavLink>
            <NavLink 
              to="/ideas" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Lightbulb className="w-5 h-5" />
              Ideas
            </NavLink>
            <NavLink 
              to="/qa" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <HelpCircle className="w-5 h-5" />
              Q&A
            </NavLink>
            <NavLink 
              to="/collaborations" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5" />
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
                <Bell className="w-5 h-5" />
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
              <User className="w-5 h-5" />
              My Profile
            </NavLink>
            <NavLink 
              to="/followers" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <UserPlus className="w-5 h-5" />
              Followers
            </NavLink>
            <NavLink 
              to="/following" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <UserPlus className="w-5 h-5" />
              Following
            </NavLink>
            <NavLink 
              to="/follow-requests" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({isActive}) => `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5" />
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
              <LogOut className="w-5 h-5" />
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

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

  const fetchNotifications = useCallback(async (reset = false) => {
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
  }, [filters, page]);

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
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const markAsRead = async (idsToMark) => {
    try {
      await api.put("/notifications/read", { ids: idsToMark });
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          idsToMark.includes(n._id) ? { ...n, isRead: true } : n
        )
      );
      
      // Recalculate unread count (approximate or refetch)
      const readCount = notifications.filter(n => idsToMark.includes(n._id) && !n.isRead).length;
      setUnreadCount(prev => Math.max(0, prev - readCount));
      
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const deleteNotifications = async (idsToDelete) => {
    if (!window.confirm("Are you sure you want to delete these notifications?")) return;
    
    try {
      await api.post("/notifications/delete", { ids: idsToDelete });
      
      setNotifications((prev) => prev.filter((n) => !idsToDelete.includes(n._id)));
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
            Notification History {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">{unreadCount}</span>}
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
              onClick={() => markAsRead(notifications.map(n => n._id))}
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
          <span className="text-slate-400 dark:text-slate-500 hidden md:inline">-</span>
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
              checked={selectedIds.length === notifications.length && notifications.length > 0}
              onChange={handleSelectAll}
              className="mr-3 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">Select All</span>
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
                    !notification.isRead ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification._id)}
                      onChange={() => handleSelectOne(notification._id)}
                      className="mt-1.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 relative z-10"
                    />
                    <div className="mt-1 text-xl">{getIcon(notification.type)}</div>
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => {
                        if (!notification.isRead) markAsRead([notification._id]);
                        navigate(getNotificationUrl(notification));
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={`text-sm font-semibold transition-colors ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
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
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading...</div>
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

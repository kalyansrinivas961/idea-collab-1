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
          <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">{type}</h2>
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
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No {type} yet.
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center gap-4 group">
                <Link to={`/users/${user._id}`} onClick={onClose} className="relative flex-shrink-0">
                    <img
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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

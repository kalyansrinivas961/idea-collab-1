import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const RecommendedUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/search") // Empty query returns all/some users
      .then(res => {
        // Filter out current user and take top 3
        const others = res.data.filter(u => u._id !== user?._id).slice(0, 3);
        setUsers(others);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch recommended users", err);
        setLoading(false);
      });
  }, [user]);

  if (loading || users.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 dark:text-white transition-colors duration-300">Who to follow</h2>
        <Link to="/users" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-300">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <div key={u._id} className="flex items-center gap-3 group">
            <Link to={`/users/${u._id}`}>
              <img
                src={u.avatarUrl || "https://via.placeholder.com/150"}
                alt={u.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800 transition-colors duration-300"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/users/${u._id}`} className="block truncate font-medium text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors duration-300">
                {u.name}
              </Link>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{u.headline || u.role || "Member"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedUsers;

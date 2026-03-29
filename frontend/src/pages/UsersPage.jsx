import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, User as UserIcon, ShieldCheck, Mail, MapPin } from "lucide-react";
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
      const res = await api.get(`/users/search?query=${query}&page=${pageNum}&limit=12`);
      const { users: newUsers, pages, total } = res.data;
      
      if (append) {
        setUsers(prev => [...prev, ...newUsers]);
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
              <UserIcon className="text-indigo-600 dark:text-indigo-400" size={28} />
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
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 transition-transform group-hover:scale-95">
                  <img
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {user.reputation > 50 && (
                  <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-800" title="High Reputation">
                    <ShieldCheck size={14} />
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{user.name}</h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full inline-block">
                {user.role || "Member"}
              </p>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 h-10 leading-relaxed italic">
                {user.headline || user.bio || "Crafting something amazing..."}
              </p>
              
              <div className="flex flex-wrap justify-center gap-1.5 mb-6 min-h-[32px]">
                {user.skills && user.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-bold border border-slate-100 dark:border-slate-700"
                  >
                    #{skill}
                  </span>
                ))}
                {user.skills && user.skills.length > 3 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold self-center">+{user.skills.length - 3}</span>
                )}
              </div>

              <div className="w-full pt-4 border-t border-slate-50 dark:border-slate-800">
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
            <p className="font-bold text-sm uppercase tracking-widest">Searching...</p>
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No creators found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try searching for a different name, role, or skill set.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UsersPage;

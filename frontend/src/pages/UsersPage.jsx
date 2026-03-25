import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/users/search?query=${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  return (
    <Layout>
      <div className="mb-6 px-1 md:px-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Community</h1>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border mb-8 mx-1 md:mx-0">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, role, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[48px] shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98] min-h-[48px] whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="font-medium">Loading community...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-1 md:px-0">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="relative mb-4">
                <img
                  src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=random"}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
              <p className="text-xs md:text-sm text-indigo-600 font-semibold mb-2 uppercase tracking-wider">{user.role || "Member"}</p>
              
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed italic">
                {user.headline || user.bio || "No bio available"}
              </p>
              
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mb-5 min-h-[32px]">
                  {user.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-[10px] md:text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 3 && (
                    <span className="text-[10px] md:text-xs text-slate-400 font-medium self-center">+{user.skills.length - 3}</span>
                  )}
                </div>
              )}

              <div className="w-full mt-auto">
                <span className="inline-flex items-center justify-center w-full bg-slate-50 text-indigo-600 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100 group-hover:border-transparent">
                  View Profile
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300 mx-1 md:mx-0">
          <div className="mb-4 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm mt-1">Try searching for a different name, role, or skill.</p>
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;

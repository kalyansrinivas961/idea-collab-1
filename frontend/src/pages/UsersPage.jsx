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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Community</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search people by name, role, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading community...</div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}`}
              className="bg-white rounded-xl p-6 shadow-sm border hover:border-indigo-200 transition flex flex-col items-center text-center"
            >
              <img
                src={user.avatarUrl || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-50 mb-4"
              />
              <h3 className="text-lg font-semibold text-slate-800">{user.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-1">{user.role || "Member"}</p>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                {user.headline || user.bio || "No bio available"}
              </p>
              
              {user.skills && user.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {user.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {user.skills.length > 3 && (
                    <span className="text-xs text-slate-400">+{user.skills.length - 3}</span>
                  )}
                </div>
              )}

              <button className="w-full mt-auto bg-slate-50 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition border border-indigo-100">
                View Profile
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border">
          No users found matching "{search}"
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;

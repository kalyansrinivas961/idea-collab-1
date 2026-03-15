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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold capitalize">{type}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-slate-500 py-4">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-slate-500 py-4">
              No {type} yet.
            </div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <Link to={`/users/${user._id}`} onClick={onClose}>
                    <img
                    src={user.avatarUrl || "https://via.placeholder.com/40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                    />
                </Link>
                <div>
                  <Link
                    to={`/users/${user._id}`}
                    onClick={onClose}
                    className="font-medium text-slate-800 hover:text-indigo-600 block"
                  >
                    {user.name}
                  </Link>
                  {user.headline && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {user.headline}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;

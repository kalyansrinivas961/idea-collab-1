import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client.js";
import socket from "../api/socket.js";

const UserList = ({ users, type, onRemove }) => {
  const handleAction = async (targetUserId, name) => {
    const actionText = type === "followers" ? "remove this follower" : "unfollow this user";
    if (!window.confirm(`Are you sure you want to ${actionText}?`)) return;

    try {
      const endpoint = type === "followers" 
        ? `/users/${targetUserId}/follower` 
        : `/users/${targetUserId}/unfollow`;
      
      await api.delete(endpoint);
      toast.success(type === "followers" ? "Follower removed" : `Unfollowed ${name}`);
      if (onRemove) onRemove(targetUserId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed">
        No {type} yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between gap-4">
          <Link to={`/users/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <img 
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                alt={user.name} 
                className="w-12 h-12 rounded-full object-cover border border-slate-100"
              />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role || "Member"}</p>
            </div>
          </Link>
          
          <button
            onClick={() => handleAction(user._id, user.name)}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition min-h-[36px]"
          >
            {type === "followers" ? "Remove" : "Unfollow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FollowRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/users/follow-requests/pending");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch follow requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    try {
      await api.put(`/users/follow-requests/${requestId}`, { status });
      toast.success(`Request ${status}`);
      setRequests(prev => prev.filter(req => req._id !== requestId));
      window.dispatchEvent(new Event("follow:processed"));
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Follow Requests</h1>
        
        {loading ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">Loading requests...</div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 transition-colors">
                <Link to={`/users/${req.sender._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src={req.sender.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.sender.name)}&background=random`} 
                    alt={req.sender.name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{req.sender.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{req.sender.role || "Member"}</p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(req._id, "accepted")}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "rejected")}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-slate-800 dark:text-white font-medium">No pending requests</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">When someone wants to follow you, their request will appear here.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FollowRequestsPage;

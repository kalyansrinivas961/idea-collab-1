import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const DashboardStats = () => {
  const { user } = useAuth();
  const [ideaCount, setIdeaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user's ideas to get the count
      api.get(`/ideas/user/${user._id}`)
        .then(res => {
          setIdeaCount(res.data.length);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch idea count", err);
          setLoading(false);
        });
    }
  }, [user]);

  const stats = [
    {
      label: "Ideas Shared",
      value: loading ? "-" : ideaCount,
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bg: "bg-indigo-50",
    },
    {
      label: "Saved Ideas",
      value: user?.savedIdeas?.length || 0,
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
      bg: "bg-emerald-50",
    },
    {
      label: "Followers",
      value: user?.followers?.length || 0,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

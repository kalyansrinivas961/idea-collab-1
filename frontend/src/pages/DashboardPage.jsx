import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import socket from "../api/socket.js";
import Layout from "../components/Layout.jsx";
import { Link } from "react-router-dom";
import { Users, Search } from "lucide-react";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import RecommendedUsers from "../components/RecommendedUsers.jsx";

const DashboardPage = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    api
      .get("/ideas")
      .then((res) => {
        setIdeas(res.data.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const handleNewIdea = (newIdea) => {
      setIdeas((prev) => [newIdea, ...prev].slice(0, 10));
    };

    socket.on("idea:created", handleNewIdea);

    return () => {
      socket.off("idea:created", handleNewIdea);
    };
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening in your creative network today.
        </p>
      </div>

      <DashboardStats />

      {/* Community Search Entry */}
      <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Find Collaborators</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Search for developers, designers, and creators in the community.</p>
          </div>
        </div>
        <Link 
          to="/users" 
          className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-none"
        >
          <Search size={16} />
          Search Creators
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h2 className="font-bold text-xl mb-1">Have a brilliant idea?</h2>
              <p className="text-indigo-100 text-sm opacity-90">
                Share it with the community and start building your dream team.
              </p>
            </div>
            <Link
              to="/ideas/new"
              className="w-full md:w-auto text-center bg-white dark:bg-white/10 text-indigo-600 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-white/20 transition shadow-sm min-h-[44px] flex items-center justify-center border border-transparent dark:border-white/20"
            >
              Share an Idea
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-slate-800 dark:text-white">Latest Ideas</h2>
            <Link to="/ideas" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Skeleton Loader
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              ))
            ) : ideas.length > 0 ? (
              ideas.map((idea) => (
                <Link
                  key={idea._id}
                  to={`/ideas/${idea._id}`}
                  className="block bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {idea.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          {idea.category}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          • {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <img 
                        src={idea.owner?.avatarUrl || "https://via.placeholder.com/30"} 
                        alt={idea.owner?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {idea.owner?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 text-xs" onClick={(e) => e.preventDefault()}>
                        <LikeButton idea={idea} />
                      </div>
                      <div className="flex items-center gap-1 text-xs" onClick={(e) => e.preventDefault()}>
                        <SaveButton idea={idea} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-dashed border-slate-300 dark:border-slate-700">
                <div className="mx-auto w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-1">No ideas yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Be the first to share something amazing!</p>
                <Link to="/ideas/new" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
                  Share an idea &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <RecommendedUsers />

          <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 rounded-xl p-5 border border-indigo-100 dark:border-slate-800 shadow-sm transition-colors">
            <h2 className="font-semibold text-indigo-900 dark:text-indigo-400 mb-3 flex items-center gap-2">
               <span>💡</span> 
               <span>Pro Tips</span>
            </h2>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
               <li className="flex items-start gap-2">
                 <span className="text-indigo-500 mt-0.5">•</span>
                 <span>Define your problem statement clearly to attract the right talent.</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-indigo-500 mt-0.5">•</span>
                 <span>Update your profile skills to get better recommendations.</span>
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-indigo-500 mt-0.5">•</span>
                 <span>Engage with other creators by commenting on their ideas.</span>
               </li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default DashboardPage;

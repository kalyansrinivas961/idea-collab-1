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
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">
          Here's what's happening in your creative network today.
        </p>
      </div>

      <DashboardStats />

      {/* Community Search Entry */}
      <div className="mb-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">Find Collaborators</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">Search for developers, designers, and creators in the community.</p>
          </div>
        </div>
        <Link 
          to="/users" 
          className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Search size={16} />
          Search Creators
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Call to Action Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
            <div className="text-center md:text-left">
              <h2 className="font-bold text-xl mb-1">Have a brilliant idea?</h2>
              <p className="text-indigo-100 text-sm opacity-90">
                Share it with the community and start building your dream team.
              </p>
            </div>
            <Link
              to="/ideas/new"
              className="w-full md:w-auto text-center bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition shadow-sm min-h-[44px] flex items-center justify-center"
            >
              Share an Idea
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-slate-800 dark:text-white transition-colors duration-300">Latest Ideas</h2>
            <Link to="/ideas" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-300">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 h-32 rounded-xl animate-pulse border dark:border-slate-800"></div>
              ))
            ) : ideas.length > 0 ? (
              ideas.map((idea) => (
                <div 
                  key={idea._id} 
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/ideas/${idea._id}`} className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        {idea.title}
                      </h3>
                    </Link>
                    <div className="flex gap-2">
                      <LikeButton idea={idea} />
                      <SaveButton idea={idea} />
                    </div>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 transition-colors duration-300">
                    {idea.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                        {idea.owner?.avatarUrl ? (
                          <img src={idea.owner.avatarUrl} alt={idea.owner.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            {idea.owner?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {idea.owner?.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md transition-colors duration-300">
                      {idea.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed dark:border-slate-800 transition-colors duration-300">
                <p className="text-slate-500 dark:text-slate-400">No ideas found. Be the first to share one!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <RecommendedUsers />
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <h2 className="font-bold text-slate-800 dark:text-white mb-4 transition-colors duration-300">Quick Actions</h2>
            <div className="space-y-2">
              <Link 
                to="/ideas/new" 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group"
              >
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 transition-colors">
                  <PlusSquare size={18} />
                </div>
                <span className="font-medium text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Post an Idea</span>
              </Link>
              <Link 
                to="/qa/post" 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 transition-colors">
                  <HelpCircle size={18} />
                </div>
                <span className="font-medium text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Ask a Question</span>
              </Link>
              <Link 
                to="/messages" 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group"
              >
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition-colors">
                  <MessageSquare size={18} />
                </div>
                <span className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400">Check Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const IdeasListPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchIdeas = () => {
    if (activeTab === "saved") {
      api
        .get("/users/saved-ideas")
        .then((res) => setIdeas(res.data))
        .catch(() => {});
      return;
    }

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    api
      .get("/ideas", { params })
      .then((res) => setIdeas(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchIdeas();
  }, [search, category, activeTab]);

  useEffect(() => {
    const handleNewIdea = (newIdea) => {
      // Only add to list if we are on "all" tab
      if (activeTab !== "all") return;

      // Check if it matches current filters
      const matchesSearch = !search || newIdea.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || newIdea.category.toLowerCase() === category.toLowerCase();

      if (matchesSearch && matchesCategory) {
        setIdeas((prev) => [newIdea, ...prev]);
      }
    };

    socket.on("idea:created", handleNewIdea);
    return () => socket.off("idea:created", handleNewIdea);
  }, [activeTab, search, category]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white transition-colors duration-300">
          {activeTab === "saved" ? "Saved Ideas" : "Explore Ideas"}
        </h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 transition-colors duration-300">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "saved"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Saved
          </button>
        </div>
      </div>
      
      {activeTab === "all" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchIdeas();
          }}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 mb-4 transition-all duration-300"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] transition-all duration-300"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px] transition-all duration-300"
          >
            <option value="">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Social">Social</option>
            <option value="Sustainability">Sustainability</option>
          </select>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div
            key={idea._id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 flex flex-col group"
          >
            <div className="flex justify-between items-start mb-4">
              <Link to={`/ideas/${idea._id}`} className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {idea.title}
                </h3>
              </Link>
              <div className="flex gap-1.5 ml-2">
                <LikeButton idea={idea} />
                <SaveButton idea={idea} />
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 transition-colors duration-300">
              {idea.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between transition-colors duration-300">
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
        ))}
      </div>
      
      {ideas.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-dashed dark:border-slate-800 transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400">No ideas found matching your criteria.</p>
        </div>
      )}
    </Layout>
  );
};

export default IdeasListPage;

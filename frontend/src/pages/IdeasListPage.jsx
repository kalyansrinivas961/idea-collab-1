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
        <h1 className="text-xl font-semibold text-slate-800">
          {activeTab === "saved" ? "Saved Ideas" : "Explore Ideas"}
        </h1>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
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
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white rounded-xl p-3 shadow-sm border mb-4"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <input
              type="text"
              placeholder="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition min-h-[44px]"
          >
            Apply
          </button>
        </form>
      )}

      <div className="space-y-3">
        {ideas.map((idea) => (
          <Link
            key={idea._id}
            to={`/ideas/${idea._id}`}
            className="block bg-white rounded-xl p-4 shadow-sm border hover:border-indigo-200"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">{idea.title}</h3>
              <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">
                {idea.category}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{idea.description}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-700">{idea.owner?.name}</span>
                <LikeButton idea={idea} />
                <SaveButton idea={idea} />
              </div>
              <span>{idea.collaborators?.length || 0} collaborators</span>
            </div>
          </Link>
        ))}
        {ideas.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-sm text-slate-500 text-center border">
            {activeTab === "saved"
              ? "You haven't saved any ideas yet."
              : "No ideas match the current filters."}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IdeasListPage;

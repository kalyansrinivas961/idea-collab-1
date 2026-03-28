import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const QAListPage = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProblems = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (tags) params.tags = tags;

    api
      .get("/qa/problems", { params })
      .then((res) => {
        setProblems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Problems Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProblems();
  }, [search, category, tags]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Q&A Section</h1>
            <p className="text-slate-500 text-sm">Solve technical problems or post your challenges.</p>
          </div>
          <Link
            to="/qa/post"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Post a Problem
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 text-sm outline-none"
          >
            <option value="">All Categories</option>
            <option value="technical">Technical</option>
            <option value="operational">Operational</option>
            <option value="programming">Programming</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tags (e.g. react, node)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm outline-none"
          />
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : problems.length > 0 ? (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/qa/problem/${problem._id}`}
                className="block bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="hidden md:flex flex-col items-center gap-1 min-w-[60px] py-2 bg-slate-50 rounded-xl">
                    <span className="text-lg font-bold text-indigo-600">{problem.upvotes.length - problem.downvotes.length}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Votes</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        problem.isResolved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {problem.isResolved ? 'Resolved' : 'Open'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">• {problem.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2 truncate">
                      {problem.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={problem.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(problem.author.name)}`}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-600">{problem.author.name}</span>
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {problem.author.reputation}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No problems found</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mt-1">Try adjusting your filters or search terms to find what you're looking for.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QAListPage;

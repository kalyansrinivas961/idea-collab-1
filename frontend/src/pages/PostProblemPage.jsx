import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import toast from "react-hot-toast";

const PostProblemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "technical",
    tags: "",
    code: "",
    language: "javascript",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      return toast.error("Title and description are required");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        codeSnippets: formData.code ? [{ language: formData.language, code: formData.code }] : []
      };

      await api.post("/qa/problems", payload);
      toast.success("Problem posted successfully!");
      navigate("/qa");
    } catch (err) {
      console.error("Post Problem Error:", err);
      toast.error(err.response?.data?.message || "Failed to post problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post a Problem</h1>
          <p className="text-slate-500 font-medium">Explain your challenge clearly to get the best solutions.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Problem Title</label>
            <input
              type="text"
              placeholder="e.g. How to implement real-time notifications with Socket.io?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              >
                <option value="technical">Technical</option>
                <option value="operational">Operational</option>
                <option value="programming">Programming</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. react, node, socket.io"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Detailed Description</label>
            <textarea
              placeholder="Describe your problem in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium min-h-[200px]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Code Snippet (Optional)</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg outline-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <textarea
              placeholder="// Paste your code here..."
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full bg-slate-900 text-slate-100 border-2 border-transparent rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm min-h-[150px]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                  Publish Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PostProblemPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Code } from "lucide-react";
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Post a Problem</h1>
          <p className="text-slate-500 text-sm">Explain your challenge clearly to get the best solutions.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Problem Title</label>
            <input
              type="text"
              placeholder="e.g. How to implement real-time notifications with Socket.io?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm outline-none"
              >
                <option value="technical">Technical</option>
                <option value="operational">Operational</option>
                <option value="programming">Programming</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. react, node, socket.io"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 uppercase tracking-wider">Detailed Description</label>
            <textarea
              placeholder="Describe your problem in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium min-h-[200px] text-sm resize-none"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Code size={16} className="text-indigo-500" />
                Code Snippet (Optional)
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg outline-none"
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
              className="w-full bg-slate-900 text-slate-100 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-mono text-sm min-h-[150px]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
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

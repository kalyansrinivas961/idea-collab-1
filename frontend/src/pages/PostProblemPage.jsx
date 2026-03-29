import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Code, Sparkles, ChevronDown, RotateCcw } from "lucide-react";
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

  // AI Assistance States
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [descriptionHistory, setDescriptionHistory] = useState([]);
  const menuRef = useRef(null);

  const handleEnhance = async (mode) => {
    if (!formData.description && mode !== "generate") {
      return toast.error("Please enter a brief description first");
    }

    setIsAIProcessing(true);
    setShowAIMenu(false);

    try {
      const res = await api.post("/ai/enhance-description", {
        text: formData.description,
        mode,
        title: formData.title,
        category: formData.category
      });

      const enhancedText = res.data.enhancedText;
      
      // Save history for revert
      setDescriptionHistory(prev => [...prev, formData.description]);
      
      setFormData(prev => ({ ...prev, description: enhancedText }));
      toast.success(`Content ${mode === 'expand' ? 'expanded' : 'refined'} by AI!`);
    } catch (err) {
      console.error("AI assistance failed:", err);
      toast.error("AI assistance failed. Please try again.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleRevert = () => {
    if (descriptionHistory.length > 0) {
      const lastDescription = descriptionHistory[descriptionHistory.length - 1];
      setFormData(prev => ({ ...prev, description: lastDescription }));
      setDescriptionHistory(prev => prev.slice(0, -1));
      toast.success("Reverted to previous version");
    }
  };

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
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Post a Problem</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Explain your challenge clearly to get the best solutions.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 shadow-sm space-y-6 transition-colors">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Problem Title</label>
            <input
              type="text"
              placeholder="e.g. How to implement real-time notifications with Socket.io?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm outline-none dark:text-white"
              >
                <option value="technical">Technical</option>
                <option value="operational">Operational</option>
                <option value="programming">Programming</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. react, node, socket.io"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium text-sm dark:text-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detailed Description</label>
              
              <div className="flex items-center gap-2">
                {descriptionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRevert}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                    title="Revert to previous version"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    disabled={isAIProcessing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                      isAIProcessing 
                      ? "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed" 
                      : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/50"
                    }`}
                  >
                    {isAIProcessing ? (
                      <div className="w-3.5 h-3.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                    )}
                    AI NARRATE
                    <ChevronDown size={12} className={`transition-transform duration-200 ${showAIMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAIMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-30 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-slate-700 mb-1">
                        AI Transformation
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleEnhance("expand")} 
                        className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition flex items-center justify-between group"
                      >
                        Expand to Narrative
                        <span className="text-[10px] text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition">Recommended</span>
                      </button>
                      <button type="button" onClick={() => handleEnhance("professional")} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition">Make Professional</button>
                      <button type="button" onClick={() => handleEnhance("creative")} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition">Make Creative</button>
                      <button type="button" onClick={() => handleEnhance("concise")} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition">Make Concise</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <textarea
                placeholder="Describe your problem in detail... (Hint: Write a brief summary and use AI Narrate to expand it!)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium min-h-[220px] text-sm resize-none dark:text-white ${
                  isAIProcessing ? "opacity-60 grayscale-[0.5]" : ""
                }`}
                required
              />
              {isAIProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-[1px] rounded-xl z-10">
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 animate-pulse tracking-tight">AI is crafting your narrative...</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code size={16} className="text-indigo-500 dark:text-indigo-400" />
                Code Snippet (Optional)
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg outline-none"
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

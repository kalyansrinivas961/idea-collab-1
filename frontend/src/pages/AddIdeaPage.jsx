import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import EmojiPicker from "emoji-picker-react";

const AddIdeaPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    visibility: "public",
    allowedCommenters: "anyone"
  });
  const [attachments, setAttachments] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // AI Description Assistance States
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [descriptionHistory, setDescriptionHistory] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const suggestionTimeoutRef = useRef(null);
  const [aiUsageStats, setAiUsageStats] = useState({ clicks: 0, accepted: 0, modes: {} });
  const [abVariant, setAbVariant] = useState(Math.random() > 0.5 ? "A" : "B");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Character limit check
    if (name === "description" && value.length > 2000) return;
    
    setForm({ ...form, [name]: value });

    // Real-time suggestions logic
    if (name === "description") {
      if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
      
      if (value.length > 20 && value.length % 50 === 0) { // Trigger suggestions every 50 chars after initial 20
        suggestionTimeoutRef.current = setTimeout(() => {
          handleAISuggestion(value);
        }, 1500);
      } else {
        setAiSuggestion("");
      }
    }
  };

  const handleAISuggestion = async (text) => {
    try {
      const res = await api.post("/ai/enhance-description", {
        text,
        mode: "suggest",
        title: form.title,
        category: form.category
      });
      setAiSuggestion(res.data.enhancedText);
    } catch (err) {
      console.error("AI Suggestion failed:", err);
    }
  };

  const handleEnhance = async (mode) => {
    setIsAIProcessing(true);
    setShowAIMenu(false);
    setError("");

    // Track usage
    setAiUsageStats(prev => ({
      ...prev,
      clicks: prev.clicks + 1,
      modes: { ...prev.modes, [mode]: (prev.modes[mode] || 0) + 1 }
    }));

    try {
      const res = await api.post("/ai/enhance-description", {
        text: form.description,
        mode,
        title: form.title,
        category: form.category
      });

      const enhancedText = res.data.enhancedText;
      
      // Save history for revert
      setDescriptionHistory(prev => [...prev, form.description]);
      
      setForm(prev => ({ ...prev, description: enhancedText }));
    } catch (err) {
      setError("AI assistance failed. Please try again.");
    } finally {
      setIsAIProcessing(false);
    }
  };

  const handleRevert = () => {
    if (descriptionHistory.length > 0) {
      const lastDescription = descriptionHistory[descriptionHistory.length - 1];
      setForm(prev => ({ ...prev, description: lastDescription }));
      setDescriptionHistory(prev => prev.slice(0, -1));
    }
  };

  const acceptSuggestion = () => {
    setForm(prev => ({ ...prev, description: prev.description + " " + aiSuggestion }));
    setAiSuggestion("");
    setAiUsageStats(prev => ({ ...prev, accepted: prev.accepted + 1 }));
  };

  const handleEmojiClick = (emojiObject) => {
    setForm(prev => ({ ...prev, description: prev.description + emojiObject.emoji }));
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("tags", form.tags); // Controller will split this string
      formData.append("visibility", form.visibility);
      formData.append("allowedCommenters", form.allowedCommenters);

      // Include AI analytics data for tracking
      formData.append("aiAnalytics", JSON.stringify({
        usage: aiUsageStats,
        variant: abVariant,
        enhanced: descriptionHistory.length > 0
      }));

      attachments.forEach(file => {
        formData.append("attachments", file);
      });

      const res = await api.post("/ideas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Idea shared successfully!");
      navigate(`/ideas/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">Share a new idea</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Describe your startup or project and invite collaborators.
        </p>
        {error && <div className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors focus:bg-white dark:focus:bg-slate-700"
              required
            />
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <div className="flex items-center gap-2">
                {descriptionHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRevert}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
                  >
                    Revert
                  </button>
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowAIMenu(!showAIMenu)}
                    disabled={isAIProcessing}
                    aria-haspopup="true"
                    aria-expanded={showAIMenu}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                      isAIProcessing 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed" 
                      : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    }`}
                  >
                    {isAIProcessing ? (
                      <div className="w-3 h-3 border-2 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )}
                    AI Assist
                  </button>
                  
                  {showAIMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fade-in-up" role="menu">
                      <button type="button" role="menuitem" onClick={() => handleEnhance("grammar")} className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none">Grammar Correction</button>
                      <button type="button" role="menuitem" onClick={() => handleEnhance("professional")} className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none">Make Professional</button>
                      <button type="button" role="menuitem" onClick={() => handleEnhance("creative")} className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none">Make Creative</button>
                      <button type="button" role="menuitem" onClick={() => handleEnhance("concise")} className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none">Make Concise</button>
                      <button type="button" role="menuitem" onClick={() => handleEnhance("expand")} className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition focus:bg-indigo-50 dark:focus:bg-indigo-900/50 focus:outline-none">Expand to Narrative</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 transition-colors dark:text-white focus:bg-white dark:focus:bg-slate-700 ${isAIProcessing ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}
                placeholder="Describe your startup or project in detail..."
                required
              />
              
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-3 text-slate-400 hover:text-yellow-500 transition"
                title="Add emoji"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {aiSuggestion && (
                <div className="absolute left-0 right-0 -bottom-10 bg-indigo-600 dark:bg-indigo-500 text-white text-[11px] p-2 rounded-lg flex items-center justify-between shadow-lg animate-fade-in-up z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-[9px] bg-white/20 px-1.5 py-0.5 rounded">AI Suggestion</span>
                    <span className="italic truncate max-w-[150px] sm:max-w-[250px]">"{aiSuggestion}"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={acceptSuggestion} className="bg-white text-indigo-700 px-2 py-0.5 rounded font-bold hover:bg-indigo-50 transition">Accept</button>
                    <button type="button" onClick={() => setAiSuggestion("")} className="text-white/80 hover:text-white transition">Ignore</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-1">
              <span className={`text-[10px] ${form.description.length > 2000 ? "text-red-500 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
                {form.description.length} / 2000 characters
              </span>
              {isAIProcessing && (
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium animate-pulse flex items-center gap-1">
                  <div className="w-1 h-1 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                  AI is refining your content...
                </span>
              )}
            </div>
            {showEmojiPicker && (
              <div className="absolute right-0 top-12 z-10 shadow-xl rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'} />
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attachments (Images, Docs)</label>
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 text-center transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
              >
                Click to upload files
              </button>
              <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">Max 5 files (Images, PDF, Docs)</span>
            </div>
            
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-sm transition-colors">
                    <span className="truncate text-slate-700 dark:text-slate-300 max-w-[80%]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors min-h-[44px]"
                placeholder="FinTech, EdTech, AI..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors min-h-[44px]"
                placeholder="React, AI, Startup..."
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition min-h-[44px] px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               Post Settings
            </button>
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-semibold">Visibility</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                 {form.visibility} • {form.allowedCommenters} comments
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition shadow-sm"
          >
            {loading ? "Creating..." : "Share Idea"}
          </button>
        </form>

        {/* Post Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-all">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in transition-colors border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Post settings</h3>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Visibility Section */}
                <div>
                   <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Who can see your post?</h4>
                   <div className="space-y-2">
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="visibility" 
                         value="public"
                         checked={form.visibility === "public"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div>
                         <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Anyone</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400">Anyone on or off IdeaCollab</div>
                       </div>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="visibility" 
                         value="connections"
                         checked={form.visibility === "connections"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div>
                         <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Connections only</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400">Connections on IdeaCollab</div>
                       </div>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="visibility" 
                         value="private"
                         checked={form.visibility === "private"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div>
                         <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Private</div>
                         <div className="text-xs text-slate-500 dark:text-slate-400">Only you can see this post</div>
                       </div>
                     </label>
                   </div>
                </div>

                {/* Comment Control Section */}
                <div>
                   <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Comment control</h4>
                   <div className="space-y-2">
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="allowedCommenters" 
                         value="anyone"
                         checked={form.allowedCommenters === "anyone"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Anyone</div>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="allowedCommenters" 
                         value="connections"
                         checked={form.allowedCommenters === "connections"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Connections only</div>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                       <input 
                         type="radio" 
                         name="allowedCommenters" 
                         value="none"
                         checked={form.allowedCommenters === "none"}
                         onChange={handleChange}
                         className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                       />
                       <div className="text-sm font-medium text-slate-700 dark:text-slate-200">No one</div>
                     </label>
                   </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 transition-colors">
                 <button 
                   type="button"
                   onClick={() => setShowSettings(false)}
                   className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                 >
                   Back
                 </button>
                 <button 
                   type="button"
                   onClick={() => setShowSettings(false)}
                   className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                 >
                   Done
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddIdeaPage;


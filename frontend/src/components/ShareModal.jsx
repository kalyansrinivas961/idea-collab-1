import React, { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Link as LinkIcon, 
  Users, 
  Search, 
  Copy, 
  Clock, 
  Shield, 
  Share2,
  Mail,
  Send,
  CheckCircle2,
  MessageCircle
} from "lucide-react";

const ShareModal = ({ idea, isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("link"); // 'link' or 'internal'
  const [permissions, setPermissions] = useState("view");
  const [expiresIn, setExpiresIn] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeTab === "internal" && searchResults.length === 0 && !isSearching) {
      fetchAllUsers();
    }
  }, [activeTab]);

  const fetchAllUsers = async () => {
    setIsSearching(true);
    try {
      const res = await api.get("/users/search?query=");
      setSearchResults(res.data.users.filter(u => u._id !== user?._id));
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsSearching(false);
    }
  };

  const generateLink = async () => {
    setLoading(true);
    try {
      const res = await api.post("/share/create", {
        ideaId: idea._id,
        permissions,
        expiresAt: expiresIn > 0 ? new Date(Date.now() + expiresIn * 60 * 60 * 1000) : null,
        sharedWith: selectedUsers.map(u => u._id)
      });
      const link = `${window.location.origin}/share/${res.data.shareToken}`;
      setShareLink(link);
      
      if (activeTab === "internal" && selectedUsers.length > 0) {
        toast.success(`Idea shared with ${selectedUsers.length} contact${selectedUsers.length > 1 ? 's' : ''}!`, {
          icon: <Send className="text-emerald-500" />,
        });
        setSelectedUsers([]); // Clear selection after sharing
      } else {
        toast.success("Share link generated!", {
          icon: <CheckCircle2 className="text-emerald-500" />,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(shareLink || `${window.location.origin}/ideas/${idea._id}`);
    const text = encodeURIComponent(`Check out this idea on IdeaCollab: ${idea.title}`);
    
    let shareUrl = "";
    switch (platform) {
      case "whatsapp": shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
      case "telegram": shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
      case "twitter": shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
      case "email": shareUrl = `mailto:?subject=${text}&body=${url}`; break;
      default: break;
    }
    
    if (shareUrl) window.open(shareUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">Share Idea</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage access and collaboration</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            {user && (
              <div className="flex p-1.5 mx-6 mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab("link")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "link" 
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LinkIcon size={14} />
                  Public Link
                </button>
                <button
                  onClick={() => setActiveTab("internal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "internal" 
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Users size={14} />
                  Internal Share
                </button>
              </div>
            )}

            <div className="p-6">
              {activeTab === "link" ? (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Shield size={10} />
                        Permissions
                      </label>
                      <select
                        value={permissions}
                        onChange={(e) => setPermissions(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white appearance-none"
                      >
                        <option value="view">View Only</option>
                        <option value="comment">Allow Comments</option>
                        <option value="edit">Allow Edits</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Clock size={10} />
                        Expiration
                      </label>
                      <select
                        value={expiresIn}
                        onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white appearance-none"
                      >
                        <option value={0}>Never</option>
                        <option value={1}>1 Hour</option>
                        <option value={24}>24 Hours</option>
                        <option value={168}>7 Days</option>
                        <option value={720}>30 Days</option>
                      </select>
                    </div>
                  </div>

                  {!shareLink ? (
                    <button
                      onClick={generateLink}
                      disabled={loading}
                      className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-black text-sm hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={18} />
                          Generate Link
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative group">
                        <input
                          readOnly
                          value={shareLink}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 pr-14 text-sm font-mono text-indigo-600 dark:text-indigo-400 outline-none"
                        />
                        <button
                          onClick={copyToClipboard}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm border border-slate-100 dark:border-slate-600"
                        >
                          {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Share</span>
                          <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                        </div>
                        <div className="flex justify-center gap-6">
                          {[
                            { id: "whatsapp", icon: <MessageCircle size={22} />, color: "#25D366" },
                            { id: "telegram", icon: <Send size={22} />, color: "#0088cc" },
                            { id: "twitter", icon: <Share2 size={22} />, color: "#1DA1F2" },
                            { id: "email", icon: <Mail size={22} />, color: "#EA4335" }
                          ].map(platform => (
                            <button
                              key={platform.id}
                              onClick={() => shareToSocial(platform.id)}
                              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md bg-white dark:bg-slate-800"
                              style={{ color: platform.color }}
                            >
                              {platform.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                      <Users size={10} />
                      Select Contacts
                    </label>
                    
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                      {isSearching ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading users...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto p-2 divide-y dark:divide-slate-700">
                          {searchResults.map(userItem => {
                            const isSelected = selectedUsers.some(u => u._id === userItem._id);
                            return (
                              <button
                                key={userItem._id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedUsers(selectedUsers.filter(u => u._id !== userItem._id));
                                  } else {
                                    setSelectedUsers([...selectedUsers, userItem]);
                                  }
                                }}
                                className={`w-full p-3 flex items-center gap-4 transition-all rounded-xl text-left group ${
                                  isSelected ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
                                }`}
                              >
                                <div className="relative">
                                  <img src={userItem.avatarUrl || `https://ui-avatars.com/api/?name=${userItem.name}`} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" alt="" />
                                  {isSelected && (
                                    <div className="absolute -right-1 -top-1 bg-indigo-600 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                                      <CheckCircle2 size={10} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-black transition-colors ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "dark:text-white"}`}>{userItem.name}</div>
                                  <div className="text-[10px] text-slate-500 font-bold truncate">{userItem.headline || userItem.role}</div>
                                </div>
                                {!isSelected && <Plus size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No users found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedUsers.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Recipients</label>
                        <button 
                          onClick={() => setSelectedUsers([])}
                          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedUsers.map(u => (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={u._id} 
                            className="flex items-center gap-2 bg-indigo-600 text-white rounded-xl pl-2 pr-3 py-1.5 shadow-sm"
                          >
                            <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name}`} className="w-5 h-5 rounded-full border border-white/20" alt="" />
                            <span className="text-xs font-black">{u.name}</span>
                            <button
                              onClick={() => setSelectedUsers(selectedUsers.filter(item => item._id !== u._id))}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={generateLink}
                    disabled={loading || selectedUsers.length === 0}
                    className="w-full bg-indigo-600 text-white rounded-2xl py-4 font-black text-sm hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Users size={18} />
                        Share with Contacts
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t dark:border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                External users will always have <span className="text-indigo-500">View-only</span> access
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Plus = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export default ShareModal;

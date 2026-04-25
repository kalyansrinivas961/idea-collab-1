import React, { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const ShareModal = ({ idea, isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("link"); // 'link' or 'internal'
  const [permissions, setPermissions] = useState("view");
  const [expiresIn, setExpiresIn] = useState(0); // 0 means no expiration
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    setIsSearching(true);
    try {
      const res = await api.get(`/users/search?query=${searchTerm}`);
      setSearchResults(res.data.users.filter(u => u._id !== user._id));
    } catch (err) {
      console.error("Search failed", err);
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
        expiresIn: expiresIn > 0 ? expiresIn : null,
        sharedWith: selectedUsers.map(u => u._id)
      });
      const link = `${window.location.origin}/share/${res.data.shareToken}`;
      setShareLink(link);
      toast.success("Share link generated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success("Copied to clipboard!");
  };

  const shareToSocial = (platform) => {
    const url = encodeURIComponent(shareLink || `${window.location.origin}/ideas/${idea._id}`);
    const text = encodeURIComponent(`Check out this idea on IdeaCollab: ${idea.title}`);
    
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Share Idea</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6 border-b dark:border-slate-800">
            <button
              onClick={() => setActiveTab("link")}
              className={`pb-2 text-sm font-bold transition-all ${activeTab === "link" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Public Link
            </button>
            <button
              onClick={() => setActiveTab("internal")}
              className={`pb-2 text-sm font-bold transition-all ${activeTab === "internal" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Internal Share
            </button>
          </div>

          {activeTab === "link" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Permissions</label>
                  <select
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                  >
                    <option value="view">View Only</option>
                    <option value="comment">Allow Comments</option>
                    <option value="edit">Allow Edits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Expiration</label>
                  <select
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
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
                  className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Generate Shareable Link"
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={shareLink}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-indigo-600 dark:text-indigo-400 outline-none"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                      title="Copy Link"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>

                  <div className="pt-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Or share via</label>
                    <div className="flex justify-center gap-4">
                      {[
                        { id: "whatsapp", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.605a11.803 11.803 0 005.925 1.577h.005c6.632 0 12.032-5.398 12.035-12.032.001-3.213-1.248-6.233-3.518-8.503z", color: "#25D366" },
                        { id: "telegram", icon: "M20.665 3.717l-17.73 6.837c-1.213.486-1.203 1.163-.222 1.467l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701v0l-.31 4.638c.454 0 .655-.209.909-.456l2.188-2.127 4.55 3.36c.839.462 1.442.224 1.65-.78l2.984-14.056c.306-1.226-.463-1.777-1.264-1.417z", color: "#0088cc" },
                        { id: "twitter", icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z", color: "#1DA1F2" },
                        { id: "email", icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", color: "#EA4335" }
                      ].map(platform => (
                        <button
                          key={platform.id}
                          onClick={() => shareToSocial(platform.id)}
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md"
                          style={{ backgroundColor: platform.color + "20", color: platform.color }}
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d={platform.icon} />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Search Users</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {isSearching && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {searchResults.map(user => (
                      <button
                        key={user._id}
                        onClick={() => {
                          if (!selectedUsers.find(u => u._id === user._id)) {
                            setSelectedUsers([...selectedUsers, user]);
                          }
                          setSearchTerm("");
                          setSearchResults([]);
                        }}
                        className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-left"
                      >
                        <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full" alt="" />
                        <div>
                          <div className="text-sm font-bold dark:text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.headline}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Selected Recipients</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div key={user._id} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full px-3 py-1.5">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">{user.name}</span>
                        <button
                          onClick={() => setSelectedUsers(selectedUsers.filter(u => u._id !== user._id))}
                          className="text-indigo-400 hover:text-indigo-600"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={generateLink}
                disabled={loading || selectedUsers.length === 0}
                className="w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Share with Selected Users"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

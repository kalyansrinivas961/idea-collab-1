import React, { useState, useEffect, useRef } from "react";
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  Camera, 
  Shield, 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import { calculateProfileCompletion } from "../utils/user";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    headline: user?.headline || "",
    role: user?.role || "",
    skills: (user?.skills || []).join(", ")
  });

  const [socialForm, setSocialForm] = useState({
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    twitter: user?.socialLinks?.twitter || "",
    portfolio: user?.socialLinks?.portfolio || ""
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: user?.privacySettings?.showEmail ?? false,
    showLocation: user?.privacySettings?.showLocation ?? true,
    allowDirectMessages: user?.privacySettings?.allowDirectMessages ?? true,
    profileVisibility: user?.privacySettings?.profileVisibility || "public"
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await api.get("/users/activity");
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activity", err);
    }
  };

  // Handlers
  const handleProfileChange = (e) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (e) => {
    setSocialForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    Object.keys(profileForm).forEach(key => formData.append(key, profileForm[key]));
    formData.append("socialLinks", JSON.stringify(socialForm));
    formData.append("privacySettings", JSON.stringify(privacySettings));
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      updateUser(res.data);
      toast.success("Profile updated successfully");
      fetchActivity(); // Refresh activity log
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Components
  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
        activeTab === id 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
          : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden relative group/header">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          
          {/* Prominent Logout Button */}
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                logout();
              }
            }}
            className="absolute top-6 right-6 p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-2xl shadow-sm transition-all z-20 group/logout"
            aria-label="Logout Account"
            title="Sign out of your account"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold opacity-0 group-hover/header:opacity-100 group-hover/logout:opacity-100 transition-opacity hidden md:inline">Sign Out</span>
              <LogOut size={20} />
            </div>
          </button>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div 
              className={`relative group cursor-pointer rounded-full p-1 border-4 transition-all ${
                isDragging ? "border-indigo-500 scale-105" : "border-white"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleAvatarClick}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl">
                <img 
                  src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {/* User Info Header */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900">{user?.name}</h1>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                  <BarChart3 size={14} className="text-amber-500" />
                  <span className="text-xs font-black tracking-wider uppercase">Reputation: {user?.reputation || 0}</span>
                </div>
              </div>
              <p className="text-lg text-indigo-600 font-semibold mb-4">{user?.headline || "Add a professional headline"}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                {user?.location && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin size={16} />
                    <span>{user?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Briefcase size={16} />
                  <span>{user?.role || "Member"}</span>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: "Followers", value: stats?.followersCount || 0 },
                { label: "Following", value: stats?.followingCount || 0 },
                { label: "Ideas", value: stats?.ideasCount || 0 },
                { label: "Collaborations", value: stats?.collaborationsCount || 0 }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl text-center">
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <TabButton id="profile" icon={UserIcon} label="Personal Info" />
          <TabButton id="activity" icon={Activity} label="Activity Timeline" />
          <TabButton id="stats" icon={BarChart3} label="Insights" />
          <TabButton id="settings" icon={Shield} label="Privacy & Security" />
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <UserIcon className="text-indigo-600" size={24} />
                      Basic Information
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Full Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Professional Headline</label>
                          <input 
                            type="text" 
                            name="headline"
                            value={profileForm.headline}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. Senior UX Designer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Primary Role</label>
                          <select 
                            name="role"
                            value={profileForm.role}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                          >
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Entrepreneur">Entrepreneur</option>
                            <option value="Investor">Investor</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Location</label>
                          <input 
                            type="text" 
                            name="location"
                            value={profileForm.location}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Bio</label>
                        <textarea 
                          name="bio"
                          value={profileForm.bio}
                          onChange={handleProfileChange}
                          rows={4}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Skills (comma separated)</label>
                        <input 
                          type="text" 
                          name="skills"
                          value={profileForm.skills}
                          onChange={handleProfileChange}
                          className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                          placeholder="React, Node.js, Design Thinking"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <Globe className="text-indigo-600" size={20} />
                          Social Links
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { name: "github", label: "GitHub URL", icon: Github },
                            { name: "linkedin", label: "LinkedIn URL", icon: Linkedin },
                            { name: "twitter", label: "Twitter URL", icon: Twitter },
                            { name: "portfolio", label: "Portfolio URL", icon: ExternalLink }
                          ].map((social) => (
                            <div key={social.name} className="space-y-2">
                              <label className="text-sm font-bold text-slate-700">{social.label}</label>
                              <div className="relative">
                                <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                  type="url" 
                                  name={social.name}
                                  value={socialForm[social.name]}
                                  onChange={handleSocialChange}
                                  className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 pt-6">
                        <button 
                          type="button" 
                          className="px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          disabled={loading}
                          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <CheckCircle2 size={18} />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                    <Activity className="text-indigo-600" size={24} />
                    Recent Activity
                  </h2>
                  <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {activities.length > 0 ? activities.map((log, i) => (
                      <div key={log._id} className="relative flex gap-6 group">
                        <div className="w-9 h-9 rounded-full bg-white border-4 border-indigo-50 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900 capitalize">
                              {log.action.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm">
                            {log.action === 'update_profile' && "You updated your professional profile information."}
                            {log.action === 'request_follow' && `You requested to follow ${log.targetUser?.name}.`}
                            {log.action === 'accept_follow' && `You accepted ${log.targetUser?.name}'s follow request.`}
                            {log.action === 'create_idea' && "You published a new innovation idea."}
                            {log.action === 'like_idea' && "You liked an interesting idea."}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12">
                        <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-medium">No recent activity to show.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <BarChart3 className="text-indigo-600" size={24} />
                      Performance Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 rounded-2xl">
                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Collaboration Impact</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900">{stats?.collaborationsCount || 0}</span>
                          <span className="text-slate-500 font-medium mb-1">Projects</span>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm">Number of ideas where you are a primary collaborator.</p>
                      </div>
                      <div className="p-6 bg-amber-50 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">Idea Reach</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900">{stats?.totalLikes || 0}</span>
                          <span className="text-slate-500 font-medium mb-1">Engagements</span>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm">Total likes received across all your shared ideas.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <Shield className="text-indigo-600" size={24} />
                      Privacy Settings
                    </h2>
                    <div className="space-y-6">
                      {[
                        { key: "showEmail", label: "Public Email", desc: "Show your email address on your public profile." },
                        { key: "showLocation", label: "Public Location", desc: "Display your city and country to other users." },
                        { key: "allowDirectMessages", label: "Direct Messages", desc: "Allow other users to send you direct messages." }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{item.label}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handlePrivacyToggle(item.key)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                              privacySettings[item.key] ? "bg-indigo-600" : "bg-slate-300"
                            }`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              privacySettings[item.key] ? "left-7" : "left-1"
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                      <h2 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
                        <AlertCircle size={24} />
                        Danger Zone
                      </h2>
                      <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <h3 className="font-bold text-red-900">Sign Out</h3>
                          <p className="text-sm text-red-600">Terminate your current session on this device.</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to log out?")) {
                              logout();
                            }
                          }}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
                        >
                          <LogOut size={18} />
                          Logout Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Completion Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Strength</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * (calculateProfileCompletion(user) / 100)) }}
                    className="text-indigo-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{calculateProfileCompletion(user)}%</span>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { label: "Avatar Uploaded", done: !!user?.avatarUrl },
                  { label: "Bio Written", done: !!user?.bio },
                  { label: "Skills Defined", done: user?.skills?.length > 0 },
                  { label: "Socials Linked", done: Object.values(user?.socialLinks || {}).some(v => !!v) }
                ].map((task, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-300"}`}>
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                    <span className={task.done ? "text-slate-700 font-medium" : "text-slate-400"}>{task.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-bold text-slate-900">{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                    user?.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                    user?.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user?.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Verification</span>
                  <span className="flex items-center gap-1 text-indigo-600 font-bold">
                    <Shield size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

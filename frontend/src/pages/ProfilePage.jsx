import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  Briefcase,
  Sun,
  Moon,
  Bell,
  Lock,
  Eye,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Layout from "../components/Layout";
import ConfirmationModal from "../components/ConfirmationModal";
import AvatarSelectionModal from "../components/AvatarSelectionModal";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-hot-toast";
import { calculateProfileCompletion } from "../utils/user";

const ProfilePage = () => {
  const { user, loading: authLoading, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(user?.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState("appearance");
  
  // App Settings State
  const [appSettings, setAppSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: "English",
    twoFactorAuth: false
  });
  
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

  const handleAppSettingChange = (key) => {
    setAppSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Setting updated", {
      icon: <CheckCircle2 className="text-green-500" size={16} />,
      style: {
        borderRadius: '12px',
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#fff' : '#1e293b',
      },
    });
  };

  const handleAvatarSelect = async (url) => {
    try {
      setLoading(true);
      const res = await api.put("/users/me", { avatarUrl: url });
      updateUser(res.data);
      setPreview(url);
      setAvatarFile(null); // Clear any pending file upload
      setIsAvatarModalOpen(false);
      toast.success("Avatar updated successfully");
      fetchActivity();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
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
      className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all whitespace-nowrap ${
        activeTab === id 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Icon size={18} className="flex-shrink-0" />
      <span>{label}</span>
    </button>
  );

  if (authLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-slate-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't load your profile information. Please try logging in again.</p>
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Go to Login
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div 
              className={`relative group cursor-pointer rounded-full p-1 border-4 transition-all ${
                isDragging ? "border-indigo-500 scale-105" : "border-white dark:border-slate-800"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleAvatarClick}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md">
                <img 
                  src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Palette className="text-white mb-1" size={24} />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
              </div>
              <div 
                className="absolute -bottom-1 -right-1 p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-90"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Upload custom image"
              >
                <Camera size={20} />
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
                <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{user?.name}</h1>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                  <BarChart3 size={14} className="text-indigo-500" />
                  <span className="text-[10px] font-medium tracking-wider uppercase">Reputation: {user?.reputation || 0}</span>
                </div>
              </div>
              <p className="text-base text-indigo-600 dark:text-indigo-400 font-medium mb-4">{user?.headline || "Add a professional headline"}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                  <Mail size={16} />
                  <span>{user?.email}</span>
                </div>
                {user?.location && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <MapPin size={16} />
                    <span>{user?.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
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
                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800">
                  <div className="text-xl font-semibold text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-max md:min-w-0">
            <TabButton id="profile" icon={UserIcon} label="Personal Info" />
            <TabButton id="activity" icon={Activity} label="Activity Timeline" />
            <TabButton id="stats" icon={BarChart3} label="Insights" />
            <TabButton id="settings" icon={Settings} label="Settings" />
          </div>
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
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                      <UserIcon className="text-indigo-600" size={24} />
                      Basic Information
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Headline</label>
                          <input 
                            type="text" 
                            name="headline"
                            value={profileForm.headline}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                            placeholder="e.g. Senior UX Designer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Primary Role</label>
                          <select 
                            name="role"
                            value={profileForm.role}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                          >
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="Product Manager">Product Manager</option>
                            <option value="Entrepreneur">Entrepreneur</option>
                            <option value="Investor">Investor</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                          <input 
                            type="text" 
                            name="location"
                            value={profileForm.location}
                            onChange={handleProfileChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                        <textarea 
                          name="bio"
                          value={profileForm.bio}
                          onChange={handleProfileChange}
                          rows={4}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none dark:text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills (comma separated)</label>
                        <input 
                          type="text" 
                          name="skills"
                          value={profileForm.skills}
                          onChange={handleProfileChange}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                          placeholder="React, Node.js, Design Thinking"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                          <Globe className="text-indigo-600" size="20" />
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
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{social.label}</label>
                              <div className="relative">
                                <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                  type="text" 
                                  name={social.name}
                                  value={socialForm[social.name]}
                                  onChange={handleSocialChange}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none dark:text-white"
                                  placeholder={`${social.label}...`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <CheckCircle2 size={18} />
                              Save Changes
                            </>
                          )}
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
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <Activity className="text-indigo-600" size={24} />
                    Recent Activity
                  </h2>
                  <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {activities.length > 0 ? activities.map((log, i) => (
                      <div key={log._id} className="relative flex gap-6 group">
                        <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-50 dark:border-indigo-900/30 flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-200 capitalize">
                              {log.action.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
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
                        <Activity className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
                        <p className="text-slate-400 dark:text-slate-500 font-medium">No recent activity to show.</p>
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
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2">
                      <BarChart3 className="text-indigo-600" size={24} />
                      Account Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Collaboration Impact</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats?.collaborationsCount || 0}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">Projects</span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">Number of ideas where you are a primary collaborator.</p>
                      </div>
                      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-4">Idea Reach</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-slate-800 dark:text-white">{stats?.totalLikes || 0}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium mb-1">Engagements</span>
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">Total likes received across all your shared ideas.</p>
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
                  className="bg-white dark:bg-slate-900 rounded-3xl p-0 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row min-h-[600px]">
                    {/* Settings Sidebar */}
                    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 p-4 md:p-6 overflow-x-auto scrollbar-hide">
                      <div className="flex md:flex-col gap-1.5 min-w-max md:min-w-0">
                        {[
                          { id: "appearance", label: "Appearance", icon: Eye },
                          { id: "notifications", label: "Notifications", icon: Bell },
                          { id: "privacy", label: "Privacy & Safety", icon: Shield },
                          { id: "account", label: "Account", icon: UserIcon },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setSettingsActiveTab(tab.id)}
                            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-2.5 md:py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                              settingsActiveTab === tab.id
                                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-slate-700"
                                : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <tab.icon size={18} className="flex-shrink-0" />
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* Settings Content */}
                    <main className="flex-1 p-8">
                      {settingsActiveTab === "appearance" && (
                        <div className="space-y-6 animate-fade-in">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Theme Preference</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose how IdeaCollab looks to you.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button 
                                onClick={() => theme === 'dark' && toggleTheme()}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                  theme === 'light' 
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' 
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    <Sun size={20} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">Light Mode</p>
                                  </div>
                                </div>
                                {theme === 'light' && <CheckCircle2 className="text-indigo-600" size={18} />}
                              </button>

                              <button 
                                onClick={() => theme === 'light' && toggleTheme()}
                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                                  theme === 'dark' 
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' 
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    <Moon size={20} />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">Dark Mode</p>
                                  </div>
                                </div>
                                {theme === 'dark' && <CheckCircle2 className="text-indigo-600" size={18} />}
                              </button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Accessibility</h3>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                  <Smartphone size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white text-sm">Reduced Motion</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Minimize animations</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "notifications" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notifications</h3>
                          <div className="space-y-4">
                            {[
                              { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email", icon: Globe },
                              { key: "pushNotifications", label: "Push Notifications", desc: "Get real-time alerts", icon: Bell }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                    <item.icon size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{item.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                  </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={appSettings[item.key]} 
                                    onChange={() => handleAppSettingChange(item.key)}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "privacy" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Privacy & Safety</h3>
                          <div className="space-y-4">
                            {[
                              { key: "showEmail", label: "Public Email", desc: "Show email on your profile" },
                              { key: "showLocation", label: "Public Location", desc: "Display city and country" },
                              { key: "allowDirectMessages", label: "Direct Messages", desc: "Allow users to message you" }
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <div className="flex-1">
                                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">{item.label}</h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                                </div>
                                <button
                                  onClick={() => handlePrivacyToggle(item.key)}
                                  className={`w-11 h-6 rounded-full transition-colors relative ${
                                    privacySettings[item.key] ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                    privacySettings[item.key] ? "left-6" : "left-1"
                                  }`}></div>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {settingsActiveTab === "account" && (
                        <div className="space-y-6 animate-fade-in">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Account Security</h3>
                          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                                  <Lock size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-white text-sm">Two-Factor Auth</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Add extra layer of security</p>
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={appSettings.twoFactorAuth} 
                                  onChange={() => handleAppSettingChange("twoFactorAuth")}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                              <Link 
                                to="/change-password"
                                className="block w-full text-center py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                              >
                                Manage Password
                              </Link>
                            </div>
                          </div>

                          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-bold text-red-600 mb-6 flex items-center gap-2">
                              <AlertCircle size={20} />
                              Danger Zone
                            </h2>
                            <div className="space-y-4">
                              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="font-bold text-red-900 dark:text-red-400 text-sm">Logout</h3>
                                  <p className="text-xs text-red-600 dark:text-red-500">Sign out of your account on this device.</p>
                                </div>
                                <button 
                                  onClick={() => setIsLogoutModalOpen(true)}
                                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95"
                                >
                                  Logout
                                </button>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="font-bold text-red-900 dark:text-red-400 text-sm">Delete Account</h3>
                                  <p className="text-xs text-red-600 dark:text-red-500">Permanently remove your account and all data.</p>
                                </div>
                                <button 
                                  onClick={() => toast.error("Account deletion requires admin confirmation.")}
                                  className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all active:scale-95"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </main>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Completion Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Profile Strength</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
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
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">{calculateProfileCompletion(user)}%</span>
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
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${task.done ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"}`}>
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                    <span className={task.done ? "text-slate-700 dark:text-slate-300 font-medium" : "text-slate-400 dark:text-slate-500"}>{task.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Info */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Member Since</span>
                  <span className="font-bold text-slate-800 dark:text-white">{new Date(user?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                    user?.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 
                    user?.status === 'Suspended' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {user?.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Verification</span>
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Shield size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AvatarSelectionModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={user?.avatarUrl}
      />
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access your ideas and collaborations."
        confirmText="Logout"
        onConfirm={logout}
        onCancel={() => setIsLogoutModalOpen(false)}
        isDanger={true}
      />
    </Layout>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Mail, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  Shield, 
  Activity, 
  BarChart3, 
  Briefcase,
  ExternalLink,
  MessageCircle,
  UserPlus,
  UserMinus,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import socket from "../api/socket.js";
import { useAuth } from "../context/AuthContext.jsx";
import { normalizeUser, calculateProfileCompletion } from "../utils/user.js";
import { toast } from "react-hot-toast";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  
  // States
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Interaction states
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [userActivityStatus, setUserActivityStatus] = useState({});

  useEffect(() => {
    fetchProfileData();

    const handleUserActivity = ({ userId, status }) => {
      setUserActivityStatus(prev => ({ ...prev, [userId]: status }));
    };

    socket.on("user_activity", handleUserActivity);

    // Refresh presence status every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchProfileData();
    }, 30000);

    return () => {
      socket.off("user_activity", handleUserActivity);
      clearInterval(refreshInterval);
    };
  }, [id]);

  useEffect(() => {
    if (currentUser && profileUser) {
      setIsFollowing(currentUser.following?.includes(profileUser._id));
    }
  }, [currentUser, profileUser]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [userRes, statsRes, activityRes, ideasRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/users/stats/${id}`),
        api.get(`/users/activity/${id}`),
        api.get(`/ideas/user/${id}`)
      ]);

      const normalized = normalizeUser(userRes.data);
      setProfileUser(normalized);
      
      // Initialize activity status for the profile user
      setUserActivityStatus(prev => ({ 
        ...prev, 
        [normalized._id]: normalized.presenceStatus || (normalized.isOnline ? 'online' : 'offline') 
      }));

      setStats(statsRes.data);
      setActivities(activityRes.data);
      setUserIdeas(ideasRes.data);
      setIsRequested(userRes.data.isRequested || false);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
      setError(err.response?.status === 403 ? "You are not authorized to view this profile." : "User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }
    setFollowLoading(true);
    try {
      const res = await api.put(`/users/${profileUser._id}/follow`);
      
      if (res.data.status === "requested") {
        setIsRequested(true);
        toast.success("Follow request sent");
      } else if (res.data.status === "request_cancelled") {
        setIsRequested(false);
        toast.info("Follow request cancelled");
      } else if (res.data.status === "unfollowed") {
        updateUser({ following: res.data.following });
        setIsFollowing(false);
        toast.info("Unfollowed");
        // Update stats locally
        setStats(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div></Layout>;
  if (error) return <Layout><div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-3xl shadow-sm border border-red-50"><Shield className="mx-auto text-red-500 mb-4" size={48} /><h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2><p className="text-slate-500 mb-6">{error}</p><Link to="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Back to Dashboard</Link></div></Layout>;
  if (!profileUser) return <Layout><div className="text-center mt-20 text-slate-500 font-bold">User profile not found.</div></Layout>;

  const isMe = currentUser?._id === profileUser._id;

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
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-xl border-4 border-white">
                <img 
                  src={profileUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=random`} 
                  alt={profileUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              {userActivityStatus[profileUser._id] && userActivityStatus[profileUser._id] !== 'offline' && (
                <div className={`absolute bottom-2 right-2 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-${userActivityStatus[profileUser._id] === 'online' ? 'green' : 'amber'}-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg ring-4 ring-${userActivityStatus[profileUser._id] === 'online' ? 'green' : 'amber'}-500/20 animate-pulse z-10`}></div>
              )}
            </div>

            {/* User Info Header */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-slate-900">{profileUser.name}</h1>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    profileUser.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                    profileUser.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {profileUser.status}
                  </span>
                  {userActivityStatus[profileUser._id] && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      userActivityStatus[profileUser._id] === 'online' ? 'text-green-600' : 
                      userActivityStatus[profileUser._id] === 'away' ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      • {userActivityStatus[profileUser._id] === 'online' ? 'Active Now' : userActivityStatus[profileUser._id] === 'away' ? 'Away' : 'Offline'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-lg text-indigo-600 font-semibold mb-4">{profileUser.headline || `${profileUser.role} at Idea Collab`}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                {profileUser.privacySettings?.showEmail && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Mail size={16} />
                    <span>{profileUser.email}</span>
                  </div>
                )}
                {profileUser.privacySettings?.showLocation && profileUser.location && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin size={16} />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Briefcase size={16} />
                  <span>{profileUser.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Clock size={16} />
                  <span>Joined {new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {!isMe && (
                  <>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                        isFollowing 
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                          : isRequested
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                      }`}
                    >
                      {followLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : (isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />)}
                      {isFollowing ? "Unfollow" : isRequested ? "Requested" : "Follow"}
                    </button>
                    {profileUser.privacySettings?.allowDirectMessages && (
                      <Link 
                        to={`/messages?user=${profileUser._id}`}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <MessageCircle size={18} />
                        Message
                      </Link>
                    )}
                  </>
                )}
                {isMe && (
                  <Link 
                    to="/profile"
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                  >
                    Edit My Profile
                  </Link>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {[
                { label: "Followers", value: stats?.followersCount || 0 },
                { label: "Following", value: stats?.followingCount || 0 },
                { label: "Ideas", value: stats?.ideasCount || 0 },
                { label: "Collabs", value: stats?.collaborationsCount || 0 }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-2xl text-center min-w-[80px]">
                  <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <TabButton id="profile" icon={Activity} label="Overview" />
          <TabButton id="ideas" icon={Globe} label="Shared Ideas" />
          <TabButton id="activity" icon={Activity} label="Activity" />
          <TabButton id="insights" icon={BarChart3} label="Insights" />
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
                  {/* About Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Shield className="text-indigo-600" size={24} />
                      About {profileUser.name.split(' ')[0]}
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-8">
                      {profileUser.bio || "This user hasn't shared a bio yet."}
                    </p>
                    
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.skills.length > 0 ? (
                        profileUser.skills.map((skill, i) => (
                          <span key={i} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm italic">No skills listed.</span>
                      )}
                    </div>
                  </div>

                  {/* Social Section */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Globe className="text-indigo-600" size={24} />
                      Connect
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "github", label: "GitHub", icon: Github, color: "hover:text-slate-900 hover:bg-slate-50" },
                        { name: "linkedin", label: "LinkedIn", icon: Linkedin, color: "hover:text-blue-600 hover:bg-blue-50" },
                        { name: "twitter", label: "Twitter", icon: Twitter, color: "hover:text-sky-500 hover:bg-sky-50" },
                        { name: "portfolio", label: "Portfolio", icon: ExternalLink, color: "hover:text-indigo-600 hover:bg-indigo-50" }
                      ].map((social) => {
                        const url = profileUser.socialLinks?.[social.name];
                        if (!url) return null;
                        return (
                          <a 
                            key={social.name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 p-4 rounded-2xl border border-slate-100 transition-all group ${social.color}`}
                          >
                            <social.icon size={20} className="text-slate-400 group-hover:text-current" />
                            <span className="font-bold text-slate-700 group-hover:text-current">{social.label}</span>
                            <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        );
                      })}
                      {!Object.values(profileUser.socialLinks || {}).some(v => !!v) && (
                        <p className="text-slate-400 text-sm italic col-span-full">No social links provided.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "ideas" && (
                <motion.div
                  key="ideas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <Globe className="text-indigo-600" size={24} />
                      Shared Innovation Ideas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {userIdeas.length > 0 ? userIdeas.map((idea) => (
                        <Link key={idea._id} to={`/ideas/${idea._id}`} className="group block bg-slate-50 rounded-3xl p-5 border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                              {idea.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(idea.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors truncate">{idea.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{idea.description}</p>
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100/50">
                            <span className="flex items-center gap-1">❤️ {idea.likes?.length || 0}</span>
                            <span className="flex items-center gap-1">🤝 {idea.collaborators?.length || 0}</span>
                          </div>
                        </Link>
                      )) : (
                        <div className="col-span-full py-12 text-center">
                          <Globe className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="text-slate-400 font-bold">No ideas shared publicly yet.</p>
                        </div>
                      )}
                    </div>
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
                            {log.action === 'update_profile' && `${profileUser.name} updated their professional profile.`}
                            {log.action === 'request_follow' && `${profileUser.name} requested to follow ${log.targetUser?.name}.`}
                            {log.action === 'accept_follow' && `${profileUser.name} accepted a new follow request.`}
                            {log.action === 'create_idea' && `${profileUser.name} published a new innovation idea.`}
                            {log.action === 'like_idea' && `${profileUser.name} liked an interesting project.`}
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

              {activeTab === "insights" && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                      <BarChart3 className="text-indigo-600" size={24} />
                      Contribution Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 rounded-2xl">
                        <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4">Collaboration Impact</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900">{stats?.collaborationsCount || 0}</span>
                          <span className="text-slate-500 font-medium mb-1">Projects</span>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm">Number of ideas where this user is an active collaborator.</p>
                      </div>
                      <div className="p-6 bg-amber-50 rounded-2xl">
                        <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">Community Reach</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-black text-slate-900">{stats?.totalLikes || 0}</span>
                          <span className="text-slate-500 font-medium mb-1">Engagements</span>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm">Total community likes received across all shared ideas.</p>
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
                    animate={{ strokeDashoffset: 364.4 - (364.4 * (calculateProfileCompletion(profileUser) / 100)) }}
                    className="text-indigo-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{calculateProfileCompletion(profileUser)}%</span>
                </div>
              </div>
              <p className="text-xs text-center text-slate-500 font-medium px-4">
                This user has completed {calculateProfileCompletion(profileUser)}% of their professional profile.
              </p>
            </div>

            {/* Verification Widget */}
            <div className="bg-indigo-600 rounded-3xl p-6 shadow-lg shadow-indigo-100 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Shield size={20} />
                </div>
                <h3 className="text-lg font-bold">Verified Member</h3>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                {profileUser.name} is a verified innovator on Idea Collab, contributing to high-impact projects.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-80">
                <Clock size={14} />
                <span>Active contributor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;

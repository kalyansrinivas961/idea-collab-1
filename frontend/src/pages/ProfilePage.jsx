import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import UserListModal from "../components/UserListModal.jsx";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    headline: "",
    role: "",
    skills: "",
    location: "",
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userIdeas, setUserIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        headline: user.headline || "",
        role: user.role || "",
        skills: (user.skills || []).join(", "),
        location: user.location || "",
        bio: user.bio || "",
        github: user.socialLinks?.github || "",
        linkedin: user.socialLinks?.linkedin || "",
        twitter: user.socialLinks?.twitter || "",
        portfolio: user.socialLinks?.portfolio || ""
      });
      setPreview(user.avatarUrl || "");

      const fetchUserIdeas = async () => {
          try {
              const res = await api.get(`/ideas/user/${user._id}`);
              setUserIdeas(res.data);
          } catch (err) {
              console.error("Failed to fetch user ideas", err);
          } finally {
              setIdeasLoading(false);
          }
      };
      fetchUserIdeas();
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("headline", form.headline);
    formData.append("role", form.role);
    formData.append("skills", form.skills);
    formData.append("location", form.location);
    formData.append("bio", form.bio);
    
    const socialLinks = {
        github: form.github,
        linkedin: form.linkedin,
        twitter: form.twitter,
        portfolio: form.portfolio
    };
    formData.append("socialLinks", JSON.stringify(socialLinks));

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setStatus("Profile updated");
      updateUser(res.data);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="relative inline-block mb-4">
              <img
                src={preview || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 mx-auto"
              />
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-sm"
                title="Change photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{form.name || "Your Name"}</h2>
            <p className="text-sm text-slate-500">{form.role || "Role"}</p>

            <div className="mt-6 flex justify-center gap-6 text-sm">
                <div 
                    className="text-center cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => setModalType('followers')}
                >
                    <div className="font-bold text-slate-800">{user?.followers?.length || 0}</div>
                    <div className="text-slate-500">Followers</div>
                </div>
                <div 
                    className="text-center cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => setModalType('following')}
                >
                    <div className="font-bold text-slate-800">{user?.following?.length || 0}</div>
                    <div className="text-slate-500">Following</div>
                </div>
            </div>
            
            <div className="mt-6 border-t pt-6">
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
             <h3 className="font-semibold text-slate-800 mb-3">Social Links</h3>
             <div className="space-y-3">
               <div>
                  <label className="text-xs text-slate-500">GitHub</label>
                  <input
                    type="url"
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
               </div>
               <div>
                  <label className="text-xs text-slate-500">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
               </div>
               <div>
                  <label className="text-xs text-slate-500">Twitter</label>
                  <input
                    type="url"
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
               </div>
               <div>
                  <label className="text-xs text-slate-500">Portfolio</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={form.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-semibold text-slate-800">Edit Profile</h1>
                    {status && (
                        <span className={`text-sm ${status.includes("Failed") ? "text-red-600" : "text-emerald-600"}`}>
                            {status}
                        </span>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                            <input
                                type="text"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                placeholder="e.g. Full Stack Developer"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                        <input
                            type="text"
                            name="headline"
                            value={form.headline}
                            onChange={handleChange}
                            placeholder="Brief professional headline"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Tell us about yourself..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={form.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, Design..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                        />
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Link to="/change-password" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium min-h-[44px] flex items-center">
                            Change Password
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors min-h-[44px]"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-slate-800">Your Ideas</h3>
                {ideasLoading ? (
                    <div className="text-center py-4 text-slate-500">Loading ideas...</div>
                ) : userIdeas.length > 0 ? (
                    userIdeas.map((idea) => (
                        <Link
                            key={idea._id}
                            to={`/ideas/${idea._id}`}
                            className="block bg-white rounded-xl p-4 shadow-sm border hover:border-indigo-200 transition"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">{idea.title}</h3>
                                <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">
                                    {idea.category}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{idea.description}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-slate-700">{user?.name}</span>
                                    <LikeButton idea={idea} />
                                    <SaveButton idea={idea} />
                                </div>
                                <span>{idea.collaborators?.length || 0} collaborators</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="bg-white rounded-xl p-6 text-sm text-slate-500 text-center border">
                        You haven't posted any ideas yet. <Link to="/ideas/new" className="text-indigo-600 hover:underline">Share your first idea!</Link>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {modalType && user && (
        <UserListModal 
            userId={user._id} 
            type={modalType} 
            onClose={() => setModalType(null)} 
        />
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Logout</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;


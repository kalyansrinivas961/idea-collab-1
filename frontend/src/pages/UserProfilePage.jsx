import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import UserListModal from "../components/UserListModal.jsx";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'
  const [userIdeas, setUserIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfileUser(res.data);
        setFollowersCount(res.data.followers?.length || 0);
      } catch (err) {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserIdeas = async () => {
        try {
            const res = await api.get(`/ideas/user/${id}`);
            setUserIdeas(res.data);
        } catch (err) {
            console.error("Failed to fetch user ideas", err);
        } finally {
            setIdeasLoading(false);
        }
    };

    fetchUser();
    fetchUserIdeas();
  }, [id]);

  useEffect(() => {
    if (currentUser && profileUser) {
      setIsFollowing(currentUser.following?.includes(profileUser._id));
    }
  }, [currentUser, profileUser]);

  const handleFollow = async () => {
    try {
      const res = await api.put(`/users/${profileUser._id}/follow`);
      
      updateUser({ following: res.data.following });
      setFollowersCount(res.data.followersCount);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Follow failed", err);
    }
  };

  if (loading) return <Layout><div className="text-center mt-10 text-slate-500">Loading profile...</div></Layout>;
  if (error) return <Layout><div className="text-center mt-10 text-slate-500">{error}</div></Layout>;
  if (!profileUser) return <Layout><div className="text-center mt-10 text-slate-500">User not found</div></Layout>;

  const isMe = currentUser?._id === profileUser._id;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="relative inline-block mb-4">
              <img
                src={profileUser.avatarUrl || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 mx-auto"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{profileUser.name}</h2>
            <p className="text-sm text-slate-500">{profileUser.role || "Member"}</p>
            {profileUser.headline && (
                <p className="text-sm text-slate-600 mt-2 italic">{profileUser.headline}</p>
            )}
            
            <div className="mt-6 flex justify-center gap-6 text-sm">
                <div 
                    className="text-center cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => setModalType('followers')}
                >
                    <div className="font-bold text-slate-800">{followersCount}</div>
                    <div className="text-slate-500">Followers</div>
                </div>
                <div 
                    className="text-center cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                    onClick={() => setModalType('following')}
                >
                    <div className="font-bold text-slate-800">{profileUser.following?.length || 0}</div>
                    <div className="text-slate-500">Following</div>
                </div>
            </div>

            {!isMe && currentUser && (
                <button
                    onClick={handleFollow}
                    className={`mt-6 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFollowing 
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                >
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            )}
          </div>
          
          {(profileUser.socialLinks?.github || profileUser.socialLinks?.linkedin || profileUser.socialLinks?.twitter || profileUser.socialLinks?.portfolio) && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="font-semibold text-slate-800 mb-3">Social Links</h3>
                <div className="space-y-3">
                    {profileUser.socialLinks.github && (
                        <a href={profileUser.socialLinks.github} target="_blank" rel="noreferrer" className="block text-sm text-indigo-600 hover:underline">
                            GitHub
                        </a>
                    )}
                    {profileUser.socialLinks.linkedin && (
                        <a href={profileUser.socialLinks.linkedin} target="_blank" rel="noreferrer" className="block text-sm text-indigo-600 hover:underline">
                            LinkedIn
                        </a>
                    )}
                    {profileUser.socialLinks.twitter && (
                        <a href={profileUser.socialLinks.twitter} target="_blank" rel="noreferrer" className="block text-sm text-indigo-600 hover:underline">
                            Twitter
                        </a>
                    )}
                    {profileUser.socialLinks.portfolio && (
                        <a href={profileUser.socialLinks.portfolio} target="_blank" rel="noreferrer" className="block text-sm text-indigo-600 hover:underline">
                            Portfolio
                        </a>
                    )}
                </div>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">About</h3>
                {profileUser.bio ? (
                    <p className="text-slate-600 whitespace-pre-wrap">{profileUser.bio}</p>
                ) : (
                    <p className="text-slate-400 italic">No bio provided.</p>
                )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Skills</h3>
                {profileUser.skills && profileUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profileUser.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-400 italic">No skills listed.</p>
                )}
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Location</h3>
                <p className="text-slate-600">{profileUser.location || "Not specified"}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Posted Ideas</h3>
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
                                    <span className="font-medium text-slate-700">{profileUser.name}</span>
                                    <LikeButton idea={idea} />
                                    <SaveButton idea={idea} />
                                </div>
                                <span>{idea.collaborators?.length || 0} collaborators</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="bg-white rounded-xl p-6 text-sm text-slate-500 text-center border">
                        No ideas posted yet.
                    </div>
                )}
            </div>
        </div>
      </div>

      {modalType && profileUser && (
        <UserListModal 
            userId={profileUser._id} 
            type={modalType} 
            onClose={() => setModalType(null)} 
        />
      )}
    </Layout>
  );
};

export default UserProfilePage;

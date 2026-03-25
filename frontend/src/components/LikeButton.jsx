import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const LikeButton = ({ idea }) => {
  const { user } = useAuth();
  
  const [likes, setLikes] = useState(idea.likes || []);

  useEffect(() => {
    setLikes(idea.likes || []);
  }, [idea.likes]);

  const likesCount = likes.length;
  const hasLiked = user && likes.includes(user._id);

  const handleToggleLike = async (e) => {
    e.stopPropagation(); // Prevent navigating if inside a clickable card
    if (!user) {
      alert("Please login to like");
      return;
    }
    try {
      const { data } = await api.put(`/ideas/${idea._id}/like`);
      setLikes(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button 
      onClick={handleToggleLike}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        hasLiked 
          ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-sm" 
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
      title={hasLiked ? "Unlike" : "Like"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={hasLiked ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-4 h-4"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      <span className="text-xs font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;

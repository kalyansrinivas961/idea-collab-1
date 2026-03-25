import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const SaveButton = ({ idea }) => {
  const { user, updateUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.savedIdeas) {
      setIsSaved(user.savedIdeas.includes(idea._id));
    }
  }, [user, idea._id]);

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to save ideas");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.put(`/users/saved-ideas/${idea._id}`);
      // data is the updated array of saved idea IDs
      updateUser({ savedIdeas: data });
      setIsSaved(data.includes(idea._id));
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isSaved
          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
      }`}
      title={isSaved ? "Unsave" : "Save"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span className="text-xs font-medium">{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
};

export default SaveButton;

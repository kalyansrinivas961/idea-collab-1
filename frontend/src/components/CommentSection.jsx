import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ idea, onUpdate }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      // The socket event will handle the update, but we can also optimistically update
      // or just wait for the socket if we prefer. 
      // However, the previous implementation relied on the response data.
      // If the response data (comments array) is missing populated fields, it might cause issues.
      // Ideally, we rely on the socket for the "full" update, or we ensure the API returns full data.
      
      const { data } = await api.post(`/ideas/${idea._id}/comments`, { text });
      
      // If we are using socket, we might not strictly need this if the socket is fast enough.
      // But to be responsive, we update local state.
      // Ensure data (comments) has user details if possible. 
      // If not, we might see a flash of "Unknown User" until socket update arrives.
      
      onUpdate({ ...idea, comments: data });
      setText("");
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete comment?")) return;
    try {
      const { data } = await api.delete(`/ideas/${idea._id}/comments/${commentId}`);
      onUpdate({ ...idea, comments: data });
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mt-4 transition-colors">
      <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Comments ({idea.comments?.length || 0})</h2>
      
      {/* Comment List */}
      <div className="space-y-6 mb-6">
        {idea.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
               {comment.user?.avatarUrl ? (
                 <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                   {comment.user?.name?.charAt(0) || "?"}
                 </span>
               )}
            </div>
            <div className="flex-1">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-slate-900 dark:text-white">
                    {comment.user?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
              </div>
              {(user && (user._id === comment.user?._id || user._id === idea.owner?._id)) && (
                <button 
                  onClick={() => handleDelete(comment._id)}
                  className="text-xs text-red-500 mt-1 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {(!idea.comments || idea.comments.length === 0) && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No comments yet.</p>
        )}
      </div>

      {/* Add Comment Form */}
      {!user ? (
         <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400">
           Please <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium">login</Link> to join the discussion.
         </div>
      ) : (idea.canComment !== undefined ? idea.canComment : (idea.allowedCommenters !== 'none' || user._id === idea.owner?._id)) ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
             {user?.avatarUrl ? (
               <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                 {user?.name?.charAt(0) || "?"}
               </span>
             )}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 dark:border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition dark:text-white resize-none"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button 
              type="submit" 
              disabled={loading || !text.trim()}
              className="absolute right-2 top-2 p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full disabled:opacity-50 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400">
          Comments are turned off for this post.
        </div>
      )}
    </div>
  );
};

export default CommentSection;

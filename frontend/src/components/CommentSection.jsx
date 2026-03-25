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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mt-4 transition-all duration-300">
      <h2 className="font-semibold text-slate-800 dark:text-white mb-4 transition-colors duration-300">Comments ({idea.comments?.length || 0})</h2>
      
      {/* Comment List */}
      <div className="space-y-6 mb-6">
        {idea.comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 transition-colors duration-300">
               {comment.user?.avatarUrl ? (
                 <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                   {comment.user?.name?.charAt(0) || "?"}
                 </span>
               )}
            </div>
            <div className="flex-1">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 transition-colors duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
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
         <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
           Please <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">login</Link> to join the discussion.
         </div>
      ) : (idea.canComment !== undefined ? idea.canComment : (idea.allowedCommenters !== 'none' || user._id === idea.owner?._id)) ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <textarea
              rows="1"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-300"
          >
            Post
          </button>
        </form>
      ) : (
        <div className="text-center bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
          Comments are restricted by the author.
        </div>
      )}
    </div>
  );
};

export default CommentSection;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";
import CommentSection from "../components/CommentSection.jsx";

const SharedIdeaPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/share/${token}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Link invalid or expired");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Loading shared idea...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center mt-10">
          <div className="text-red-600 dark:text-red-400 font-bold mb-2">Error</div>
          <div className="text-slate-500 dark:text-slate-400 mb-6">{error}</div>
          <Link to="/ideas" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-bold">
            Explore more ideas
          </Link>
        </div>
      </Layout>
    );
  }

  const { idea, permissions } = data;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            You are viewing this idea via a shared link with <strong>{permissions}</strong> permissions.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-1">{idea.title}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link to={`/users/${idea.owner?._id}`} className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400">
                    {idea.owner?.name}
                </Link>
                <span>•</span>
                <span>{idea.category}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{idea.description}</p>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
             <LikeButton idea={idea} />
             <SaveButton idea={idea} />
          </div>
        </div>

        {permissions !== "view" && (
          <CommentSection idea={idea} readOnly={permissions === "view"} />
        )}
        
        {permissions === "view" && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Comments are disabled for this shared link.</p>
                <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition inline-block">
                    Join IdeaCollab to join the conversation
                </Link>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default SharedIdeaPage;

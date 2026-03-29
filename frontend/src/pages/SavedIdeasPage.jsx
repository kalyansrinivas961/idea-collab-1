import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";

const SavedIdeasPage = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users/saved-ideas")
      .then((res) => {
        setIdeas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-white">Saved Ideas</h1>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading saved ideas...</div>
      ) : (
        <div className="space-y-3">
          {ideas.length > 0 ? (
            ideas.map((idea) => (
              <Link
                key={idea._id}
                to={`/ideas/${idea._id}`}
                className="block bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {idea.title}
                  </h3>
                  <span className="text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5">
                    {idea.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                  {idea.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {idea.owner?.name}
                    </span>
                    <LikeButton idea={idea} />
                    <SaveButton idea={idea} />
                  </div>
                  <span>{idea.collaborators?.length || 0} collaborators</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 text-sm text-slate-500 dark:text-slate-400 text-center border border-slate-100 dark:border-slate-800">
              You haven't saved any ideas yet.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default SavedIdeasPage;

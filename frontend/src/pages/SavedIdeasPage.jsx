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
        <h1 className="text-xl font-semibold text-slate-800">Saved Ideas</h1>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading saved ideas...</div>
      ) : (
        <div className="space-y-3">
          {ideas.length > 0 ? (
            ideas.map((idea) => (
              <Link
                key={idea._id}
                to={`/ideas/${idea._id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border hover:border-indigo-200"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                    {idea.title}
                  </h3>
                  <span className="text-xs rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5">
                    {idea.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                  {idea.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700">
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
            <div className="bg-white rounded-xl p-6 text-sm text-slate-500 text-center border">
              You haven't saved any ideas yet.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default SavedIdeasPage;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import LikeButton from "../components/LikeButton.jsx";
import SaveButton from "../components/SaveButton.jsx";
import CommentSection from "../components/CommentSection.jsx";
import ReportModal from "../components/ReportModal.jsx";
import socket from "../api/socket.js";

const IdeaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchIdea = () => {
    setLoading(true);
    api
      .get(`/ideas/${id}`)
      .then((res) => setIdea(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load idea"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchIdea();

    socket.on("idea:updated", (updatedIdea) => {
      if (updatedIdea._id === id) {
        setIdea(updatedIdea);
      }
    });

    return () => {
      socket.off("idea:updated");
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this idea?")) return;
    try {
      await api.delete(`/ideas/${id}`);
      navigate("/ideas");
    } catch {
      setError("Failed to delete idea");
    }
  };

  const handleRequest = async () => {
    setRequestStatus("");
    try {
      await api.post("/collaborations/requests", {
        ideaId: id,
        message: requestMessage
      });
      setRequestStatus("Request sent");
      setRequestMessage("");
    } catch (err) {
      setRequestStatus(err.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Loading idea...</div>
      </Layout>
    );
  }

  if (!idea) {
    return (
      <Layout>
        <div className="text-center mt-10">
          <div className="text-slate-500 dark:text-slate-400 mb-2">Idea not found</div>
          {error && <div className="text-sm text-red-600 dark:text-red-400">Error: {error}</div>}
          <Link to="/ideas" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm block mt-4">
            Back to Ideas
          </Link>
        </div>
      </Layout>
    );
  }

  const isOwner = user && idea.owner && idea.owner._id === user._id;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4">
        {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
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
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 h-fit border border-emerald-100 dark:border-emerald-800">
                {idea.status}
              </span>
              {user && !isOwner && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 transition-colors bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/30 shadow-sm dark:shadow-none"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4a1 1 0 01-.8 1.6H6a1 1 0 01-1-1V6z" clipRule="evenodd" />
                  </svg>
                  Report
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{idea.description}</p>
          {idea.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {idea.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Attachments Display */}
          {idea.attachments?.length > 0 && (
            <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Attachments</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {idea.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={`${import.meta.env.VITE_API_URL}${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition bg-white dark:bg-slate-900"
                  >
                    {file.fileType === 'image' ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${file.url}`}
                        alt={file.originalName}
                        className="h-24 w-full object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="h-24 w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 rounded mb-2 text-indigo-400 dark:text-indigo-300">
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                      </div>
                    )}
                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate w-full text-center font-medium">{file.originalName}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
             <LikeButton idea={idea} />
             <SaveButton idea={idea} />
          </div>
        </div>

        {showReportModal && (
          <ReportModal
            ideaId={id}
            onClose={() => setShowReportModal(false)}
          />
        )}

        <CommentSection idea={idea} onUpdate={setIdea} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 md:col-span-2 transition-colors">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-2">Collaborators</h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to={`/users/${idea.owner?._id}`} className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                    {idea.owner?.name}
                </Link> (Owner)
              </li>
              {idea.collaborators?.map((c) => (
                <li key={c._id}>
                    <Link to={`/users/${c._id}`} className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">
                        {c.name}
                    </Link>
                </li>
              ))}
              {(!idea.collaborators || idea.collaborators.length === 0) && (
                <li className="text-slate-500 dark:text-slate-500 text-xs italic">No collaborators yet.</li>
              )}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3 h-fit transition-colors">
            {isOwner ? (
              <>
                <h2 className="font-semibold text-slate-800 dark:text-white mb-2">Owner actions</h2>
                <button
                  onClick={handleDelete}
                  className="w-full text-sm rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition min-h-[44px]"
                >
                  Delete idea
                </button>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-slate-800 dark:text-white mb-2">Collaborate</h2>
                <textarea
                  rows="3"
                  placeholder="Explain how you can contribute..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 dark:text-white transition-colors"
                />
                <button
                  onClick={handleRequest}
                  className="w-full text-sm rounded-lg bg-indigo-600 text-white py-2 hover:bg-indigo-700 transition shadow-sm font-medium min-h-[44px]"
                >
                  Send collaboration request
                </button>
                {requestStatus && (
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 font-medium">{requestStatus}</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IdeaDetailsPage;

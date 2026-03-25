import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewMessage] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubloading] = useState(false);

  const fetchProblem = async () => {
    try {
      const res = await api.get(`/qa/problems/${id}`);
      setProblem(res.data);
      const solRes = await api.get(`/qa/problems/${id}/solutions`);
      setSolutions(solRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Problem Error:", err);
      toast.error("Failed to load problem");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const handleVoteProblem = async (type) => {
    if (!currentUser) return toast.error("Please login to vote");
    try {
      const res = await api.post(`/qa/problems/${id}/vote`, { type });
      setProblem(res.data);
    } catch (err) {
      toast.error("Voting failed");
    }
  };

  const handleVoteSolution = async (solId, type) => {
    if (!currentUser) return toast.error("Please login to vote");
    try {
      const res = await api.post(`/solutions/${solId}/vote`, { type });
      setSolutions(prev => prev.map(s => s._id === solId ? res.data : s));
    } catch (err) {
      toast.error("Voting failed");
    }
  };

  const handleAcceptSolution = async (solId) => {
    try {
      const res = await api.post(`/solutions/${solId}/accept`);
      setProblem(res.data.problem);
      // Update all solutions to reflect new acceptance state
      const solRes = await api.get(`/qa/problems/${id}/solutions`);
      setSolutions(solRes.data);
      toast.success("Solution status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!newSolution.trim()) return toast.error("Please provide a solution");

    setSubloading(true);
    try {
      const res = await api.post(`/qa/problems/${id}/solutions`, {
        problemId: id,
        content: newSolution,
        codeSnippets: code ? [{ language, code }] : []
      });
      setSolutions(prev => [...prev, { ...res.data, author: currentUser }]);
      setNewMessage("");
      setCode("");
      toast.success("Solution submitted!");
    } catch (err) {
      toast.error("Failed to submit solution");
    } finally {
      setSubloading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex justify-center py-40">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Layout>
  );

  if (!problem) return (
    <Layout>
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold text-slate-800">Problem not found</h2>
        <Link to="/qa" className="text-indigo-600 font-bold mt-4 inline-block hover:underline">Back to Q&A</Link>
      </div>
    </Layout>
  );

  const isAuthor = currentUser?._id === problem.author._id;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/qa" className="text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Q&A
          </Link>
        </div>

        {/* Problem Section */}
        <div className="flex gap-6 mb-12">
          {/* Voting Sidebar */}
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => handleVoteProblem('upvote')}
              className={`p-3 rounded-2xl border-2 transition-all ${problem.upvotes.includes(currentUser?._id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
            </button>
            <span className="text-xl font-black text-slate-800">{problem.upvotes.length - problem.downvotes.length}</span>
            <button 
              onClick={() => handleVoteProblem('downvote')}
              className={`p-3 rounded-2xl border-2 transition-all ${problem.downvotes.includes(currentUser?._id) ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-red-200 hover:text-red-500'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

          <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${problem.isResolved ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {problem.isResolved ? 'Resolved' : 'Open'}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">{problem.category}</span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{problem.title}</h1>
            
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{problem.description}</p>
            </div>

            {problem.codeSnippets.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between bg-slate-800 text-slate-400 px-4 py-2 rounded-t-2xl text-[10px] font-black uppercase tracking-widest">
                  <span>{problem.codeSnippets[0].language}</span>
                </div>
                <pre className="bg-slate-900 text-indigo-300 p-6 rounded-b-2xl overflow-x-auto font-mono text-sm shadow-inner">
                  <code>{problem.codeSnippets[0].code}</code>
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {problem.tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-2xl text-xs font-bold border border-slate-200">#{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <img src={problem.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(problem.author.name)}`} alt="" className="w-10 h-10 rounded-2xl object-cover ring-4 ring-slate-50" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{problem.author.name}</span>
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px] font-black">★ {problem.author.reputation}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posted on {new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xl font-black text-slate-800">{problem.views}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">{solutions.length} Solutions</h2>
            <div className="h-1 flex-1 bg-slate-100 mx-6 rounded-full opacity-50"></div>
          </div>

          <div className="space-y-8">
            {solutions.map((solution) => (
              <div key={solution._id} className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => handleVoteSolution(solution._id, 'upvote')}
                    className={`p-2 rounded-xl transition-all ${solution.upvotes.includes(currentUser?._id) ? 'text-indigo-600 scale-110' : 'text-slate-300 hover:text-indigo-400'}`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-8 8h16l-8-8z"/></svg>
                  </button>
                  <span className="text-sm font-black text-slate-600">{solution.upvotes.length - solution.downvotes.length}</span>
                  <button 
                    onClick={() => handleVoteSolution(solution._id, 'downvote')}
                    className={`p-2 rounded-xl transition-all ${solution.downvotes.includes(currentUser?._id) ? 'text-red-500 scale-110' : 'text-slate-300 hover:text-red-400'}`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 20l8-8H4l8 8z"/></svg>
                  </button>
                  {solution.isAccepted && (
                    <div className="mt-2 text-emerald-500" title="Accepted Solution">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </div>
                  )}
                </div>

                <div className={`flex-1 bg-white border-2 rounded-3xl p-6 transition-all ${solution.isAccepted ? 'border-emerald-500 shadow-xl shadow-emerald-50' : 'border-slate-50 hover:border-indigo-100'}`}>
                  <p className="text-slate-700 leading-relaxed font-medium mb-6 whitespace-pre-wrap">{solution.content}</p>
                  
                  {solution.codeSnippets?.length > 0 && (
                    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                      <div className="bg-slate-800 text-slate-400 px-4 py-2 text-[9px] font-bold uppercase tracking-widest">{solution.codeSnippets[0].language}</div>
                      <pre className="bg-slate-900 text-indigo-300 p-4 font-mono text-xs overflow-x-auto">
                        <code>{solution.codeSnippets[0].code}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={solution.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.author.name)}`} alt="" className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <span className="block text-xs font-black text-slate-800">{solution.author.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(solution.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {isAuthor && (
                      <button 
                        onClick={() => handleAcceptSolution(solution._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${solution.isAccepted ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      >
                        {solution.isAccepted ? 'Revoke Acceptance' : 'Accept Solution'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Solution Section */}
        <div className="bg-indigo-900 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200">
          <h2 className="text-2xl font-black mb-2">Your Solution</h2>
          <p className="text-indigo-200 font-medium mb-8">Share your expertise and help resolve this challenge.</p>
          
          <form onSubmit={handleSubmitSolution} className="space-y-6">
            <textarea
              placeholder="Explain your approach clearly..."
              value={newSolution}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-6 py-4 focus:outline-none focus:border-white/30 focus:bg-white/20 transition-all font-medium min-h-[150px] placeholder:text-white/30"
              required
            />
            
            <div className="bg-black/20 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-300">Code Snippet (Optional)</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/10 border-none text-[10px] font-black rounded-lg px-2 py-1 focus:ring-0"
                >
                  <option value="javascript">JS</option>
                  <option value="python">PY</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>
              <textarea
                placeholder="// Paste code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black/30 border-none rounded-2xl px-4 py-3 focus:ring-0 font-mono text-sm min-h-[120px] text-indigo-300 placeholder:text-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-indigo-900 py-4 rounded-3xl font-black hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/20"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Submit Solution
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProblemDetailPage;

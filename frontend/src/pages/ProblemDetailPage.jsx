import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowUp, ArrowDown, Check, MessageSquare, Trash2, Reply } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import toast from "react-hot-toast";

const ProblemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewMessage] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [replyTo, setReplyTo] = useState(null); // ID of solution being replied to
  const [replyText, setReplyText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteProblem = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/qa/problems/${id}`);
      toast.success("Question deleted successfully");
      navigate("/qa");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete question");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!isAuthor) return;
    const newStatus = problem.status === "solved" ? "open" : "solved";
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/qa/problems/${id}/status`, { status: newStatus });
      setProblem(res.data);
      toast.success(`Question marked as ${newStatus === "solved" ? "Solved" : "Still Looking"}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

  const handleSubmitSolution = async (e, isReply = false) => {
    if (e) e.preventDefault();
    const content = isReply ? replyText : newSolution;
    if (!content.trim()) return toast.error("Please provide a solution");

    if (!isReply && isAuthor) {
      return toast.error("You cannot post a solution to your own question. Use replies to respond to others.");
    }

    setSubloading(true);
    try {
      const res = await api.post(`/qa/problems/${id}/solutions`, {
        problemId: id,
        content,
        codeSnippets: !isReply && code ? [{ language, code }] : [],
        parentReply: isReply ? replyTo : null
      });
      
      const newSol = { ...res.data, author: currentUser };
      setSolutions(prev => [...prev, newSol]);
      
      if (isReply) {
        setReplyText("");
        setReplyTo(null);
      } else {
        setNewMessage("");
        setCode("");
      }
      toast.success(isReply ? "Reply posted!" : "Solution posted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post response");
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

  const problemAuthorId = problem.author?._id || problem.author;
  const isAuthor = currentUser?._id === problemAuthorId;

  // Group solutions by parentReply to support threading
  const topLevelSolutions = solutions.filter(s => !s.parentReply);
  const replies = solutions.filter(s => s.parentReply);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/qa" className="text-slate-500 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Q&A
          </Link>
          
          <div className="flex items-center gap-4">
            {isAuthor && (
              <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question Status</span>
                <button
                  onClick={handleToggleStatus}
                  disabled={updatingStatus}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    problem.status === "solved" ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                  role="switch"
                  aria-checked={problem.status === "solved"}
                >
                  <span className="sr-only">Mark as Solved</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      problem.status === "solved" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${problem.status === "solved" ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {problem.status === "solved" ? 'Marked as Solved' : 'Still Looking'}
                </span>
              </div>
            )}

            {isAuthor && (
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-all border border-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Question
              </button>
            )}
          </div>
        </div>

        {/* Problem Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Voting Sidebar */}
          <div className="flex flex-row md:flex-col items-center gap-2 justify-center md:justify-start">
            <button 
              onClick={() => handleVoteProblem('upvote')}
              className={`p-2 rounded-xl border transition-all ${problem.upvotes.includes(currentUser?._id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'}`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-slate-800">{problem.upvotes.length - problem.downvotes.length}</span>
            <button 
              onClick={() => handleVoteProblem('downvote')}
              className={`p-2 rounded-xl border transition-all ${problem.downvotes.includes(currentUser?._id) ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-100' : 'bg-white border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500'}`}
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5 ${
                problem.status === "solved" ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
              }`}>
                {problem.status === "solved" ? (
                  <>
                    <Check className="w-3 h-3" strokeWidth={3} />
                    Solved
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                    Still Looking
                  </>
                )}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{problem.category}</span>
            </div>
            
            <h1 className="text-xl font-semibold text-slate-800 mb-6 leading-tight">{problem.title}</h1>
            
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-slate-600 leading-relaxed font-medium">{problem.description}</p>
            </div>

            {problem.codeSnippets.length > 0 && (
              <div className="mb-8 border border-slate-100 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between bg-slate-50 border-b border-slate-100 text-slate-500 px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                  <span>{problem.codeSnippets[0].language}</span>
                </div>
                <pre className="bg-slate-900 text-indigo-300 p-6 overflow-x-auto font-mono text-sm">
                  <code>{problem.codeSnippets[0].code}</code>
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {problem.tags.map(tag => (
                <span key={tag} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">#{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <img src={problem.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(problem.author.name)}`} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{problem.author.name}</span>
                    <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-lg text-[10px] font-bold">★ {problem.author.reputation}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posted on {new Date(problem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-slate-800">{problem.views}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solutions Section */}
        <div className="mb-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              {solutions.length} {solutions.length === 1 ? 'Solution' : 'Solutions'}
            </h3>
          </div>

          {/* Post Solution Form (Hidden for author unless replying) */}
          {(!isAuthor || replyTo) ? (
            <div id="response-form" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <MessageSquare size={18} />
                <h4 className="text-sm font-bold uppercase tracking-wider">
                  {replyTo ? "Post a Reply" : "Post a Solution"}
                </h4>
              </div>
              
              {replyTo && (
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                  <p className="text-xs text-indigo-700 font-medium">
                    Replying to {solutions.find(s => s._id === replyTo)?.author?.name}'s solution
                  </p>
                  <button 
                    onClick={() => setReplyTo(null)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <form onSubmit={(e) => handleSubmitSolution(e, !!replyTo)} className="space-y-4">
                <textarea
                  value={replyTo ? replyText : newSolution}
                  onChange={(e) => replyTo ? setReplyText(e.target.value) : setNewMessage(e.target.value)}
                  placeholder={replyTo ? "Type your reply..." : "Explain your solution in detail..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm min-h-[120px] resize-none"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Reply className="w-4 h-4" />
                    )}
                    {replyTo ? "Post Reply" : "Post Solution"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center mb-8">
              <p className="text-sm text-slate-500 font-medium">
                As the author, you cannot post a solution to your own question. 
                <br />You can still reply to solutions provided by others.
              </p>
            </div>
          )}

          <div className="space-y-8">
            {topLevelSolutions.map((solution) => (
              <div key={solution._id} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-row md:flex-col items-center gap-2 justify-center md:justify-start">
                    <button 
                      onClick={() => handleVoteSolution(solution._id, 'upvote')}
                      className={`p-1.5 rounded-lg transition-all ${solution.upvotes.includes(currentUser?._id) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-50'}`}
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600">{solution.upvotes.length - solution.downvotes.length}</span>
                    <button 
                      onClick={() => handleVoteSolution(solution._id, 'downvote')}
                      className={`p-1.5 rounded-lg transition-all ${solution.downvotes.includes(currentUser?._id) ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'}`}
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                    {solution.isAccepted && (
                      <div className="mt-2 text-emerald-500 bg-emerald-50 p-1 rounded-lg" title="Accepted Solution">
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  <div className={`flex-1 bg-white border rounded-2xl p-6 transition-all ${solution.isAccepted ? 'border-emerald-500 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6 whitespace-pre-wrap">{solution.content}</p>
                    
                    {solution.codeSnippets?.length > 0 && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-slate-100">
                        <div className="bg-slate-50 border-b border-slate-100 text-slate-500 px-4 py-2 text-[9px] font-bold uppercase tracking-widest">{solution.codeSnippets[0].language}</div>
                        <pre className="bg-slate-900 text-indigo-300 p-4 font-mono text-xs overflow-x-auto">
                          <code>{solution.codeSnippets[0].code}</code>
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={solution.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(solution.author.name)}`} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <span className="block text-xs font-bold text-slate-800">{solution.author.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(solution.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setReplyTo(solution._id === replyTo ? null : solution._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all uppercase tracking-wider"
                        >
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                        {isAuthor && (
                          <button 
                            onClick={() => handleAcceptSolution(solution._id)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${solution.isAccepted ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                          >
                            {solution.isAccepted ? 'Revoke Acceptance' : 'Accept Solution'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {replyTo === solution._id && (
                  <div className="ml-12 md:ml-16 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                      <Reply className="w-3 h-3" />
                      Replying to {solution.author.name}
                    </div>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium text-sm min-h-[100px] mb-4"
                    />
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setReplyTo(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSubmitSolution(null, true)}
                        disabled={submitting}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        Submit Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                <div className="ml-12 md:ml-16 space-y-4">
                  {replies.filter(r => r.parentReply === solution._id).map(reply => (
                    <div key={reply._id} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{reply.content}</p>
                      <div className="flex items-center gap-3">
                        <img src={reply.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author.name)}`} alt="" className="w-6 h-6 rounded-md object-cover" />
                        <div>
                          <span className="block text-[10px] font-bold text-slate-800">{reply.author.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{new Date(reply.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
       
       <ConfirmationModal
         isOpen={isDeleteModalOpen}
         title="Delete Question"
         message="Are you sure you want to permanently delete this question and all its solutions? This action cannot be undone."
         confirmText="Delete"
         onConfirm={handleDeleteProblem}
         onCancel={() => setIsDeleteModalOpen(false)}
         isDanger={true}
         isLoading={isDeleting}
       />
     </Layout>
   );
 };

export default ProblemDetailPage;

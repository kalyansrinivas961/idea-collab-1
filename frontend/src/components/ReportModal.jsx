import React, { useState } from "react";
import api from "../api/client";

const ReportModal = ({ ideaId, onClose, onReportSuccess }) => {
  const [category, setCategory] = useState("spam");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (context.length < 500) {
      setError(`Context must be at least 500 characters. Current length: ${context.length}`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/reports", {
        ideaId,
        category,
        context
      });
      setReferenceNumber(res.data.referenceNumber);
      if (onReportSuccess) onReportSuccess(res.data.referenceNumber);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (referenceNumber) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Report Received</h3>
          <p className="text-slate-600 mb-4 text-sm">
            Thank you for helping us keep IdeaCollab safe. Your report has been submitted to our moderation team.
          </p>
          <div className="bg-slate-50 border rounded-lg p-3 mb-6">
            <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold mb-1">Reference Number</span>
            <span className="text-lg font-mono font-bold text-indigo-600">{referenceNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-slate-800 text-white rounded-lg py-2.5 font-medium hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">Report Idea</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Why are you reporting this?</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="spam">Spam / Deceptive content</option>
              <option value="harassment">Harassment / Hate speech</option>
              <option value="misinformation">Misinformation</option>
              <option value="illegal">Illegal content / Activities</option>
              <option value="copyright">Copyright violation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Additional Context</label>
              <span className={`text-[10px] font-bold ${context.length < 500 ? "text-slate-400" : "text-emerald-500"}`}>
                {context.length} / 500 minimum
              </span>
            </div>
            <textarea
              required
              rows="6"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Please provide detailed information about why this content should be removed. (Minimum 500 characters)"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Your report will be reviewed by our moderation team. Abuse of the reporting system may result in account suspension.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || context.length < 500}
              className="px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;

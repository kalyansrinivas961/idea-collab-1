import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/client";
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User as UserIcon, 
  ExternalLink, 
  ChevronLeft,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Hash,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchReportDetails = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data);
    } catch (err) {
      toast.error("Failed to load report details");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/reports/${id}/status`, { status: newStatus });
      setReport({ ...report, status: newStatus });
      toast.success(`Report status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update report status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-200 dark:border-amber-800/50"><Clock size={14} /> Pending Review</span>;
      case "resolved":
        return <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800/50"><CheckCircle size={14} /> Resolved</span>;
      case "dismissed":
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"><XCircle size={14} /> Dismissed</span>;
      default:
        return <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800/50">{status}</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold tracking-wide">Loading Report Details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Moderation Hub
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Report Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                      <ShieldAlert className="text-red-600" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Report Review</h1>
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{report.referenceNumber}</p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>

                <div className="space-y-8">
                  {/* Category & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Violation Category</p>
                      <p className="text-sm font-black text-red-600 dark:text-red-400 uppercase">{report.category}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Submission Date</p>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {new Date(report.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>

                  {/* Complaint Context */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare size={16} className="text-indigo-500" />
                      Complaint Context
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic whitespace-pre-wrap break-words">
                        "{report.context}"
                      </p>
                    </div>
                  </div>

                  {/* Moderator Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-indigo-500" />
                      Take Action
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleStatusUpdate("dismissed")}
                        disabled={updating || report.status === "dismissed"}
                        className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2.5"
                      >
                        <XCircle size={16} /> DISMISS REPORT
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate("resolved")}
                        disabled={updating || report.status === "resolved"}
                        className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10 dark:shadow-none"
                      >
                        <CheckCircle size={16} /> MARK AS RESOLVED
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Idea Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-widest">Reported Content</h3>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <h4 className="text-base font-black text-slate-800 dark:text-white mb-2 line-clamp-2">{report.idea?.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4">{report.idea?.description}</p>
                  <Link 
                    to={`/ideas/${report.idea?._id}`}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white dark:bg-slate-800 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all border border-indigo-100 dark:border-indigo-900/50 uppercase"
                  >
                    View Original Idea <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-widest">People Involved</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img 
                    src={report.reporter?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reporter?.name)}&background=random`} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Reporter</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{report.reporter?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <img 
                    src={report.idea?.owner?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.idea?.owner?.name)}&background=random`} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Content Owner</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{report.idea?.owner?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportDetailsPage;

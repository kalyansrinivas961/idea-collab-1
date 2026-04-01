import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/client";
import { 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search,
  MessageSquare,
  User as UserIcon,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await api.put(`/reports/${reportId}/status`, { status: newStatus });
      setReports(reports.map(r => r._id === reportId ? { ...r, status: newStatus } : r));
      toast.success(`Report ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = !search || 
      r.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.idea?.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pending</span>;
      case "resolved":
        return <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Resolved</span>;
      case "dismissed":
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Dismissed</span>;
      default:
        return <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-red-600" size={32} />
              Moderation Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Review and resolve community content reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchReports} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search reference, user, or idea..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-slate-400" size={18} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white font-bold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        {loading && reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-bold">Loading reports...</p>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                          {report.referenceNumber}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                        Reported Idea: {report.idea?.title || "Deleted Idea"}
                        {report.idea && (
                          <Link to={`/ideas/${report.idea._id}`} className="text-indigo-600 hover:text-indigo-700">
                            <ExternalLink size={14} />
                          </Link>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                          {report.category}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <UserIcon size={12} />
                          By {report.reporter?.name || "Unknown"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{report.context}"
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-row lg:flex-col gap-2 justify-center">
                    <button 
                      onClick={() => handleStatusUpdate(report._id, "resolved")}
                      disabled={report.status === "resolved"}
                      className="flex-1 lg:flex-none py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} /> RESOLVE
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(report._id, "dismissed")}
                      disabled={report.status === "dismissed"}
                      className="flex-1 lg:flex-none py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black hover:bg-slate-300 dark:hover:bg-slate-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <XCircle size={14} /> DISMISS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No reports found</h3>
            <p className="text-slate-500 text-sm">Everything looks clean in the community for now!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;

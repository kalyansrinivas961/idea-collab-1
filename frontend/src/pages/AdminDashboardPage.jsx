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
  ChevronRight,
  AlertTriangle,
  FileText,
  RefreshCw,
  BarChart3,
  Mic
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VoiceInput from "../components/VoiceInput";

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchReports = async () => {
    console.log("Fetching reports...");
    setLoading(true);
    try {
      const res = await api.get("/reports");
      console.log("Reports fetched successfully:", res.data.length);
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
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

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
  };

  const filteredReports = reports.filter(r => {
    const matchesTab = activeTab === "all" || r.status === activeTab;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      (r.referenceNumber && r.referenceNumber.toLowerCase().includes(searchLower)) ||
      (r.reporter?.name && r.reporter.name.toLowerCase().includes(searchLower)) ||
      (r.idea?.title && r.idea.title.toLowerCase().includes(searchLower));
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><Clock size={14} /> Pending Review</span>;
      case "resolved":
        return <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><CheckCircle size={14} /> Resolved</span>;
      case "dismissed":
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><XCircle size={14} /> Dismissed</span>;
      default:
        return <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getAccentColor = (status) => {
    switch (status) {
      case "pending": return "border-l-amber-500";
      case "resolved": return "border-l-emerald-500";
      case "dismissed": return "border-l-slate-400";
      default: return "border-l-indigo-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                <ShieldAlert className="text-red-600" size={28} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                Moderation Hub
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg ml-1">
              Review and manage reported content to maintain community standards.
            </p>
          </div>
          
          <button 
            onClick={fetchReports} 
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500"/>
                Report Statistics
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Total Reports", val: stats.total, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                  { label: "Pending Review", val: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
                  { label: "Resolved", val: stats.resolved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                  { label: "Dismissed", val: stats.dismissed, icon: XCircle, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
                ].map((s, i) => (
                  <div key={i} className={`p-4 rounded-2xl flex items-center gap-4 ${s.bg}`}>
                    <s.icon className={`${s.color} w-6 h-6 flex-shrink-0`} />
                    <div className="flex-1 flex justify-between items-center">
                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">{s.label}</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Controls Bar */}
            <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full md:w-auto overflow-x-auto">
                {["all", "pending", "resolved", "dismissed"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`flex-1 md:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${
                      activeTab === t
                        ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-md"
                        : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:max-w-sm group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search reports..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <VoiceInput 
                    onTranscript={(text) => setSearch(text)}
                    className="p-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Reports Content */}
            {loading && reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="relative mb-4">
                  <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide">FETCHING MODERATION QUEUE...</p>
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {filteredReports.map((report) => (
                  <div 
                    key={report._id} 
                    onClick={(e) => {
                      // Only navigate if we're not clicking a button or a link
                      if (e.target.closest('button') || e.target.closest('a')) return;
                      navigate(`/admin/reports/${report._id}`);
                    }}
                    className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border dark:border-slate-800 hover:shadow-lg hover:border-indigo-500/50 transition-all border-l-4 ${getAccentColor(report.status)} cursor-pointer group/card`}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        {/* Left: Metadata & Content */}
                        <div className="flex-1 min-w-0 space-y-5">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="font-mono text-xs font-bold tracking-tighter text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/50 uppercase">
                              {report.referenceNumber}
                            </span>
                            {getStatusBadge(report.status)}
                            <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs ml-auto">
                              <Clock size={14} />
                              {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 group-hover/card:text-indigo-600 transition-colors">
                              {report.idea?.title || "Archived Content"}
                              {report.idea && (
                                <Link 
                                  to={`/ideas/${report.idea._id}`} 
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" 
                                  title="View Idea"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                              )}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-200 dark:border-red-900/30">
                                {report.category}
                              </span>
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                <UserIcon size={12} />
                                Reported by: <span className="font-bold text-slate-700 dark:text-slate-200">{report.reporter?.name || "System"}</span>
                              </div>
                            </div>
                          </div>

                          {report.context && (
                            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 max-h-40 overflow-y-auto overflow-x-auto md:overflow-x-hidden">
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic break-words whitespace-pre-wrap">
                                "{report.context}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right: Moderator Actions */}
                        <div className="lg:w-56 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-5 lg:pt-0 lg:pl-6">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1 lg:block hidden">Moderator Actions</p>
                          <button 
                            onClick={() => handleStatusUpdate(report._id, "dismissed")}
                            disabled={report.status === "dismissed"}
                            className="w-full py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <XCircle size={14} /> Dismiss Report
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(report._id, "resolved")}
                            disabled={report.status === "resolved"}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 dark:shadow-none"
                          >
                            <CheckCircle size={14} /> Mark as Resolved
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
                  <ShieldAlert size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">No Reports Found</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                  {activeTab === 'all' 
                    ? "The moderation queue is clear. Great job!"
                    : `There are no ${activeTab} reports to show.`}
                </p>
                {activeTab !== 'all' && (
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="mt-6 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
                  >
                    View All Reports
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;

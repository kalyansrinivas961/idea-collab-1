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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
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

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
  };

  const filteredReports = reports.filter(r => {
    const matchesTab = activeTab === "all" || r.status === activeTab;
    const matchesSearch = !search || 
      r.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.idea?.title.toLowerCase().includes(search.toLowerCase());
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <ShieldAlert className="text-red-600" size={32} />
              </div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                Moderation <span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium ml-1">
              Maintain community standards and review reported content.
            </p>
          </div>
          
          <button 
            onClick={fetchReports} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Reports", val: stats.total, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
            { label: "Pending Review", val: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { label: "Resolved", val: stats.resolved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Dismissed", val: stats.dismissed, icon: XCircle, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
              <div className={`p-3 rounded-2xl ${s.bg}`}>
                <s.icon className={s.color} size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white leading-none mt-1">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls Bar */}
        <div className="space-y-6">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            {/* Status Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full xl:w-auto">
              {["all", "pending", "resolved", "dismissed"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 xl:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all capitalize ${
                    activeTab === t
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full xl:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by ID, reporter, or idea title..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-sm"
              />
            </div>
          </div>

          {/* Reports Content */}
          {loading && reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
              </div>
              <p className="text-slate-500 font-black mt-6 tracking-wide">FETCHING MODERATION QUEUE...</p>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredReports.map((report) => (
                <div key={report._id} className={`bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all border-l-8 ${getAccentColor(report.status)}`}>
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                      {/* Left: Metadata & Content */}
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className="font-mono text-[10px] font-black tracking-tighter text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 uppercase">
                            REF: {report.referenceNumber}
                          </span>
                          {getStatusBadge(report.status)}
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs ml-auto">
                            <Clock size={14} />
                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                {report.idea?.title || "Archived Content"}
                                {report.idea && (
                                  <Link to={`/ideas/${report.idea._id}`} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" title="View Idea">
                                    <ExternalLink size={16} />
                                  </Link>
                                )}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
                                {report.category}
                              </span>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                                <UserIcon size={14} className="text-slate-400" />
                                Reporter: <span className="text-slate-700 dark:text-slate-200">{report.reporter?.name || "System"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 relative group">
                            <MessageSquare className="absolute -top-3 -left-3 text-slate-200 dark:text-slate-700" size={32} />
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                              "{report.context}"
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Moderator Actions */}
                      <div className="lg:w-64 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">Moderator Actions</p>
                        <button 
                          onClick={() => handleStatusUpdate(report._id, "resolved")}
                          disabled={report.status === "resolved"}
                          className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-200 dark:shadow-none"
                        >
                          <CheckCircle size={16} /> MARK AS RESOLVED
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(report._id, "dismissed")}
                          disabled={report.status === "dismissed"}
                          className="w-full py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-black hover:bg-slate-300 dark:hover:bg-slate-700 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2.5"
                        >
                          <XCircle size={16} /> DISMISS REPORT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700">
                <ShieldAlert size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Zero Reports Found</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                {activeTab === 'all' 
                  ? "The community is currently safe and standard compliant. No reports to display."
                  : `There are currently no ${activeTab} reports in the queue.`}
              </p>
              {activeTab !== 'all' && (
                <button 
                  onClick={() => setActiveTab('all')}
                  className="mt-6 text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline"
                >
                  View All Reports &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;

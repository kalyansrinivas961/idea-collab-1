import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";
import { toast } from "react-hot-toast";

const SharingHistoryPage = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/share/history");
      setLinks(res.data);
    } catch (err) {
      toast.error("Failed to load sharing history");
    } finally {
      setLoading(false);
    }
  };

  const revokeLink = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this link? It will no longer be accessible.")) return;
    try {
      await api.delete(`/share/${id}`);
      setLinks(links.map(l => l._id === id ? { ...l, isActive: false } : l));
      toast.success("Link revoked");
    } catch (err) {
      toast.error("Failed to revoke link");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-slate-500 dark:text-slate-400 mt-10">Loading sharing history...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Sharing History</h1>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{links.length} Links Generated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Idea</th>
                <th className="px-6 py-4 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Permissions</th>
                <th className="px-6 py-4 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Access Count</th>
                <th className="px-6 py-4 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-4 font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {links.map((link) => (
                <tr key={link._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{link.idea?.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{link.shareToken}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      link.permissions === 'edit' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' :
                      link.permissions === 'comment' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                      'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                    }`}>
                      {link.permissions}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800 dark:text-white">{link.accessCount}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Total Views</div>
                  </td>
                  <td className="px-6 py-4">
                    {link.isActive ? (
                      <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {link.isActive && (
                      <button
                        onClick={() => revokeLink(link._id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No sharing history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SharingHistoryPage;

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const CollaborationRequestsPage = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchData = () => {
    api
      .get("/collaborations/requests")
      .then((res) => {
        setIncoming(res.data.incoming || []);
        setOutgoing(res.data.outgoing || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async (id, status) => {
    await api.put(`/collaborations/requests/${id}`, { status });
    fetchData();
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
            Incoming requests
          </h1>
          <div className="space-y-3 text-sm">
            {incoming.map((req) => (
              <div
                key={req._id}
                className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400">{req.sender?.name}</span> wants to join <span className="text-indigo-600 dark:text-indigo-400">{req.idea?.title}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic">"{req.message}"</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Status:</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      req.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                      req.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleRespond(req._id, "accepted")}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req._id, "rejected")}
                      className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {incoming.length === 0 && (
              <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No incoming collaboration requests.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
            Outgoing requests
          </h1>
          <div className="space-y-3 text-sm">
            {outgoing.map((req) => (
              <div key={req._id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="font-bold text-slate-800 dark:text-white mb-1 truncate">{req.idea?.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">To: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{req.receiver?.name}</span></div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg italic leading-relaxed">"{req.message}"</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Status:</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    req.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    req.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
            {outgoing.length === 0 && (
              <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">You have not sent any requests yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationRequestsPage;


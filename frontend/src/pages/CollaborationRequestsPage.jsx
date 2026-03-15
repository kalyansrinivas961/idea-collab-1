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
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h1 className="text-lg font-semibold text-slate-800 mb-2">Incoming requests</h1>
          <div className="space-y-3 text-sm">
            {incoming.map((req) => (
              <div
                key={req._id}
                className="border rounded-lg p-3 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-medium text-slate-800">
                    {req.sender?.name} wants to join {req.idea?.title}
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{req.message}</div>
                  <div className="text-xs text-slate-500">Status: {req.status}</div>
                </div>
                {req.status === "pending" && (
                  <div className="flex flex-col gap-1 text-xs">
                    <button
                      onClick={() => handleRespond(req._id, "accepted")}
                      className="px-2 py-1 rounded bg-emerald-600 text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req._id, "rejected")}
                      className="px-2 py-1 rounded border border-slate-200 text-slate-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
            {incoming.length === 0 && (
              <div className="text-xs text-slate-500">No incoming collaboration requests.</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <h1 className="text-lg font-semibold text-slate-800 mb-2">Outgoing requests</h1>
          <div className="space-y-3 text-sm">
            {outgoing.map((req) => (
              <div key={req._id} className="border rounded-lg p-3">
                <div className="font-medium text-slate-800">{req.idea?.title}</div>
                <div className="text-xs text-slate-500 mb-1">To: {req.receiver?.name}</div>
                <div className="text-xs text-slate-500 mb-1">{req.message}</div>
                <div className="text-xs text-slate-500">Status: {req.status}</div>
              </div>
            ))}
            {outgoing.length === 0 && (
              <div className="text-xs text-slate-500">You have not sent any requests yet.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollaborationRequestsPage;


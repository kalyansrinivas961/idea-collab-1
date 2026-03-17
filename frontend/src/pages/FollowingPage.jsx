import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import UserList from "../components/UserList.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const FollowingPage = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.get(`/users/${user._id}/following`)
        .then(res => setFollowing(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRemove = (id) => {
    setFollowing(prev => prev.filter(f => f._id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Following</h1>
        {loading ? (
          <div className="text-center py-10 text-slate-500">Loading following...</div>
        ) : (
          <UserList users={following} type="following" onRemove={handleRemove} />
        )}
      </div>
    </Layout>
  );
};

export default FollowingPage;

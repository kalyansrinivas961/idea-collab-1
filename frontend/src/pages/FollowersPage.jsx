import React, { useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import UserList from "../components/UserList.jsx";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const FollowersPage = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.get(`/users/${user._id}/followers`)
        .then(res => setFollowers(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleRemove = (id) => {
    setFollowers(prev => prev.filter(f => f._id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Followers</h1>
        {loading ? (
          <div className="text-center py-10 text-slate-500 dark:text-slate-400">Loading followers...</div>
        ) : (
          <UserList users={followers} type="followers" onRemove={handleRemove} />
        )}
      </div>
    </Layout>
  );
};

export default FollowersPage;

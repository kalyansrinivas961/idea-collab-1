import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Users, MapPin, Briefcase, ChevronLeft, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/client.js";

const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  // Filters state
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [skill, setSkill] = useState(searchParams.get("skill") || "");
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("query", search);
      if (role) params.append("role", role);
      if (location) params.append("location", location);
      if (skill) params.append("skill", skill);
      params.append("page", page);
      params.append("limit", 20);

      const res = await api.get(`/users/search?${params.toString()}`);
      setUsers(res.data.users);
      setPagination({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total
      });
      
      // Update URL without refreshing
      setSearchParams(params);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(parseInt(searchParams.get("page")) || 1);
  }, [searchParams.get("page")]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchUsers(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" size={28} />
            User Discovery
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Find and connect with talented creators across the community.</p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
            showFilters 
              ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" 
              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
          }`}
        >
          <SlidersHorizontal size={18} />
          {showFilters ? "Hide Filters" : "Advanced Filters"}
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 mx-1 md:mx-0">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] whitespace-nowrap"
            >
              Search Users
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Professional Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                  >
                    <option value="">All Roles</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Investor">Investor</option>
                  </select>
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. New York, London"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-1">Specific Skill</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. React, Python"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-all font-medium"
                  />
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
          <p className="font-bold text-sm">Discovering members...</p>
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1 md:px-0">
            {users.map((user) => (
              <Link
                key={user._id}
                to={`/users/${user._id}`}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col items-center text-center group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="relative mb-4 z-10">
                  <img
                    src={user.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=random"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors z-10">{user.name}</h3>
                <div className="flex items-center gap-1.5 text-indigo-600 mb-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{user.role || "Member"}</span>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed font-medium">
                  {user.headline || user.bio || "No professional headline added"}
                </p>
                
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mb-6 min-h-[32px] z-10">
                    {user.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="text-[10px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-bold self-center">+{user.skills.length - 3}</span>
                    )}
                  </div>
                )}

                <div className="w-full mt-auto z-10">
                  <div className="inline-flex items-center justify-center w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                    View Profile
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1.5 mx-4">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      pagination.page === i + 1
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, pagination.page - 3), Math.min(pagination.pages, pagination.page + 2))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-slate-200 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-100 mx-1 md:mx-0 shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="text-slate-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No users matched your search</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">Try adjusting your keywords or filters to discover other amazing community members.</p>
          <button 
            onClick={() => {
              setSearch("");
              setRole("");
              setLocation("");
              setSkill("");
              fetchUsers(1);
            }}
            className="mt-8 text-indigo-600 font-bold hover:underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      )}
    </Layout>
  );
};

export default UsersPage;

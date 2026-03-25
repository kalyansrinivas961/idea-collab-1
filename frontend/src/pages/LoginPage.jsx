import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ 
    identifier: "", 
    password: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        identifier: form.identifier,
        password: form.password
      };

      const res = await api.post("/auth/login", payload);
      toast.success("Welcome back! Login successful.");
      setMessage("Login successful! Redirecting...");
      login(res.data.token, res.data.user);
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      toast.success(`Welcome ${res.data.user.name}!`);
      setMessage("Login successful! Redirecting...");
      login(res.data.token, res.data.user);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || err.message || "Google login failed";
      setError(`Google Login Error: ${errorMsg}`);
      console.error("Frontend Google Login Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-sm rounded-xl p-8 border border-slate-100 dark:border-slate-800 transition-all duration-300">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2 transition-colors duration-300">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors duration-300">Sign in to continue to IdeaCollab.</p>
          
          {error && <div className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
          {message && <div className="mb-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</div>}

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400 transition-colors duration-300">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Email</label>
              <input
                type="email"
                name="identifier"
                placeholder="email@example.com"
                value={form.identifier}
                onChange={handleChange}
                className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 my-auto p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 focus:outline-none rounded transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-.79.23-1.57.66-2.32M6.6 6.6C8.12 5.57 9.98 5 12 5c5 0 9 4 9 7 0 1.1-.43 2.23-1.2 3.27M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            
            <div className="text-right">
              <Link to="/forgot-password" title="Forgot password?" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center transition-colors duration-300">
            New to IdeaCollab?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default LoginPage;

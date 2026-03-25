import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Founder",
    skills: "",
    googleId: "",
    avatarUrl: ""
  });
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: isGoogleSignup ? undefined : form.password,
        googleId: form.googleId || undefined,
        avatarUrl: form.avatarUrl || undefined,
        role: form.role,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      };
      
      const res = await api.post("/auth/register", payload);
      toast.success("Account created successfully!");
      setMessage("Account created successfully! Redirecting...");
      login(res.data.token, res.data.user);
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/google/verify", {
        credential: credentialResponse.credential,
      });

      if (res.data.isNewUser) {
        // User doesn't exist, fill form
        setForm(prev => ({
          ...prev,
          name: res.data.profile.name || "",
          email: res.data.profile.email || "",
          googleId: res.data.profile.googleId || "",
          avatarUrl: res.data.profile.avatarUrl || ""
        }));
        setIsGoogleSignup(true);
        setMessage("Google profile linked! Please complete your profile details below.");
      } else {
        // User already exists, log in
        toast.success(`Welcome back ${res.data.user.name}!`);
        setMessage("Account exists! Logging you in...");
        login(res.data.token, res.data.user);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || err.message || "Google registration failed";
      setError(`Google Registration Error: ${errorMsg}`);
      console.error("Frontend Google Registration Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white shadow-sm rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Join IdeaCollab</h1>
          <p className="text-sm text-slate-500 mb-6">
            Create your profile and start collaborating on ideas.
          </p>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          {message && <div className="mb-4 text-sm text-emerald-600">{message}</div>}

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              text="signup_with"
            />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or register with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isGoogleSignup ? "bg-slate-50 cursor-not-allowed" : ""
                }`}
                required
                readOnly={isGoogleSignup}
              />
            </div>

            {!isGoogleSignup && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Founder</option>
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>Investor</option>
                  <option>Student</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;

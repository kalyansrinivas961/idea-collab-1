import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { jsPDF } from "jspdf";

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
  const [backupCodes, setBackupCodes] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const downloadTXT = () => {
    if (!backupCodes) return;
    const content = `IdeaCollab Backup Codes\n\nGenerated for: ${form.email}\nDate: ${new Date().toLocaleString()}\n\nCodes:\n${backupCodes.join("\n")}\n\nWARNING: Keep these codes safe. They can be used to reset your password.`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ideacollab-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = () => {
    if (!backupCodes) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("IdeaCollab Backup Codes", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated for: ${form.email}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 42);
    doc.setFontSize(14);
    doc.text("Your Backup Codes:", 20, 55);
    
    doc.setFontSize(12);
    backupCodes.forEach((code, index) => {
      doc.text(`${index + 1}. ${code}`, 30, 65 + (index * 8));
    });

    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text("WARNING: These codes are for one-time use only.", 20, 150);
    doc.text("Store them securely and never share them with anyone.", 20, 157);
    
    doc.save("ideacollab-backup-codes.pdf");
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
      
      // Call login immediately to store token
      login(res.data.token, res.data.user);

      if (res.data.backupCodes) {
        setBackupCodes(res.data.backupCodes);
        setMessage("Account created! PLEASE SAVE YOUR BACKUP CODES. You will only see them once.");
      } else {
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackupCodesDone = () => {
    const token = localStorage.getItem("token"); // Assuming it might be there, but let's be safe
    // If we have backup codes, we probably just got them from the response
    // We need to ensure login() was called if it wasn't already
    navigate("/dashboard");
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Join IdeaCollab</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create your profile and start collaborating on ideas.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          )}

          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme={document.documentElement.classList.contains('dark') ? "filled_black" : "outline"}
              size="large"
              shape="pill"
              text="signup_with"
              width="100%"
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">Or register with email</span>
            </div>
          </div>
          
          {backupCodes ? (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-amber-800 dark:text-amber-300 font-bold">Important: Save these codes!</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      You will only see these codes once. If you lose your password and can't access your email, these codes are the ONLY way to recover your account.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-center font-mono text-sm tracking-wider text-slate-700 dark:text-slate-300 select-all">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={downloadTXT}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download TXT
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>

              <button
                onClick={handleBackupCodesDone}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                I've saved my codes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white ${
                    isGoogleSignup ? "bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-60" : ""
                  }`}
                  required
                  readOnly={isGoogleSignup}
                />
              </div>
            </div>

            {!isGoogleSignup && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  required
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white appearance-none"
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
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Skills
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, UI/UX..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : "Create account"}
            </button>
          </form>
          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";
import Footer from "../components/Footer.jsx";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Backup Code, 4: New Password
  const [resetToken, setResetToken] = useState("");
  const [backupCode, setBackupCode] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBackupCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-backup-code", { email, backupCode });
      setResetToken(res.data.resetToken);
      setMessage("Backup code verified! Please set your new password.");
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid backup code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = step === 4 
        ? { email, resetToken, newPassword, mode: 'backup_code' }
        : { email, otp, newPassword };
        
      const res = await api.post("/auth/reset-password", payload);
      setMessage(res.data.message);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Reset Password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {step === 1 && "Enter your email address and we'll send you a verification code."}
              {step === 2 && `Enter the 6-digit code sent to ${email}.`}
              {step === 3 && "Enter one of your 8-10 character backup codes."}
              {step === 4 && "Choose a new secure password for your account."}
            </p>
          </div>
          
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                  <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500">Or use backup code</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl py-3 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Use Backup Code
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={() => setStep(4)} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white text-center font-bold tracking-[0.5em]"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
              >
                Verify Code
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 py-2 transition-colors"
              >
                ← Back to email
              </button>
            </form>
          ) : step === 3 ? (
            <form onSubmit={handleVerifyBackupCode} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Backup Code</label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white text-center font-mono uppercase tracking-widest"
                  placeholder="ABC123XY"
                  maxLength="10"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Verifying..." : "Verify Backup Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 py-2 transition-colors"
              >
                ← Use email verification instead
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <Link to="/login" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;

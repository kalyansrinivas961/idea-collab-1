import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Layout from "../components/Layout.jsx";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "newPassword") {
      checkStrength(e.target.value);
    }
  };

  const checkStrength = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    setPasswordCriteria(criteria);

    const validCount = Object.values(criteria).filter(Boolean).length;
    setStrength(validCount); // 0 to 5
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (strength < 5) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });
      setSuccess("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setStrength(0);
      setPasswordCriteria({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
      
      // Optional: Redirect after success
      // setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Change Password</h1>

        {error && (
          <div
            className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4"
            role="alert"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-md rounded-2xl p-8 border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="mb-4">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="currentPassword"
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="newPassword"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="password-requirements"
            />
            
            {/* Strength Meter */}
            <div className="mt-2 h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>
            
            <div id="password-requirements" className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              <p className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Password must contain:</p>
              <ul className="grid grid-cols-2 gap-2">
                <li className={passwordCriteria.length ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-600"}>
                  {passwordCriteria.length ? "✓" : "○"} 8+ Characters
                </li>
                <li className={passwordCriteria.uppercase ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-600"}>
                  {passwordCriteria.uppercase ? "✓" : "○"} Uppercase
                </li>
                <li className={passwordCriteria.lowercase ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-600"}>
                  {passwordCriteria.lowercase ? "✓" : "○"} Lowercase
                </li>
                <li className={passwordCriteria.number ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-600"}>
                  {passwordCriteria.number ? "✓" : "○"} Number
                </li>
                <li className={passwordCriteria.special ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-600"}>
                  {passwordCriteria.special ? "✓" : "○"} Special Char
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              className="shadow-sm appearance-none border border-slate-200 dark:border-slate-700 rounded-xl w-full py-3 px-4 text-slate-700 dark:text-white bg-white dark:bg-slate-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full transition-all active:scale-95 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChangePasswordPage;

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { 
  Sun, 
  Moon, 
  Bell, 
  Lock, 
  User, 
  Eye, 
  Globe, 
  Shield, 
  Smartphone,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("appearance");
  
  // State for other configuration options
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    publicProfile: true,
    showEmail: false,
    language: "English",
    twoFactorAuth: false
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Setting updated", {
      icon: <CheckCircle2 className="text-green-500" size={16} />,
      style: {
        borderRadius: '12px',
        background: theme === 'dark' ? '#1e293b' : '#fff',
        color: theme === 'dark' ? '#fff' : '#1e293b',
      },
    });
  };

  const tabs = [
    { id: "appearance", label: "Appearance", icon: Eye },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Safety", icon: Shield },
    { id: "account", label: "Account", icon: User },
  ];

  const renderAppearance = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Theme Preference</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Choose how IdeaCollab looks to you. Select between a light or dark theme, or sync with your system.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              theme === 'light' 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' 
                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Sun size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 dark:text-white">Light Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Classic bright appearance</p>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="text-indigo-600" size={20} />}
          </button>

          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
              theme === 'dark' 
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10' 
                : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Moon size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Easier on the eyes</p>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="text-indigo-600" size={20} />}
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Accessibility</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">Reduced Motion</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Minimize animations throughout the app</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notification Settings</h3>
      <div className="space-y-4">
        {[
          { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email about your activity", icon: Globe },
          { key: "pushNotifications", label: "Push Notifications", desc: "Get real-time alerts on your device", icon: Bell }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings[item.key]} 
                onChange={() => handleSettingChange(item.key)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Privacy & Safety</h3>
      <div className="space-y-4">
        {[
          { key: "publicProfile", label: "Public Profile", desc: "Allow others to see your shared ideas and profile", icon: User },
          { key: "showEmail", label: "Show Email", desc: "Display your email address on your public profile", icon: Globe }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings[item.key]} 
                onChange={() => handleSettingChange(item.key)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and application settings.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 min-h-[500px] transition-colors">
            {activeTab === "appearance" && renderAppearance()}
            {activeTab === "notifications" && renderNotifications()}
            {activeTab === "privacy" && renderPrivacy()}
            {activeTab === "account" && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Account Security</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.twoFactorAuth} 
                        onChange={() => handleSettingChange("twoFactorAuth")}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <button className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Manage Password
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;

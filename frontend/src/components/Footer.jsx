import React from "react";
import { Link } from "react-router-dom";
import { getLegalConfig } from "../config/legal.js";

const Footer = ({ locale }) => {
  const year = new Date().getFullYear();
  const cfg = getLegalConfig(locale);
  
  // Hide footer on chat page to maximize space
  if (window.location.pathname.startsWith('/messages')) return null;

  return (
    <footer role="contentinfo" aria-label="Legal and regulatory information" className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 py-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              IC
            </span>
            <span className="font-bold text-slate-800 dark:text-white tracking-tight">IdeaCollab</span>
          </div>
          
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link to="/terms" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {cfg.tosLabel}
            </Link>
            <Link to="/privacy" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {cfg.privacyLabel}
            </Link>
          </nav>

          <div className="text-sm font-medium text-slate-400 dark:text-slate-500">
            &copy; {year} {cfg.companyName}. {cfg.copyrightPrefix}
          </div>
        </div>
        {cfg.regulatoryDisclosure && (
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left" aria-label="Regulatory disclosure">
            {cfg.regulatoryDisclosure}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;


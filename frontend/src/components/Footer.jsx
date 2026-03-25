import React from "react";
import { Link } from "react-router-dom";
import { getLegalConfig } from "../config/legal.js";

const Footer = ({ locale }) => {
  const year = new Date().getFullYear();
  const cfg = getLegalConfig(locale);
  
  // Hide footer on chat page to maximize space
  if (window.location.pathname.startsWith('/messages')) return null;

  return (
    <footer role="contentinfo" aria-label="Legal and regulatory information" className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav aria-label="Legal" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ul className="flex flex-wrap items-center gap-4">
            <li>
              <Link to="/terms" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors">
                {cfg.tosLabel}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors">
                {cfg.privacyLabel}
              </Link>
            </li>
          </ul>
          <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            <span aria-label="Copyright notice">© {year} {cfg.companyName}. {cfg.copyrightPrefix}</span>
          </div>
        </nav>
        {cfg.regulatoryDisclosure && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 transition-colors" aria-label="Regulatory disclosure">
            {cfg.regulatoryDisclosure}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;


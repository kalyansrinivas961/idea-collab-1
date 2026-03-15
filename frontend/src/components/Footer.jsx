import React from "react";
import { Link } from "react-router-dom";
import { getLegalConfig } from "../config/legal.js";

const Footer = ({ locale }) => {
  const year = new Date().getFullYear();
  const cfg = getLegalConfig(locale);
  return (
    <footer role="contentinfo" aria-label="Legal and regulatory information" className="bg-white border-t">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav aria-label="Legal" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ul className="flex flex-wrap items-center gap-4">
            <li>
              <Link to="/terms" className="text-sm text-slate-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                {cfg.tosLabel}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-slate-600 hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                {cfg.privacyLabel}
              </Link>
            </li>
          </ul>
          <div className="text-sm text-slate-500">
            <span aria-label="Copyright notice">© {year} {cfg.companyName}. {cfg.copyrightPrefix}</span>
          </div>
        </nav>
        {cfg.regulatoryDisclosure && (
          <p className="mt-3 text-xs text-slate-500" aria-label="Regulatory disclosure">
            {cfg.regulatoryDisclosure}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;


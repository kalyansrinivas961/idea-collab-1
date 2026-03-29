import React from "react";
import Layout from "../components/Layout.jsx";

const TermsPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <section aria-labelledby="terms-heading" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <h1 id="terms-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b dark:border-slate-800 pb-4">Terms of Service</h1>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using IdeaCollab, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use this application.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">2. User Accounts</h2>
              <p>
                To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>You must be at least 13 years old to use this service.</li>
                <li>You agree to provide accurate and complete information during registration.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">3. User Content</h2>
              <p>
                You retain ownership of the ideas, comments, and other content you post on IdeaCollab. However, by posting content, you grant IdeaCollab a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, and display such content.
              </p>
              <p className="mt-2">
                You are solely responsible for the content you post and ensure that it does not violate any third-party rights, including intellectual property or privacy rights.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">4. Prohibited Conduct</h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Harassing, threatening, or intimidating other users.</li>
                <li>Posting spam, malware, or any other malicious content.</li>
                <li>Attempting to interfere with the proper functioning of the service.</li>
                <li>Using the service for any illegal or unauthorized purpose.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">5. Intellectual Property</h2>
              <p>
                The IdeaCollab name, logo, and all original content and features are the exclusive property of IdeaCollab and its licensors.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including if you breach the Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">7. Limitation of Liability</h2>
              <p>
                In no event shall IdeaCollab be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the service.
              </p>
            </div>

            <div className="border-t dark:border-slate-800 pt-6 mt-10">
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                Last updated: March 14, 2026
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TermsPage;

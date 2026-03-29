import React from "react";
import Layout from "../components/Layout.jsx";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <section aria-labelledby="privacy-heading" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <h1 id="privacy-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b dark:border-slate-800 pb-4">Privacy Policy</h1>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              At IdeaCollab, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us when you create an account, post ideas, or communicate with other users.</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li><strong className="text-slate-900 dark:text-slate-200">Personal Information:</strong> Name, email address, password, professional headline, skills, and profile picture.</li>
                <li><strong className="text-slate-900 dark:text-slate-200">User Content:</strong> Ideas, descriptions, comments, and messages you share on the platform.</li>
                <li><strong className="text-slate-900 dark:text-slate-200">Authentication Data:</strong> If you use Google Login, we collect your Google ID and basic profile information as authorized by your Google account settings.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>Personalize your experience and suggest relevant collaborators or ideas.</li>
                <li>Communicate with you about updates, security alerts, and support messages.</li>
                <li>Monitor and analyze usage patterns to enhance platform performance.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">3. Data Sharing and Disclosure</h2>
              <p>
                Your profile information (name, skills, bio) and any ideas you post publicly are visible to other registered users of the platform. We do not sell your personal data to third parties. We may share information:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>With your consent or at your direction.</li>
                <li>To comply with legal obligations or protect the rights and safety of our users.</li>
                <li>With service providers who perform functions on our behalf (e.g., email delivery, database hosting).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. This includes encryption of sensitive data and secure server configurations. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">5. Your Choices and Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Access, update, or delete your profile information at any time through your account settings.</li>
                <li>Opt-out of certain communications.</li>
                <li>Request a copy of the personal data we hold about you.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">6. Changes to This Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
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

export default PrivacyPage;

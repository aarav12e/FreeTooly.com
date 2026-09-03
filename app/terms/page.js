import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions - FreeTooly",
  description: "Terms and Conditions of service for using FreeTooly online utilities.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-12">
      {/* Breadcrumb / Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Home
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div>
          <span className="ct-tag mb-2">Terms of Service</span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 2026</p>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-heading text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using FreeTooly (the "Website"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">2. Permitted Use</h2>
          <p>
            FreeTooly grants you a free, non-exclusive, non-transferable right to use all online utilities for personal, educational, or commercial purposes. You agree not to attempt to disrupt or abuse the service through automated attacks or malicious bots.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">3. User Responsibility & File Content</h2>
          <p>
            You retain full ownership of all files and text processed through our tools. You are solely responsible for ensuring that you have the right to modify or convert any file processed on FreeTooly and that your content does not violate any third-party copyright laws.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">4. Availability & Modifications</h2>
          <p>
            We continuously improve our toolset. FreeTooly reserves the right to add, modify, or discontinue tools at any time without prior notice.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">5. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with standard internet laws and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}

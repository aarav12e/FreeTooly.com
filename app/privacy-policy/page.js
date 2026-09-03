import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - FreeTooly",
  description: "Learn how FreeTooly protects your privacy with 100% browser-based processing and zero file tracking.",
};

export default function PrivacyPolicyPage() {
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
          <span className="ct-tag mb-2">Privacy & Security</span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 2026</p>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-heading text-lg font-bold text-slate-900">1. Zero Server Storage & No Upload Retention</h2>
          <p>
            At FreeTooly, your privacy is our top priority. All tools on our website (including PDF converters, Word tools, image processors, text counters, and generators) run <strong>100% locally inside your browser</strong>. Your files are processed dynamically using client-side JavaScript and are never uploaded to or stored on any server.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">2. No Account Registration</h2>
          <p>
            You are not required to create an account, log in, or provide any personal information (such as your name, email address, or phone number) to use any of our 100+ free online tools.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">3. Cookies & Analytics</h2>
          <p>
            We use minimal local storage purely to remember your preferences (such as tool settings or search filters) during your session. We do not use intrusive tracking cookies or sell user data to third parties.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">4. Third-Party Links</h2>
          <p>
            Our website may occasionally contain links to third-party resources or documentation. We are not responsible for the privacy practices or content of external websites.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">5. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect improvements to our toolset or security standards. Any revisions will be posted directly on this page.
          </p>
        </div>
      </div>
    </div>
  );
}

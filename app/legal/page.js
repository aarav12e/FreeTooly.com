import Link from "next/link";

export const metadata = {
  title: "Legal Information & Disclaimer - FreeTooly",
  description: "Legal disclaimer, copyright, and terms of usage for FreeTooly online utilities.",
};

export default function LegalPage() {
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
          <span className="ct-tag mb-2">Legal Information</span>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 mt-1">
            Legal Disclaimer & Terms
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last Updated: July 2026</p>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <h2 className="font-heading text-lg font-bold text-slate-900">1. Disclaimer of Warranties</h2>
          <p>
            FreeTooly provides all online conversion, editing, and utility tools on an "AS IS" and "AS AVAILABLE" basis.
            While we strive for maximum accuracy, we make no representations or warranties of any kind, express or implied, regarding the completeness, accuracy, reliability, or suitability of any tool output.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">2. Client-Side File Processing</h2>
          <p>
            All file conversions (including PDF, Word, Excel, PowerPoint, and images) execute locally inside your web browser.
            Your uploaded files and documents are never transferred to or stored on external remote servers, ensuring maximum security and privacy.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">3. Limitation of Liability</h2>
          <p>
            In no event shall FreeTooly or its operators be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use any tool on this website. Users are advised to keep backup copies of original files before performing any file manipulations.
          </p>

          <h2 className="font-heading text-lg font-bold text-slate-900">4. Intellectual Property</h2>
          <p>
            All website branding, logos, layout designs, and original interface elements belong to FreeTooly. Output files converted or generated using our tools remain the sole property of the respective user.
          </p>
        </div>
      </div>
    </div>
  );
}

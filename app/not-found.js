import Link from "next/link";

export const metadata = {
  title: "404 – Page Not Found | FreeTooly",
  description: "The page you are looking for does not exist. Head back to FreeTooly and explore 100+ free online tools.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-page)" }}>
      {/* Subtle animated background blobs */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0
      }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: "40vw", height: "40vw", maxWidth: 500, maxHeight: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          animation: "blobFloat 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "-8%",
          width: "35vw", height: "35vw", maxWidth: 450, maxHeight: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          animation: "blobFloat 10s ease-in-out infinite reverse",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 520 }}>

        {/* Big 404 display */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(7rem, 20vw, 10rem)",
            fontWeight: 800,
            lineHeight: 1,
            background: "linear-gradient(135deg, #2563eb 0%, #6366f1 60%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "block",
            userSelect: "none",
          }}>
            404
          </span>
          {/* Floating emoji */}
          <span style={{
            position: "absolute",
            top: "10%", right: "10%",
            fontSize: "2.5rem",
            animation: "toolFloat 4s ease-in-out infinite",
            display: "inline-block",
          }}>🔧</span>
        </div>

        {/* Card */}
        <div style={{
          background: "#ffffff",
          border: "1px solid var(--border-color)",
          borderRadius: "1.5rem",
          padding: "2rem 2.5rem 2.5rem",
          boxShadow: "0 20px 60px -10px rgba(0,0,0,0.08), 0 4px 16px -4px rgba(37,99,235,0.06)",
        }}>
          {/* Status pill */}
          <div style={{ marginBottom: "1.25rem" }}>
            <span className="ct-tag" style={{ fontSize: "0.7rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Page Not Found
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "0.75rem",
            lineHeight: 1.2,
          }}>
            Oops! This page doesn&apos;t exist
          </h1>

          <p style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            marginBottom: "2rem",
          }}>
            Looks like this tool wandered off! The page you&apos;re looking for may have been moved, renamed, or never existed. Head back home to explore all our free tools.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/"
              id="not-found-home-btn"
              className="ct-btn-primary"
              style={{ borderRadius: "0.875rem", padding: "0.7rem 1.5rem", textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Link>
            <Link
              href="/#tools"
              id="not-found-browse-btn"
              className="ct-btn-secondary"
              style={{ borderRadius: "0.875rem", padding: "0.7rem 1.5rem", textDecoration: "none" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Browse All Tools
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: "1.75rem" }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "0.75rem" }}>
            Popular tools to try:
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Word Counter", slug: "word-counter" },
              { label: "Case Converter", slug: "case-converter" },
              { label: "MD5 Generator", slug: "md5-generator" },
              { label: "JSON Formatter", slug: "json-formatter" },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#2563eb",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "0.5rem",
                  padding: "0.3rem 0.75rem",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  display: "inline-block",
                }}
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animations injected inline for static export compatibility */}
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes toolFloat {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
      `}</style>
    </div>
  );
}

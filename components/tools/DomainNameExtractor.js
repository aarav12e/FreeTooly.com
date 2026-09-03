"use client";

import { useState, useMemo } from "react";
import CopyButton from "@/components/CopyButton";
import { downloadFile } from "@/lib/file-utils";

// ─── Sample URL list ──────────────────────────────────────────────────────────
const SAMPLE_URLS = `https://www.google.com/search?q=hello
http://github.com/openai/gpt-4
https://subdomain.example.co.uk/path/to/page?ref=home
ftp://files.server.org/uploads/report.pdf
https://news.ycombinator.com/item?id=38000001
http://www.amazon.com/dp/B09G9FPHY6
https://docs.microsoft.com/en-us/azure/
https://stackoverflow.com/questions/12345/how-to-do-x
https://api.stripe.com/v1/customers
https://cdn.cloudflare.com/assets/logo.png
www.wikipedia.org/wiki/Domain_name
blog.mybusiness.io/post/seo-tips
https://mail.google.com/mail/u/0/#inbox
https://192.168.1.1/admin
https://[2001:db8::1]/path`;

// ─── Output format options ────────────────────────────────────────────────────
const OUTPUT_FORMATS = [
  { id: "domain",           label: "Domain Only",        example: "example.com" },
  { id: "root",             label: "Root Domain",         example: "example.com (strips subdomains)" },
  { id: "subdomain",        label: "Full Host",           example: "sub.example.com" },
  { id: "tld",              label: "TLD Only",            example: ".com / .org" },
  { id: "protocol+domain",  label: "Protocol + Domain",   example: "https://example.com" },
  { id: "full-url",         label: "Full URL (cleaned)",  example: "https://example.com/path" },
];

// ─── Known multi-part TLDs (common list) ─────────────────────────────────────
const MULTI_TLDS = new Set([
  "co.uk","co.in","co.jp","co.nz","co.za","co.ke","com.au","com.br","com.cn",
  "com.mx","com.tr","com.ar","com.sg","com.ph","com.hk","net.au","org.uk",
  "gov.uk","ac.uk","me.uk","ltd.uk","plc.uk","org.au","edu.au","gov.au",
  "net.nz","org.nz","edu.nz","co.il","co.id","co.th","co.kr",
]);

// ─── Extract root domain stripping www + subdomains ───────────────────────────
function getRootDomain(hostname) {
  const parts = hostname.split(".");
  if (parts.length <= 2) return hostname;
  // Check for multi-part TLDs (e.g. co.uk)
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_TLDS.has(lastTwo) && parts.length > 2) {
    return parts.slice(-3).join(".");
  }
  return parts.slice(-2).join(".");
}

function stripWww(host) {
  return host.replace(/^www\./, "");
}

// ─── Main extraction function for a single line ───────────────────────────────
function extractFromLine(raw) {
  let line = raw.trim();
  if (!line) return null;

  // If it starts with a protocol use URL API
  // Otherwise try prepending https://
  let urlStr = line;
  if (!/^[a-z][a-z0-9+\-.]*:\/\//i.test(line)) {
    // Could be www.example.com or just example.com/path
    urlStr = `https://${line}`;
  }

  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname;
    const protocol = parsed.protocol.replace(":", "");
    const pathname = parsed.pathname;
    const search   = parsed.search;

    // Skip plain IP addresses if hostname is an IPv4
    // (we still include them, just flag them)
    const isIPv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
    const isIPv6 = hostname.startsWith("[");

    const root = isIPv4 || isIPv6 ? hostname : getRootDomain(stripWww(hostname));
    const fullHost = stripWww(hostname);
    const tld = isIPv4 || isIPv6 ? null : "." + hostname.split(".").slice(-1)[0];

    return {
      original: raw.trim(),
      protocol,
      hostname,
      fullHost,
      rootDomain: root,
      tld,
      pathname,
      search,
      isIP: isIPv4 || isIPv6,
    };
  } catch {
    return null; // unparseable
  }
}

// ─── Format output based on selected mode ─────────────────────────────────────
function formatResult(info, format) {
  if (!info) return null;
  switch (format) {
    case "domain":          return info.fullHost;
    case "root":            return info.rootDomain;
    case "subdomain":       return info.hostname;
    case "tld":             return info.tld || "(none)";
    case "protocol+domain": return `${info.protocol}://${info.fullHost}`;
    case "full-url":        return `${info.protocol}://${info.hostname}${info.pathname}${info.search}`;
    default:                return info.rootDomain;
  }
}

export default function DomainNameExtractor() {
  const [input, setInput] = useState(SAMPLE_URLS);
  const [outputFormat, setOutputFormat] = useState("root");
  const [deduplicate, setDeduplicate] = useState(true);
  const [sortAlpha, setSortAlpha] = useState(false);
  const [filterIPAddresses, setFilterIPAddresses] = useState(false);
  const [filterSubdomains, setFilterSubdomains] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [toastNotice, setToastNotice] = useState("");

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  // ─── Process ───────────────────────────────────────────────────────────────
  const { results, failed, stats } = useMemo(() => {
    const lines = input.split("\n");
    const parsed = lines.map((line) => extractFromLine(line));

    let valid = parsed.filter(Boolean);
    let invalid = parsed
      .map((r, i) => (r === null && lines[i].trim() ? lines[i].trim() : null))
      .filter(Boolean);

    // Filter IPs
    if (filterIPAddresses) valid = valid.filter((r) => !r.isIP);

    // Filter subdomains (keep only root domain matches)
    if (filterSubdomains) {
      valid = valid.filter((r) => {
        const stripped = r.fullHost;
        return stripped === r.rootDomain;
      });
    }

    // Format
    let formatted = valid.map((info) => formatResult(info, outputFormat)).filter(Boolean);

    // Deduplicate
    if (deduplicate) formatted = [...new Set(formatted)];

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.trim().toLowerCase();
      formatted = formatted.filter((d) => d.toLowerCase().includes(q));
    }

    // Sort
    if (sortAlpha) formatted.sort((a, b) => a.localeCompare(b));

    return {
      results: formatted,
      failed: invalid,
      stats: {
        total: lines.filter((l) => l.trim()).length,
        extracted: formatted.length,
        skipped: invalid.length,
        ips: valid.filter((r) => r.isIP).length,
      },
    };
  }, [input, outputFormat, deduplicate, sortAlpha, filterIPAddresses, filterSubdomains, searchFilter]);

  const outputText = results.join("\n");

  const handleDownloadTxt = () => {
    downloadFile(outputText, "domains.txt", "text/plain");
    showToast("✓ Downloaded domains.txt");
  };

  const handleDownloadCsv = () => {
    const csv = "domain\n" + results.map((d) => `"${d}"`).join("\n");
    downloadFile(csv, "domains.csv", "text/csv");
    showToast("✓ Downloaded domains.csv");
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(results, null, 2);
    downloadFile(json, "domains.json", "application/json");
    showToast("✓ Downloaded domains.json");
  };

  return (
    <div className="space-y-5">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 60%, #061529 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl flex-shrink-0">
            🔗
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">Domain Name Extractor</div>
            <div className="text-[11px] text-sky-300/70 font-medium mt-0.5">
              Paste URLs → Extract clean domains instantly
            </div>
          </div>
        </div>
        {/* Live stats */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: "Input URLs",  value: stats.total,     color: "text-sky-300" },
            { label: "Extracted",   value: stats.extracted, color: "text-emerald-300" },
            { label: "Skipped",     value: stats.skipped,   color: "text-amber-300" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`font-extrabold text-lg leading-none ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-white/40 font-medium mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-sky-500/10 pointer-events-none" />
      </div>

      {/* ── Main Two-Column Layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ─── Left: Input Panel ─────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Input Box */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-[#223247] bg-slate-50 dark:bg-[#111a27]">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                📋 Input — Paste URLs (one per line)
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setInput(""); showToast("✓ Cleared"); }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-500 cursor-pointer transition-colors">
                  Clear
                </button>
                <button onClick={() => setInput(SAMPLE_URLS)}
                  className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                  Load Sample
                </button>
              </div>
            </div>
            <textarea
              rows={18}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"https://www.example.com/page\nhttps://subdomain.google.com/search?q=test\nwww.github.com/openai\n..."}
              className="w-full p-4 font-mono text-xs leading-6 bg-white dark:bg-[#131d2b] text-slate-700 dark:text-slate-300 resize-none outline-none placeholder-slate-300 dark:placeholder-slate-600"
              spellCheck={false}
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100 dark:border-[#1a2740] text-[10px] text-slate-400 font-mono bg-slate-50/50 dark:bg-[#111a27]/50">
              <span>{input.split("\n").filter((l) => l.trim()).length} URLs entered</span>
              <span>{input.length} chars</span>
            </div>
          </div>

          {/* Options Panel */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-4">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              ⚙️ Extraction Options
            </div>

            {/* Output Format */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Output Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {OUTPUT_FORMATS.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setOutputFormat(fmt.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      outputFormat === fmt.id
                        ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-600"
                    }`}
                  >
                    <div className="font-bold text-xs">{fmt.label}</div>
                    <div className={`text-[10px] mt-0.5 font-mono ${outputFormat === fmt.id ? "text-sky-100" : "text-slate-400"}`}>
                      {fmt.example}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { key: "deduplicate",      label: "Remove Duplicates",   state: deduplicate,      set: setDeduplicate },
                { key: "sortAlpha",        label: "Sort A → Z",          state: sortAlpha,         set: setSortAlpha },
                { key: "filterIPs",        label: "Skip IP Addresses",   state: filterIPAddresses, set: setFilterIPAddresses },
                { key: "filterSubdomains", label: "Skip Subdomains",     state: filterSubdomains,  set: setFilterSubdomains },
              ].map((opt) => (
                <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] hover:border-sky-400 dark:hover:border-sky-600 transition-all">
                  <div className={`w-8 h-4 rounded-full transition-all flex-shrink-0 relative ${opt.state ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                    <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${opt.state ? "left-4" : "left-0.5"}`} />
                    <input type="checkbox" checked={opt.state} onChange={(e) => opt.set(e.target.checked)} className="sr-only" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right: Output Panel ───────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Output Controls */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                ✅ Extracted Domains
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {results.length} results
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter results…"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] text-xs font-mono text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 transition-all"
              />
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-2">
              <CopyButton text={outputText} label="Copy All" />
              <button onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                .TXT
              </button>
              <button onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                .CSV
              </button>
              <button onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-[#1f2f44] hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">
                .JSON
              </button>
            </div>

            {/* Toast */}
            {toastNotice && (
              <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">
                {toastNotice}
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] shadow-sm overflow-hidden">
            <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-[#1a2740]">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <span className="text-4xl mb-3">🔗</span>
                  <div className="font-semibold text-sm">No domains extracted yet</div>
                  <div className="text-[11px] mt-1">Paste some URLs in the input panel</div>
                </div>
              ) : (
                results.map((domain, i) => (
                  <div key={i}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 group transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-mono text-slate-300 dark:text-slate-600 w-6 text-right flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {domain}
                      </span>
                    </div>
                    <button
                      onClick={() => { navigator.clipboard?.writeText(domain); showToast(`✓ Copied: ${domain}`); }}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-opacity flex-shrink-0 ml-2"
                    >
                      Copy
                    </button>
                  </div>
                ))
              )}
            </div>
            {results.length > 0 && (
              <div className="border-t border-slate-100 dark:border-[#1a2740] px-4 py-2 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-50/50 dark:bg-[#111a27]/50">
                <span>{results.length} unique domains</span>
                <span>
                  {deduplicate && `deduped • `}
                  {sortAlpha && "sorted A-Z • "}
                  {outputFormat}
                </span>
              </div>
            )}
          </div>

          {/* Failed / Skipped Lines */}
          {failed.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/30 p-4 space-y-2">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <span>⚠️</span>
                <span>{failed.length} unparseable line{failed.length > 1 ? "s" : ""} (skipped)</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {failed.map((line, i) => (
                  <div key={i} className="text-[10px] font-mono text-amber-600 dark:text-amber-500 truncate">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Tips */}
          <div className="bg-slate-50 dark:bg-[#111a27] rounded-xl border border-slate-200 dark:border-[#223247] p-4 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">💡 Features</div>
            <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              <li>→ Handles <strong className="text-slate-600 dark:text-slate-300">http, https, ftp</strong> and bare <code className="text-sky-600 dark:text-sky-400">www.</code> addresses</li>
              <li>→ Detects multi-part TLDs like <code className="text-sky-600 dark:text-sky-400">.co.uk</code> and <code className="text-sky-600 dark:text-sky-400">.com.au</code></li>
              <li>→ Strips query strings, paths, ports and fragments</li>
              <li>→ Export as plain text, CSV spreadsheet or JSON array</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

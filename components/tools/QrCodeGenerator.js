"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { downloadFile } from "@/lib/file-utils";
import QRCode from "qrcode";

const DATA_TYPES = [
  { id: "url",       label: "URL / Link",    icon: "🔗", desc: "Website, app or product link" },
  { id: "text",      label: "Plain Text",    icon: "📝", desc: "Notes, coupons, messages" },
  { id: "wifi",      label: "Wi-Fi",         icon: "📶", desc: "Share network credentials" },
  { id: "vcard",     label: "vCard Contact", icon: "👤", desc: "Name, phone, email & org" },
  { id: "email",     label: "Email",         icon: "✉️",  desc: "Pre-filled email message" },
  { id: "phone",     label: "Phone / SMS",   icon: "📞", desc: "Call or text on scan" },
  { id: "whatsapp",  label: "WhatsApp",      icon: "💬", desc: "Direct WhatsApp chat" },
];

const COLOR_PRESETS = [
  { name: "Midnight",   dark: "#0f172a", light: "#ffffff", accent: "#6366f1" },
  { name: "Ocean",      dark: "#0284c7", light: "#f0f9ff", accent: "#0284c7" },
  { name: "Emerald",    dark: "#047857", light: "#f0fdf4", accent: "#10b981" },
  { name: "Violet",     dark: "#7c3aed", light: "#faf5ff", accent: "#8b5cf6" },
  { name: "Rose",       dark: "#be123c", light: "#fff1f2", accent: "#f43f5e" },
  { name: "Amber",      dark: "#b45309", light: "#fffbeb", accent: "#f59e0b" },
  { name: "Cyan",       dark: "#0e7490", light: "#ecfeff", accent: "#06b6d4" },
  { name: "Slate",      dark: "#334155", light: "#f8fafc", accent: "#94a3b8" },
];

const LOGO_PRESETS = [
  { id: "none",      name: "None",      icon: null },
  { id: "link",      name: "Link",      icon: "🔗" },
  { id: "wifi",      name: "Wi-Fi",     icon: "📶" },
  { id: "whatsapp",  name: "WA",        icon: "💬" },
  { id: "globe",     name: "Globe",     icon: "🌐" },
  { id: "mail",      name: "Email",     icon: "✉️" },
  { id: "star",      name: "Star",      icon: "⭐" },
  { id: "heart",     name: "Heart",     icon: "❤️" },
  { id: "lock",      name: "Secure",    icon: "🔒" },
];

const FRAME_PRESETS = [
  { id: "none",        label: "No Frame" },
  { id: "bottom-pill", label: "Pill Badge" },
  { id: "top-bottom",  label: "Banner" },
  { id: "card-frame",  label: "Card" },
];

export default function QrCodeGenerator() {
  const [dataType, setDataType] = useState("url");
  const [urlInput, setUrlInput] = useState("https://freetooly.com");
  const [textInput, setTextInput] = useState("Hello from FreeTooly!");

  const [wifiSsid, setWifiSsid] = useState("MyHomeNetwork");
  const [wifiPassword, setWifiPassword] = useState("SecretPassword123");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  const [vcardFirst, setVcardFirst] = useState("John");
  const [vcardLast, setVcardLast] = useState("Doe");
  const [vcardPhone, setVcardPhone] = useState("+1 555-0199");
  const [vcardEmail, setVcardEmail] = useState("john@example.com");
  const [vcardOrg, setVcardOrg] = useState("Acme Inc");
  const [vcardUrl, setVcardUrl] = useState("https://example.com");

  const [emailTo, setEmailTo] = useState("support@example.com");
  const [emailSubject, setEmailSubject] = useState("Hello");
  const [emailBody, setEmailBody] = useState("I would like more information.");
  const [phoneNum, setPhoneNum] = useState("+15550199");
  const [smsBody, setSmsBody] = useState("Hi there!");
  const [whatsappNum, setWhatsappNum] = useState("+15550199");
  const [whatsappMsg, setWhatsappMsg] = useState("Hello from QR code!");

  const [dotColor, setDotColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const [dotStyle, setDotStyle] = useState("rounded");
  const [cornerEyeStyle, setCornerEyeStyle] = useState("rounded");
  const [eyeColor, setEyeColor] = useState("");
  const [errorCorrection, setErrorCorrection] = useState("H");
  const [margin, setMargin] = useState(2);

  const [selectedLogoPreset, setSelectedLogoPreset] = useState("none");
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [logoSizePercent, setLogoSizePercent] = useState(22);
  const [frameStyle, setFrameStyle] = useState("none");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [frameColor, setFrameColor] = useState("#0f172a");

  const [toastNotice, setToastNotice] = useState("");
  const [activeSection, setActiveSection] = useState("content"); // content | style | logo

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  const qrPayload = useMemo(() => {
    switch (dataType) {
      case "url":       return urlInput.startsWith("http") ? urlInput : `https://${urlInput}`;
      case "text":      return textInput;
      case "wifi":      return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
      case "vcard":     return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLast};${vcardFirst};;;\nFN:${vcardFirst} ${vcardLast}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nURL:${vcardUrl}\nEND:VCARD`;
      case "email":     return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":     return smsBody ? `SMSTO:${phoneNum}:${smsBody}` : `tel:${phoneNum}`;
      case "whatsapp":  const cp = whatsappNum.replace(/[^0-9]/g, ""); return `https://wa.me/${cp}?text=${encodeURIComponent(whatsappMsg)}`;
      default:          return "https://freetooly.com";
    }
  }, [dataType, urlInput, textInput, wifiSsid, wifiPassword, wifiEncryption, wifiHidden,
      vcardFirst, vcardLast, vcardPhone, vcardEmail, vcardOrg, vcardUrl,
      emailTo, emailSubject, emailBody, phoneNum, smsBody, whatsappNum, whatsappMsg]);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const qr = QRCode.create(qrPayload || "https://freetooly.com", { errorCorrectionLevel: errorCorrection });
      const modules = qr.modules;
      const count = modules.size;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const hasFrame = frameStyle !== "none";
      const frameHeight = hasFrame ? 70 : 0;
      const qrCanvasSize = 500;
      canvas.width = qrCanvasSize;
      canvas.height = qrCanvasSize + frameHeight;

      const effectiveBgColor = isTransparentBg ? "transparent" : bgColor;
      if (!isTransparentBg) { ctx.fillStyle = effectiveBgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      else ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hasFrame) {
        ctx.fillStyle = frameColor;
        if (frameStyle === "bottom-pill") {
          const pw = 240, ph = 44, px = (qrCanvasSize - pw) / 2, py = qrCanvasSize + 10;
          ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 22); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "bold 15px sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(frameText.toUpperCase(), qrCanvasSize / 2, py + ph / 2);
        } else {
          ctx.fillRect(0, qrCanvasSize, qrCanvasSize, frameHeight);
          ctx.fillStyle = "#fff"; ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(frameText.toUpperCase(), qrCanvasSize / 2, qrCanvasSize + frameHeight / 2);
        }
      }

      const totalCells = count + margin * 2;
      const cellSize = qrCanvasSize / totalCells;
      const startX = margin * cellSize;
      const startY = margin * cellSize;

      const isFinder = (r, c) =>
        (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);

      ctx.fillStyle = dotColor;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (!modules.get(r, c)) continue;
          const x = startX + c * cellSize;
          const y = startY + r * cellSize;
          if (isFinder(r, c)) {
            ctx.fillStyle = eyeColor || dotColor;
            if (cornerEyeStyle === "rounded") { ctx.beginPath(); ctx.roundRect(x, y, cellSize, cellSize, cellSize * 0.35); ctx.fill(); }
            else if (cornerEyeStyle === "circle") { ctx.beginPath(); ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2); ctx.fill(); }
            else ctx.fillRect(x, y, cellSize, cellSize);
            ctx.fillStyle = dotColor;
          } else {
            if (dotStyle === "rounded") { ctx.beginPath(); ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, (cellSize - 1) * 0.4); ctx.fill(); }
            else if (dotStyle === "dots") { ctx.beginPath(); ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * 0.85, 0, Math.PI * 2); ctx.fill(); }
            else if (dotStyle === "classy") {
              ctx.beginPath(); ctx.moveTo(x + cellSize / 2, y); ctx.lineTo(x + cellSize, y + cellSize / 2);
              ctx.lineTo(x + cellSize / 2, y + cellSize); ctx.lineTo(x, y + cellSize / 2); ctx.closePath(); ctx.fill();
            } else ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }

      const logoToDraw = customLogoUrl || selectedLogoPreset;
      if (logoToDraw && logoToDraw !== "none") {
        const logoPixelSize = qrCanvasSize * (logoSizePercent / 100);
        const logoX = (qrCanvasSize - logoPixelSize) / 2;
        const logoY = (qrCanvasSize - logoPixelSize) / 2;
        ctx.fillStyle = isTransparentBg ? "#ffffff" : bgColor;
        ctx.beginPath(); ctx.arc(qrCanvasSize / 2, qrCanvasSize / 2, logoPixelSize / 1.7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = dotColor; ctx.lineWidth = 2; ctx.stroke();
        if (customLogoUrl) {
          const img = new Image(); img.crossOrigin = "anonymous";
          img.onload = () => ctx.drawImage(img, logoX, logoY, logoPixelSize, logoPixelSize);
          img.src = customLogoUrl;
        } else {
          const p = LOGO_PRESETS.find((lp) => lp.id === selectedLogoPreset);
          if (p?.icon) { ctx.font = `${logoPixelSize * 0.55}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = dotColor; ctx.fillText(p.icon, qrCanvasSize / 2, qrCanvasSize / 2); }
        }
      }
    } catch (err) { console.error("QR render error:", err); }
  }, [qrPayload, dotColor, bgColor, isTransparentBg, dotStyle, cornerEyeStyle, eyeColor,
      errorCorrection, margin, frameStyle, frameText, frameColor, selectedLogoPreset, customLogoUrl, logoSizePercent]);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { setCustomLogoUrl(ev.target.result); setSelectedLogoPreset("custom"); showToast("✓ Logo uploaded"); };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => { if (blob) { downloadFile(blob, "qr-code.png", "image/png"); showToast("✓ PNG downloaded"); } }, "image/png");
  };

  const handleDownloadJpg = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const tmp = document.createElement("canvas"); tmp.width = canvas.width; tmp.height = canvas.height;
    const ctx = tmp.getContext("2d"); ctx.fillStyle = bgColor === "transparent" ? "#ffffff" : bgColor;
    ctx.fillRect(0, 0, tmp.width, tmp.height); ctx.drawImage(canvas, 0, 0);
    tmp.toBlob((blob) => { if (blob) { downloadFile(blob, "qr-code.jpg", "image/jpeg"); showToast("✓ JPG downloaded"); } }, "image/jpeg", 0.95);
  };

  const handleDownloadSvg = () => {
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL("image/png");
      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">\n  <image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/>\n</svg>`;
      downloadFile(svg, "qr-code.svg", "image/svg+xml");
      showToast("✓ SVG downloaded");
    } catch { handleDownloadPng(); }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      try {
        if (blob && navigator.clipboard?.write) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          showToast("✓ Copied to clipboard!");
        }
      } catch { showToast("Clipboard not supported in this browser"); }
    });
  };

  const applyColorPreset = (p) => {
    setDotColor(p.dark); setBgColor(p.light); setEyeColor(p.dark); setFrameColor(p.dark);
    showToast(`✓ Theme: ${p.name}`);
  };

  // ─── Section Tab Component ─────────────────────────────────────────────────
  const SectionTab = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
        activeSection === id
          ? "bg-white dark:bg-[#182333] text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-[#2a3c53]"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="space-y-5">

      {/* ── Hero Status Strip ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c4a6e 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xl flex-shrink-0">
            📱
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-wide">QR Code Studio</div>
            <div className="text-[11px] text-cyan-300/70 font-medium mt-0.5">Real-time • 100% Free • No Signup</div>
          </div>
        </div>
        {/* Quick Color Palettes */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Theme:</span>
          <div className="flex gap-1.5">
            {COLOR_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyColorPreset(p)}
                title={p.name}
                className="w-6 h-6 rounded-full border-2 border-white/20 hover:border-white/70 hover:scale-110 transition-all cursor-pointer shadow-md"
                style={{ background: `linear-gradient(135deg, ${p.dark} 50%, ${p.light} 50%)` }}
              />
            ))}
          </div>
        </div>
        {/* Subtle glow orb */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-500/10 pointer-events-none" />
      </div>

      {/* ── Main Layout: Left Controls + Right Preview ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ─── Left: Controls Panel ─────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4">

          {/* Section Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-[#111a27] p-1 rounded-xl border border-slate-200 dark:border-[#223247]">
            <SectionTab id="content" icon="📄" label="Content" />
            <SectionTab id="style"   icon="🎨" label="Design" />
            <SectionTab id="logo"    icon="⭐" label="Logo & Frame" />
          </div>

          {/* ── CONTENT TAB ──────────────────────────────────────────────────── */}
          {activeSection === "content" && (
            <div className="space-y-4">
              {/* Data Type Cards */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  QR Content Type
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DATA_TYPES.map((dt) => (
                    <button
                      key={dt.id}
                      onClick={() => setDataType(dt.id)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer group border ${
                        dataType === dt.id
                          ? "bg-blue-600 dark:bg-cyan-500 border-blue-600 dark:border-cyan-400 text-white shadow-md"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-cyan-600 hover:bg-blue-50/50 dark:hover:bg-cyan-950/20"
                      }`}
                    >
                      <div className="text-lg mb-1">{dt.icon}</div>
                      <div className="font-bold text-xs leading-tight">{dt.label}</div>
                      <div className={`text-[10px] mt-0.5 leading-tight ${dataType === dt.id ? "text-blue-100 dark:text-cyan-100" : "text-slate-400"}`}>
                        {dt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Input Fields */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm space-y-3">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {DATA_TYPES.find((d) => d.id === dataType)?.icon}{" "}
                  {DATA_TYPES.find((d) => d.id === dataType)?.label} Details
                </div>

                {dataType === "url" && (
                  <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://yourwebsite.com" className="tool-input font-mono text-sm" />
                )}

                {dataType === "text" && (
                  <textarea rows={4} value={textInput} onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter any text, message or coupon code..." className="tool-input text-sm resize-none" />
                )}

                {dataType === "wifi" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Network Name (SSID)</label>
                        <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="tool-input text-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Password</label>
                        <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="tool-input text-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">Security:</span>
                        {["WPA", "WEP", "nopass"].map((s) => (
                          <button key={s} onClick={() => setWifiEncryption(s)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${wifiEncryption === s ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"}`}>
                            {s === "nopass" ? "Open" : s}
                          </button>
                        ))}
                      </div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="rounded accent-blue-600" />
                        Hidden Network
                      </label>
                    </div>
                  </div>
                )}

                {dataType === "vcard" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">First Name</label>
                      <input type="text" value={vcardFirst} onChange={(e) => setVcardFirst(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Last Name</label>
                      <input type="text" value={vcardLast} onChange={(e) => setVcardLast(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Phone</label>
                      <input type="tel" value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Email</label>
                      <input type="email" value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Company / Organization</label>
                      <input type="text" value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Website URL</label>
                      <input type="url" value={vcardUrl} onChange={(e) => setVcardUrl(e.target.value)} className="tool-input text-sm" />
                    </div>
                  </div>
                )}

                {dataType === "email" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Recipient Email</label>
                      <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Subject</label>
                      <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Message Body</label>
                      <textarea rows={3} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="tool-input text-sm resize-none" />
                    </div>
                  </div>
                )}

                {dataType === "phone" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Phone Number <span className="font-normal">(with country code)</span></label>
                      <input type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder="+1 555 0199" className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">SMS Message <span className="font-normal">(optional)</span></label>
                      <input type="text" value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="Leave blank for phone call only" className="tool-input text-sm" />
                    </div>
                  </div>
                )}

                {dataType === "whatsapp" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">WhatsApp Number <span className="font-normal">(with country code)</span></label>
                      <input type="tel" value={whatsappNum} onChange={(e) => setWhatsappNum(e.target.value)} placeholder="+1 555 0199" className="tool-input text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Pre-filled Message</label>
                      <input type="text" value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)} className="tool-input text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STYLE / DESIGN TAB ───────────────────────────────────────────── */}
          {activeSection === "style" && (
            <div className="space-y-4">

              {/* Color Pickers Row */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Colors</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "QR Color",    value: dotColor, onChange: setDotColor, hint: "Modules & dots" },
                    { label: "Background",  value: bgColor,  onChange: (v) => { setBgColor(v); setIsTransparentBg(false); }, hint: "Canvas fill" },
                    { label: "Eye Color",   value: eyeColor || dotColor, onChange: setEyeColor, hint: "Corner squares" },
                  ].map((col) => (
                    <div key={col.label} className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">{col.label}</label>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input type="color" value={col.value} onChange={(e) => col.onChange(e.target.value)}
                            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-[#2a3c53] cursor-pointer p-0.5 bg-white dark:bg-[#182333]" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-700 dark:text-slate-300">{col.value}</div>
                          <div className="text-[10px] text-slate-400">{col.hint}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Transparent BG toggle */}
                <label className="flex items-center gap-2 mt-3 cursor-pointer w-fit">
                  <input type="checkbox" checked={isTransparentBg} onChange={(e) => setIsTransparentBg(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Transparent background (PNG only)</span>
                </label>
                {/* Reset eye */}
                {eyeColor && (
                  <button onClick={() => setEyeColor("")} className="mt-2 text-[11px] text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer font-semibold">
                    Reset Eye Color to QR Color
                  </button>
                )}
              </div>

              {/* Module Pattern */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Module Pattern</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "rounded", label: "Smooth", preview: "▪" },
                    { id: "dots",    label: "Circles", preview: "●" },
                    { id: "classy",  label: "Diamond", preview: "◆" },
                    { id: "square",  label: "Classic", preview: "■" },
                  ].map((s) => (
                    <button key={s.id} onClick={() => setDotStyle(s.id)}
                      className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1.5 font-bold text-xs cursor-pointer border transition-all ${
                        dotStyle === s.id
                          ? "bg-blue-600 dark:bg-cyan-500 text-white border-blue-600 dark:border-cyan-400 shadow-md"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300 hover:border-blue-400"
                      }`}>
                      <span className="text-xl leading-none">{s.preview}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Eye Pattern */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Corner Eye Style</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "rounded", label: "Rounded",  preview: "▣" },
                    { id: "circle",  label: "Circles",  preview: "◎" },
                    { id: "square",  label: "Square",   preview: "⊞" },
                  ].map((ce) => (
                    <button key={ce.id} onClick={() => setCornerEyeStyle(ce.id)}
                      className={`py-3 rounded-xl flex flex-col items-center gap-1.5 font-bold text-xs cursor-pointer border transition-all ${
                        cornerEyeStyle === ce.id
                          ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-md"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300"
                      }`}>
                      <span className="text-xl">{ce.preview}</span>
                      <span>{ce.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Advanced</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      Error Correction
                      <span className="ml-1.5 text-[10px] font-normal text-slate-400">(H = best for logos)</span>
                    </label>
                    <div className="flex gap-1">
                      {["L", "M", "Q", "H"].map((lvl) => (
                        <button key={lvl} onClick={() => setErrorCorrection(lvl)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            errorCorrection === lvl
                              ? "bg-blue-600 dark:bg-cyan-500 text-white"
                              : "bg-slate-100 dark:bg-[#182333] text-slate-600 dark:text-slate-400"
                          }`}>
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      Quiet Zone Margin <span className="font-normal text-[10px] text-slate-400">({margin} cells)</span>
                    </label>
                    <input type="range" min={1} max={6} value={margin} onChange={(e) => setMargin(Number(e.target.value))}
                      className="w-full accent-blue-600 dark:accent-cyan-500 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LOGO & FRAME TAB ─────────────────────────────────────────────── */}
          {activeSection === "logo" && (
            <div className="space-y-4">
              {/* Center Icon */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Center Icon / Badge</div>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 dark:bg-cyan-500 text-white text-xs font-bold hover:bg-blue-700 dark:hover:bg-cyan-400 transition-all cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Logo
                  </button>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                  {LOGO_PRESETS.map((lp) => (
                    <button key={lp.id} onClick={() => { setSelectedLogoPreset(lp.id); setCustomLogoUrl(""); }}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold cursor-pointer border transition-all ${
                        selectedLogoPreset === lp.id && !customLogoUrl
                          ? "bg-blue-600 dark:bg-cyan-500 text-white border-blue-600 dark:border-cyan-400 shadow-md"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300 hover:border-blue-400"
                      }`}>
                      <span className="text-lg">{lp.icon || "✕"}</span>
                      <span>{lp.name}</span>
                    </button>
                  ))}
                  {customLogoUrl && (
                    <div className="aspect-square rounded-xl border-2 border-blue-500 overflow-hidden relative">
                      <img src={customLogoUrl} alt="Custom logo" className="w-full h-full object-contain" />
                      <button onClick={() => { setCustomLogoUrl(""); setSelectedLogoPreset("none"); }}
                        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-bl-lg cursor-pointer font-bold">
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {(selectedLogoPreset !== "none" || customLogoUrl) && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#223247]">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      Logo Size: {logoSizePercent}% of QR width
                    </label>
                    <input type="range" min={15} max={35} value={logoSizePercent} onChange={(e) => setLogoSizePercent(Number(e.target.value))}
                      className="w-full accent-blue-600 dark:accent-cyan-500 cursor-pointer" />
                  </div>
                )}
              </div>

              {/* Call-to-Action Frame */}
              <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  Call-To-Action Frame
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {FRAME_PRESETS.map((fp) => (
                    <button key={fp.id} onClick={() => setFrameStyle(fp.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold cursor-pointer border transition-all ${
                        frameStyle === fp.id
                          ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-md"
                          : "bg-slate-50 dark:bg-[#182333] border-slate-200 dark:border-[#2a3c53] text-slate-600 dark:text-slate-300 hover:border-slate-400"
                      }`}>
                      {fp.label}
                    </button>
                  ))}
                </div>

                {frameStyle !== "none" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Frame Text</label>
                      <input type="text" value={frameText} onChange={(e) => setFrameText(e.target.value)}
                        placeholder="e.g. SCAN ME" className="tool-input text-sm font-bold uppercase" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">Frame Color</label>
                      <input type="color" value={frameColor} onChange={(e) => setFrameColor(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 dark:border-[#2a3c53] cursor-pointer p-1 bg-white dark:bg-[#182333]" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Live Preview Panel ────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preview Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Live Preview</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                ● Live
              </span>
            </h3>
            <button onClick={handleCopyImage}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy Image
            </button>
          </div>

          {/* Toast */}
          {toastNotice && (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
              {toastNotice}
            </div>
          )}

          {/* Canvas Box */}
          <div className={`rounded-2xl border-2 overflow-hidden flex items-center justify-center min-h-[320px] transition-all relative ${
            isTransparentBg
              ? "border-dashed border-slate-300 dark:border-[#2a3c53] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px]"
              : "border-slate-200 dark:border-[#223247]"
          }`} style={!isTransparentBg ? { backgroundColor: bgColor } : {}}>
            <canvas ref={canvasRef} className="max-w-full h-auto" style={{ maxHeight: "400px" }} />
          </div>

          {/* Downloads */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Export QR Code</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Commercial use · No watermark</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-sm">
                ✓
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <button onClick={handleDownloadPng}
                className="py-3 rounded-xl bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white font-bold text-xs shadow-sm transition-all flex flex-col items-center gap-1 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>PNG (HD)</span>
              </button>

              <button onClick={handleDownloadSvg}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex flex-col items-center gap-1 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>SVG Vector</span>
              </button>

              <button onClick={handleDownloadJpg}
                className="py-3 rounded-xl bg-slate-800 dark:bg-[#1e2f44] hover:bg-slate-900 dark:hover:bg-[#283d58] text-white font-bold text-xs shadow-sm transition-all flex flex-col items-center gap-1 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>JPG (2K)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

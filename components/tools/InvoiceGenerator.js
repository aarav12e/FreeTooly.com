"use client";

import { useState, useRef, useMemo } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { downloadFile } from "@/lib/file-utils";

// ─── Currency Options ──────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", symbol: "$",   label: "$ USD (United States Dollar)" },
  { code: "EUR", symbol: "€",   label: "€ EUR (Eurozone)" },
  { code: "GBP", symbol: "£",   label: "£ GBP (British Pound)" },
  { code: "INR", symbol: "₹",   label: "₹ INR (Indian Rupee)" },
  { code: "CAD", symbol: "CA$", label: "CA$ CAD (Canadian Dollar)" },
  { code: "AUD", symbol: "AU$", label: "AU$ AUD (Australian Dollar)" },
  { code: "JPY", symbol: "¥",   label: "¥ JPY (Japanese Yen)" },
  { code: "CHF", symbol: "CHF", label: "CHF (Swiss Franc)" },
  { code: "AED", symbol: "AED", label: "AED (United Arab Emirates Dirham)" },
  { code: "SGD", symbol: "S$",  label: "S$ SGD (Singapore Dollar)" },
];

// ─── Professional Corporate Color Themes (Zero Purple) ─────────────────────────
const THEMES = [
  { id: "navy",     name: "Executive Navy", primary: "#0f2744", secondary: "#1e3a8a", accent: "#2563eb", bgLight: "#f0f6ff", pdfRgb: [0.06, 0.15, 0.27] },
  { id: "slate",    name: "Onyx & Charcoal", primary: "#18181b", secondary: "#27272a", accent: "#52525b", bgLight: "#f4f4f5", pdfRgb: [0.09, 0.09, 0.11] },
  { id: "cobalt",   name: "Corporate Blue", primary: "#1d4ed8", secondary: "#2563eb", accent: "#3b82f6", bgLight: "#eff6ff", pdfRgb: [0.11, 0.31, 0.85] },
  { id: "emerald",  name: "Forest Emerald",  primary: "#064e3b", secondary: "#047857", accent: "#059669", bgLight: "#ecfdf5", pdfRgb: [0.02, 0.31, 0.23] },
  { id: "graphite", name: "Steel Graphite",  primary: "#334155", secondary: "#475569", accent: "#64748b", bgLight: "#f8fafc", pdfRgb: [0.20, 0.25, 0.33] },
];

// ─── Professional Initial Data ────────────────────────────────────────────────
const DEFAULT_INVOICE = {
  invoiceNumber: "INV-2026-0042",
  invoiceDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  poNumber: "PO-98721",
  currency: "USD",
  currencySymbol: "$",
  status: "Due", // "Due" | "Paid" | "Draft" | "Pending"

  // Seller / Company
  fromName: "Apex Global Solutions Inc.",
  fromEmail: "billing@apexsolutions.com",
  fromPhone: "+1 (555) 489-2041",
  fromWebsite: "www.apexsolutions.com",
  fromAddress: "500 Financial Plaza, Suite 1800",
  fromCityStateZip: "New York, NY 10005, USA",
  fromTaxId: "EIN: 84-9382109",

  // Buyer / Client
  toName: "David Harrison",
  toCompany: "Global Vanguard Enterprises LLC",
  toEmail: "d.harrison@vanguardenterprises.com",
  toPhone: "+1 (555) 782-9901",
  toAddress: "1200 Avenue of the Americas, Floor 24",
  toCityStateZip: "New York, NY 10036, USA",
  toTaxId: "Tax ID: US-992-104-32",

  // Line Items
  items: [
    { id: 1, description: "Enterprise Cloud Infrastructure & Database Architecture", qty: 40, unitPrice: 150 },
    { id: 2, description: "Frontend Application Implementation & System Integration", qty: 30, unitPrice: 125 },
    { id: 3, description: "Automated CI/CD DevOps Pipeline & Security Audit", qty: 20, unitPrice: 140 },
    { id: 4, description: "Dedicated Technical Support & Maintenance SLA (Monthly)", qty: 1, unitPrice: 850 },
  ],

  // Extra Financials
  taxRate: 8.5,
  taxLabel: "Sales Tax / VAT",
  discountPercent: 5,
  shipping: 0,

  // Payment Details
  bankName: "JPMorgan Chase Bank, N.A.",
  accountHolder: "Apex Global Solutions Inc.",
  accountNumber: "9834-0192-3841",
  routingOrIban: "Routing: 021000021 | SWIFT/BIC: CHASUS33",
  paymentNotes: "Please reference Invoice # INV-2026-0042 in payment memo.",

  // Notes & Policy
  notes: "Thank you for choosing Apex Global Solutions. We value our ongoing business relationship.",
  terms: "Payment is due within 14 calendar days of invoice date. Payments made after the due date are subject to a 1.5% late fee per month.",
  signatoryName: "Finance & Accounts Department",
};

// ─── PDF WinAnsi Character Sanitizer Helper ────────────────────────────────────
// Standard PDF fonts (Helvetica) only support WinAnsi / Latin-1 encoding.
// Characters like ₹ (INR), smart quotes, em-dashes, etc. cause WinAnsi encoding errors.
function sanitizeForPdf(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/₹/g, "Rs. ")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/•/g, "*")
    .replace(/…/g, "...")
    .replace(/[^\x00-\xFF]/g, " "); // Replace anything outside WinAnsi Latin-1
}

function getPdfSafeCurrency(symbol, code) {
  if (code === "INR" || symbol === "₹") return "Rs. ";
  if (code === "JPY" || symbol === "¥") return "JPY ";
  if (code === "AED") return "AED ";
  if (code === "CHF") return "CHF ";
  if (code === "SGD") return "S$ ";
  if (code === "CAD") return "CA$ ";
  if (code === "AUD") return "AU$ ";
  if (code === "EUR") return "EUR ";
  if (code === "GBP") return "GBP ";
  if (code === "USD") return "$";
  if (symbol && !/^[\x00-\xFF]+$/.test(symbol)) {
    return (code || "$") + " ";
  }
  return symbol || "$";
}

export default function InvoiceGenerator() {
  const [data, setData] = useState(DEFAULT_INVOICE);
  const [themeId, setThemeId] = useState("navy");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoBytes, setLogoBytes] = useState(null);
  const [logoType, setLogoType] = useState("");
  const [toastNotice, setToastNotice] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview"

  const fileInputRef = useRef(null);
  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(""), 3000);
  };

  // ─── Financial Calculations ─────────────────────────────────────────────────
  const { subtotal, discountAmount, taxableAmount, taxAmount, grandTotal } = useMemo(() => {
    const sub = data.items.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0), 0);
    const disc = (sub * (Number(data.discountPercent) || 0)) / 100;
    const taxable = Math.max(0, sub - disc);
    const tax = (taxable * (Number(data.taxRate) || 0)) / 100;
    const ship = Number(data.shipping) || 0;
    const total = taxable + tax + ship;
    return {
      subtotal: sub,
      discountAmount: disc,
      taxableAmount: taxable,
      taxAmount: tax,
      grandTotal: total,
    };
  }, [data.items, data.discountPercent, data.taxRate, data.shipping]);

  // ─── Field Helpers ──────────────────────────────────────────────────────────
  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: "Professional Consulting / Service Description", qty: 1, unitPrice: 100 }],
    }));
    showToast("✓ Added new line item");
  };

  const removeItem = (index) => {
    if (data.items.length <= 1) {
      showToast("Invoice must have at least 1 line item");
      return;
    }
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    showToast("✓ Line item removed");
  };

  // ─── Quick Due Date Helper ──────────────────────────────────────────────────
  const setDueDays = (days) => {
    const base = new Date(data.invoiceDate || Date.now());
    const next = new Date(base.getTime() + days * 86400000);
    updateField("dueDate", next.toISOString().split("T")[0]);
    showToast(`✓ Set due date to +${days} days`);
  };

  // ─── Logo Handler ───────────────────────────────────────────────────────────
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Logo size should be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        setLogoUrl(event.target.result);
        const arrayBuffer = await file.arrayBuffer();
        setLogoBytes(new Uint8Array(arrayBuffer));
        setLogoType(file.type.includes("png") ? "png" : "jpg");
        showToast("✓ Company logo uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoUrl("");
    setLogoBytes(null);
    setLogoType("");
    showToast("✓ Logo removed");
  };

  const handleCurrencyChange = (code) => {
    const curr = CURRENCIES.find((c) => c.code === code);
    if (curr) {
      setData((prev) => ({
        ...prev,
        currency: curr.code,
        currencySymbol: curr.symbol,
      }));
    }
  };

  // ─── Load Sample & Reset ────────────────────────────────────────────────────
  const loadSample = () => {
    setData({
      ...DEFAULT_INVOICE,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    });
    showToast("✓ Corporate sample invoice loaded");
  };

  const clearForm = () => {
    setData({
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      poNumber: "",
      currency: "USD",
      currencySymbol: "$",
      status: "Due",
      fromName: "",
      fromEmail: "",
      fromPhone: "",
      fromWebsite: "",
      fromAddress: "",
      fromCityStateZip: "",
      fromTaxId: "",
      toName: "",
      toCompany: "",
      toEmail: "",
      toPhone: "",
      toAddress: "",
      toCityStateZip: "",
      toTaxId: "",
      items: [{ id: 1, description: "", qty: 1, unitPrice: 0 }],
      taxRate: 0,
      taxLabel: "Tax",
      discountPercent: 0,
      shipping: 0,
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      routingOrIban: "",
      paymentNotes: "",
      notes: "",
      terms: "Payment is due within 14 days of invoice date.",
      signatoryName: "",
    });
    removeLogo();
    showToast("✓ Blank invoice created");
  };

  // ─── High-Fidelity Vector PDF Generation (pdf-lib) ──────────────────────────
  const generatePdfLibDocument = async () => {
    setIsGeneratingPdf(true);
    try {
      const pdfDoc = await PDFDocument.create();
      // Standard US Letter Page (612 x 792 pt)
      const page = pdfDoc.addPage([612, 792]);
      const { width, height } = page.getSize();

      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      const [tr, tg, tb] = currentTheme.pdfRgb;
      const themePrimary = rgb(tr, tg, tb);
      const darkText = rgb(0.09, 0.11, 0.14);
      const bodyText = rgb(0.25, 0.28, 0.32);
      const mutedText = rgb(0.48, 0.52, 0.58);
      const borderLine = rgb(0.86, 0.89, 0.92);
      const bgGray = rgb(0.95, 0.96, 0.98);

      const marginX = 42;
      const contentWidth = width - marginX * 2; // 528 pt

      // Top Accent Strip
      page.drawRectangle({
        x: 0,
        y: height - 10,
        width: width,
        height: 10,
        color: themePrimary,
      });

      let currY = height - 44;

      // ── 1. Header (Logo / Company Name Left + INVOICE Meta Right) ──
      const headerTopY = currY;

      // Logo or Company Name
      if (logoBytes) {
        try {
          let embeddedLogo;
          if (logoType === "png") {
            embeddedLogo = await pdfDoc.embedPng(logoBytes);
          } else {
            embeddedLogo = await pdfDoc.embedJpg(logoBytes);
          }
          const maxW = 140;
          const maxH = 45;
          const scale = Math.min(maxW / embeddedLogo.width, maxH / embeddedLogo.height, 1);
          const drawW = embeddedLogo.width * scale;
          const drawH = embeddedLogo.height * scale;
          page.drawImage(embeddedLogo, {
            x: marginX,
            y: headerTopY - drawH,
            width: drawW,
            height: drawH,
          });
          currY = headerTopY - drawH - 10;
        } catch {
          page.drawText(sanitizeForPdf(data.fromName || "COMPANY NAME"), {
            x: marginX,
            y: headerTopY - 12,
            size: 15,
            font: fontBold,
            color: themePrimary,
          });
          currY = headerTopY - 24;
        }
      } else {
        page.drawText(sanitizeForPdf(data.fromName || "COMPANY NAME"), {
          x: marginX,
          y: headerTopY - 12,
          size: 15,
          font: fontBold,
          color: themePrimary,
        });
        currY = headerTopY - 24;
      }

      // "INVOICE" Title Right
      const invoiceTitle = "INVOICE";
      const titleWidth = fontBold.widthOfTextAtSize(invoiceTitle, 22);
      page.drawText(invoiceTitle, {
        x: width - marginX - titleWidth,
        y: headerTopY - 12,
        size: 22,
        font: fontBold,
        color: themePrimary,
      });

      // Invoice Meta Rows (Right-Aligned)
      const metaRows = [
        { label: "Invoice #", val: data.invoiceNumber || "N/A" },
        { label: "Date", val: data.invoiceDate || "N/A" },
        { label: "Due Date", val: data.dueDate || "N/A" },
      ];
      if (data.poNumber) metaRows.push({ label: "PO #", val: data.poNumber });

      let metaY = headerTopY - 30;
      for (const m of metaRows) {
        const fullStr = sanitizeForPdf(`${m.label}: ${m.val}`);
        const strW = fontRegular.widthOfTextAtSize(fullStr, 8.5);
        page.drawText(fullStr, {
          x: width - marginX - strW,
          y: metaY,
          size: 8.5,
          font: fontRegular,
          color: darkText,
        });
        metaY -= 12;
      }

      // Company Info (Left)
      const sellerRows = [
        data.fromEmail,
        data.fromPhone,
        data.fromWebsite,
        data.fromAddress,
        data.fromCityStateZip,
        data.fromTaxId,
      ].filter(Boolean);

      let sellerY = currY;
      for (const row of sellerRows) {
        const cleanRow = sanitizeForPdf(row);
        page.drawText(cleanRow, {
          x: marginX,
          y: sellerY,
          size: 8,
          font: fontRegular,
          color: mutedText,
        });
        sellerY -= 11;
      }

      currY = Math.min(sellerY, metaY) - 12;

      // Divider Line
      page.drawLine({
        start: { x: marginX, y: currY },
        end: { x: width - marginX, y: currY },
        thickness: 0.8,
        color: borderLine,
      });

      currY -= 14;

      // ── 2. Billed To (Client Details) ──
      page.drawText("BILLED TO", {
        x: marginX,
        y: currY,
        size: 8,
        font: fontBold,
        color: themePrimary,
      });
      currY -= 12;

      if (data.toCompany) {
        page.drawText(sanitizeForPdf(data.toCompany), {
          x: marginX,
          y: currY,
          size: 10.5,
          font: fontBold,
          color: darkText,
        });
        currY -= 12;
      }
      if (data.toName) {
        page.drawText(sanitizeForPdf(`Attn: ${data.toName}`), {
          x: marginX,
          y: currY,
          size: 8.5,
          font: fontRegular,
          color: bodyText,
        });
        currY -= 11;
      }

      const clientRows = [
        data.toAddress,
        data.toCityStateZip,
        data.toEmail,
        data.toPhone,
        data.toTaxId,
      ].filter(Boolean);

      for (const row of clientRows) {
        page.drawText(sanitizeForPdf(row), {
          x: marginX,
          y: currY,
          size: 8,
          font: fontRegular,
          color: mutedText,
        });
        currY -= 10;
      }

      currY -= 12;

      // ── 3. Line Items Table ──
      const colX_Desc = marginX + 8;
      const colX_Qty = marginX + 310;
      const colX_Price = marginX + 390;
      const colX_Total = width - marginX - 8;

      const headerH = 20;
      page.drawRectangle({
        x: marginX,
        y: currY - headerH + 5,
        width: contentWidth,
        height: headerH,
        color: bgGray,
      });
      page.drawLine({
        start: { x: marginX, y: currY - headerH + 5 },
        end: { x: width - marginX, y: currY - headerH + 5 },
        thickness: 0.8,
        color: borderLine,
      });

      page.drawText("DESCRIPTION / SERVICE", { x: colX_Desc, y: currY - 8, size: 8, font: fontBold, color: themePrimary });
      page.drawText("QTY", { x: colX_Qty, y: currY - 8, size: 8, font: fontBold, color: themePrimary });

      const priceHeaderW = fontBold.widthOfTextAtSize("UNIT PRICE", 8);
      page.drawText("UNIT PRICE", { x: colX_Price - priceHeaderW, y: currY - 8, size: 8, font: fontBold, color: themePrimary });

      const totalHeaderW = fontBold.widthOfTextAtSize("TOTAL", 8);
      page.drawText("TOTAL", { x: colX_Total - totalHeaderW, y: currY - 8, size: 8, font: fontBold, color: themePrimary });

      currY -= headerH + 6;

      const sym = getPdfSafeCurrency(data.currencySymbol, data.currency);

      // Table Rows
      for (const item of data.items) {
        const itemQty = Number(item.qty) || 0;
        const itemPrice = Number(item.unitPrice) || 0;
        const itemTotal = itemQty * itemPrice;

        const rawDesc = item.description || "Item description";
        const desc = sanitizeForPdf(rawDesc);
        const truncatedDesc = desc.length > 50 ? desc.substring(0, 47) + "..." : desc;

        const priceStr = sanitizeForPdf(`${sym}${itemPrice.toFixed(2)}`);
        const totalStr = sanitizeForPdf(`${sym}${itemTotal.toFixed(2)}`);
        const qtyStr = String(itemQty);

        page.drawText(truncatedDesc, { x: colX_Desc, y: currY, size: 8.5, font: fontRegular, color: darkText });
        page.drawText(qtyStr, { x: colX_Qty + 4, y: currY, size: 8.5, font: fontRegular, color: bodyText });

        const priceW = fontRegular.widthOfTextAtSize(priceStr, 8.5);
        page.drawText(priceStr, { x: colX_Price - priceW, y: currY, size: 8.5, font: fontRegular, color: bodyText });

        const totalW = fontBold.widthOfTextAtSize(totalStr, 8.5);
        page.drawText(totalStr, { x: colX_Total - totalW, y: currY, size: 8.5, font: fontBold, color: darkText });

        currY -= 6;
        page.drawLine({
          start: { x: marginX, y: currY },
          end: { x: width - marginX, y: currY },
          thickness: 0.5,
          color: borderLine,
        });
        currY -= 13;
      }

      currY -= 10;

      // ── 4. Bottom Section: Bank Instructions Left + Totals Card Right ──
      const bottomSectionTop = currY;

      // Right: Totals Box (Width: 210pt, Right: width - marginX)
      const totalsBoxW = 210;
      const totalsBoxX = width - marginX - totalsBoxW;
      let totalsY = bottomSectionTop;

      const summaryLines = [
        { label: "Subtotal:", val: sanitizeForPdf(`${sym}${subtotal.toFixed(2)}`), isTotal: false },
      ];
      if (data.discountPercent > 0) {
        summaryLines.push({ label: sanitizeForPdf(`Discount (${data.discountPercent}%):`), val: sanitizeForPdf(`-${sym}${discountAmount.toFixed(2)}`), isTotal: false });
      }
      if (data.taxRate > 0) {
        summaryLines.push({ label: sanitizeForPdf(`${data.taxLabel || "Tax"} (${data.taxRate}%):`), val: sanitizeForPdf(`+${sym}${taxAmount.toFixed(2)}`), isTotal: false });
      }
      if (data.shipping > 0) {
        summaryLines.push({ label: "Shipping / Handling:", val: sanitizeForPdf(`${sym}${Number(data.shipping).toFixed(2)}`), isTotal: false });
      }

      for (const row of summaryLines) {
        page.drawText(row.label, {
          x: totalsBoxX + 10,
          y: totalsY,
          size: 8.5,
          font: fontRegular,
          color: mutedText,
        });

        const valW = fontBold.widthOfTextAtSize(row.val, 8.5);
        page.drawText(row.val, {
          x: width - marginX - 10 - valW,
          y: totalsY,
          size: 8.5,
          font: fontBold,
          color: bodyText,
        });
        totalsY -= 15;
      }

      // Total Due Highlight Banner
      const grandTotalStr = sanitizeForPdf(`${sym}${grandTotal.toFixed(2)}`);
      const grandTotalW = fontBold.widthOfTextAtSize(grandTotalStr, 11);
      const totalBannerH = 24;

      page.drawRectangle({
        x: totalsBoxX,
        y: totalsY - totalBannerH + 9,
        width: totalsBoxW,
        height: totalBannerH,
        color: bgGray,
      });
      page.drawLine({
        start: { x: totalsBoxX, y: totalsY - totalBannerH + 9 },
        end: { x: width - marginX, y: totalsY - totalBannerH + 9 },
        thickness: 1,
        color: themePrimary,
      });

      page.drawText("Total Amount Due:", {
        x: totalsBoxX + 10,
        y: totalsY - 5,
        size: 9.5,
        font: fontBold,
        color: themePrimary,
      });

      page.drawText(grandTotalStr, {
        x: width - marginX - 10 - grandTotalW,
        y: totalsY - 5,
        size: 11,
        font: fontBold,
        color: themePrimary,
      });

      // Left: Payment & Bank Transfer Instructions (Width: 280pt)
      let bankY = bottomSectionTop;
      if (data.bankName || data.accountNumber || data.routingOrIban || data.paymentNotes) {
        page.drawText("PAYMENT & WIRE TRANSFER INSTRUCTIONS", {
          x: marginX,
          y: bankY,
          size: 8,
          font: fontBold,
          color: themePrimary,
        });
        bankY -= 13;

        if (data.bankName) {
          page.drawText(sanitizeForPdf(`Bank Name: ${data.bankName}`), { x: marginX, y: bankY, size: 7.5, font: fontRegular, color: bodyText });
          bankY -= 10;
        }
        if (data.accountHolder) {
          page.drawText(sanitizeForPdf(`Beneficiary: ${data.accountHolder}`), { x: marginX, y: bankY, size: 7.5, font: fontRegular, color: bodyText });
          bankY -= 10;
        }
        if (data.accountNumber) {
          page.drawText(sanitizeForPdf(`Account #: ${data.accountNumber}`), { x: marginX, y: bankY, size: 7.5, font: fontRegular, color: bodyText });
          bankY -= 10;
        }
        if (data.routingOrIban) {
          page.drawText(sanitizeForPdf(data.routingOrIban), { x: marginX, y: bankY, size: 7.5, font: fontRegular, color: mutedText });
          bankY -= 10;
        }
        if (data.paymentNotes) {
          page.drawText(sanitizeForPdf(`Note: ${data.paymentNotes}`), { x: marginX, y: bankY, size: 7.5, font: fontOblique, color: mutedText });
        }
      }

      // ── 5. Terms & Notes at Bottom (Safe footer zone) ──
      let footerY = 56;
      if (data.terms) {
        page.drawText("TERMS & CONDITIONS", { x: marginX, y: footerY, size: 7, font: fontBold, color: mutedText });
        footerY -= 9;
        page.drawText(sanitizeForPdf(data.terms.substring(0, 115)), { x: marginX, y: footerY, size: 6.5, font: fontRegular, color: mutedText });
        footerY -= 10;
      }
      if (data.notes) {
        page.drawText(sanitizeForPdf(data.notes.substring(0, 115)), { x: marginX, y: footerY, size: 7, font: fontOblique, color: bodyText });
      }

      // Bottom Colored Strip
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: 6,
        color: themePrimary,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      downloadFile(blob, `${data.invoiceNumber || "invoice"}.pdf`, "application/pdf");
      showToast(`✓ PDF generated cleanly: ${data.invoiceNumber || "invoice"}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      showToast("PDF error: " + err.message);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* ── Executive Dark Hero Banner (No Purple) ─────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
        style={{ background: "linear-gradient(135deg, #091524 0%, #0f2744 60%, #173254 100%)" }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-2xl flex-shrink-0">
            📄
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-wide flex items-center gap-2">
              <span>Professional Invoice Generator</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/20">
                PDF Ready
              </span>
            </div>
            <div className="text-xs text-blue-200/70 font-medium mt-0.5">
              Create, brand &amp; download client-ready vector PDF invoices instantly
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadSample}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 cursor-pointer transition-all"
          >
            ⚡ Load Sample
          </button>
          <button
            onClick={clearForm}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-xs font-semibold border border-white/10 cursor-pointer transition-all"
          >
            Clear
          </button>
          <button
            onClick={generatePdfLibDocument}
            disabled={isGeneratingPdf}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center gap-2 cursor-pointer transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isGeneratingPdf ? "Generating PDF…" : "Download PDF"}</span>
          </button>
        </div>

        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 pointer-events-none" />
      </div>

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toastNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          {toastNotice}
        </div>
      )}

      {/* ── Top Bar: Editor / Preview Tabs + Currency + Professional Theme Selector ── */}
      <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex gap-1 bg-slate-100 dark:bg-[#182333] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === "editor"
                ? "bg-white dark:bg-[#223247] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            ✏️ Invoice Details &amp; Items
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-[#223247] text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            👁️ Document Preview
          </button>
        </div>

        {/* Currency & Color Theme Options */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Currency:</span>
            <select
              value={data.currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-[#2a3c53] bg-slate-50 dark:bg-[#182333] text-slate-800 dark:text-slate-200 cursor-pointer outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Theme:</span>
            <div className="flex gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all border-2 ${
                    themeId === t.id ? "scale-110 border-blue-500 shadow-md ring-2 ring-blue-200 dark:ring-blue-900" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: t.primary }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB 1: INVOICE EDITOR ─────────────────────────────────────────── */}
      {activeTab === "editor" ? (
        <div className="space-y-5">
          {/* Section 1: Logo & Invoice Header Meta */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center justify-between">
              <span>1. Corporate Branding &amp; Invoice Metadata</span>
              <span className="text-xs font-normal text-slate-400">All fields appear on your PDF</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Logo Upload Box */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Company Logo (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#2a3c53] p-4 flex flex-col items-center justify-center gap-1.5 min-h-[120px] bg-slate-50 dark:bg-[#182333] hover:border-blue-500 cursor-pointer transition-all relative overflow-hidden"
                >
                  {logoUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img src={logoUrl} alt="Company logo" className="max-h-16 object-contain rounded-lg shadow-sm" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                        className="mt-1.5 text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        ✕ Remove Logo
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-2xl">🏢</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload Business Logo</span>
                      <span className="text-[10px] text-slate-400">PNG or JPG (Max 5MB)</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Invoice # *
                  </label>
                  <input
                    type="text"
                    value={data.invoiceNumber}
                    onChange={(e) => updateField("invoiceNumber", e.target.value)}
                    placeholder="INV-2026-001"
                    className="tool-input text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    value={data.invoiceDate}
                    onChange={(e) => updateField("invoiceDate", e.target.value)}
                    className="tool-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => updateField("dueDate", e.target.value)}
                    className="tool-input text-xs"
                  />
                  <div className="flex gap-1 mt-1">
                    {[7, 14, 30].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDueDays(d)}
                        className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        +{d}d
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    P.O. Number
                  </label>
                  <input
                    type="text"
                    value={data.poNumber}
                    onChange={(e) => updateField("poNumber", e.target.value)}
                    placeholder="PO-98721"
                    className="tool-input text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: From (Seller) & Bill To (Client) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* FROM (Seller / Your Business) */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span>🏛️</span>
                <span>From (Your Company Details)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  value={data.fromName}
                  onChange={(e) => updateField("fromName", e.target.value)}
                  placeholder="e.g. Apex Global Solutions Inc."
                  className="tool-input text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={data.fromEmail}
                    onChange={(e) => updateField("fromEmail", e.target.value)}
                    placeholder="billing@company.com"
                    className="tool-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Business Phone</label>
                  <input
                    type="tel"
                    value={data.fromPhone}
                    onChange={(e) => updateField("fromPhone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="tool-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={data.fromAddress}
                  onChange={(e) => updateField("fromAddress", e.target.value)}
                  placeholder="500 Financial Plaza, Suite 1800"
                  className="tool-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">City, State, ZIP</label>
                  <input
                    type="text"
                    value={data.fromCityStateZip}
                    onChange={(e) => updateField("fromCityStateZip", e.target.value)}
                    placeholder="New York, NY 10005"
                    className="tool-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tax / VAT / EIN ID</label>
                  <input
                    type="text"
                    value={data.fromTaxId}
                    onChange={(e) => updateField("fromTaxId", e.target.value)}
                    placeholder="EIN: 84-9382109"
                    className="tool-input text-xs"
                  />
                </div>
              </div>
            </div>

            {/* BILL TO (Client / Customer) */}
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-3">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span>👤</span>
                <span>Bill To (Client / Customer Details)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Company Name *</label>
                <input
                  type="text"
                  value={data.toCompany}
                  onChange={(e) => updateField("toCompany", e.target.value)}
                  placeholder="e.g. Global Vanguard Enterprises LLC"
                  className="tool-input text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Attention / Contact Person</label>
                  <input
                    type="text"
                    value={data.toName}
                    onChange={(e) => updateField("toName", e.target.value)}
                    placeholder="David Harrison"
                    className="tool-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={data.toEmail}
                    onChange={(e) => updateField("toEmail", e.target.value)}
                    placeholder="contact@client.com"
                    className="tool-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Street Address</label>
                <input
                  type="text"
                  value={data.toAddress}
                  onChange={(e) => updateField("toAddress", e.target.value)}
                  placeholder="1200 Avenue of the Americas"
                  className="tool-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">City, State, ZIP</label>
                  <input
                    type="text"
                    value={data.toCityStateZip}
                    onChange={(e) => updateField("toCityStateZip", e.target.value)}
                    placeholder="New York, NY 10036"
                    className="tool-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Client Tax / VAT ID</label>
                  <input
                    type="text"
                    value={data.toTaxId}
                    onChange={(e) => updateField("toTaxId", e.target.value)}
                    placeholder="VAT-992-104-32"
                    className="tool-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items Table & Math */}
          <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                3. Products, Services &amp; Line Items
              </div>
              <button
                onClick={addItem}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>+</span> Add Line Item
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-2.5">
              <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                <div className="col-span-6">Description / Service Item</div>
                <div className="col-span-2 text-center">Qty / Hours</div>
                <div className="col-span-2 text-right">Unit Price ({data.currencySymbol})</div>
                <div className="col-span-1 text-right">Total</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {data.items.map((item, index) => {
                const itemTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <div
                    key={item.id || index}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#182333] border border-slate-200 dark:border-[#2a3c53] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                  >
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Description of service, product or work done..."
                        className="tool-input text-xs w-full font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.qty}
                        onChange={(e) => updateItem(index, "qty", e.target.value)}
                        placeholder="1"
                        className="tool-input text-xs text-center font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                        placeholder="0.00"
                        className="tool-input text-xs text-right font-mono"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                      {data.currencySymbol}{itemTotal.toFixed(2)}
                    </div>
                    <div className="sm:col-span-1 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        title="Remove item"
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all cursor-pointer mx-auto font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations & Bank Info Grid */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#223247] grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Payment Instructions (Left) */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Payment / Bank Transfer Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    placeholder="Bank Name"
                    className="tool-input text-xs"
                  />
                  <input
                    type="text"
                    value={data.accountHolder}
                    onChange={(e) => updateField("accountHolder", e.target.value)}
                    placeholder="Beneficiary / Account Name"
                    className="tool-input text-xs"
                  />
                  <input
                    type="text"
                    value={data.accountNumber}
                    onChange={(e) => updateField("accountNumber", e.target.value)}
                    placeholder="Account / IBAN #"
                    className="tool-input text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={data.routingOrIban}
                    onChange={(e) => updateField("routingOrIban", e.target.value)}
                    placeholder="Routing / SWIFT / BIC"
                    className="tool-input text-xs font-mono"
                  />
                </div>
                <input
                  type="text"
                  value={data.paymentNotes}
                  onChange={(e) => updateField("paymentNotes", e.target.value)}
                  placeholder="Additional payment instructions (e.g. Wire, ACH, PayPal)"
                  className="tool-input text-xs"
                />
              </div>

              {/* Totals Summary (Right) */}
              <div className="bg-slate-50 dark:bg-[#182333] rounded-2xl border border-slate-200 dark:border-[#2a3c53] p-4 space-y-2.5">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {data.currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Discount (%):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={data.discountPercent}
                      onChange={(e) => updateField("discountPercent", e.target.value)}
                      className="w-16 tool-input text-xs text-right py-1 px-2"
                    />
                    <span className="font-mono text-slate-500 min-w-[70px] text-right">
                      -{data.currencySymbol}{discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Tax / VAT (%):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={data.taxRate}
                      onChange={(e) => updateField("taxRate", e.target.value)}
                      className="w-16 tool-input text-xs text-right py-1 px-2"
                    />
                    <span className="font-mono text-slate-500 min-w-[70px] text-right">
                      +{data.currencySymbol}{taxAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Shipping / Surcharge ({data.currencySymbol}):</span>
                  <input
                    type="number"
                    min="0"
                    value={data.shipping}
                    onChange={(e) => updateField("shipping", e.target.value)}
                    className="w-24 tool-input text-xs text-right py-1 px-2"
                  />
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-[#2a3c53] flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">Total Amount Due:</span>
                  <span className="font-mono font-extrabold text-lg" style={{ color: currentTheme.accent }}>
                    {data.currencySymbol}{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Terms & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Customer Notes / Thank You Message
              </label>
              <textarea
                rows={3}
                value={data.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Thank you for your business!"
                className="tool-input text-xs resize-none"
              />
            </div>

            <div className="bg-white dark:bg-[#131d2b] rounded-2xl border border-slate-200 dark:border-[#223247] p-5 shadow-sm space-y-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Payment Terms &amp; Conditions
              </label>
              <textarea
                rows={3}
                value={data.terms}
                onChange={(e) => updateField("terms", e.target.value)}
                placeholder="Payment is due within 14 days of invoice date..."
                className="tool-input text-xs resize-none"
              />
            </div>
          </div>
        </div>
      ) : (
        /* ── TAB 2: LIVE DOCUMENT PREVIEW ─────────────────────────────────── */
        <div className="space-y-4">
          <div className="flex justify-end gap-2.5">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-[#1e2f44] text-white text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-900"
            >
              <span>🖨️</span> Print / Save as PDF
            </button>
            <button
              onClick={generatePdfLibDocument}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-blue-700 shadow-md"
            >
              <span>📥</span> Download PDF Document
            </button>
          </div>

          {/* Clean Executive Paper Container */}
          <div
            className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 max-w-4xl mx-auto space-y-8 font-sans"
            style={{ minHeight: "820px" }}
          >
            {/* Top Color Accent Strip */}
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: currentTheme.primary }} />

            {/* Header: Company + Title */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-2">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="max-h-16 object-contain" />
                ) : (
                  <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: currentTheme.primary }}>
                    {data.fromName || "YOUR COMPANY NAME"}
                  </h1>
                )}
                <div className="text-xs text-slate-500 space-y-0.5">
                  {data.fromEmail && <div>{data.fromEmail}</div>}
                  {data.fromPhone && <div>{data.fromPhone}</div>}
                  {data.fromWebsite && <div>{data.fromWebsite}</div>}
                  {data.fromAddress && <div>{data.fromAddress}</div>}
                  {data.fromCityStateZip && <div>{data.fromCityStateZip}</div>}
                  {data.fromTaxId && <div>{data.fromTaxId}</div>}
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: currentTheme.primary }}>
                  INVOICE
                </h2>
                <div className="text-xs text-slate-700 font-mono font-bold">
                  #{data.invoiceNumber || "INV-001"}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">Invoice Date:</span> {data.invoiceDate}
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">Payment Due:</span> {data.dueDate}
                </div>
                {data.poNumber && (
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold">PO Number:</span> {data.poNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Bill To Block */}
            <div className="border-t border-slate-100 pt-6">
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: currentTheme.primary }}>
                Billed To
              </div>
              <div className="text-sm font-extrabold text-slate-900">
                {data.toCompany || data.toName || "Client Company Name"}
              </div>
              {data.toName && data.toCompany && (
                <div className="text-xs text-slate-600 mt-0.5">Attn: {data.toName}</div>
              )}
              <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                {data.toAddress && <div>{data.toAddress}</div>}
                {data.toCityStateZip && <div>{data.toCityStateZip}</div>}
                {data.toEmail && <div>{data.toEmail}</div>}
                {data.toPhone && <div>{data.toPhone}</div>}
                {data.toTaxId && <div>{data.toTaxId}</div>}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: currentTheme.primary }}>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-slate-700">Description</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-center text-slate-700">Qty</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-right text-slate-700">Unit Price</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-right text-slate-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-3 font-medium text-slate-800">{item.description || "—"}</td>
                      <td className="py-3 text-center text-slate-600 font-mono">{item.qty}</td>
                      <td className="py-3 text-right text-slate-600 font-mono">
                        {data.currencySymbol}{Number(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-bold font-mono text-slate-900">
                        {data.currencySymbol}{((Number(item.qty) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Wire Transfer Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
              <div className="space-y-3 text-xs">
                {(data.bankName || data.accountNumber) && (
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                      Payment / Wire Transfer
                    </div>
                    <div className="text-slate-600 space-y-0.5">
                      {data.bankName && <div>Bank: {data.bankName}</div>}
                      {data.accountHolder && <div>Beneficiary: {data.accountHolder}</div>}
                      {data.accountNumber && <div>Account #: {data.accountNumber}</div>}
                      {data.routingOrIban && <div>{data.routingOrIban}</div>}
                      {data.paymentNotes && <div className="text-slate-500 italic mt-1">{data.paymentNotes}</div>}
                    </div>
                  </div>
                )}
                {data.terms && (
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Terms</div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">{data.terms}</p>
                  </div>
                )}
              </div>

              {/* Totals Block */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {data.currencySymbol}{subtotal.toFixed(2)}
                  </span>
                </div>
                {data.discountPercent > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Discount ({data.discountPercent}%):</span>
                    <span className="font-mono text-slate-600">
                      -{data.currencySymbol}{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {data.taxRate > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>{data.taxLabel || "Tax"} ({data.taxRate}%):</span>
                    <span className="font-mono text-slate-600">
                      +{data.currencySymbol}{taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {data.shipping > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping / Surcharge:</span>
                    <span className="font-mono text-slate-600">
                      {data.currencySymbol}{Number(data.shipping).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-900 text-sm font-extrabold">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-lg" style={{ color: currentTheme.primary }}>
                    {data.currencySymbol}{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Footer */}
            {data.notes && (
              <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500 italic">
                {data.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

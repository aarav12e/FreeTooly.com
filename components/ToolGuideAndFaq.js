"use client";

import { useState } from "react";

export default function ToolGuideAndFaq({ tool }) {
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Upload or Enter Input",
      desc: `Drag and drop your file or paste text content directly into the ${tool?.name || "tool"} workspace above.`,
    },
    {
      num: "02",
      title: "Configure & Process",
      desc: `Select your desired settings or preferences, then click the primary action button to process your data in real-time.`,
    },
    {
      num: "03",
      title: "Download or Copy Output",
      desc: `Instantly download the processed file or click Copy to use your result immediately without any watermark.`,
    },
  ];

  const faqs = [
    {
      q: `Is ${tool?.name || "this tool"} completely free to use?`,
      a: `Yes! ${tool?.name || "This tool"} is 100% free with no daily limits, hidden subscriptions, or account registration required.`,
    },
    {
      q: `Are my files and data safe when using ${tool?.name || "this tool"}?`,
      a: `Absolutely. All processing takes place locally inside your web browser using client-side JavaScript. Your files and personal data are never uploaded to remote servers.`,
    },
    {
      q: `Can I use ${tool?.name || "this tool"} on mobile devices?`,
      a: `Yes, FreeTooly is fully responsive and works seamlessly across smartphones, tablets, laptops, and desktop computers.`,
    },
  ];

  return (
    <div className="space-y-10 mt-12 pt-8 border-t border-slate-200">
      {/* 3-Step How-To Guide */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Simple 3-Step Guide</span>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
            How to use {tool?.name || "this tool"}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 relative shadow-xs"
            >
              <span className="font-heading font-black text-2xl text-blue-600 opacity-40">{step.num}</span>
              <h3 className="font-heading font-bold text-sm text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Frequently Asked Questions</span>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900">
            Questions about {tool?.name || "this tool"}
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full text-left p-4 font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-blue-600 font-bold">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

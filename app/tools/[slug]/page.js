import { notFound } from "next/navigation";
import Link from "next/link";
import { tools, getToolBySlug, categoryLabels } from "@/lib/tools-registry";
import ToolRenderer from "@/components/ToolRenderer";
import ToolGuideAndFaq from "@/components/ToolGuideAndFaq";
import ToolPageTracker from "@/components/ToolPageTracker";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params = {} }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  return {
    title: `${tool.name} - Free Online Tool | FreeTooly`,
    description: tool.description,
  };
}

export default function ToolPage({ params = {} }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return notFound();

  const related = tools
    .filter((t) => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 4);

  return (
<<<<<<< HEAD
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-slate-900">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
=======
    <div className="max-w-4xl mx-auto px-4 sm:px-5 py-8 text-slate-900 dark:text-white">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 mb-6 transition-colors"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to all tools
      </Link>

      {/* Tool Header Box */}
<<<<<<< HEAD
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {tool.icon && (
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl flex-shrink-0 text-slate-800">
=======
      <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {tool.icon && (
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#192738] border border-blue-100 dark:border-[#2b3e56] flex items-center justify-center text-2xl flex-shrink-0">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                {tool.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
<<<<<<< HEAD
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                  {categoryLabels?.[tool.category] || tool.category}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                {tool.name}
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
            </div>
          </div>

          {/* Favorite Action Tracker */}
=======
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-cyan-500/15 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30">
                  {categoryLabels?.[tool.category] || tool.category}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                {tool.name}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tool.description}</p>
            </div>
          </div>

          {/* Interactive Star Favorite Action */}
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
          <div className="flex-shrink-0 sm:self-start">
            <ToolPageTracker slug={tool.slug} name={tool.name} />
          </div>
        </div>
      </div>

      {/* Tool Interactive Workplace Box */}
<<<<<<< HEAD
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
=======
      <div className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
        <ToolRenderer slug={tool.slug} />
      </div>

      {/* 3-Step Guide and Accordion FAQ */}
      <ToolGuideAndFaq tool={tool} />

      {/* Related tools */}
      {related.length > 0 && (
<<<<<<< HEAD
        <div className="space-y-4 mt-12 pt-8 border-t border-slate-200">
          <h2 className="font-heading text-lg font-bold text-slate-900">
=======
        <div className="space-y-4 mt-12 pt-8 border-t border-slate-200 dark:border-[#1f2e42]">
          <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((relTool) => (
              <Link
                key={relTool.slug}
                href={`/tools/${relTool.slug}`}
<<<<<<< HEAD
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-4 transition-all group shadow-xs"
=======
                className="bg-white dark:bg-[#131d2b] border border-slate-200 dark:border-[#223247] hover:border-blue-500 dark:hover:border-cyan-500 rounded-2xl p-4 transition-all group shadow-xs"
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
              >
                <div className="flex items-center gap-3">
                  {relTool.icon && <span className="text-xl flex-shrink-0">{relTool.icon}</span>}
                  <div className="flex-1 min-w-0">
<<<<<<< HEAD
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {relTool.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{relTool.description}</div>
=======
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                      {relTool.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{relTool.description}</div>
>>>>>>> 53844a0fad2b165a89f707b67cb1f34bd1c212a6
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

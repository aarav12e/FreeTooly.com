export default function ToolCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full animate-pulse">
      <div>
        {/* Banner skeleton */}
        <div className="w-full aspect-square rounded-xl bg-slate-100 mb-5" />

        {/* Badge skeleton */}
        <div className="h-5 w-24 rounded-md bg-slate-100 mb-3" />

        {/* Title skeleton */}
        <div className="h-6 w-3/4 rounded bg-slate-100 mb-2" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="h-4 w-16 rounded bg-slate-100" />
      </div>
    </div>
  );
}

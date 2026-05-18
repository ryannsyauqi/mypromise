export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse pb-20 select-none">
      {/* Header Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 md:px-2">
        <div className="lg:col-span-7 space-y-3">
          <div className="h-9 w-52 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-4 w-80 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-slate-100 rounded-md"></div>
            <div className="h-6 w-12 bg-slate-200/70 rounded-lg"></div>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full"></div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left main content block skeleton */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/80 border border-slate-100/80 p-8 rounded-[32px] space-y-7 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/60">
              <div className="h-6 w-40 bg-slate-200/70 rounded-xl"></div>
              <div className="h-4 w-12 bg-slate-100 rounded-md"></div>
            </div>
            
            {/* Repeated rows */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-[22px] bg-slate-200/70 shrink-0"></div>
                <div className="flex-grow space-y-3 pt-1">
                  <div className="h-5 w-1/3 bg-slate-200/70 rounded-lg"></div>
                  <div className="h-4 w-5/6 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right card block skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 border border-slate-100/80 p-8 rounded-[32px] space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-slate-200/70 rounded-[24px]"></div>
            <div className="space-y-3">
              <div className="h-6 w-2/3 bg-slate-200/70 rounded-xl"></div>
              <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
              <div className="h-4 w-5/6 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-12 w-full bg-slate-200/70 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Admin Sidebar - Dark Theme for distinction */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              MyPromise <span className="text-rose-500 font-black">HQ</span>
            </span>
          </Link>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Operator Console</p>
        </div>

        <nav className="flex-grow p-6 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white font-bold rounded-xl text-sm"
          >
            <span>📊</span> Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl text-sm font-medium"
          >
            <span>🛍️</span> Pesanan
          </Link>
          <Link
            href="/admin/templates"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl text-sm font-medium"
          >
            <span>🎨</span> Katalog Template
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all rounded-xl text-sm font-medium"
          >
            <span>⚙️</span> Pengaturan
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <Link href="/" className="w-full px-4 py-3 text-left text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-3">
            <span>←</span> Back to Web
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <div className="flex-grow flex flex-col">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">/</span>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Administrator Overview</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Operator One</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Main Controller</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              👤
            </div>
          </div>
        </header>

        <main className="p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

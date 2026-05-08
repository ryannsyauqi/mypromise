import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-cream-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-cream-100">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              <span className="gradient-text">My</span>Promise
            </span>
          </Link>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-500 font-bold rounded-xl text-sm"
          >
            <span>🏠</span> Beranda
          </Link>
          <Link
            href="/dashboard/invitation"
            className="flex items-center gap-3 px-4 py-3 text-charcoal-500 hover:bg-cream-50 hover:text-charcoal-800 transition-all rounded-xl text-sm font-medium"
          >
            <span>✨</span> Edit Undangan
          </Link>
          <Link
            href="/dashboard/guests"
            className="flex items-center gap-3 px-4 py-3 text-charcoal-500 hover:bg-cream-50 hover:text-charcoal-800 transition-all rounded-xl text-sm font-medium"
          >
            <span>👥</span> Daftar Tamu
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 px-4 py-3 text-charcoal-500 hover:bg-cream-50 hover:text-charcoal-800 transition-all rounded-xl text-sm font-medium"
          >
            <span>💳</span> Pembayaran
          </Link>
        </nav>

        <div className="p-6 border-t border-cream-100">
          <button className="w-full px-4 py-3 text-left text-charcoal-400 hover:text-rose-500 transition-colors text-sm font-medium flex items-center gap-3">
            <span>🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Topbar Mobile */}
        <header className="md:hidden bg-white border-b border-cream-200 p-4 flex justify-between items-center">
          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>MyPromise</span>
          <button className="p-2">☰</button>
        </header>

        <main className="p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

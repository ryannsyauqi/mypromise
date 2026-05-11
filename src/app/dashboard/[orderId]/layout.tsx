"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  ),
  Guests: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Billing: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const orderId = params.orderId as string;
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      // For public dashboard, we fetch the order details instead of auth user
      const { data: order } = await supabase
        .from('orders')
        .select('buyer_name')
        .eq('id', orderId)
        .single();
      
      if (order) {
        setUser({
          display_name: order.buyer_name || "User"
        });
      }
    }
    if (orderId) loadUser();
  }, [supabase, orderId]);

  const nickname = user?.display_name?.split(' ')[0] || "Mempelai";

  const navItems = [
    { name: "Beranda", href: `/dashboard/${orderId}`, icon: Icons.Home },
    { name: "Edit Undangan", href: `/dashboard/${orderId}/invitation`, icon: Icons.Edit },
    { name: "Daftar Tamu", href: `/dashboard/${orderId}/guests`, icon: Icons.Guests },
    { name: "Pembayaran", href: `/dashboard/${orderId}/billing`, icon: Icons.Billing },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-cream-200 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 border-b border-cream-100 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              <span className="gradient-text">My</span>Promise
            </span>
          </Link>
        </div>

        <div className="p-6">
          <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Icons.User />
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selamat Datang</p>
              <p className="text-sm font-bold text-charcoal-900 truncate">{nickname}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all rounded-2xl text-[11px] uppercase tracking-widest font-black ${
                    isActive 
                      ? "bg-rose-50 text-rose-500 shadow-sm border border-rose-100/50" 
                      : "text-charcoal-400 hover:bg-slate-50 hover:text-charcoal-800"
                  }`}
                >
                  <Icon /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-cream-100">
          <Link href="/" className="w-full px-5 py-4 text-left text-charcoal-400 hover:text-rose-500 transition-all text-[11px] uppercase tracking-widest font-black flex items-center gap-3 hover:bg-rose-50 rounded-2xl">
            <Icons.Logout /> Kembali ke Beranda
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Topbar Mobile */}
        <header className="lg:hidden bg-white border-b border-cream-200 p-4 flex justify-between items-center sticky top-0 z-50">
          <span className="font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>MyPromise</span>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
              {nickname[0]}
            </div>
            <button className="p-2 text-charcoal-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>

        <main className="p-6 md:p-12 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

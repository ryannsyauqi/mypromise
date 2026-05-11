"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardRedirect() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mx-auto">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Akses Terbatas</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Silakan gunakan link dashboard personal yang telah dikirimkan melalui WhatsApp setelah Anda melakukan pemesanan.
        </p>
        <div className="pt-4">
          <Link href="/" className="inline-block px-8 py-4 bg-charcoal-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-rose-500 transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

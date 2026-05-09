"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .limit(1)
        .single();
      
      if (data) setInvitation(data);
      setLoading(false);
    }
    loadDashboardData();
  }, [supabase]);
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Halo, Budi & Ayu!
        </h1>
        <p className="text-charcoal-400 mt-2">Selamat datang di dashboard MyPromise. Mari buat undangan impian Anda.</p>
      </div>

      {/* Stats / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
          <p className="text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-2">Status Pesanan</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage-500"></span>
            <p className="text-lg font-bold text-charcoal-800">Lunas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
          <p className="text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-2">Template</p>
          <p className="text-lg font-bold text-charcoal-800">Minimalist Elegance</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
          <p className="text-xs font-bold text-charcoal-400 uppercase tracking-widest mb-2">Masa Aktif</p>
          <p className="text-lg font-bold text-charcoal-800">365 Hari Lagi</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Card */}
        <div className="bg-white p-8 rounded-[40px] border border-cream-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>Persiapan Undangan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-600 font-medium">Data Mempelai</span>
              <span className="text-xs font-bold text-sage-500 uppercase tracking-widest">Selesai</span>
            </div>
            <div className="w-full h-2 bg-cream-50 rounded-full overflow-hidden">
              <div className="w-full h-full bg-sage-400"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-600 font-medium">Detail Acara</span>
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">Proses</span>
            </div>
            <div className="w-full h-2 bg-cream-50 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-gold-400"></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-600 font-medium">Galeri Foto</span>
              <span className="text-xs font-bold text-charcoal-300 uppercase tracking-widest">Belum</span>
            </div>
            <div className="w-full h-2 bg-cream-50 rounded-full overflow-hidden">
              <div className="w-0 h-full bg-rose-400"></div>
            </div>
          </div>

          <Link
            href="/dashboard/invitation"
            className="block w-full py-4 bg-rose-500 text-white font-bold rounded-2xl text-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-900/10"
          >
            Lanjutkan Mengisi Data
          </Link>
        </div>

        {/* Preview Card */}
        <div className="bg-charcoal-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Lihat Undangan</h2>
            <p className="text-white/50 text-sm">Lihat tampilan sementara undangan digital Anda.</p>
          </div>

          <div className="relative z-10 pt-12">
            <Link
              href={invitation ? `/invitation/${invitation.slug}` : "/demo/minimalist-elegance"}
              target="_blank"
              className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all"
            >
              {invitation ? "Buka Undangan Anda" : "Buka Live Preview"}
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

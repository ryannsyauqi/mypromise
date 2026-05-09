"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function DashboardPage() {
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      // Get the latest invitation and related order/template
      const { data: invitationData, error } = await supabase
        .from('invitations')
        .select('*, orders(*, templates(*))')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (invitationData) {
        setData(invitationData);
      }
      setLoading(false);
    }
    loadDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const order = data?.orders;
  const template = order?.templates;
  const content = data?.content || {};
  
  // Calculate progress
  const totalFields = 10; // Basic target
  const filledFields = Object.keys(content).length;
  const progressPercent = Math.min(Math.round((filledFields / totalFields) * 100), 100);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 block">Dashboard Overview</span>
        <h1 className="text-4xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
          Halo, {order?.buyer_name || "Mempelai"}!
        </h1>
        <p className="text-slate-500 mt-3 font-medium">Selamat datang kembali. Mari selesaikan persiapan hari bahagia kamu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Status Pesanan</p>
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${order?.payment_status === 'paid' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
            <p className="text-xl font-black text-charcoal-900 uppercase tracking-tight">
              {order?.payment_status === 'paid' ? 'Sudah Lunas' : 'Menunggu'}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Template Dipilih</p>
          <p className="text-xl font-black text-charcoal-900 uppercase tracking-tight truncate">
            {template?.name || "Premium Design"}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Masa Aktif</p>
          <p className="text-xl font-black text-charcoal-900 uppercase tracking-tight">365 Hari Lagi</p>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Persiapan Undangan</h2>
            <span className="text-[10px] font-black px-4 py-1.5 bg-rose-50 text-rose-500 rounded-full uppercase tracking-widest border border-rose-100/50">
              {progressPercent}% Complete
            </span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-charcoal-800">Data Mempelai & Acara</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{progressPercent > 70 ? 'Selesai' : 'Belum Lengkap'}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 p-0.5">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tamu Diundang</p>
                <p className="text-xl font-black text-charcoal-900">0</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Konfirmasi RSVP</p>
                <p className="text-xl font-black text-charcoal-900">0</p>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/invitation"
            className="mt-10 block w-full py-5 bg-charcoal-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl text-center hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-charcoal-900/10"
          >
            Lanjutkan Mengisi Data
          </Link>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 bg-rose-500 p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between group min-h-[400px]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60 mb-3 block">Real-time Preview</span>
            <h2 className="text-white text-3xl font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Lihat Undangan Kamu
            </h2>
            <p className="text-white/60 text-sm mt-4 leading-relaxed font-medium">
              Cek hasil sementara undangan digital kamu yang sedang dikerjakan.
            </p>
          </div>

          <div className="relative z-10">
            <Link
              href={data ? `/invitation/${data.slug}` : "/demo/minimalist-elegance"}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all duration-500 shadow-2xl shadow-rose-900/20"
            >
              Buka Live Preview
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

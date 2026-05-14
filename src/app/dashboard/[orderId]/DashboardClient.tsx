"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DashboardClient({ initialData, orderId }: { initialData: any, orderId: string }) {
  const [data, setData] = useState<any>(initialData);
  const [stats, setStats] = useState({ 
    totalGuests: initialData?.guests?.length || 0, 
    rsvpCount: initialData?.guests?.filter((g: any) => g.status === 'hadir').length || 0 
  });

  const order = data?.orders;
  const template = order?.templates;
  const content = data?.content || {};
  const fieldSchema = template?.field_schema || [];
  
  // Calculate progress based on schema
  const requiredFields = fieldSchema.filter((f: any) => f.required);
  const totalRequired = requiredFields.length || 1;
  const filledRequired = requiredFields.filter((f: any) => {
    const val = content[f.key];
    return val && val.toString().trim() !== "";
  }).length;
  
  const progressPercent = Math.min(Math.round((filledRequired / totalRequired) * 100), 100);

  // Calculate Active Period
  const getRemainingDays = () => {
    if (!order?.created_at) return "365 Hari";
    const createdDate = new Date(order.created_at);
    const expiryDate = new Date(createdDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity
    
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? `${diffDays} Hari` : "Expired";
  };

  // Extract Nickname
  const nickname = order?.buyer_name ? order.buyer_name.split(' ')[0] : "Mempelai";

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 block">Dashboard Overview</span>
        <h1 className="text-4xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
          Halo, {nickname}!
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
          <p className="text-xl font-black text-charcoal-900 uppercase tracking-tight">{getRemainingDays()}</p>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Persiapan Undangan</h2>
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
              progressPercent === 100 ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' : 'bg-rose-50 text-rose-500 border-rose-100/50'
            }`}>
              {progressPercent}% Selesai
            </span>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-charcoal-800">Data Mempelai & Acara</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{progressPercent === 100 ? 'Selesai' : 'Belum Lengkap'}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tamu Diundang</p>
                <p className="text-xl font-black text-charcoal-900">{stats.totalGuests}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Konfirmasi RSVP</p>
                <p className="text-xl font-black text-charcoal-900">{stats.rsvpCount}</p>
              </div>
            </div>
          </div>

          <Link
            href={`/dashboard/${orderId}/invitation`}
            className="mt-10 block w-full py-5 bg-charcoal-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl text-center hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-charcoal-900/10"
          >
            {progressPercent === 100 ? "Update Data Undangan" : "Lanjutkan Mengisi Data"}
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
            {data?.slug ? (
              <Link
                href={`/${data.slug}`}
                target="_blank"
                className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 transition-all duration-500 shadow-2xl shadow-rose-900/20"
              >
                Buka Live Preview
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            ) : (
              <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                Slug belum diatur
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  // Logic for each step's completion
  const isStep1Done = progressPercent === 100; // Based on required fields
  const isStep2Done = data?.content?.is_slug_customized === true;
  const isStep3Done = stats.totalGuests > 0;
  const isStep4Done = isStep1Done && isStep2Done && isStep3Done;

  // New Granular Global Progress calculation (3 steps)
  // Step 1 contributes based on its actual percentage (0-100%)
  // Step 2 and 3 are binary (0 or 100%)
  const step1Weight = progressPercent / 100;
  const step2Weight = isStep2Done ? 1 : 0;
  const step3Weight = isStep3Done ? 1 : 0;

  const overallProgress = Math.round(((step1Weight + step2Weight + step3Weight) / 3) * 100);
  const activeStep = !isStep1Done ? 1 : !isStep2Done ? 2 : !isStep3Done ? 3 : 4;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Minimalist Header Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 md:px-2">
        <div className="lg:col-span-7 space-y-1">
          <h1 className="text-4xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            Halo, {nickname}
          </h1>
          <p className="text-slate-500 font-medium text-sm">Lengkapi data untuk mengaktifkan website undanganmu.</p>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-charcoal-900 uppercase tracking-[0.2em] opacity-50">Progres Persiapan</span>
            <span className="text-base font-black text-rose-500">{overallProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-rose-500/20"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Roadmap Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative">
            <div className="absolute left-8 top-12 bottom-12 w-[1px] bg-slate-100"></div>

            <div className="space-y-6">
              {[
                { step: 1, title: "Lengkapi Data Mempelai", desc: "Nama, jadwal acara, lokasi, galeri foto dan lain-lain.", href: `/dashboard/${orderId}/invitation`, done: isStep1Done, disabled: false },
                { step: 2, title: "Kustomisasi Link", desc: "Edit link website kamu disini (ex: mypromise.id/niafahmiforever).", href: `/dashboard/${orderId}/settings`, done: isStep2Done, disabled: !isStep1Done },
                { step: 3, title: "Kelola Tamu & Bagikan Undangan", desc: "Tambah daftar tamu dan mulai sebarkan undangan kamu.", href: `/dashboard/${orderId}/guests`, done: isStep3Done, disabled: !isStep2Done }
              ].map((item) => {
                const isActive = item.step === activeStep;

                return (
                  <div key={item.step} className="relative flex gap-6 group transition-all duration-500">
                    <div className={`w-16 h-16 rounded-[24px] flex-shrink-0 flex items-center justify-center font-black text-lg transition-all duration-500 z-10 border-4 ${item.done || isActive ? 'bg-rose-500 border-rose-100 text-white shadow-xl shadow-rose-500/10' :
                      'bg-white border-slate-100 text-slate-300'
                      }`}>
                      {item.done ? (
                        <svg className="w-6 h-6 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : item.step}
                    </div>

                    {!item.disabled ? (
                      <Link href={item.href} className={`flex-grow bg-white p-7 rounded-[32px] border transition-all duration-500 relative ${isActive ? 'border-rose-500 shadow-xl shadow-rose-500/5 ring-1 ring-rose-500/10' : 'border-slate-100 shadow-sm'
                        } hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/[0.04]`}>
                        {isActive && (
                          <div className="absolute -top-3 left-8 px-3 py-1 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-500/20 animate-bounce">
                            TODO
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <div className="space-y-1">
                            <h3 className={`text-lg font-bold transition-colors ${item.done ? 'text-charcoal-900' : isActive ? 'text-rose-500' : 'text-slate-400'}`}>
                              {item.title}
                            </h3>
                            {item.step === 1 && !item.done && (
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-rose-400" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">{progressPercent}%</span>
                              </div>
                            )}
                          </div>
                          <svg className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${item.done || isActive ? 'text-rose-500' : 'text-slate-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </Link>
                    ) : (
                      <div className={`flex-grow bg-white p-7 rounded-[32px] border shadow-sm transition-all duration-500 ${item.done ? 'border-rose-200 shadow-xl shadow-rose-500/[0.04]' : 'border-slate-100'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-lg font-bold ${item.done ? 'text-charcoal-900' : 'text-slate-400'}`}>{item.title}</h3>
                          <div className="w-5 h-5"></div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-rose-500 p-10 rounded-[48px] shadow-2xl shadow-rose-500/20 relative overflow-hidden flex flex-col justify-between min-h-[420px] group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/10 backdrop-blur-md">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.102-1.101" />
                </svg>
              </div>
              <h2 className="text-white text-4xl font-bold leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Cek Hasil Undangan
              </h2>
            </div>

            <div className="relative z-10 space-y-4">
              {data?.slug && overallProgress === 100 ? (
                <Link
                  href={`/${data.slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-white w-full py-5 rounded-2xl text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-2xl shadow-rose-900/20"
                >
                  Lihat Undangan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 bg-white/20 w-full py-5 rounded-2xl text-white/40 font-black uppercase tracking-[0.2em] text-[10px] cursor-not-allowed border border-white/10 backdrop-blur-sm">
                    Preview Undangan
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-center text-white/50 font-bold uppercase tracking-widest leading-relaxed">
                    Selesaikan semua langkah untuk melihat preview undangan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Icons = {
  Guests: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
};

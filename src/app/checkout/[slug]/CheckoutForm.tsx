"use client";

import { useState } from "react";
import { Template } from "@/lib/types";

interface CheckoutFormProps {
  template: Template;
}

export default function CheckoutForm({ template }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);
  const lifetimePrice = 19000;
  const finalAmount = template.price + (isLifetime ? lifetimePrice : 0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          templateSlug: template.slug,
          amount: finalAmount,
          customerDetails: formData,
          isLifetime: isLifetime,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // CASE 1: SIMULATOR MODE
      if (data.isSimulator) {
        console.log("Simulating success...");
        setTimeout(() => {
          window.location.href = `/checkout/success?order_id=${data.orderId}`;
        }, 1000);
        return;
      }

      // CASE 2: REAL MIDTRANS
      // @ts-ignore
      if (window.snap) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            window.location.href = `/checkout/success?order_id=${data.orderId}`;
          },
          onError: function (result: any) {
            alert("Pembayaran gagal, silakan coba lagi.");
            setLoading(false);
          },
          onClose: function () {
            alert("Anda menutup jendela pembayaran.");
            setLoading(false);
          },
        });
      } else {
        throw new Error("Midtrans Snap not loaded");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || "Gagal memproses pesanan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Summary Section - First on Mobile */}
      <div className="w-full lg:col-span-5 lg:order-2 lg:sticky lg:top-32 animate-fade-in">
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
          <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Ringkasan Order</h2>

          <div className="flex gap-4 md:gap-5 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-50">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
              <img
                src={template.thumbnail_url || "/images/placeholder.png"}
                alt={template.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">{template.category}</span>
              <h3 className="text-lg md:text-xl font-bold leading-tight text-charcoal-900">{template.name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-[11px] md:text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Harga</span>
              <span className={`font-bold text-charcoal-700 ${template.original_price && template.original_price > template.price ? 'line-through text-slate-300' : ''}`}>
                Rp {((template.original_price && template.original_price > template.price) ? template.original_price : template.price).toLocaleString("id-ID")}
              </span>
            </div>

            {template.original_price && template.original_price > template.price && (
              <div className="flex justify-between items-center text-[11px] md:text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Diskon</span>
                <span className="text-rose-500 font-black">
                  - Rp {(template.original_price - template.price).toLocaleString("id-ID")}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-[11px] md:text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Biaya Layanan</span>
              <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">Gratis</span>
            </div>

            {isLifetime && (
              <div className="flex justify-between items-center text-[11px] md:text-xs text-rose-600 font-bold animate-fade-in">
                <span className="uppercase tracking-wider">Masa Aktif Selamanya</span>
                <span>+ Rp 19.000</span>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Bayar</span>
              <span className="text-2xl md:text-3xl font-black text-rose-500 transition-all duration-300" style={{ fontFamily: "var(--font-playfair)" }}>
                Rp {finalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:col-span-7 lg:order-1">
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 lg:p-12 shadow-xl shadow-charcoal-900/[0.02] border border-slate-100">
          <div className="flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Data Pembeli</h2>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium">Lengkapi data untuk pengiriman tautan undangan.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="name" className="flex items-center gap-2 text-[10px] font-black text-charcoal-400 uppercase tracking-[0.2em] mb-2.5 transition-colors group-focus-within:text-rose-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap kamu"
                  className="w-full px-6 py-4 sm:py-5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="flex items-center gap-2 text-[10px] font-black text-charcoal-400 uppercase tracking-[0.2em] mb-2.5 transition-colors group-focus-within:text-rose-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Aktif
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className="w-full px-6 py-4 sm:py-5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
                />
              </div>

              <div className="group">
                <label htmlFor="phone" className="flex items-center gap-2 text-[10px] font-black text-charcoal-400 uppercase tracking-[0.2em] mb-2.5 transition-colors group-focus-within:text-rose-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-400 font-black text-sm">+62</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="812xxxxxxx"
                    className="w-full pl-16 pr-6 py-4 sm:py-5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
                  />
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-slate-400 leading-relaxed font-medium">
                  <svg className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  Link pengisian data mempelai akan dikirim otomatis ke email, pastikan email aktif dan tidak typo.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className={`cursor-pointer group flex items-start gap-4 p-5 md:p-6 rounded-[24px] border-2 transition-all duration-300 ${
                isLifetime ? 'bg-rose-50 border-rose-500 shadow-lg shadow-rose-500/10' : 'bg-white border-cream-200 hover:border-rose-200'
              }`}>
                <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isLifetime ? 'border-rose-500 bg-rose-500 text-white' : 'border-slate-300 text-transparent group-hover:border-rose-300'
                }`}>
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isLifetime} 
                  onChange={(e) => setIsLifetime(e.target.checked)} 
                />
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className={`font-bold text-sm md:text-base ${isLifetime ? 'text-rose-600' : 'text-charcoal-900'}`}>Masa Aktif Selamanya</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+ Rp 19.000</span>
                  </div>
                  <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed">
                    Default aktif 365 hari. Upgrade agar link undangan kamu bisa dikenang selamanya tanpa batas waktu kadaluarsa.
                  </p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-2xl hover:bg-rose-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rose-900/10 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Bayar Rp {finalAmount.toLocaleString("id-ID")}
                  <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 px-4 pb-8 lg:pb-0">
          {[
            { label: "Secure Payment", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { label: "Fast Process", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { label: "Premium Quality", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={badge.icon} />
                </svg>
              </div>
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-slate-400">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Template } from "@/lib/types";

interface CheckoutFormProps {
  template: Template;
}

export default function CheckoutForm({ template }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
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
          amount: template.price,
          customerDetails: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      // CASE 1: SIMULATOR MODE
      if (data.isSimulator) {
        console.log("Simulating success...");
        // Wait a bit to show loading
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
            className="w-full px-6 py-4.5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
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
            className="w-full px-6 py-4.5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
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
              className="w-full pl-16 pr-6 py-4.5 rounded-2xl border border-cream-200 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-cream-50/20 font-bold text-charcoal-800 placeholder:text-charcoal-300 placeholder:font-medium"
            />
          </div>
          <div className="mt-3 flex items-start gap-2 text-[10px] text-charcoal-400 leading-relaxed font-medium uppercase tracking-wider">
            <svg className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            Tautan pengisian konten akan dikirim ke nomor ini.
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full py-5 bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-rose-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rose-900/10 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            Processing
          </>
        ) : (
          <>
            Lanjutkan Pembayaran
            <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

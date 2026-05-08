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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Budi Pratama"
            className="w-full px-5 py-4 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-cream-50/30 font-medium"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="budi@example.com"
            className="w-full px-5 py-4 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-cream-50/30 font-medium"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Nomor WhatsApp
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 font-medium">+62</span>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="81234567890"
              className="w-full pl-16 pr-5 py-4 rounded-xl border border-cream-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-cream-50/30 font-medium"
            />
          </div>
          <p className="mt-2 text-[11px] text-charcoal-400 leading-relaxed uppercase tracking-wider">
            Pastikan nomor WhatsApp aktif untuk menerima link pengisian konten.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rose-900/10 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Memproses...
          </>
        ) : (
          `Bayar Rp ${(template.price / 1000).toFixed(0)}k Sekarang`
        )}
      </button>
    </form>
  );
}

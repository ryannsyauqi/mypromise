"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function BillingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const supabase = createClient();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      const { data } = await supabase
        .from('orders')
        .select('*, templates(*)')
        .eq('id', orderId)
        .single();
      
      if (data) setOrder(data);
      setLoading(false);
    }
    loadOrder();
  }, [supabase, orderId]);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return (
    <div className="text-center p-20">
      <p className="text-slate-400">Data pembayaran tidak ditemukan.</p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Detail Pembayaran
        </h1>
        <p className="text-charcoal-400 mt-2">Riwayat transaksi dan status pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02] overflow-hidden">
            <div className="p-10 border-b border-slate-50">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">ID Pesanan</p>
                  <p className="font-bold text-charcoal-900">#{order.order_number}</p>
                </div>
                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'
                }`}>
                  {order.payment_status === 'paid' ? 'Lunas' : 'Menunggu Pembayaran'}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Template</span>
                  <span className="text-charcoal-900 font-bold">{order.templates?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">Tanggal Transaksi</span>
                  <span className="text-charcoal-900 font-bold">{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-charcoal-900 font-black uppercase tracking-widest text-xs">Total Pembayaran</span>
                  <span className="text-2xl font-black text-rose-500">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/30">
              <h3 className="text-sm font-bold text-charcoal-900 mb-4">Informasi Pembeli</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nama</p>
                  <p className="text-sm font-bold text-charcoal-800">{order.buyer_name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                  <p className="text-sm font-bold text-charcoal-800">{order.buyer_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-charcoal-900 rounded-[40px] p-10 text-white space-y-6">
            <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Butuh Bantuan?</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Jika ada kendala dalam pembayaran atau ingin menanyakan detail pesanan, jangan ragu untuk menghubungi tim support kami.
            </p>
            <button className="w-full py-4 bg-white text-charcoal-900 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-500">
              Hubungi Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

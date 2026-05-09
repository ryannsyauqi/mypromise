"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function BillingPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBillingData() {
      const { data, error } = await supabase
        .from('orders')
        .select('*, templates(name)')
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
      setLoading(false);
    }
    loadBillingData();
  }, [supabase]);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-10">
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 block">Financial Overview</span>
        <h1 className="text-4xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
          Riwayat Pembayaran
        </h1>
        <p className="text-slate-500 mt-3 font-medium text-sm">Pantau status transaksi dan riwayat pembelian kamu.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tanggal</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Template</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Bayar</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-medium">Belum ada riwayat transaksi.</td>
                </tr>
              ) : (
                orders.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.order_number}</span>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-charcoal-800">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-charcoal-800">{tx.templates?.name || "Premium Design"}</td>
                    <td className="px-10 py-6 text-sm font-black text-rose-500">Rp {tx.amount.toLocaleString("id-ID")}</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                        tx.payment_status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                          : 'bg-amber-50 text-amber-600 border-amber-100/50'
                      }`}>
                        {tx.payment_status === 'paid' ? 'Lunas' : 'Tertunda'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

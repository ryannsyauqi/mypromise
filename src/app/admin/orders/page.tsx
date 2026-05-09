"use client";

import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/admin/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        if (data.orders) setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Fetching Orders...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Semua Pesanan</h1>
          <p className="text-slate-500 mt-2 font-medium">Data real-time dari seluruh customer.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order & Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kontak</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">Belum ada transaksi di database.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-bold text-slate-400 mb-1">{order.order_number}</span>
                        <span className="font-bold text-slate-900 text-sm">{order.buyer_name}</span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase font-medium">
                          {new Date(order.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{order.templates?.name || "Template Unknown"}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter mt-0.5">/{order.templates?.slug || "unknown"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                          <span className="opacity-50">📧</span> {order.buyer_email}
                        </span>
                        <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                          <span className="opacity-50">📱</span> +62 {order.buyer_phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {order.payment_status}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                          {order.order_status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-sm font-black text-slate-900">Rp {order.amount.toLocaleString("id-ID")}</span>
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

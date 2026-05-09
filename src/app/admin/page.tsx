"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) throw new Error("Failed to fetch admin stats");
        
        const data = await response.json();
        const { orderCount, totalRevenue, recentOrders: orders } = data;

        setStats([
          { label: "Total Omzet", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, change: "+100%", icon: "💰" },
          { label: "Total Pesanan", value: orderCount || 0, change: "New", icon: "🛒" },
          { label: "Undangan Aktif", value: orderCount || 0, change: "New", icon: "✨" },
          { label: "Rata-rata Order", value: totalRevenue ? `Rp ${(totalRevenue / (orderCount || 1)).toLocaleString("id-ID")}` : "0", change: "New", icon: "📈" },
        ]);

        if (orders) setRecentOrders(orders);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Loading HQ Data...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          HQ Overview
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Data real-time dari database MyPromise.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-rose-500 group-hover:scale-110 transition-all duration-500">
                {stat.icon}
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-500 p-8 rounded-[40px] text-white flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-xl shadow-rose-500/20" onClick={() => window.location.href='/admin/orders'}>
          <div>
            <span className="text-3xl">📦</span>
            <h3 className="text-xl font-black mt-4">Kelola Pesanan</h3>
            <p className="text-rose-100 text-xs font-medium mt-1">Cek pembayaran & detail customer</p>
          </div>
          <span className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1 rounded-full">Go to Orders →</span>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-between hover:scale-[1.02] transition-transform cursor-pointer shadow-xl shadow-slate-900/20" onClick={() => window.location.href='/admin/templates'}>
          <div>
            <span className="text-3xl">🎨</span>
            <h3 className="text-xl font-black mt-4">Edit Katalog</h3>
            <p className="text-slate-400 text-xs font-medium mt-1">Update harga & status template</p>
          </div>
          <span className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 w-fit px-3 py-1 rounded-full">Go to Catalog →</span>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-[40px] text-slate-900 flex flex-col justify-between hover:border-slate-300 transition-all cursor-pointer shadow-sm" onClick={() => window.location.href='/'}>
          <div>
            <span className="text-3xl">🌐</span>
            <h3 className="text-xl font-black mt-4">Lihat Website</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Buka landing page utama</p>
          </div>
          <span className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-500 w-fit px-3 py-1 rounded-full">View Site ↗</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest">Pesanan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer & Template</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic">Belum ada pesanan masuk.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500">{order.order_number}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{order.buyer_name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          {order.templates?.name || "Unknown Template"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-gold-50 text-gold-600'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 text-right">Rp {order.amount.toLocaleString("id-ID")}</td>
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

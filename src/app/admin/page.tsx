"use client";

import { useState, useEffect } from "react";

const Icons = {
  Revenue: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
    </svg>
  ),
  Orders: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  Active: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ),
  Average: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 17.07z"/>
    </svg>
  ),
};

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
          { label: "Total Omzet", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, change: "+100%", icon: <Icons.Revenue /> },
          { label: "Total Pesanan", value: orderCount || 0, change: "New", icon: <Icons.Orders /> },
          { label: "Undangan Aktif", value: orderCount || 0, change: "New", icon: <Icons.Active /> },
          { label: "Rata-rata Order", value: totalRevenue ? `Rp ${(totalRevenue / (orderCount || 1)).toLocaleString("id-ID")}` : "0", change: "New", icon: <Icons.Average /> },
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

  if (loading) return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header Skeleton */}
      <div className="flex justify-between items-end">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-3"></div>
        </div>
        <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 animate-pulse"></div>
              <div className="h-6 w-12 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-3 w-24 bg-slate-100 rounded mb-3 animate-pulse"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table Skeleton */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
        <div className="p-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-6 w-48 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            HQ Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Data real-time dari database MyPromise.</p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-inner">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Pesanan Terbaru</h2>
          <button 
            onClick={() => window.location.href='/admin/orders'}
            className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-4 py-2 rounded-full transition-colors"
          >
            Lihat Semua →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer & Template</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl opacity-20">📭</span>
                      <p className="text-sm">Belum ada pesanan masuk.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6 text-xs font-mono font-bold text-slate-500">{order.order_number}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{order.buyer_name}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          {order.templates?.name || "Unknown Template"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-900 text-right">Rp {order.amount.toLocaleString("id-ID")}</td>
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


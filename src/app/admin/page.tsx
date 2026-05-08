"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminPage() {
  const supabase = createClient();
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      // 1. Fetch Orders Count
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch Total Revenue
      const { data: revenueData } = await supabase
        .from('orders')
        .select('amount')
        .eq('status', 'paid');
      
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // 3. Fetch Recent Orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats([
        { label: "Total Omzet", value: `Rp ${totalRevenue.toLocaleString("id-ID")}`, change: "+100%", icon: "💰" },
        { label: "Total Pesanan", value: orderCount || 0, change: "New", icon: "🛒" },
        { label: "Undangan Aktif", value: orderCount || 0, change: "New", icon: "✨" },
        { label: "Rata-rata Order", value: totalRevenue ? `Rp ${(totalRevenue / (orderCount || 1)).toLocaleString("id-ID")}` : "0", change: "New", icon: "📈" },
      ]);

      if (orders) setRecentOrders(orders);
      setLoading(false);
    }

    loadAdminData();
  }, [supabase]);

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
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
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
                    <td className="px-8 py-5 text-xs font-mono font-bold text-slate-500">{order.id}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{order.buyer_name}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-gold-50 text-gold-600'}`}>
                        {order.status}
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

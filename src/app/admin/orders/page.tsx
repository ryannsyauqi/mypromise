"use client";

import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all"); // all, paid, pending
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, amount-high, amount-low

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

  // Derived filtered and sorted orders
  const filteredOrders = orders
    .filter((o) => {
      const matchesSearch = o.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           o.buyer_email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPayment = paymentFilter === "all" || 
                           (paymentFilter === "paid" && o.payment_status === "paid") || 
                           (paymentFilter === "pending" && o.payment_status !== "paid");
      return matchesSearch && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "amount-low") return a.amount - b.amount;
      return 0;
    });

  if (loading) return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-3"></div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="p-8 space-y-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-100 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Semua Pesanan</h1>
          <p className="text-slate-500 mt-2 font-medium">Data real-time dari seluruh customer.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari pesanan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-rose-500 w-full sm:w-64 transition-all"
            />
            <svg className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="paid">Sudah Bayar</option>
            <option value="pending">Pending</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="amount-high">Total Tertinggi</option>
            <option value="amount-low">Total Terendah</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. Order</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                    {searchQuery || paymentFilter !== "all" ? "Tidak ada pesanan yang sesuai filter." : "Belum ada transaksi di database."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-6">
                      <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter">#{order.order_number}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{order.buyer_name}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 uppercase font-medium">
                          {new Date(order.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-slate-800 whitespace-nowrap">{order.templates?.name || "Template"}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[11px] text-slate-500 font-medium lowercase">{order.buyer_email}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[11px] text-slate-500 font-medium">+62 {order.buyer_phone}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                        {order.order_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-sm font-black text-slate-900 whitespace-nowrap">Rp {order.amount.toLocaleString("id-ID")}</span>
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

"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, amount-high, amount-low
  const [activeTab, setActiveTab] = useState<"paid" | "pending">("paid");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const isFilterActive = 
    searchQuery !== "" || 
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
  };

  const getWhatsAppLink = (buyerName: string, orderNumber: string, amount: number, phone: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 5) {
      cleanPhone = '62' + cleanPhone;
    }
    const text = `Halo ${buyerName}, terima kasih telah memesan undangan di MyPromise! Kami menginfokan bahwa pesanan Anda #${orderNumber} sebesar Rp ${amount.toLocaleString('id-ID')} masih berstatus pending. Silakan selesaikan pembayaran agar kami dapat langsung mengaktifkan undangan Anda. Hubungi kami jika ada kendala. Terima kasih!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

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
                           o.buyer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (o.buyer_phone && o.buyer_phone.includes(searchQuery));
      
      const matchesPayment = activeTab === "paid" ? o.payment_status === "paid" : o.payment_status !== "paid";

      return matchesSearch && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "amount-high") return b.amount - a.amount;
      if (sortBy === "amount-low") return a.amount - b.amount;
      return 0;
    });

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const sheetData = filteredOrders.map((o) => ({
      "No. Order": o.order_number,
      "Tanggal & Waktu": new Date(o.created_at).toLocaleString("id-ID"),
      "Nama Lengkap": o.buyer_name,
      "WhatsApp": o.buyer_phone ? `+62 ${o.buyer_phone}` : "-",
      "Email": o.buyer_email || "-",
      "Nama Template": o.templates?.name || "-",
      "Total Bayar": o.amount,
      "Status Pembayaran": o.payment_status === "paid" ? "Paid" : "Pending",
      "Progres Undangan": `${o.real_progress || 0}%`,
      "Link Undangan": o.invitation_slug ? `${window.location.origin}/${o.invitation_slug}` : "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");
    XLSX.writeFile(workbook, `mypromise_laporan_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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
    <>
      <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Semua Pesanan</h1>
          <p className="text-slate-500 mt-1 font-medium text-base">Data real-time dari seluruh customer.</p>
        </div>
        
        {/* Controls Bar - subtle normal estetik, clean proportions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-56">
            <input 
              type="text" 
              placeholder="Cari pesanan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 w-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300"
            />
            <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="amount-high">Total Tertinggi</option>
            <option value="amount-low">Total Terendah</option>
          </select>

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset Filter"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset
            </button>
          )}

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Ekspor
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Segmented Tab Control */}
        <div className="flex border-b border-slate-200/60 gap-8 mb-0 px-8 pt-6 bg-slate-50/20 backdrop-blur-md rounded-t-[32px]">
          <button
            onClick={() => setActiveTab("paid")}
            className={`pb-4 px-2.5 text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-3 outline-none ${
              activeTab === "paid"
                ? "border-rose-500 text-rose-600 scale-[1.01]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>Paid</span>
            <span className={`px-3 py-0.5 rounded-full text-xs font-black transition-all ${
              activeTab === 'paid' 
                ? 'bg-rose-100 text-rose-700 shadow-sm' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {orders.filter(o => o.payment_status === "paid").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-2.5 text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-3 outline-none ${
              activeTab === "pending"
                ? "border-rose-500 text-rose-600 scale-[1.01]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <span>Pending Payment</span>
            <span className={`px-3 py-0.5 rounded-full text-xs font-black transition-all ${
              activeTab === 'pending' 
                ? 'bg-rose-100 text-rose-700 shadow-sm' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              {orders.filter(o => o.payment_status !== "paid").length}
            </span>
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-340px)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(226,232,240,0.8)]">
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">No. Order</th>
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">Tanggal & Waktu</th>
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">Template</th>
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4.5 text-xs font-black text-slate-400 uppercase tracking-widest">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    {searchQuery ? "Tidak ada pesanan yang sesuai filter." : "Belum ada transaksi di database."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-xs font-black text-slate-500 uppercase tracking-tighter">#{order.order_number}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-bold text-slate-800 text-sm whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          {new Date(order.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }).replace('.', ':')} WIB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-base whitespace-nowrap">{order.buyer_name}</span>
                        {(order.notes?.includes('Selamanya') || order.expires_at?.startsWith('2099')) && (
                          <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-md text-[9px] font-black uppercase tracking-widest">Lifetime</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-extrabold text-slate-850 whitespace-nowrap">{order.templates?.name || "Template"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-base font-black text-slate-900 whitespace-nowrap">Rp {order.amount.toLocaleString("id-ID")}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="flex-1 min-w-[140px]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-wider text-ellipsis overflow-hidden whitespace-nowrap">
                              {order.real_progress === 0 ? "not started yet" : order.real_progress >= 100 ? "completed" : "in progress"}
                            </span>
                            <span className="text-xs font-black text-rose-500">
                              {order.real_progress || 0}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                            <div 
                              className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                              style={{ width: `${order.real_progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <a
                          href={`/dashboard/${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-200/40 hover:border-rose-200 rounded-xl transition-all shrink-0 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                          title="Buka Dashboard User"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Dynamic Detail Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-[32px] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <span className="font-mono text-xs font-black text-rose-500 tracking-wider">ORDER #{selectedOrder.order_number}</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">Detail Pesanan</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              {/* Row 1: Customer Details */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Informasi Pelanggan</h4>
                <div className="bg-slate-50/60 border border-slate-200/40 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Nama Lengkap</span>
                    <span className="font-bold text-slate-800">{selectedOrder.buyer_name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Email</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800 lowercase">{selectedOrder.buyer_email}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedOrder.buyer_email);
                          alert("Email berhasil disalin!");
                        }}
                        className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">No. WhatsApp</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">+62 {selectedOrder.buyer_phone}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`+62 ${selectedOrder.buyer_phone}`);
                          alert("Nomor WhatsApp berhasil disalin!");
                        }}
                        className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Order Details */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Rincian Pembelian</h4>
                <div className="bg-slate-50/60 border border-slate-200/40 rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Template Terpilih</span>
                    <span className="font-bold text-slate-800">{selectedOrder.templates?.name || "Template"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Masa Aktif</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      selectedOrder.notes?.includes('Selamanya') || selectedOrder.expires_at?.startsWith('2099')
                        ? 'bg-rose-50 border border-rose-200 text-rose-600'
                        : 'bg-slate-100 border border-slate-200 text-slate-500'
                    }`}>
                      {selectedOrder.notes?.includes('Selamanya') || selectedOrder.expires_at?.startsWith('2099') ? 'LIFETIME' : 'STANDARD'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Nilai Transaksi</span>
                    <span className="font-black text-slate-900">Rp {selectedOrder.amount.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Status Pembayaran</span>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${selectedOrder.payment_status === 'paid' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Progress Details */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Progres Undangan</h4>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-bold text-slate-700 capitalize">{selectedOrder.real_progress === 0 ? "not started yet" : selectedOrder.real_progress >= 100 ? "completed" : "in progress"}</span>
                  <span className="font-black text-rose-500">{selectedOrder.real_progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 border border-slate-200/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${selectedOrder.real_progress || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex gap-3">
              {selectedOrder.payment_status !== 'paid' && (
                <a 
                  href={getWhatsAppLink(selectedOrder.buyer_name, selectedOrder.order_number, selectedOrder.amount, selectedOrder.buyer_phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/10 cursor-pointer text-center flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.256 5.254 0 11.714 0c3.129.001 6.07 1.22 8.28 3.432 2.211 2.213 3.428 5.157 3.427 8.283-.003 6.458-5.255 11.714-11.717 11.714-2.006-.001-3.98-.515-5.733-1.493L0 24zm6.49-4.78c1.644.976 3.266 1.488 4.962 1.489 5.378 0 9.752-4.372 9.755-9.75.002-2.597-1.009-5.04-2.846-6.88C16.63 2.228 14.195 1.218 11.716 1.218c-5.381 0-9.754 4.373-9.757 9.751-.001 1.794.492 3.468 1.43 5.025l-.994 3.633 3.662-.977zm11.715-6.732c-.312-.156-1.848-.91-2.131-1.014-.282-.105-.489-.156-.693.156-.205.312-.793 1.014-.972 1.22-.18.205-.359.229-.672.073-.312-.155-1.32-.486-2.514-1.55-.93-.83-1.557-1.854-1.74-2.164-.18-.312-.02-.48.137-.636.141-.14.312-.364.469-.546.156-.182.208-.312.312-.52.105-.208.052-.39-.026-.546-.078-.156-.693-1.67-.95-2.285-.25-.601-.523-.519-.693-.527-.18-.009-.387-.01-.592-.01-.205 0-.537.078-.817.39-.28.312-1.07 1.047-1.07 2.553 0 1.506 1.096 2.964 1.25 3.173.156.208 2.158 3.296 5.228 4.622.73.315 1.3.504 1.744.645.733.233 1.4.2 1.928.121.588-.088 1.848-.756 2.11-1.455.263-.7.263-1.3.185-1.455-.078-.157-.282-.26-.593-.416z" />
                  </svg>
                  Follow-up WA
                </a>
              )}
              <a 
                href={`/dashboard/${selectedOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer text-center"
              >
                Buka Dashboard User
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

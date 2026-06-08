"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const Icons = {
  Revenue: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  Orders: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  ),
  Active: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
  Average: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 17.07z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.256 5.254 0 11.714 0c3.129.001 6.07 1.22 8.28 3.432 2.211 2.213 3.428 5.157 3.427 8.283-.003 6.458-5.255 11.714-11.717 11.714-2.006-.001-3.98-.515-5.733-1.493L0 24zm6.49-4.78c1.644.976 3.266 1.488 4.962 1.489 5.378 0 9.752-4.372 9.755-9.75.002-2.597-1.009-5.04-2.846-6.88C16.63 2.228 14.195 1.218 11.716 1.218c-5.381 0-9.754 4.373-9.757 9.751-.001 1.794.492 3.468 1.43 5.025l-.994 3.633 3.662-.977zm11.715-6.732c-.312-.156-1.848-.91-2.131-1.014-.282-.105-.489-.156-.693.156-.205.312-.793 1.014-.972 1.22-.18.205-.359.229-.672.073-.312-.155-1.32-.486-2.514-1.55-.93-.83-1.557-1.854-1.74-2.164-.18-.312-.02-.48.137-.636.141-.14.312-.364.469-.546.156-.182.208-.312.312-.52.105-.208.052-.39-.026-.546-.078-.156-.693-1.67-.95-2.285-.25-.601-.523-.519-.693-.527-.18-.009-.387-.01-.592-.01-.205 0-.537.078-.817.39-.28.312-1.07 1.047-1.07 2.553 0 1.506 1.096 2.964 1.25 3.173.156.208 2.158 3.296 5.228 4.622.73.315 1.3.504 1.744.645.733.233 1.4.2 1.928.121.588-.088 1.848-.756 2.11-1.455.263-.7.263-1.3.185-1.455-.078-.157-.282-.26-.593-.416z" />
    </svg>
  ),
  DashboardLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
};

// Reusable animated mini-sparkline component
function Sparkline({ data, colorClass = "stroke-rose-500" }: { data: number[]; colorClass?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 90 + 5;
    const y = 25 - ((val - min) / range) * 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="w-20 h-7 overflow-visible" viewBox="0 0 100 30">
      <polyline
        fill="none"
        className={colorClass}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<string>("mtd");

  // Custom states for interactivity
  const [chartMetric, setChartMetric] = useState<"revenue" | "count">("revenue");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getRangeLabel = (val: string) => {
    switch (val) {
      case "today": return "Hari Ini";
      case "yesterday": return "Kemarin";
      case "7days": return "7 Hari";
      case "30days": return "30 Hari";
      case "mtd": return "Bulan Ini";
      case "ytd": return "Tahun Ini";
      default: return "Semua Waktu";
    }
  };

  useEffect(() => {
    async function loadAdminData() {
      setRefreshing(true);
      try {
        const response = await fetch(`/api/admin/stats?range=${dateRange}`);
        if (!response.ok) throw new Error("Failed to fetch admin stats");

        const data = await response.json();
        setRecentOrders(data.recentOrders || []);
        setAnalytics(data);

        setStats([
          {
            label: "Total Omzet",
            value: `Rp ${data.totalRevenue.toLocaleString("id-ID")}`,
            subtitle: `${data.lifetimeCount} Lifetime Upsells`,
            change: getRangeLabel(dateRange),
            icon: <Icons.Revenue />,
            trend: data.trendData.map((d: any) => d.revenue),
            color: "stroke-rose-500",
            bg: "hover:border-rose-300"
          },
          {
            label: "Total Pesanan",
            value: data.orderCount || 0,
            subtitle: `${data.activeOrderCount} Terbayar`,
            change: getRangeLabel(dateRange),
            icon: <Icons.Orders />,
            trend: data.trendData.map((d: any) => d.count),
            color: "stroke-rose-500",
            bg: "hover:border-rose-300"
          },
          {
            label: "Rata-rata Order",
            value: `Rp ${data.averageOrderValue.toLocaleString("id-ID")}`,
            subtitle: "Per paid transaction",
            change: "Healthy AOV",
            icon: <Icons.Average />,
            trend: data.trendData.map((d: any) => d.revenue),
            color: "stroke-rose-500",
            bg: "hover:border-rose-300"
          },
          {
            label: "Lifetime Upsell",
            value: `${data.upsellRate}%`,
            subtitle: `Rp ${(data.lifetimeCount * 19000).toLocaleString("id-ID")} Upsell Rev`,
            change: "AOV Booster",
            icon: <Icons.Active />,
            trend: data.trendData.map((d: any) => d.count),
            color: "stroke-rose-500",
            bg: "hover:border-rose-300"
          },
        ]);

      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }

    loadAdminData();
  }, [dateRange]);

  const handleExportExcel = () => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        const ordersToExport = data.orders || [];
        const sheetData = ordersToExport.map((o: any) => ({
          "No. Order": o.order_number,
          "Nama Pembeli": o.buyer_name,
          "Email": o.buyer_email,
          "WhatsApp": o.buyer_phone,
          "Template": o.templates?.name || "N/A",
          "Status Pembayaran": o.payment_status.toUpperCase(),
          "Status Progres": o.order_status.replace('_', ' ').toUpperCase(),
          "Total Bayar": o.amount,
          "Masa Aktif": o.notes?.includes('Selamanya') || o.expires_at?.startsWith('2099') ? 'LIFETIME' : 'STANDARD',
          "Tanggal Dibuat": new Date(o.created_at).toLocaleString('id-ID')
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");
        XLSX.writeFile(workbook, `mypromise_orders_${new Date().toISOString().split('T')[0]}.xlsx`);
      })
      .catch(err => {
        console.error("Export failed:", err);
        alert("Gagal mengunduh laporan Excel.");
      });
  };

  const handleCopyLink = (orderId: string, slug: string) => {
    const link = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getWhatsAppLink = (phone: string, buyerName: string, orderNumber: string, status: string, amount: number, orderId: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62') && cleanPhone.length > 5) {
      cleanPhone = '62' + cleanPhone;
    }

    const text = status === 'paid'
      ? `Halo ${buyerName}, terima kasih telah memesan undangan di MyPromise! Pesanan Anda #${orderNumber} sebesar Rp ${amount.toLocaleString('id-ID')} telah sukses diverifikasi. Silakan lengkapi data undangan Anda di link dashboard berikut: ${window.location.origin}/dashboard/${orderId}`
      : `Halo ${buyerName}, terima kasih telah memesan undangan di MyPromise! Kami menginfokan bahwa pesanan Anda #${orderNumber} sebesar Rp ${amount.toLocaleString('id-ID')} masih berstatus pending. Silakan selesaikan pembayaran agar kami dapat langsung mengaktifkan undangan Anda. Hubungi kami jika ada kendala. Terima kasih!`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  if (loading) return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header Skeleton */}
      <div className="flex justify-between items-end">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-3"></div>
        </div>
        <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse"></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
              <div className="h-6 w-16 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-3 w-24 bg-slate-100 rounded mb-2 animate-pulse"></div>
            <div className="h-7 w-36 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-3 w-32 bg-slate-100 rounded mt-3 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Chart and Side Bento Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-200 h-[340px] animate-pulse"></div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 h-[340px] animate-pulse"></div>
      </div>

      {/* Recent Orders Table Skeleton */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-5 w-40 bg-slate-100 rounded animate-pulse"></div>
              <div className="h-5 w-24 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Custom SVG Chart calculations
  const chartValues = analytics?.trendData?.map((d: any) => chartMetric === "revenue" ? d.revenue : d.count) || [];
  const realMax = Math.max(...chartValues, 0);
  const maxVal = realMax > 0 ? realMax : (chartMetric === "revenue" ? 100000 : 5);
  const chartCeiling = maxVal / 0.8;

  // Helper to parse complete date strings (e.g., "18 Mei") to override API date decimation
  const getCleanLabel = (d: any) => {
    if (d.fullDate) return d.fullDate;
    if (d.date && (d.date.includes(",") || d.date.includes(" "))) {
      const cleaned = d.date.replace(",", "").trim();
      const parts = cleaned.split(/\s+/);
      if (parts.length > 1) {
        const day = parts[1];
        if (!isNaN(Number(day))) {
          const monthName = new Date().toLocaleDateString('id-ID', { month: 'short' });
          return `${day} ${monthName}`;
        }
      }
    }
    return d.date || "";
  };

  const chartPoints = analytics?.trendData?.map((d: any, i: number) => {
    const val = chartMetric === "revenue" ? d.revenue : d.count;
    // Wide horizontal layout centered and balanced within grid boundaries [30, 590]
    const x = 56 + (i / (analytics.trendData.length - 1 || 1)) * 508;
    // Base is 180px, height scaled using chartCeiling to keep 20% breathing room at the top
    const y = 180 - (val / chartCeiling) * 160;
    const fullLabel = getCleanLabel(d);
    return { x, y, val, label: fullLabel, rawDate: d.fullDate || fullLabel };
  }) || [];

  const linePath = chartPoints.map((p: any, i: number) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(" ");
  const areaPath = chartPoints.length > 0
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} 170 L ${chartPoints[0].x} 170 Z`
    : "";

  return (
    <div className={`relative space-y-8 animate-fade-in pb-12 transition-all duration-300 ${refreshing ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
      {/* Premium Ambient Background Glowing Auras */}
      <div className="absolute top-[-50px] right-[-100px] w-[380px] h-[380px] rounded-full bg-rose-200/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[200px] left-[-80px] w-[350px] h-[350px] rounded-full bg-amber-100/15 blur-[120px] pointer-events-none -z-10" />

      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Sales Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-base">Data real-time dari database MyPromise.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Global Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300 min-w-[160px]"
          >
            <option value="mtd">Bulan Ini (Month to Date)</option>
            <option value="today">Hari Ini (Today)</option>
            <option value="yesterday">Kemarin (Yesterday)</option>
            <option value="7days">7 Hari Terakhir</option>
            <option value="30days">30 Hari Terakhir</option>
            <option value="ytd">Tahun Ini (Year to Date)</option>
            <option value="alltime">Semua Waktu (All Time)</option>
          </select>

          <div className="text-[11px] font-semibold text-slate-500 bg-slate-100/60 px-3.5 py-2 rounded-xl border border-slate-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)] shrink-0 flex items-center gap-2">
            {refreshing && (
              <svg className="animate-spin h-3.5 w-3.5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>Updated: {new Date().toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-1.5 hover:border-rose-300/40 hover:shadow-[0_20px_40px_rgba(244,63,94,0.03)] group flex flex-col justify-between relative overflow-hidden`}>
            {/* Corner accent glow on hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-500 group-hover:bg-rose-500 group-hover:text-white group-hover:scale-105 transition-all duration-500 shadow-inner">
                  {stat.icon}
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-50/50 text-rose-600 border border-rose-100/50 rounded-lg uppercase tracking-wider">
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-semibold text-slate-400">{stat.subtitle}</span>
              <Sparkline data={stat.trend} colorClass={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Bento Row (Chart & Leaderboard/Integrations) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Custom SVG Trend Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 rounded-[32px] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Tren Penjualan ({getRangeLabel(dateRange)})</h2>
              <p className="text-xs text-slate-450 mt-0.5">
                {dateRange === "today" || dateRange === "yesterday"
                  ? "Analisis omzet rupiah dan jumlah transaksi per 4 jam"
                  : dateRange === "ytd" || dateRange === "alltime"
                    ? "Analisis omzet rupiah dan jumlah transaksi bulanan"
                    : "Analisis omzet rupiah dan jumlah transaksi harian"}
              </p>
            </div>

            {/* Chart Metric Selector */}
            <div className="flex bg-slate-100/60 p-1 rounded-xl border border-slate-200/60">
              <button
                onClick={() => setChartMetric("revenue")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${chartMetric === "revenue" ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Omzet (Rp)
              </button>
              <button
                onClick={() => setChartMetric("count")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${chartMetric === "count" ? "bg-white text-rose-500 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                Pesanan
              </button>
            </div>
          </div>

          {/* Interactive Chart Container - Expanded vertical height to maximize visual impact */}
          <div className="relative w-full h-[380px] bg-slate-50/20 rounded-2xl border border-slate-100/50 p-2">
            {/* Grid Lines and Chart Drawing */}
            <svg className="w-full h-full text-slate-200" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                {/* Revenue (Emerald mapped to Primary Rose) Solid Color Fills & Filter */}
                <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C25A75" stopOpacity="0.90" />
                  <stop offset="100%" stopColor="#C25A75" stopOpacity="0.90" />
                </linearGradient>
                <linearGradient id="revenueBarHoverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E07A94" stopOpacity="1.0" />
                  <stop offset="100%" stopColor="#E07A94" stopOpacity="1.0" />
                </linearGradient>
                <filter id="revenue-bar-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#C25A75" floodOpacity="0.25" />
                </filter>

                {/* Orders (Rose Crimson mapped to Primary Rose) Solid Color Fills & Filter */}
                <linearGradient id="ordersBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C25A75" stopOpacity="0.90" />
                  <stop offset="100%" stopColor="#C25A75" stopOpacity="0.90" />
                </linearGradient>
                <linearGradient id="ordersBarHoverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E07A94" stopOpacity="1.0" />
                  <stop offset="100%" stopColor="#E07A94" stopOpacity="1.0" />
                </linearGradient>
                <filter id="orders-bar-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#C25A75" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Horizontal Gridlines - Expanded width to touch the canvas edges */}
              <line x1="30" y1="20" x2="590" y2="20" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="4 4" />
              <line x1="30" y1="100" x2="590" y2="100" stroke="#f1f5f9" strokeWidth="1.2" strokeDasharray="4 4" />
              <line x1="30" y1="180" x2="590" y2="180" stroke="#e2e8f0" strokeWidth="1.2" />

              {/* Bar Elements */}
              {chartPoints.map((p: any, i: number) => {
                // Calculate horizontal step between adjacent bars to maintain a pixel-perfect, harmonious 25% gap and 75% bar width
                const step = 508 / (chartPoints.length - 1 || 1);
                const barWidth = Math.max(6, Math.min(52, step * 0.75));
                // Segment the total width perfectly so adjacent hover zones touch without overlapping or leaving dead zones
                const triggerWidth = 508 / (chartPoints.length || 1);
                const isRevenue = chartMetric === "revenue";
                return (
                  <g key={i} className="group/bar">
                    {/* Actual dynamic rounded lozenge bar - Now unblocked with pointer-events-none so it never intercepts mouse events */}
                    <rect
                      x={p.x - barWidth / 2}
                      y={p.y}
                      width={barWidth}
                      height={Math.max(4, 180 - p.y)}
                      rx={Math.min(6, barWidth / 2)}
                      className="transition-all duration-300 ease-out origin-bottom pointer-events-none"
                      fill={hoveredPoint === i
                        ? (isRevenue ? "url(#revenueBarHoverGradient)" : "url(#ordersBarHoverGradient)")
                        : (isRevenue ? "url(#revenueBarGradient)" : "url(#ordersBarGradient)")}
                      style={{
                        filter: hoveredPoint === i
                          ? (isRevenue ? "url(#revenue-bar-glow)" : "url(#orders-bar-glow)")
                          : "none",
                        transform: hoveredPoint === i ? "scaleY(1.03)" : "none",
                        transformOrigin: `${p.x}px 180px`,
                      }}
                    />

                    {/* Ghost column for generous, smooth hover trigger - Placed LAST in DOM hierarchy to float on top of actual bars */}
                    <rect
                      x={p.x - triggerWidth / 2}
                      y="0"
                      width={triggerWidth}
                      height="195"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Un-skewed Value Labels above each bar (Rendered as absolute HTML overlays to prevent SVG 'preserveAspectRatio="none"' warping) */}
            {chartPoints.map((p: any, i: number) => {
              const isRevenue = chartMetric === "revenue";
              // Only show if value is positive
              if (p.val <= 0) return null;

              // Show on Month view (up to 31 days) or if the bar is hovered!
              const shouldShow = chartPoints.length <= 31 || hoveredPoint === i;
              if (!shouldShow) return null;

              const formattedVal = isRevenue
                ? p.val >= 1000000
                  ? `${(p.val / 1000000).toFixed(2).replace('.', ',').replace(',00', '')}M`
                  : p.val >= 1000
                    ? `${Math.round(p.val / 1000)}k`
                    : p.val
                : p.val;

              return (
                <div
                  key={`val-overlay-${i}`}
                  className={`absolute text-[8px] font-black tracking-tight pointer-events-none transition-all duration-300 -translate-x-1/2 -translate-y-full ${hoveredPoint === i
                    ? "text-rose-500 font-extrabold scale-110"
                    : "text-slate-400"
                    }`}
                  style={{
                    left: `${(p.x / 600) * 100}%`,
                    top: `${(p.y / 200) * 100 - 1.5}%`, // Position slightly higher than the bar's peak
                  }}
                >
                  {formattedVal}
                </div>
              );
            })}

            {/* Y-Axis Grid labels - Percentage-positioned to match SVG scaling precisely (Unblocked with pointer-events-none) */}
            <div className="absolute left-1.5 top-[10%] -translate-y-1/2 text-[8px] font-black text-slate-455 bg-white/90 px-1 py-0.5 rounded border border-slate-100 shadow-sm pointer-events-none">
              {chartMetric === "revenue" ? `Rp ${(chartCeiling / 1000).toLocaleString("id-ID")}k` : Math.round(chartCeiling)}
            </div>
            <div className="absolute left-1.5 top-[50%] -translate-y-1/2 text-[8px] font-black text-slate-455 bg-white/90 px-1 py-0.5 rounded border border-slate-100 shadow-sm pointer-events-none">
              {chartMetric === "revenue" ? `Rp ${(chartCeiling / 2 / 1000).toLocaleString("id-ID")}k` : Math.round(chartCeiling / 2)}
            </div>
            <div className="absolute left-1.5 top-[90%] -translate-y-1/2 text-[8px] font-black text-slate-455 bg-white/90 px-1 py-0.5 rounded border border-slate-100 shadow-sm pointer-events-none">0</div>

            {/* X-Axis Labels - Mathematically centered under every single bar (horizontal, unrotated day numbers) - Dynamically themed */}
            <div className="absolute top-[92%] left-0 right-0 h-6 pointer-events-none">
              {chartPoints.map((p: any, i: number) => {
                const isRevenue = chartMetric === "revenue";
                const dayNumber = p.label.includes(" ") ? p.label.split(" ")[0] : p.label;

                return (
                  <span
                    key={i}
                    className={`absolute text-[8px] font-black uppercase tracking-wider transition-all duration-300 -translate-x-1/2 ${hoveredPoint === i
                      ? 'text-rose-500 font-extrabold scale-110 bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-slate-100/80 z-20'
                      : 'text-slate-400'
                      }`}
                    style={{
                      left: `${(p.x / 600) * 100}%`,
                    }}
                  >
                    {hoveredPoint === i ? p.label : dayNumber}
                  </span>
                );
              })}
            </div>

            {/* Interactive HTML Tooltip overlay - Positioned mathematically using pure SVG viewport percentages */}
            {hoveredPoint !== null && chartPoints[hoveredPoint] && (
              <div
                className="absolute bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs font-semibold pointer-events-none transition-all duration-200 z-10 border border-slate-800"
                style={{
                  left: `${(chartPoints[hoveredPoint].x / 600) * 100}%`,
                  top: `${(chartPoints[hoveredPoint].y / 200) * 100}%`,
                  transform: 'translate(-50%, -115%)',
                }}
              >
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{chartPoints[hoveredPoint].rawDate}</p>
                <p className="text-[11px] font-black text-white mt-0.5">
                  {chartMetric === "revenue"
                    ? `Rp ${chartPoints[hoveredPoint].val.toLocaleString("id-ID")}`
                    : `${chartPoints[hoveredPoint].val} Pesanan`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Side Bento Column: Template Leaderboard */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-[32px] border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          {/* Best Selling Templates */}
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-5">Peringkat Penjualan Template</h2>
            <div className="space-y-5">
              {analytics?.templatePerformance?.map((item: any, i: number) => {
                const totalRev = analytics?.totalRevenue || 1;
                const percentage = Math.round((item.revenue / totalRev) * 105) || 0; // Slight padding factor for a beautiful visual fill
                const displayPercentage = Math.round((item.revenue / totalRev) * 100);
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{i + 1}. {item.name}</span>
                      <span className="text-slate-400 font-semibold">{item.count} sales ({displayPercentage}%)</span>
                    </div>
                    {/* Minimalist Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>


    </div>
  );
}



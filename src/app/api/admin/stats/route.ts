import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

function getLocalDateString(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    // Parse date range parameter (Default: "mtd" - Month to Date)
    const range = request.nextUrl.searchParams.get("range") || "mtd";
    const now = new Date();
    let startDate: string | null = null;
    let endDate: string | null = null;

    // Define Date Boundaries based on range selection
    if (range === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (range === "yesterday") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1).toISOString();
    } else if (range === "7days") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "30days") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (range === "mtd") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (range === "ytd") {
      startDate = new Date(now.getFullYear(), 0, 1).toISOString();
    } // "alltime" leaves startDate and endDate as null

    // 1. Fetch Orders Count within date range
    let countQuery = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (startDate) countQuery = countQuery.gte('created_at', startDate);
    if (endDate) countQuery = countQuery.lte('created_at', endDate);

    const { count: orderCount, error: countError } = await countQuery;
    if (countError) throw countError;

    // 2. Fetch Enriched Analytics from Paid Orders within date range
    let revQuery = supabase
      .from('orders')
      .select('amount, created_at, notes, expires_at, templates(name)')
      .eq('payment_status', 'paid');
    
    if (startDate) revQuery = revQuery.gte('created_at', startDate);
    if (endDate) revQuery = revQuery.lte('created_at', endDate);

    const { data: revenueData, error: revError } = await revQuery;
    if (revError) throw revError;
    
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    // Calculate Lifetime Link Upsell Stats
    const lifetimeOrders = revenueData?.filter(o => o.notes?.includes('Selamanya') || o.expires_at?.startsWith('2099')) || [];
    const lifetimeCount = lifetimeOrders.length;
    const upsellRevenue = lifetimeCount * 19000;
    const upsellRate = revenueData && revenueData.length > 0 
      ? Math.round((lifetimeCount / revenueData.length) * 100) 
      : 0;

    // Calculate Average Order Value (AOV)
    const activeOrderCount = revenueData?.length || 0;
    const averageOrderValue = activeOrderCount > 0 
      ? Math.round(totalRevenue / activeOrderCount) 
      : 0;

    // 3. Dynamic Trend Grouping based on timeframe selection
    let trendData: any[] = [];

    if (range === "today" || range === "yesterday") {
      // Group by 4-hour intervals for sub-daily precision (Today / Yesterday)
      const intervals = [0, 4, 8, 12, 16, 20];
      trendData = intervals.map(hour => {
        const label = `${hour.toString().padStart(2, '0')}:00`;
        const hourOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const h = new Date(o.created_at).getHours();
          return h >= hour && h < hour + 4;
        }) || [];
        const revenue = hourOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = hourOrders.length;
        return { date: label, revenue, count };
      });

    } else if (range === "7days") {
      // Group by past 7 days (Daily)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return getLocalDateString(d);
      }).reverse();

      trendData = last7Days.map(date => {
        const dayOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const orderDate = getLocalDateString(new Date(o.created_at));
          return orderDate === date;
        }) || [];
        const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = dayOrders.length;
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        return { date: formattedDate, revenue, count };
      });

    } else if (range === "mtd") {
      // Group by Month to Date (Daily list up to current day)
      const currentDay = now.getDate();
      const dailyPoints = Array.from({ length: currentDay }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
        return getLocalDateString(d);
      });

      trendData = dailyPoints.map((date, idx) => {
        const dayOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const orderDate = getLocalDateString(new Date(o.created_at));
          return orderDate === date;
        }) || [];
        const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = dayOrders.length;
        
        // Return full date label for all days so the frontend can display 1, 2, 3, 4... consecutively up to today's date!
        const label = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          
        return { date: label, revenue, count, fullDate: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
      });

    } else if (range === "30days") {
      // Group by past 30 days (Daily)
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return getLocalDateString(d);
      }).reverse();

      trendData = last30Days.map((date, idx) => {
        const dayOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const orderDate = getLocalDateString(new Date(o.created_at));
          return orderDate === date;
        }) || [];
        const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = dayOrders.length;
        
        // Return full date label for all days so the frontend can display 1, 2, 3, 4... consecutively!
        const label = new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
          
        return { date: label, revenue, count, fullDate: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) };
      });

    } else if (range === "ytd") {
      // Group by Year to Date (Monthly points)
      const currentMonth = now.getMonth();
      const months = Array.from({ length: currentMonth + 1 }, (_, i) => i);
      trendData = months.map(m => {
        const monthOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const orderDate = new Date(o.created_at);
          return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === m;
        }) || [];
        const revenue = monthOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = monthOrders.length;
        const label = new Date(now.getFullYear(), m, 1).toLocaleDateString('id-ID', { month: 'short' });
        return { date: label, revenue, count };
      });

    } else {
      // "alltime" - Group by Month for past 12 months
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
      }).reverse();

      trendData = last12Months.map(({ year, month }) => {
        const monthOrders = revenueData?.filter(o => {
          if (!o.created_at) return false;
          const orderDate = new Date(o.created_at);
          return orderDate.getFullYear() === year && orderDate.getMonth() === month;
        }) || [];
        const revenue = monthOrders.reduce((sum, o) => sum + o.amount, 0);
        const count = monthOrders.length;
        const label = new Date(year, month, 1).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        return { date: label, revenue, count };
      });
    }

    // Calculate Template Performance Leaderboard
    const templateMap: Record<string, { name: string; count: number; revenue: number }> = {};
    revenueData?.forEach(o => {
      const templateObj: any = o.templates;
      const templateName = (Array.isArray(templateObj) ? templateObj[0]?.name : templateObj?.name) || "Template Kustom";
      if (!templateMap[templateName]) {
        templateMap[templateName] = { name: templateName, count: 0, revenue: 0 };
      }
      templateMap[templateName].count += 1;
      templateMap[templateName].revenue += o.amount;
    });

    const templatePerformance = Object.values(templateMap)
      .sort((a, b) => b.count - a.count || b.revenue - a.revenue);

    // 4. Fetch Recent Orders matching date range (Limit 5)
    let recentQuery = supabase
      .from('orders')
      .select('*, templates(name, slug)')
      .order('created_at', { ascending: false });

    if (startDate) recentQuery = recentQuery.gte('created_at', startDate);
    if (endDate) recentQuery = recentQuery.lte('created_at', endDate);

    const { data: recentOrders, error: ordersError } = await recentQuery.limit(5);

    if (ordersError) throw ordersError;

    return NextResponse.json({
      orderCount: orderCount || 0,
      totalRevenue,
      activeOrderCount,
      lifetimeCount,
      upsellRevenue,
      upsellRate,
      averageOrderValue,
      trendData,
      templatePerformance,
      recentOrders: recentOrders || [],
    });

  } catch (error: any) {
    console.error("❌ Admin Stats API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}



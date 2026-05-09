import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Fetch Orders Count
    const { count: orderCount, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // 2. Fetch Total Revenue
    const { data: revenueData, error: revError } = await supabase
      .from('orders')
      .select('amount')
      .eq('payment_status', 'paid');
    
    if (revError) throw revError;
    
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    // 3. Fetch Recent Orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (ordersError) throw ordersError;

    return NextResponse.json({
      orderCount: orderCount || 0,
      totalRevenue,
      recentOrders: orders || [],
    });

  } catch (error: any) {
    console.error("❌ Admin Stats API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

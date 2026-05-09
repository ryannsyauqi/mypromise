import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, templates(name, slug)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: orders || [] });

  } catch (error: any) {
    console.error("❌ Admin Orders API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, name, url_param, full_url } = body;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('guests')
      .insert({
        order_id,
        name,
        url_param,
        full_url
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) return NextResponse.json({ message: "Order ID is required" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

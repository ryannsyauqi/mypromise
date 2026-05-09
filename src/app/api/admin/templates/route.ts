import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ templates: templates || [] });

  } catch (error: any) {
    console.error("❌ Admin Templates API GET Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { id, name, price, original_price, is_active, thumbnail_url } = body;

    if (!id) {
      return NextResponse.json({ message: "Template ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('templates')
      .update({
        name,
        price,
        original_price,
        is_active,
        thumbnail_url
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ template: data });

  } catch (error: any) {
    console.error("❌ Admin Templates API PATCH Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

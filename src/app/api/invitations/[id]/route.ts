import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!id) {
      return NextResponse.json({ message: "Invitation ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('invitations')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("❌ Update Error:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Invitation updated successfully" });
    
  } catch (error: any) {
    console.error("❌ API Fatal Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

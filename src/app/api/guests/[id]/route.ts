import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const guestId = params.id;
    const body = await request.json();
    
    if (!guestId) {
      return NextResponse.json({ message: "Guest ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('guests')
      .update({
        name: body.name,
        url_param: body.url_param,
        full_url: body.full_url
      })
      .eq('id', guestId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating guest:", error);
    return NextResponse.json({ message: error.message || "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const guestId = params.id;
    
    if (!guestId) {
      return NextResponse.json({ message: "Guest ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);

    if (error) throw error;
    return NextResponse.json({ message: "Guest deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting guest:", error);
    return NextResponse.json({ message: error.message || "Failed to delete guest" }, { status: 500 });
  }
}


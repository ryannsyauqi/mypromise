import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId, guestSlug } = body;

    if (!invitationId || !guestSlug) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Get Invitation to find order_id
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('order_id')
      .eq('id', invitationId)
      .single();

    if (invError || !invitation) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // 2. Update the guest's is_opened status to true
    const { error: updateError } = await supabase
      .from('guests')
      .update({ is_opened: true })
      .eq('order_id', invitation.order_id)
      .eq('url_param', guestSlug);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "Guest opened status updated" });
  } catch (error: any) {
    console.error("Error opening guest:", error);
    return NextResponse.json({ message: error.message || "Failed to update opened status" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId, name, guestSlug, attendance, guestCount, message } = body;

    if (!invitationId || !name || !attendance) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Get Invitation and Order ID
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('order_id')
      .eq('id', invitationId)
      .single();

    if (invError || !invitation) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // 2. Update Guest Status and Message in 'guests' table
    // Match by unique guestSlug (url_param) if present, otherwise fallback to matching by name (case-insensitive)
    let guestQuery = supabase
      .from('guests')
      .update({ status: attendance, message: message });

    if (guestSlug) {
      guestQuery = guestQuery.eq('url_param', guestSlug);
    } else {
      guestQuery = guestQuery.ilike('name', name);
    }

    const { error: guestError } = await guestQuery.eq('order_id', invitation.order_id);

    if (guestError) {
      console.warn("Guest status not updated (might not exist in guest list):", guestError.message);
    }

    // 3. Insert into 'wishes' table
    const { error: wishError } = await supabase
      .from('wishes')
      .insert({
        invitation_id: invitationId,
        name,
        message,
        attendance,
        guest_count: guestCount || 1
      });

    if (wishError) {
      console.error("Error saving wish:", wishError);
      // We don't fail the whole request if only the wish fails, but good to know
    }

    return NextResponse.json({ message: "RSVP saved successfully" });
  } catch (error: any) {
    console.error("RSVP API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

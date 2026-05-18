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

    // Fetch original guest details before update to sync wishes
    const { data: oldGuest } = await supabase
      .from('guests')
      .select('name, order_id')
      .eq('id', guestId)
      .single();

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

    // Sync wish name if updated
    if (oldGuest && body.name && oldGuest.name !== body.name) {
      const { data: invitation } = await supabase
        .from('invitations')
        .select('id')
        .eq('order_id', oldGuest.order_id)
        .single();

      if (invitation) {
        await supabase
          .from('wishes')
          .update({ name: body.name })
          .eq('invitation_id', invitation.id)
          .ilike('name', oldGuest.name);
      }
    }

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

    // Fetch guest details before deleting to clean up wishes
    const { data: guest } = await supabase
      .from('guests')
      .select('name, order_id')
      .eq('id', guestId)
      .single();

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);

    if (error) throw error;

    // Clean up matching wishes
    if (guest) {
      const { data: invitation } = await supabase
        .from('invitations')
        .select('id')
        .eq('order_id', guest.order_id)
        .single();

      if (invitation) {
        await supabase
          .from('wishes')
          .delete()
          .eq('invitation_id', invitation.id)
          .ilike('name', guest.name);
      }
    }

    return NextResponse.json({ message: "Guest deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting guest:", error);
    return NextResponse.json({ message: error.message || "Failed to delete guest" }, { status: 500 });
  }
}


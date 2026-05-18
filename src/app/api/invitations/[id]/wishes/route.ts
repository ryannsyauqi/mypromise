import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;

  try {
    const supabase = createAdminClient();

    // 1. Get the invitation details to find the order_id
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('order_id')
      .eq('id', id)
      .single();

    if (invError || !invitation) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // 2. Fetch all current guests in this order to check existence
    const { data: guests } = await supabase
      .from('guests')
      .select('name')
      .eq('order_id', invitation.order_id);

    const guestNames = new Set((guests || []).map(g => (g.name || "").toLowerCase().trim()));

    // 3. Fetch wishes
    const { data: wishes, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('invitation_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter wishes to only show wishes from guests that still exist in the guest list
    const filteredWishes = (wishes || []).filter(wish => 
      guestNames.has((wish.name || "").toLowerCase().trim())
    );

    return NextResponse.json(filteredWishes);
  } catch (error: any) {
    console.error("Wishes API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

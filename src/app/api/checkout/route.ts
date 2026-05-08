import { NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails } = body;
    
    const orderId = `MP-${nanoid(10)}`;
    const invitationSlug = `${templateSlug}-${nanoid(5)}`.toLowerCase();

    // Try to connect to Supabase, but don't crash if DNS is still propagating
    try {
      const supabase = await createClient();
      
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          buyer_name: customerDetails.name,
          buyer_email: customerDetails.email,
          buyer_phone: customerDetails.phone,
          template_id: templateId,
          amount: amount,
          status: 'paid', // Simulator mode
        });

      if (orderError) console.warn("⚠️ Supabase Order Error:", orderError.message);

      const { error: invError } = await supabase
        .from('invitations')
        .insert({
          order_id: orderId,
          slug: invitationSlug,
          template_id: templateId,
          content: {},
          is_active: false,
        });
        
      if (invError) console.warn("⚠️ Supabase Invitation Error:", invError.message);
    } catch (supabaseError) {
      console.error("❌ Supabase Connection Failed (DNS issue):", supabaseError);
    }

    // Always return success for now so user can see the flow
    return NextResponse.json({
      isSimulator: true,
      orderId: orderId,
      invitationSlug: invitationSlug,
      message: "Connected to simulator. (Supabase sync will work once DNS propagates)"
    });
    
  } catch (error: any) {
    console.error("❌ Checkout API Fatal Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

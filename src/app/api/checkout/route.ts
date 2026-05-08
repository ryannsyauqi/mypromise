import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails } = body;
    
    const orderId = `MP-${nanoid(10)}`;
    const invitationSlug = `${templateSlug}-${nanoid(5)}`.toLowerCase();

    // TOTAL BYPASS MODE: 
    // We try to save, but if it fails, we still let the user proceed.
    try {
      const supabase = await createClient();
      
      await supabase.from('orders').insert({
        id: orderId,
        buyer_name: customerDetails.name,
        buyer_email: customerDetails.email,
        buyer_phone: customerDetails.phone,
        template_id: templateId,
        amount: amount,
        status: 'paid',
      });

      await supabase.from('invitations').insert({
        order_id: orderId,
        slug: invitationSlug,
        template_id: templateId,
        content: {},
        is_active: false,
      });
    } catch (dbError) {
      console.warn("⚠️ Database save skipped (Bypass Mode):", dbError);
    }

    // Always return success so you can see the dashboard
    return NextResponse.json({
      isSimulator: true,
      orderId: orderId,
      invitationSlug: invitationSlug,
      message: "Bypass mode active. Testing UI flow only."
    });
    
  } catch (error: any) {
    console.error("❌ Checkout API Fatal Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error (Bypass active)" },
      { status: 200 } // We even return 200 for errors to keep you moving
    );
  }
}

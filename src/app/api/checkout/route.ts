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

    const supabase = await createClient();
    
    // 1. SAVE TO ORDERS TABLE (Strict Mode)
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

    if (orderError) {
      console.error("❌ Supabase Order Error:", orderError);
      throw new Error(`Gagal menyimpan order: ${orderError.message}`);
    }

    // 2. SAVE TO INVITATIONS TABLE
    const { error: invError } = await supabase
      .from('invitations')
      .insert({
        order_id: orderId,
        slug: invitationSlug,
        template_id: templateId,
        content: {},
        is_active: false,
      });
      
    if (invError) {
      console.error("❌ Supabase Invitation Error:", invError);
      throw new Error(`Gagal menyimpan undangan: ${invError.message}`);
    }

    return NextResponse.json({
      isSimulator: true,
      orderId: orderId,
      invitationSlug: invitationSlug,
    });
    
  } catch (error: any) {
    console.error("❌ Checkout API Fatal Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

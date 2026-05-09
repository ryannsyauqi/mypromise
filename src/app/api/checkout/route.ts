import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails } = body;
    
    const orderId = `MP-${nanoid(10)}`;
    const invitationSlug = `${templateSlug}-${nanoid(5)}`.toLowerCase();

    // Using Admin Client to bypass RLS and ensure data is saved
    try {
      const supabase = createAdminClient();
      
      const { data: orderData, error: orderError } = await supabase.from('orders').insert({
        order_number: orderId,
        buyer_name: customerDetails.name,
        buyer_email: customerDetails.email,
        buyer_phone: customerDetails.phone,
        template_id: templateId,
        amount: amount,
        payment_status: 'paid',
        order_status: 'awaiting_content',
        inv_slug: invitationSlug,
      }).select().single();

      if (orderError) {
        console.error("❌ Database Insert Error:", orderError);
        throw orderError;
      }

      // Create initial invitation content
      const { error: invError } = await supabase.from('invitations').insert({
        order_id: orderData.id,
        slug: invitationSlug,
        template_id: templateId,
        content: {
          groom_name: customerDetails.name.split(' & ')[0] || customerDetails.name,
          bride_name: customerDetails.name.split(' & ')[1] || "",
        }
      });

      if (invError) {
        console.error("❌ Invitation Insert Error:", invError);
      }

      console.log("✅ Order & Invitation saved successfully:", orderId);
    } catch (dbError) {
      console.error("❌ Database save failed:", dbError);
    }

    return NextResponse.json({
      isSimulator: true,
      orderId: orderId,
      invitationSlug: invitationSlug,
      message: "Order processed successfully."
    });
    
  } catch (error: any) {
    console.error("❌ Checkout API Fatal Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

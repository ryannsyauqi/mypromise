import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/utils/supabase/admin";
import { snap } from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails } = body;
    
    const orderId = `MP-${nanoid(10)}`;
    const invitationSlug = `${templateSlug}-${nanoid(5)}`.toLowerCase();

    // 1. Create Transaction in Midtrans Snap
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 2. Save to Database with 'pending' status
    const supabase = createAdminClient();
    
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      order_number: orderId,
      buyer_name: customerDetails.name,
      buyer_email: customerDetails.email,
      buyer_phone: customerDetails.phone,
      template_id: templateId,
      amount: amount,
      payment_status: 'pending', // Awalnya pending
      order_status: 'awaiting_content',
      inv_slug: invitationSlug,
    }).select().single();

    if (orderError) {
      console.error("❌ Database Insert Error:", orderError);
      throw orderError;
    }

    // Create initial invitation content
    await supabase.from('invitations').insert({
      order_id: orderData.id,
      slug: invitationSlug,
      template_id: templateId,
      content: {
        groom_name: customerDetails.name.split(' & ')[0] || customerDetails.name,
        bride_name: customerDetails.name.split(' & ')[1] || "",
      }
    });

    console.log("✅ Order saved & Midtrans token generated:", orderId);

    return NextResponse.json({
      token: snapToken,
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

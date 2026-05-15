import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/utils/supabase/admin";
import { snap } from "@/lib/midtrans";
import { sendEmailNotification } from "@/lib/notifications";
import { getPendingPaymentEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails } = body;
    
    const orderId = `MP-${nanoid(10)}`;
    
    // Generate slug from buyer name
    const slugify = (text: string) => text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    let baseSlug = slugify(customerDetails.name);
    let invitationSlug = baseSlug;

    const supabase = createAdminClient();

    // Check for existing slug and add suffix if needed
    const { data: existingInvs } = await supabase
      .from('invitations')
      .select('slug')
      .ilike('slug', `${baseSlug}%`);

    if (existingInvs && existingInvs.length > 0) {
      const count = existingInvs.length;
      invitationSlug = `${baseSlug}-${(count + 1).toString().padStart(3, '0')}`;
    }
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
        groom_name: "",
        bride_name: "",
      }
    });

    console.log("✅ Order saved & Midtrans token generated:", orderId);

    // 3. Send Pending Payment Email (Wait for it to ensure delivery)
    const pendingEmailHtml = getPendingPaymentEmail(
      customerDetails.name,
      amount.toLocaleString("id-ID"),
      transaction.redirect_url
    );
    
    await sendEmailNotification(
      customerDetails.email,
      "Hampir Selesai! Pesanan Undangan MyPromise Kamu",
      pendingEmailHtml
    );

    return NextResponse.json({
      token: snapToken,
      redirectUrl: transaction.redirect_url,
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

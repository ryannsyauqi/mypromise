import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/utils/supabase/admin";
import { snap } from "@/lib/midtrans";
import { sendEmailNotification, sendAdminInternalNotification } from "@/lib/notifications";
import { getPendingPaymentEmail, getAdminInternalEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, templateSlug, amount, customerDetails, isLifetime } = body;
    
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

    // Check for existing slug in both tables
    let isUnique = false;
    let suffix = 0;
    
    while (!isUnique) {
      const currentCheck = suffix === 0 ? baseSlug : `${baseSlug}-${suffix.toString().padStart(3, '0')}`;
      
      // Check invitations table
      const { data: invCheck } = await supabase
        .from('invitations')
        .select('slug')
        .eq('slug', currentCheck)
        .maybeSingle();

      // Check orders table (the one causing the constraint error)
      const { data: orderCheck } = await supabase
        .from('orders')
        .select('inv_slug')
        .eq('inv_slug', currentCheck)
        .maybeSingle();

      if (!invCheck && !orderCheck) {
        invitationSlug = currentCheck;
        isUnique = true;
      } else {
        suffix++;
      }
      
      // Safety break to prevent infinite loop
      if (suffix > 999) break;
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
      notes: isLifetime ? 'Masa Aktif Selamanya' : null,
      expires_at: isLifetime ? '2099-12-31T23:59:59Z' : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
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

    // 3. Send Pending Payment Email to Customer
    const pendingEmailHtml = getPendingPaymentEmail(
      customerDetails.name,
      amount.toLocaleString("id-ID"),
      transaction.redirect_url,
      orderId
    );
    
    await sendEmailNotification(
      customerDetails.email,
      "Hampir Selesai! Pesanan Undangan MyPromise Kamu",
      pendingEmailHtml
    );

    // 4. Send Internal Admin HQ Notification
    const adminHqUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mypromise.id'}/admin/orders`;
    const adminHtml = getAdminInternalEmail(
      orderId,
      customerDetails.name,
      customerDetails.email,
      customerDetails.phone,
      templateSlug || "Template Undangan",
      amount,
      "pending",
      adminHqUrl
    );

    await sendAdminInternalNotification(
      `[Rp ${amount.toLocaleString("id-ID")}] Pesanan Baru Masuk #${orderId}`,
      adminHtml
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

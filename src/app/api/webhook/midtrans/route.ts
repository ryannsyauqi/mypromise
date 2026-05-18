import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendEmailNotification, sendAdminInternalNotification } from "@/lib/notifications";
import { getSuccessPaymentEmail, getAdminInternalEmail } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // 1. Verify notification authenticity (Security Check)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = crypto
      .createHash("sha512")
      .update(notification.order_id + notification.status_code + notification.gross_amount + serverKey)
      .digest("hex");

    if (signatureKey !== notification.signature_key) {
      console.error("❌ Invalid Midtrans Signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const orderId = notification.order_id;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    const supabase = createAdminClient();

    // 2. Handle Status
    if (
      (transactionStatus === "capture" && fraudStatus === "accept") ||
      transactionStatus === "settlement"
    ) {
      // Payment success!
      const { data: order, error: updateError } = await supabase
        .from("orders")
        .update({ payment_status: "paid" })
        .eq("order_number", orderId)
        .select(`
          *,
          templates:template_id (name)
        `)
        .single();

      if (updateError) {
        console.error("❌ Error updating order to paid:", updateError);
      } else if (order) {
        // --- TRIGGER NOTIFICATIONS ---
        const dashboardLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mypromise.id'}/dashboard/${order.id}`;

        // 1. Kirim Email ke Customer
        const successEmailHtml = getSuccessPaymentEmail(order.buyer_name, dashboardLink, order.order_number);
        await sendEmailNotification(
          order.buyer_email,
          "Pembayaran Berhasil 🎉 - Dashboard MyPromise",
          successEmailHtml
        );

        // 2. Kirim Email Notifikasi Internal ke Admin HQ
        const adminHqUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mypromise.id'}/admin/orders`;
        const templateName = order.templates?.name || "Template Undangan";
        const adminHtml = getAdminInternalEmail(
          order.order_number,
          order.buyer_name,
          order.buyer_email,
          order.buyer_phone,
          templateName,
          order.amount,
          "paid",
          adminHqUrl
        );

        await sendAdminInternalNotification(
          `[Rp ${order.amount.toLocaleString("id-ID")}] Successful Transaction #${order.order_number}`,
          adminHtml
        );

        console.log(`✅ Success notifications triggered for ${order.buyer_name}`);
      }
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      // Payment failed
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("order_number", orderId);

      if (error) console.error("❌ Error updating order to failed:", error);
    } else if (transactionStatus === "pending") {
      // Waiting for payment
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "pending" })
        .eq("order_number", orderId);

      if (error) console.error("❌ Error updating order to pending:", error);
    }

    return NextResponse.json({ message: "OK" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

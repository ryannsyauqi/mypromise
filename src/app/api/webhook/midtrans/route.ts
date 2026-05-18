import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendEmailNotification } from "@/lib/notifications";
import { getSuccessPaymentEmail } from "@/lib/email-templates";
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
        .select()
        .single();
      
      if (updateError) {
        console.error("❌ Error updating order to paid:", updateError);
      } else if (order) {
        // --- TRIGGER NOTIFICATIONS ---
        const dashboardLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://mypromise.id'}/dashboard/${order.id}`;
        
        // Kirim Email menggunakan template premium baru (Wait for it)
        const successEmailHtml = getSuccessPaymentEmail(order.buyer_name, dashboardLink, order.order_number);
        
        await sendEmailNotification(
          order.buyer_email, 
          "Pembayaran Berhasil 🎉 - Dashboard MyPromise", 
          successEmailHtml
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

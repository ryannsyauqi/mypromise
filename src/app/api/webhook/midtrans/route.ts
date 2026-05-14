import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendWhatsAppNotification, sendEmailNotification } from "@/lib/notifications";
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
        const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${order.id}`;
        const waMessage = `Halo ${order.buyer_name}! 🎉\n\nPembayaran kamu telah berhasil diverifikasi. Sekarang kamu bisa mulai mengatur undanganmu di dashboard MyPromise melalui link berikut:\n\n${dashboardLink}\n\nSelamat berkarya!`;
        
        // Kirim WhatsApp (Async - biarkan berjalan di background)
        sendWhatsAppNotification(order.buyer_phone, waMessage);
        
        // Kirim Email (Async)
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Pembayaran Berhasil! 🎉</h2>
            <p>Halo <strong>${order.buyer_name}</strong>,</p>
            <p>Terima kasih telah mempercayakan undangan pernikahan kamu kepada MyPromise.</p>
            <p>Kamu sekarang bisa mulai mengisi detail undangan dan memilih musik melalui dashboard pribadi kamu:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardLink}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Buka Dashboard Saya</a>
            </div>
            <p style="font-size: 0.9em; color: #666;">Jika tombol di atas tidak bekerja, kamu bisa copy-paste link berikut ke browser kamu:<br>${dashboardLink}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #999;">Ini adalah email otomatis, mohon tidak membalas email ini.</p>
          </div>
        `;
        
        sendEmailNotification(order.buyer_email, "Pembayaran Berhasil - Dashboard MyPromise", emailHtml);
        
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

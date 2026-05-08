import { NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // 1. Verify notification authenticity (Security Check)
    // Hash = SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = crypto
      .createHash("sha512")
      .update(notification.order_id + notification.status_code + notification.gross_amount + serverKey)
      .digest("hex");

    if (signatureKey !== notification.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const orderId = notification.order_id;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud: ${fraudStatus}`);

    // 2. Handle Status
    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        // Payment success!
        // TODO: Update order status to 'paid' in Supabase
        // TODO: Trigger email/whatsapp notification to buyer
      }
    } else if (transactionStatus === "settlement") {
      // Payment success! (usually for non-credit card)
      // TODO: Update order status to 'paid' in Supabase
      // TODO: Trigger email/whatsapp notification to buyer
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      // Payment failed
      // TODO: Update order status to 'failed' or 'expired' in Supabase
    } else if (transactionStatus === "pending") {
      // Waiting for payment
      // TODO: Update order status to 'pending' in Supabase
    }

    return NextResponse.json({ message: "OK" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

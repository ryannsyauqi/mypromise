import { createAdminClient } from "../src/utils/supabase/admin";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function simulate() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const supabase = createAdminClient();

  console.log("🚀 Memulai Simulasi Trial...");

  // 0. Ambil Template ID yang valid
  const { data: templates } = await supabase.from('templates').select('id').limit(1);
  const templateId = templates?.[0]?.id;

  if (!templateId) {
    console.error("❌ Tidak ada template di database. Jalankan migrasi dulu!");
    return;
  }

  // 1. Buat Order Dummy di Supabase
  const orderNumber = `TRIAL-${Math.floor(Math.random() * 100000)}`;
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      buyer_name: "Ryan Syauqi",
      buyer_email: "syauqiryan1@gmail.com",
      buyer_phone: "628123456789",
      template_id: templateId,
      amount: 175000,
      payment_status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error("❌ Gagal membuat order dummy:", orderError.message);
    return;
  }

  console.log(`✅ Order Dummy dibuat: ${orderNumber} (Status: Pending)`);

  // 2. Hitung Signature Key (Persis seperti yang dilakukan Midtrans)
  const statusCode = "200";
  const grossAmount = "175000.00";
  const signatureKey = crypto
    .createHash("sha512")
    .update(orderNumber + statusCode + grossAmount + serverKey)
    .digest("hex");

  // 3. Panggil Webhook Kita Sendiri (Simulasi Midtrans)
  console.log("📡 Mengirim sinyal pembayaran sukses ke Webhook...");
  
  const response = await fetch("http://localhost:3000/api/webhook/midtrans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: orderNumber,
      status_code: statusCode,
      gross_amount: grossAmount,
      transaction_status: "settlement",
      signature_key: signatureKey
    })
  });

  const result = await response.json();
  console.log("📨 Respon dari Webhook:", result);

  // 4. Cek Hasil di Database
  setTimeout(async () => {
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select('payment_status')
      .eq('order_number', orderNumber)
      .single();

    if (updatedOrder?.payment_status === 'paid') {
      console.log("🎉 BERHASIL! Status di database sudah berubah jadi 'PAID'.");
    } else {
      console.log("❌ GAGAL. Status database masih:", updatedOrder?.payment_status);
    }
  }, 2000);
}

simulate();

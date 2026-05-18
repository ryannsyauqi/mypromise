import { Resend } from "resend";
import { getSystemSettings } from "./settings";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Notification Service for MyPromise
 * Handles WhatsApp (via Fonnte) and Email (via Resend)
 */

export async function sendWhatsAppNotification(to: string, message: string) {
  const token = process.env.FONNTE_TOKEN; // Ambil dari .env.local
  
  if (!token) {
    console.warn("⚠️ FONNTE_TOKEN tidak ditemukan. WhatsApp tidak terkirim.");
    return { success: false, message: "Token missing" };
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: new URLSearchParams({
        target: to,
        message: message,
      }),
    });

    const result = await response.json();
    console.log("📲 Fonnte Result:", result);
    return { success: result.status, data: result };
  } catch (error) {
    console.error("❌ WhatsApp Error:", error);
    return { success: false, error };
  }
}

export async function sendEmailNotification(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY tidak ditemukan. Email tidak terkirim.");
    return { success: false, message: "Key missing" };
  }

  try {
    const settings = getSystemSettings();
    const { data, error } = await resend.emails.send({
      from: `${settings.websiteName} <halo@mypromise.id>`,
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("❌ Resend Error:", error);
      return { success: false, error };
    }

    console.log("📧 Email Sent to customer:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email Fatal Error:", error);
    return { success: false, error };
  }
}

export async function sendAdminInternalNotification(subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: "Key missing" };
  }

  try {
    const settings = getSystemSettings();
    const adminEmail = settings.notificationEmail || "syauqiryan1@gmail.com";

    const { data, error } = await resend.emails.send({
      from: `${settings.websiteName} HQ <halo@mypromise.id>`,
      to: [adminEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("❌ Admin Resend Error:", error);
      return { success: false, error };
    }

    console.log("📧 Admin HQ Notif Sent to " + adminEmail + ":", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Admin Email Fatal Error:", error);
    return { success: false, error };
  }
}

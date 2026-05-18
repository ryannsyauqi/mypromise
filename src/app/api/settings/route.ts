import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSystemSettings, saveSystemSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = getSystemSettings();
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_token")?.value === "authenticated";

    if (!isAdmin) {
      // Return only public non-sensitive settings to unauthenticated callers
      return NextResponse.json({
        websiteName: settings.websiteName,
        whatsappNumber: settings.whatsappNumber,
        notificationEmail: settings.notificationEmail,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("❌ GET /api/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_token")?.value === "authenticated";
    
    if (!isAdmin && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updated = saveSystemSettings(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("❌ POST /api/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

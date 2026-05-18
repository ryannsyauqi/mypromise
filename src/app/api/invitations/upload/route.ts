import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const uploadFormData = await request.formData();
    const file = uploadFormData.get("file") as File;
    const path = uploadFormData.get("path") as string;

    if (!file || !path) {
      return NextResponse.json({ message: "File and path are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Ensure bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    if (!buckets?.find((b) => b.id === "invitations")) {
      console.log("🛠 Creating 'invitations' bucket...");
      const { error: createError } = await supabase.storage.createBucket("invitations", {
        public: true,
        allowedMimeTypes: ["image/*", "audio/*"],
      });
      if (createError) throw createError;
    } else {
      try {
        await supabase.storage.updateBucket("invitations", {
          public: true,
          allowedMimeTypes: ["image/*", "audio/*"],
        });
      } catch (err) {
        console.warn("Notice updating bucket:", err);
      }
    }

    // 2. Prepare file
    const buffer = Buffer.from(await file.arrayBuffer());

    // 3. Upload file using Admin Client (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from("invitations")
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("invitations")
      .getPublicUrl(path);

    return NextResponse.json({ publicUrl });

  } catch (error: any) {
    console.error("❌ Invitation Upload API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Ensure bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    if (!buckets?.find((b) => b.id === "templates")) {
      console.log("🛠 Creating 'templates' bucket...");
      const { error: createError } = await supabase.storage.createBucket("templates", {
        public: true,
        allowedMimeTypes: ["image/*"],
      });
      if (createError) throw createError;
    }

    // 2. Prepare file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    // 3. Upload file using Admin Client (bypasses RLS)
    const { error: uploadError } = await supabase.storage
      .from("templates")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("templates")
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl });

  } catch (error: any) {
    console.error("❌ Admin Upload API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, slug } = body;

    if (!id) {
      return NextResponse.json({ message: "Invitation ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // Build update object
    const updateData: any = {};
    if (content) updateData.content = content;
    if (slug) {
      updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // If we're updating the slug, we mark it as customized in the content JSON
      const { data: current } = await supabase.from('invitations').select('content').eq('id', id).single();
      updateData.content = { 
        ...(current?.content || {}), 
        ...(content || {}),
        is_slug_customized: true 
      };
    }

    const { data, error } = await supabase
      .from('invitations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("❌ Update Error:", error);
      if (error.code === '23505') {
        return NextResponse.json({ message: "URL (slug) ini sudah digunakan. Silakan pilih yang lain." }, { status: 409 });
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Invitation updated successfully" });
    
  } catch (error: any) {
    console.error("❌ API Fatal Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

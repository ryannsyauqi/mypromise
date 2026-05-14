import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('invitation_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Wishes API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

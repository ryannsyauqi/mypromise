import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Get all templates currently in the DB
    const { data: allTemplates, error: fetchErr } = await supabase
      .from("templates")
      .select("*");

    if (fetchErr) throw fetchErr;

    // We want to keep exactly these 3 slugs:
    const slugsToKeep = ["minimalist-elegance", "modern-luxe", "garden-romance"];
    
    // Find the ID of the default "minimalist-elegance" template to reassign any orders
    const defaultTemplate = allTemplates?.find(t => t.slug === "minimalist-elegance");
    if (!defaultTemplate) {
      return NextResponse.json({
        success: false,
        message: "Default template 'minimalist-elegance' not found in database. Please ensure it exists first."
      }, { status: 400 });
    }

    const deletedSlugs: string[] = [];
    const keptSlugs: string[] = [];
    const migratedOrdersCount: Record<string, number> = {};

    for (const t of allTemplates || []) {
      if (slugsToKeep.includes(t.slug)) {
        keptSlugs.push(t.slug);
      } else {
        // Unwanted template!
        // First, check if there are orders referencing this template_id
        const { data: referencingOrders, error: orderErr } = await supabase
          .from("orders")
          .select("id")
          .eq("template_id", t.id);

        if (orderErr) {
          console.warn(`Warning checking orders for template ${t.slug}:`, orderErr);
        }

        if (referencingOrders && referencingOrders.length > 0) {
          // Reassign these orders to the default "minimalist-elegance" template
          const { error: updateErr } = await supabase
            .from("orders")
            .update({ template_id: defaultTemplate.id })
            .eq("template_id", t.id);

          if (updateErr) throw updateErr;
          migratedOrdersCount[t.slug] = referencingOrders.length;
        }

        // Also check if there are invitations referencing this template_id
        const { data: referencingInvitations, error: invErr } = await supabase
          .from("invitations")
          .select("id")
          .eq("template_id", t.id);

        if (invErr) {
          console.warn(`Warning checking invitations for template ${t.slug}:`, invErr);
        }

        if (referencingInvitations && referencingInvitations.length > 0) {
          // Reassign these invitations to the default "minimalist-elegance" template
          const { error: updateInvErr } = await supabase
            .from("invitations")
            .update({ template_id: defaultTemplate.id })
            .eq("template_id", t.id);

          if (updateInvErr) throw updateInvErr;
        }

        // Now safe to delete
        const { error: delErr } = await supabase
          .from("templates")
          .delete()
          .eq("id", t.id);

        if (delErr) throw delErr;
        deletedSlugs.push(t.slug);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database templates clean up completed successfully.",
      kept: keptSlugs,
      deleted: deletedSlugs,
      migratedOrders: migratedOrdersCount
    });

  } catch (error: any) {
    console.error("❌ Admin Clean Templates API GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

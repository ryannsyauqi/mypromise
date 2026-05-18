import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

function calculateRealProgress(order: any) {
  const template = order.templates;
  // Supabase might return an array for one-to-many or single object
  const invitation = Array.isArray(order.invitations) ? order.invitations[0] : order.invitations;
  const content = invitation?.content || {};
  const guests = order.guests || [];

  const baseFieldSchema = template?.field_schema && template?.field_schema.length > 0 
    ? template.field_schema 
    : [
        { key: "groom_name", type: "text", required: true },
        { key: "bride_name", type: "text", required: true },
        { key: "groom_full_name", type: "text", required: true },
        { key: "bride_full_name", type: "text", required: true },
        { key: "groom_parents", type: "text", required: true },
        { key: "bride_parents", type: "text", required: true },
        { key: "akad_date", type: "date", required: true },
        { key: "akad_time", type: "time", required: true },
        { key: "akad_venue", type: "text", required: true },
        { key: "akad_address", type: "textarea", required: true },
        { key: "reception_date", type: "date", required: true },
        { key: "reception_time", type: "time", required: true },
        { key: "reception_venue", type: "text", required: true },
        { key: "reception_address", type: "textarea", required: true },
        { key: "photo_hero", type: "file", required: true },
        { key: "photo_groom", type: "file", required: true },
        { key: "photo_bride", type: "file", required: true },
      ];
      
  const fieldSchema = [...baseFieldSchema];
  if (!fieldSchema.some((f: any) => f.key === "music_url")) {
    fieldSchema.push({
      key: "music_url",
      type: "file",
      required: true,
    });
  }

  const requiredFields = fieldSchema.filter((f: any) => f.required);

  const tab1Fields = requiredFields.filter((f: any) => (f.key.startsWith('groom') || f.key.startsWith('bride')) && f.type !== 'file');
  const tab1Total = tab1Fields.length || 1;
  const tab1Filled = tab1Fields.filter((f: any) => content[f.key] && content[f.key].toString().trim() !== "").length;
  const tab1Percent = Math.round((tab1Filled / tab1Total) * 100);

  const tab2Fields = requiredFields.filter((f: any) => f.key.startsWith('akad') || f.key.startsWith('reception') || f.key.includes('date'));
  const tab2Total = tab2Fields.length || 1;
  const tab2Filled = tab2Fields.filter((f: any) => content[f.key] && content[f.key].toString().trim() !== "").length;
  const tab2Percent = Math.round((tab2Filled / tab2Total) * 100);

  const hasLoveQuote = content.love_quote && content.love_quote.toString().trim() !== "";
  const hasGiftAddress = content.gift_address && content.gift_address.toString().trim() !== "";
  const hasLoveStory = Array.isArray(content.love_story) && content.love_story.length > 0 && content.love_story.some((story: any) => (story.title || story.description || "").toString().trim() !== "");
  const hasGiftAccounts = (content.bank_account_1 && content.bank_account_1.toString().trim() !== "") || 
                          (content.bank_account_2 && content.bank_account_2.toString().trim() !== "") ||
                          (Array.isArray(content.bank_accounts) && content.bank_accounts.length > 0 && content.bank_accounts.some((acc: any) => (acc.number || acc.name || "").toString().trim() !== ""));

  const tab3Percent = (hasLoveQuote || hasGiftAddress || hasLoveStory || hasGiftAccounts) ? 100 : 0;

  const tab4Fields = requiredFields.filter((f: any) => (f.type === 'file' || f.type === 'image') && f.key !== 'music_url' && f.key !== 'music');
  const tab4Total = tab4Fields.length || 1;
  const tab4Filled = tab4Fields.filter((f: any) => content[f.key] && content[f.key].toString().trim() !== "").length;
  const tab4Percent = Math.round((tab4Filled / tab4Total) * 100);

  const tab5Fields = requiredFields.filter((f: any) => f.key === 'music_url' || f.key === 'music');
  const tab5Total = tab5Fields.length || 1;
  const tab5Filled = tab5Fields.filter((f: any) => (content.music_url || content.music) && (content.music_url || content.music).toString().trim() !== "").length;
  const tab5Percent = Math.round((tab5Filled / tab5Total) * 100);

  const progressPercent = Math.min(Math.round((tab1Percent + tab2Percent + tab3Percent + tab4Percent + tab5Percent) / 5), 100);

  const isStep1Done = progressPercent === 100;
  const isStep2Done = content?.is_slug_customized === true;
  const isStep3Done = guests.length > 0;

  const step1Score = (progressPercent / 100) * 80;
  const step2Score = isStep2Done ? 10 : 0;
  const step3Score = isStep3Done ? 10 : 0;

  return Math.round(step1Score + step2Score + step3Score);
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, templates(name, slug, field_schema), invitations(content, slug), guests(id)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const enrichedOrders = (orders || []).map((order: any) => {
      const realProgress = calculateRealProgress(order);
      // Remove nested arrays from response payload to keep it light if needed, or keep them.
      // We will keep them for now, but attach real_progress
      return {
        ...order,
        real_progress: realProgress
      };
    });

    return NextResponse.json({ orders: enrichedOrders });

  } catch (error: any) {
    console.error("❌ Admin Orders API Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

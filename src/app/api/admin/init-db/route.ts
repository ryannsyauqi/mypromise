import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

const STANDARD_SCHEMA = [
  { key: "groom_name", label: "Nama Panggilan Mempelai Pria", type: "text", required: true },
  { key: "bride_name", label: "Nama Panggilan Mempelai Wanita", type: "text", required: true },
  { key: "groom_full_name", label: "Nama Lengkap Mempelai Pria", type: "text", required: true },
  { key: "bride_full_name", label: "Nama Lengkap Mempelai Wanita", type: "text", required: true },
  { key: "groom_parents", label: "Nama Orang Tua Mempelai Pria", type: "text", required: true, hint: "Contoh: Bapak Ahmad & Ibu Sari" },
  { key: "bride_parents", label: "Nama Orang Tua Mempelai Wanita", type: "text", required: true },
  { key: "akad_date", label: "Tanggal Akad", type: "date", required: true },
  { key: "akad_time", label: "Waktu Akad", type: "time", required: true },
  { key: "akad_venue", label: "Nama Tempat Akad", type: "text", required: true },
  { key: "akad_address", label: "Alamat Lengkap Akad", type: "textarea", required: true },
  { key: "reception_date", label: "Tanggal Resepsi", type: "date", required: true },
  { key: "reception_time", label: "Waktu Resepsi", type: "time", required: true },
  { key: "reception_venue", label: "Nama Tempat Resepsi", type: "text", required: true },
  { key: "reception_address", label: "Alamat Lengkap Resepsi", type: "textarea", required: true },
  { key: "maps_link", label: "Link Google Maps Venue", type: "url", required: false },
  { key: "love_quote", label: "Kutipan / Ayat / Quote", type: "textarea", required: false, hint: "Ayat Al-Quran, puisi, atau kata-kata favorit kalian." },
  { key: "bank_account_1", label: "Rekening 1", type: "text", required: false, hint: "Format: Nama Bank — Nomor Rekening — Nama Pemilik" },
  { key: "bank_account_2", label: "Rekening 2", type: "text", required: false },
  { key: "photo_hero", label: "Foto Utama", type: "file", required: true, hint: "Foto yang akan muncul di bagian paling atas." },
  { key: "photo_groom", label: "Foto Mempelai Pria", type: "file", required: true },
  { key: "photo_bride", label: "Foto Mempelai Wanita", type: "file", required: true },
  { key: "gallery", label: "Galeri Foto", type: "multi_file", required: false, hint: "Unggah beberapa foto untuk galeri." },
];

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Update all templates with standard schema if they are empty
    const { data: templates, error: tErr } = await supabase
      .from('templates')
      .select('id, field_schema');
    
    if (tErr) throw tErr;

    let updatedCount = 0;
    for (const t of templates || []) {
      // Force update to ensure latest standard schema
      await supabase
        .from('templates')
        .update({ field_schema: STANDARD_SCHEMA })
        .eq('id', t.id);
      updatedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updatedCount} templates with standard schema.`,
      templatesCount: templates?.length 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

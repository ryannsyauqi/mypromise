import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const orderId = params.orderId;

  // Fetch data using Admin Client to bypass RLS for public access via UUID
  const supabase = createAdminClient();
  
  // Get invitation and related order/template
  const { data: invitationData } = await supabase
    .from('invitations')
    .select('*, orders(*, templates(*))')
    .eq('order_id', orderId)
    .single();

  if (!invitationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-charcoal-900">Dashboard Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md">Maaf, kami tidak dapat menemukan data untuk pesanan ini. Pastikan link yang kamu buka sudah benar.</p>
        <Link href="/" className="px-8 py-3 bg-charcoal-900 text-white font-bold rounded-xl hover:bg-rose-500 transition-all">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Get guests stats
  const { data: guestData } = await supabase
    .from('guests')
    .select('status')
    .eq('order_id', orderId);

  const initialData = {
    ...invitationData,
    guests: guestData || []
  };

  return <DashboardClient initialData={initialData} orderId={orderId} />;
}

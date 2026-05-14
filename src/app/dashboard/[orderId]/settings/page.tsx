import InvitationSettingsForm from "./InvitationSettingsForm";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";

export default async function SettingsPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const orderId = params.orderId;

  const supabase = createAdminClient();
  const { data: invitationData } = await supabase
    .from('invitations')
    .select('*, orders(*, templates(*))')
    .eq('order_id', orderId)
    .single();

  if (!invitationData) {
    return notFound();
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Pengaturan URL Undangan
        </h1>
        <p className="text-charcoal-400 mt-2">Ubah alamat link undangan kamu agar lebih personal dan mudah diingat.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-cream-200 shadow-sm overflow-hidden">
        <InvitationSettingsForm initialData={invitationData} />
      </div>
    </div>
  );
}

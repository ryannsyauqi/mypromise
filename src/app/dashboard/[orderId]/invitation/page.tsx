import InvitationForm from "./InvitationForm";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";

export default async function EditInvitationPage(props: { params: Promise<{ orderId: string }> }) {
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
    <div className="animate-fade-in flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Data Pernikahan
        </h1>
        <p className="text-charcoal-400 mt-2">Isi detail hari bahagia kamu di bawah ini dan simpan perubahannya</p>
      </div>

      <div style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        <InvitationForm initialData={invitationData} />
      </div>
    </div>
  );
}

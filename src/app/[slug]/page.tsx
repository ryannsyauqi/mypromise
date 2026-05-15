import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import MinimalistTemplate from "@/components/invitation/MinimalistTemplate";

export const dynamic = "force-dynamic";

export default async function InvitationPage(props: { params: Promise<{ slug: string }>, searchParams: Promise<{ to?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const guestName = searchParams.to;

  const supabase = createAdminClient();

  // Fetch invitation by slug
  // design_config is added here as a future-proof column
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*, orders(*, templates(*))')
    .eq('slug', slug)
    .single();

  if (error || !invitation) {
    console.error("Invitation not found for slug:", slug, error);
    return notFound();
  }

  const templateData = invitation.orders?.templates;
  const content = invitation.content || {};
  
  // designConfig will hold template-specific tweaks (backgrounds, fonts, etc.)
  const designConfig = invitation.design_config || {};

  // Logika Pemilihan Template (Switcher)
  // Saat ini kita fallback ke MinimalistTemplate, 
  // tapi kodenya sudah siap menerima template lain.
  const renderTemplate = () => {
    // Nantinya kita bisa switch berdasarkan templateData.slug atau ID
    // switch(templateData?.id) {
    //   case 'elegant-001': return <ElegantTemplate ... />
    // }
    
    return (
      <MinimalistTemplate 
        invitationId={invitation.id}
        data={content} 
        designConfig={designConfig}
        guestName={guestName} 
        isDemo={false} 
      />
    );
  };

  return (
    <main>
      {renderTemplate()}
    </main>
  );
}

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
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*, orders(*, templates(*))')
    .eq('slug', slug)
    .single();

  if (error || !invitation) {
    console.error("Invitation not found for slug:", slug, error);
    return notFound();
  }

  const template = invitation.orders?.templates;
  const content = invitation.content || {};

  // For now, we only have MinimalistTemplate. 
  // In a real app, you'd switch based on template.slug
  return (
    <main>
      <MinimalistTemplate 
        data={content} 
        guestName={guestName} 
        isDemo={false} 
      />
    </main>
  );
}

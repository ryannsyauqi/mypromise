import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import MinimalistTemplate from "@/components/invitation/MinimalistTemplate";
import ModernLuxeTemplate from "@/components/invitation/ModernLuxeTemplate";
import GardenRomanceTemplate from "@/components/invitation/GardenRomanceTemplate";
import AurelTemplate from "@/components/invitation/AurelTemplate";
import CelesteTemplate from "@/components/invitation/CelesteTemplate";
import MirelleTemplate from "@/components/invitation/MirelleTemplate";
import SakaTemplate from "@/components/invitation/SakaTemplate";
import TirtaTemplate from "@/components/invitation/TirtaTemplate";
import WulanTemplate from "@/components/invitation/WulanTemplate";
import JasmineTemplate from "@/components/invitation/JasmineTemplate";
import FernTemplate from "@/components/invitation/FernTemplate";
import DahliaTemplate from "@/components/invitation/DahliaTemplate";

export const dynamic = "force-dynamic";

export default async function InvitationPage(props: { params: Promise<{ slug: string }>, searchParams: Promise<{ to?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const urlParam = searchParams.to;

  const supabase = createAdminClient();

  let guestName: string | undefined = undefined;
  let guestSlug: string | undefined = undefined;

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

  const order = invitation.orders;
  if (order) {
    const isLifetime = order.notes?.includes('Selamanya') || order.expires_at?.startsWith('2099');
    if (!isLifetime && order.created_at) {
      const createdDate = new Date(order.created_at);
      const expiryDate = order.expires_at ? new Date(order.expires_at) : new Date(new Date(createdDate.getTime()).setFullYear(createdDate.getFullYear() + 1));
      if (new Date() > expiryDate) {
        return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md p-8 md:p-12 rounded-[32px] border border-slate-700 shadow-2xl space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-rose-500/10">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Link Undangan Telah Berakhir
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Masa aktif undangan ini telah habis (365 hari sejak pemesanan). Terima kasih telah mempercayakan momen berharga Anda kepada MyPromise.
              </p>
              <div className="pt-4 border-t border-slate-700/80">
                <a 
                  href="/" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                >
                  Buat Undangan Baru
                </a>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  const templateData = invitation.orders?.templates;
  const content = invitation.content || {};

  // Fetch real guest name and slug if urlParam exists in database
  if (urlParam) {
    const { data: guestData } = await supabase
      .from('guests')
      .select('name, url_param')
      .eq('order_id', invitation.order_id)
      .eq('url_param', urlParam)
      .single();

    if (guestData) {
      guestName = guestData.name;
      guestSlug = guestData.url_param;
    }
  }
  
  // designConfig will hold template-specific tweaks (backgrounds, fonts, etc.)
  const designConfig = invitation.design_config || {};

  const renderTemplate = () => {
    const templateSlug = templateData?.slug || "minimalist-elegance";
    
    switch (templateSlug) {
      case "aurel":
        return (
          <AurelTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "celeste":
        return (
          <CelesteTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "mirelle":
        return (
          <MirelleTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "saka":
        return (
          <SakaTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "tirta":
        return (
          <TirtaTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "wulan":
        return (
          <WulanTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "jasmine":
        return (
          <JasmineTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "fern":
        return (
          <FernTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "dahlia":
        return (
          <DahliaTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "modern-luxe":
        return (
          <ModernLuxeTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "garden-romance":
        return (
          <GardenRomanceTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
      case "minimalist-elegance":
      default:
        return (
          <MinimalistTemplate 
            invitationId={invitation.id}
            data={content} 
            designConfig={designConfig}
            guestName={guestName} 
            guestSlug={guestSlug}
            isDemo={false} 
          />
        );
    }
  };

  return (
    <main>
      {renderTemplate()}
    </main>
  );
}

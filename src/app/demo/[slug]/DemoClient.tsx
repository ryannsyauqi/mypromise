"use client";

import MinimalistTemplate from "@/components/invitation/MinimalistTemplate";

interface DemoClientProps {
  slug: string;
  guestName?: string;
  data: {
    groom_name: string;
    bride_name: string;
    groom_full_name: string;
    bride_full_name: string;
    groom_parents: string;
    bride_parents: string;
    akad_date: string;
    akad_time: string;
    akad_venue: string;
    akad_address: string;
    reception_date: string;
    reception_time: string;
    reception_venue: string;
    reception_address: string;
    maps_link?: string;
    love_quote?: string;
    bank_account_1?: string;
    bank_account_2?: string;
    love_story?: { date: string; title: string; description: string }[];
    photo_hero: string;
    photo_groom: string;
    photo_bride: string;
  };
  templateName: string;
}

export default function DemoClient({ guestName, data, templateName }: DemoClientProps) {
  // For now, all templates render the Minimalist Template
  // In the future, different slugs will render different template components
  return (
    <>
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-charcoal-800 text-white text-center py-2 px-4">
        <p className="text-xs flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-rose-400">
            <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-4 9c-.83 0-1.5-.67-1.5-1.5S7.17 8 8 8s1.5.67 1.5 1.5S8.83 11 8 11zm3-4c-.83 0-1.5-.67-1.5-1.5S10.17 4 11 4s1.5.67 1.5 1.5S11.83 7 11 7zm5 0c-.83 0-1.5-.67-1.5-1.5S15.17 4 16 4s1.5.67 1.5 1.5S16.83 7 16 7zm1 5c-.83 0-1.5-.67-1.5-1.5S16.17 9 17 9s1.5.67 1.5 1.5S17.83 12 17 12z"/>
          </svg>
          <span className="font-semibold">Mode Demo</span> — {templateName} •{" "}
          <a href="/templates" className="underline hover:text-rose-300 transition-colors">
            Pilih Template Ini
          </a>
        </p>
      </div>
      <div className="pt-8">
        <MinimalistTemplate invitationId="demo-id" data={data} guestName={guestName} isDemo />
      </div>
    </>
  );
}

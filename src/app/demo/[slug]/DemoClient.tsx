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
        <p className="text-xs">
          🎨 <span className="font-semibold">Mode Demo</span> — {templateName} •{" "}
          <a href="/templates" className="underline hover:text-rose-300 transition-colors">
            Pilih Template Ini
          </a>
        </p>
      </div>
      <div className="pt-8">
        <MinimalistTemplate data={data} guestName={guestName} isDemo />
      </div>
    </>
  );
}

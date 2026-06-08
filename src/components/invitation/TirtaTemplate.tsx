"use client";

import { useState, useEffect } from "react";
import TemplateLayout from "@/components/invitation/TemplateLayout";
import CountdownTimer from "@/components/invitation/CountdownTimer";
import ScrollReveal from "@/components/invitation/ScrollReveal";
import RSVPForm from "@/components/invitation/RSVPForm";
import { demoWishes } from "@/lib/demo-data";

interface InvitationData {
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
  bank_accounts?: { bank: string; number: string; name: string }[];
  gift_address?: string;
  love_story?: { date: string; title: string; description: string }[];
  photo_hero: string;
  photo_groom: string;
  photo_bride: string;
  music_url?: string;
  music?: string;
  [key: string]: any;
}

interface TirtaTemplateProps {
  invitationId: string;
  data: InvitationData;
  designConfig?: any;
  guestName?: string;
  guestSlug?: string;
  isDemo?: boolean;
}

function formatEventFullDate(dateStr: string) {
  if (!dateStr) return "Tanggal Belum Diatur";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Tanggal Tidak Valid";
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getGoogleCalendarUrl(title: string, date: string, time: string, venue: string, address: string) {
  if (!date || !time) return "#";
  try {
    const start = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
    const hourPart = time.split(":")[0];
    const endHour = String(Number(hourPart) + 2).padStart(2, "0");
    const end = `${date.replace(/-/g, "")}T${endHour}${time.split(":")[1]}00`;
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${start}/${end}`,
      location: `${venue || ""}, ${address || ""}`,
      details: `Undangan Pernikahan — ${title}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (e) {
    return "#";
  }
}

const Icons = {
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2050/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2050/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2050/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2050/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-[#2D7D6F]">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  WaterIkatDivider: () => (
    <svg width="100" height="20" viewBox="0 0 100 20" fill="none" className="text-[#2D7D6F]/65 mx-auto">
      <path d="M 0 10 Q 12.5 0 25 10 T 50 10 T 75 10 T 100 10" stroke="currentColor" strokeWidth="1" />
      <path d="M 0 14 Q 12.5 4 25 14 T 50 14 T 75 14 T 100 14" stroke="#C4622D" strokeWidth="0.75" opacity="0.6" />
      <circle cx="50" cy="10" r="1.5" fill="currentColor" />
    </svg>
  )
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function TirtaTemplate({
  invitationId,
  data,
  designConfig,
  guestName,
  guestSlug,
  isDemo
}: TirtaTemplateProps) {
  const [wishes, setWishes] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const displayName = guestName || "Tamu Undangan";
  const heroImage = data.photo_hero || PLACEHOLDER_IMAGE;
  const groomImage = data.photo_groom || PLACEHOLDER_IMAGE;
  const brideImage = data.photo_bride || PLACEHOLDER_IMAGE;

  const galleryPhotos = Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : (isDemo ? [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop"
  ] : []);

  const parseAccounts = (invData: any) => {
    if (Array.isArray(invData?.bank_accounts) && invData.bank_accounts.length > 0) {
      return invData.bank_accounts.map((acc: any) => {
        if (!acc) return null;
        let b = acc.bank || "";
        let n = acc.number || "";
        let nm = acc.name || "";
        if (b && (b.includes("–") || b.includes("—") || (b.includes("-") && b.length > 15))) {
          const parts = b.split(/\s*[-–—]\s*/).map((s: string) => s.trim());
          b = parts[0] || "BCA";
          n = parts[1] || n;
          nm = parts[2] || nm;
        }
        return { bank: b, number: n, name: nm };
      }).filter((acc: any) => acc && (acc.number || acc.name));
    }
    return [invData?.bank_account_1, invData?.bank_account_2].filter(Boolean).map(acc => {
      const parts = acc!.split(/\s*[-–—]\s*/).map((p: string) => p.trim());
      return { bank: parts[0] || "", number: parts[1] || "", name: parts[2] || "" };
    }).filter(acc => acc && (acc.number || acc.name));
  };

  const accountsList = parseAccounts(data);

  useEffect(() => {
    async function loadWishes() {
      if (isDemo) {
        setWishes(demoWishes);
        return;
      }
      try {
        const response = await fetch(`/api/invitations/${invitationId}/wishes`);
        if (response.ok) {
          const wishData = await response.json();
          if (Array.isArray(wishData)) {
            setWishes(wishData);
          }
        }
      } catch (error) {
        console.error("Failed to load wishes:", error);
      }
    }
    loadWishes();
  }, [invitationId, isDemo]);

  const handleCopy = (num: string, index: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (selectedPhotoIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex(prev => prev === null || prev === 0 ? galleryPhotos.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex(prev => prev === null || prev === galleryPhotos.length - 1 ? 0 : prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, galleryPhotos.length]);

  return (
    <TemplateLayout
      invitationId={invitationId}
      data={data}
      guestName={displayName}
      guestSlug={guestSlug}
      isDemo={isDemo}
      theme="nusantara"
    >
      {/* 
        Tirta: Tenun Ikat, Fluid Water Geometries (Near White #FAFAF8, Teal #2D7D6F & Terracotta #C4622D accents, Playfair + Plus Jakarta Sans)
      */}
      <div className="bg-[#FAFAF8] text-[#1C2B2B] font-sans font-light min-h-screen relative p-4 sm:p-6 md:p-8 select-none">
        
        {/* Wave pattern background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#2D7D6F_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

        {/* Structural margins */}
        <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#2D7D6F]/10 pointer-events-none z-0" />
        <div className="absolute inset-5 sm:inset-7 md:inset-9 border border-[#C4622D]/10 pointer-events-none z-0" />

        <div className="relative z-10 max-w-lg mx-auto py-16 px-4 sm:px-6 space-y-36 text-center">
          
          {/* Section 1: Opening */}
          <section className="space-y-6">
            <ScrollReveal delay={100} direction="none">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C4622D]">TIRTA PAMILUT</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-serif italic text-3xl text-[#1C2B2B] leading-normal font-medium">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#4A6060] mb-4">
                Assalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>

            {data.love_quote && (
              <ScrollReveal delay={400} direction="up">
                <div className="py-6 px-4 border-y border-[#2D7D6F]/20 max-w-xs mx-auto space-y-4">
                  <p className="font-serif italic text-sm text-[#4A6060] leading-relaxed">
                    &ldquo;{data.love_quote}&rdquo;
                  </p>
                  <Icons.WaterIkatDivider />
                </div>
              </ScrollReveal>
            )}
          </section>

          {/* Hero Cover (Mobile Only) */}
          <section className="space-y-6 lg:hidden">
            <ScrollReveal delay={100} direction="none">
              <div className="border border-[#2D7D6F]/20 p-2.5 bg-white shadow-xl relative max-w-xs mx-auto rounded-3xl overflow-hidden">
                <div className="absolute inset-1.5 border border-[#C4622D]/25 rounded-[18px] pointer-events-none" />
                <img 
                  src={heroImage} 
                  alt="Hero Image" 
                  className="w-full aspect-[4/5] object-cover rounded-[18px]" 
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="space-y-3">
                <h1 className="font-serif text-4xl font-normal tracking-wide text-[#1C2B2B]">
                  {data.groom_name} &amp; {data.bride_name}
                </h1>
                <p className="text-[10px] text-[#4A6060] tracking-[0.2em] uppercase font-bold">
                  {formatEventFullDate(data.akad_date)}
                </p>
                <div className="pt-6 max-w-xs mx-auto">
                  <CountdownTimer targetDate={data.akad_date} />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Couple Profiles */}
          <section className="space-y-24">
            <ScrollReveal delay={100} direction="up">
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">PRAWIRA WANODYA</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#1C2B2B] uppercase">PASANGAN MEMPELAI</h2>
                <Icons.WaterIkatDivider />
              </div>
            </ScrollReveal>

            {/* Groom */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#2D7D6F]/20 p-2 bg-white shadow-sm relative rounded-[32px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#C4622D]/15 rounded-[24px] pointer-events-none" />
                  <img 
                    src={groomImage} 
                    alt={data.groom_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-[24px] grayscale-[5%] hover:grayscale-0 transition-all duration-[850ms]" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2 pt-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#2D7D6F]">PRAMA PRIYA</span>
                  <h3 className="font-serif text-2xl font-normal text-[#1C2B2B]">{data.groom_full_name}</h3>
                  <p className="text-[11px] text-[#4A6060] leading-relaxed">Putra tercinta dari {data.groom_parents}</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100} direction="none">
              <span className="font-serif italic text-4xl text-[#C4622D]">&amp;</span>
            </ScrollReveal>

            {/* Bride */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#2D7D6F]/20 p-2 bg-white shadow-sm relative rounded-[32px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#C4622D]/15 rounded-[24px] pointer-events-none" />
                  <img 
                    src={brideImage} 
                    alt={data.bride_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-[24px] grayscale-[5%] hover:grayscale-0 transition-all duration-[850ms]" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2 pt-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#2D7D6F]">DAHAYU KANYA</span>
                  <h3 className="font-serif text-2xl font-normal text-[#1C2B2B]">{data.bride_full_name}</h3>
                  <p className="text-[11px] text-[#4A6060] leading-relaxed">Putri tercinta dari {data.bride_parents}</p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Love Story */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">KASIH MENGALIR</span>
                  <h2 className="font-serif text-2xl font-normal tracking-widest text-[#1C2B2B] uppercase">ALUR CERITA</h2>
                  <Icons.WaterIkatDivider />
                </div>
              </ScrollReveal>

              <div className="space-y-8 relative">
                {data.love_story.map((story, i) => (
                  <ScrollReveal key={i} delay={150 * i} direction="up">
                    <div className="border border-[#2D7D6F]/20 p-6 bg-white/40 space-y-2 text-center relative rounded-2xl shadow-3xs">
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#C4622D]/70" />
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#2D7D6F]/70" />
                      
                      <span className="text-[9px] font-bold text-[#C4622D] tracking-widest uppercase">{story.date}</span>
                      <h3 className="font-serif text-lg font-normal text-[#1C2B2B]">{story.title}</h3>
                      <p className="text-[11px] text-[#4A6060] leading-relaxed">{story.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          <section className="space-y-16">
            <ScrollReveal delay={100} direction="up">
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">SAMAYA WIGUNA</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#1C2B2B] uppercase">HARI BAHAGIA</h2>
                <Icons.WaterIkatDivider />
              </div>
            </ScrollReveal>

            {/* Akad */}
            <ScrollReveal delay={150} direction="up">
              <div className="border border-[#2D7D6F]/25 bg-white/30 p-8 space-y-6 rounded-[32px] shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C4622D]/20 rounded-[24px] pointer-events-none" />
                <h3 className="font-serif text-2xl font-light italic text-[#2D7D6F]">Akad Nikah</h3>
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#1C2B2B]">{formatEventFullDate(data.akad_date)}</p>
                  <p className="text-[10px] text-[#4A6060] uppercase tracking-widest font-light">{data.akad_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#2D7D6F]/10">
                  <p className="font-serif text-lg font-medium text-[#1C2B2B]">{data.akad_venue}</p>
                  <p className="text-[11px] text-[#4A6060] leading-relaxed max-w-xs mx-auto">{data.akad_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Akad ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D7D6F] text-white hover:bg-[#C4622D] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest rounded-xl cursor-pointer shadow-sm"
                >
                  <Icons.Calendar /> Simpan Kalender
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi */}
            <ScrollReveal delay={200} direction="up">
              <div className="border border-[#2D7D6F]/25 bg-white/30 p-8 space-y-6 rounded-[32px] shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C4622D]/20 rounded-[24px] pointer-events-none" />
                <h3 className="font-serif text-2xl font-light italic text-[#2D7D6F]">Resepsi</h3>
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#1C2B2B]">{formatEventFullDate(data.reception_date)}</p>
                  <p className="text-[10px] text-[#4A6060] uppercase tracking-widest font-light">{data.reception_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#2D7D6F]/10">
                  <p className="font-serif text-lg font-medium text-[#1C2B2B]">{data.reception_venue}</p>
                  <p className="text-[11px] text-[#4A6060] leading-relaxed max-w-xs mx-auto">{data.reception_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D7D6F] text-white hover:bg-[#C4622D] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest rounded-xl cursor-pointer shadow-sm"
                >
                  <Icons.Calendar /> Simpan Kalender
                </a>
              </div>
            </ScrollReveal>

            {data.maps_link && (
              <ScrollReveal delay={250} direction="up">
                <a 
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2D7D6F] hover:bg-[#C4622D] text-white transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl cursor-pointer shadow-md"
                >
                  <Icons.MapPin /> NAVIGASI GOOGLE MAPS
                </a>
              </ScrollReveal>
            )}
          </section>

          {/* Photo Gallery */}
          {galleryPhotos.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">RAYA RUPA</span>
                  <h2 className="font-serif text-3xl font-normal tracking-widest text-[#1C2B2B] uppercase">GALERI DOKUMENTASI</h2>
                  <Icons.WaterIkatDivider />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-4">
                {galleryPhotos.map((url: string, idx: number) => (
                  <ScrollReveal key={idx} delay={100 * idx} direction="up">
                    <div 
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#2D7D6F]/20 p-1 bg-white rounded-2xl"
                    >
                      <img 
                        src={url} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover rounded-xl grayscale-[5%] hover:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {/* RSVP & Wishes */}
          <section className="space-y-12">
            <ScrollReveal delay={100} direction="up">
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">SUBHA MANGGALA</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#1C2B2B] uppercase">KONFIRMASI RAWUH</h2>
                <Icons.WaterIkatDivider />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="up">
              <div className="border border-[#2D7D6F]/20 bg-white/40 p-6 rounded-3xl shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C4622D]/15 rounded-[20px] pointer-events-none" />
                <RSVPForm 
                  invitationId={invitationId} 
                  guestName={guestName} 
                  guestSlug={guestSlug}
                  isDemo={isDemo} 
                  onSuccess={() => {
                    fetch(`/api/invitations/${invitationId}/wishes`)
                      .then(res => res.json())
                      .then(data => {
                        if (Array.isArray(data)) setWishes(data);
                        else setWishes([]);
                      })
                      .catch(e => console.error("Error fetching wishes:", e));
                  }}
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {wishes.length === 0 ? (
                  <p className="text-[11px] text-[#4A6060] italic text-center">Belum ada ucapan doa. Sumangga paring restu!</p>
                ) : (
                  wishes.map((w, i) => (
                    <div key={i} className="bg-white/50 border border-[#2D7D6F]/20 p-4 text-left space-y-1 rounded-2xl shadow-3xs">
                      <div className="flex items-center justify-between border-b border-[#2D7D6F]/10 pb-1">
                        <span className="font-bold text-[11px] text-[#1C2B2B]">{w.name}</span>
                        <span className="text-[9px] text-[#4A6060]">{new Date(w.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-[11px] text-[#4A6060] leading-relaxed">{w.message}</p>
                      <div className="pt-1 text-[8px] font-bold uppercase tracking-wider text-[#2D7D6F]">
                        {w.attendance === "hadir" ? "• Rawuh" : w.attendance === "tidak_hadir" ? "• Absent" : "• Belum Pasti"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollReveal>
          </section>

          {/* Gift */}
          {(accountsList.length > 0 || data.gift_address) && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">DANA TRESNA</span>
                  <h2 className="font-serif text-3xl font-normal tracking-widest text-[#1C2B2B] uppercase">KADO DIGITAL</h2>
                  <Icons.WaterIkatDivider />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} direction="up">
                <div className="space-y-6">
                  {accountsList.length > 0 && (
                    <div className="space-y-4">
                      {accountsList.map((acc: any, i: number) => (
                        <div key={i} className="border border-[#2D7D6F]/20 bg-white p-5 text-center space-y-2 rounded-2xl shadow-3xs relative">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D7D6F]">{acc.bank}</p>
                          <p className="font-mono text-base font-bold text-[#1C2B2B] tracking-wider">{acc.number}</p>
                          <p className="text-[9px] text-[#4A6060] uppercase tracking-widest">a.n. {acc.name}</p>
                          <button
                            onClick={() => handleCopy(acc.number, i)}
                            className="inline-flex items-center gap-1.5 text-[9px] text-[#2D7D6F] font-bold hover:text-[#C4622D] transition-colors cursor-pointer uppercase tracking-widest"
                          >
                            <Icons.Copy /> {copiedIndex === i ? "Tersalin!" : "Salin Rekening"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.gift_address && (
                    <div className="border border-[#2D7D6F]/20 bg-white p-6 text-center space-y-2 rounded-2xl shadow-3xs">
                      <p className="text-[9px] uppercase tracking-wider text-[#C4622D] font-bold">Kirim Kado Fisik</p>
                      <p className="text-[11px] text-[#1C2B2B] leading-relaxed max-w-xs mx-auto">{data.gift_address}</p>
                      <button
                        onClick={() => handleCopy(data.gift_address || "", 99)}
                        className="inline-flex items-center gap-1.5 text-[9px] text-[#2D7D6F] font-bold hover:text-[#C4622D] transition-colors cursor-pointer uppercase tracking-widest"
                      >
                        <Icons.Copy /> {copiedIndex === 99 ? "Tersalin!" : "Salin Alamat"}
                      </button>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* Closing */}
          <section className="space-y-6 py-10">
            <ScrollReveal delay={100} direction="up">
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C4622D]">TERIMA KASIH</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-serif text-3xl font-normal text-[#1C2B2B]">
                {data.groom_name} &amp; {data.bride_name}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[11px] text-[#4A6060] leading-relaxed max-w-xs mx-auto">
                Kasinggihan pangabekten sarta panuwun katur dhumateng panjenengan sedaya ingkang kepareng rawuh lan paring berkah pangestu.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#4A6060] mt-4">
                Wassalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>
          </section>

          {/* Footer Branding */}
          <div className="pt-10 border-t border-[#2D7D6F]/10 text-center">
            <p className="text-[9px] text-[#4A6060] tracking-widest uppercase">
              Dibuat oleh{" "}
              <a href="https://mypromise.id" className="text-[#2D7D6F] font-bold hover:underline ml-1">
                MyPromise
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 animate-fade-in backdrop-blur-md cursor-pointer"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 border border-white/10"
            title="Tutup (Esc)"
          >
            <Icons.Close />
          </button>

          {galleryPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(prev => prev === null || prev === 0 ? galleryPhotos.length - 1 : prev - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 border border-white/10"
                title="Sebelumnya"
              >
                <Icons.ChevronLeft />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(prev => prev === null || prev === galleryPhotos.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-50 border border-white/10"
                title="Berikutnya"
              >
                <Icons.ChevronRight />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-auto h-auto rounded-xl overflow-hidden shadow-2xl border border-white/20 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[selectedPhotoIndex]}
              alt={`Gallery preview ${selectedPhotoIndex + 1}`}
              className="max-h-[80vh] max-w-[85vw] object-contain rounded-xl mx-auto"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1C2B2B]/90 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase shadow-xl">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </TemplateLayout>
  );
}

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

interface SakaTemplateProps {
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-amber-700">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  KawungOrnament: () => (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="text-[#B8860B] opacity-55 mx-auto">
      {/* Small Javanese-inspired Kawung shape */}
      <path d="M30 12C22 12 18 4 30 0C42 4 38 12 30 12Z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 12C22 12 18 20 30 24C42 20 38 12 30 12Z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 12C30 4 22 0 18 12C22 24 30 20 30 12Z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 12C30 4 38 0 42 12C38 24 30 20 30 12Z" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="30" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function SakaTemplate({
  invitationId,
  data,
  designConfig,
  guestName,
  guestSlug,
  isDemo
}: SakaTemplateProps) {
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
        Saka: Javanese Heritage (Warm Parchment, Deep Warm Brown, Gold Accent, Playfair + Plus Jakarta Sans)
        Kawung SVG pattern.
      */}
      <div className="bg-[#F5F0E8] text-[#2C1810] font-sans font-light min-h-screen relative p-4 sm:p-6 md:p-8 select-none">
        
        {/* Subtle Kawung pattern background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#B8860B_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

        {/* Outer borders */}
        <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#B8860B]/15 pointer-events-none z-0" />
        <div className="absolute inset-5 sm:inset-7 md:inset-9 border border-[#2C1810]/5 pointer-events-none z-0" />

        <div className="relative z-10 max-w-lg mx-auto py-16 px-4 sm:px-6 space-y-36 text-center">
          
          {/* Section 1: Opening */}
          <section className="space-y-6">
            <ScrollReveal delay={100} direction="none">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">SERAT PARIPURNA</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-serif italic text-3xl text-[#2C1810] leading-normal font-medium">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7A5C3A] mb-4">
                Assalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>

            {data.love_quote && (
              <ScrollReveal delay={400} direction="up">
                <div className="py-6 px-4 border-y border-[#B8860B]/20 max-w-xs mx-auto space-y-3">
                  <p className="font-serif italic text-sm text-[#7A5C3A] leading-relaxed">
                    &ldquo;{data.love_quote}&rdquo;
                  </p>
                  <Icons.KawungOrnament />
                </div>
              </ScrollReveal>
            )}
          </section>

          {/* Hero Cover (Mobile Only) */}
          <section className="space-y-6 lg:hidden">
            <ScrollReveal delay={100} direction="none">
              <div className="border-2 border-[#B8860B]/35 p-2 bg-[#F5F0E8] shadow-lg relative max-w-xs mx-auto">
                <div className="absolute inset-1 border border-[#B8860B]/20 pointer-events-none" />
                <img 
                  src={heroImage} 
                  alt="Hero Image" 
                  className="w-full aspect-[4/5] object-cover grayscale-[5%]" 
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="space-y-3">
                <h1 className="font-serif text-4xl font-normal tracking-wide text-[#2C1810]">
                  {data.groom_name} &amp; {data.bride_name}
                </h1>
                <p className="text-[10px] text-[#7A5C3A] tracking-[0.2em] uppercase font-bold">
                  {formatEventFullDate(data.akad_date)}
                </p>
                <div className="pt-6 max-w-xs mx-auto">
                  <CountdownTimer targetDate={data.akad_date} />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Javanese Heritage Couple Profiles */}
          <section className="space-y-20">
            <ScrollReveal delay={100} direction="up">
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">PASANGAN LUHUR</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#2C1810] uppercase">MANGGALA PARAS</h2>
                <Icons.KawungOrnament />
              </div>
            </ScrollReveal>

            {/* Groom */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#B8860B]/20 p-2 bg-white shadow-xs relative rounded-t-[100px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#B8860B]/10 pointer-events-none rounded-t-[90px]" />
                  <img 
                    src={groomImage} 
                    alt={data.groom_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-t-[90px] grayscale-[10%] hover:grayscale-0 transition-all duration-[800ms]" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">PRAMESTHI PRIYA</span>
                  <h3 className="font-serif text-2xl font-normal text-[#2C1810]">{data.groom_full_name}</h3>
                  <p className="text-[11px] text-[#7A5C3A] leading-relaxed">Putra Kakung saking {data.groom_parents}</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100} direction="none">
              <span className="font-serif italic text-4xl text-[#B8860B]">&amp;</span>
            </ScrollReveal>

            {/* Bride */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#B8860B]/20 p-2 bg-white shadow-xs relative rounded-t-[100px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#B8860B]/10 pointer-events-none rounded-t-[90px]" />
                  <img 
                    src={brideImage} 
                    alt={data.bride_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-t-[90px] grayscale-[10%] hover:grayscale-0 transition-all duration-[800ms]" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">SEKAR AYU</span>
                  <h3 className="font-serif text-2xl font-normal text-[#2C1810]">{data.bride_full_name}</h3>
                  <p className="text-[11px] text-[#7A5C3A] leading-relaxed">Putri Ayu saking {data.bride_parents}</p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Love Story */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">TITIAN KASIH</span>
                  <h2 className="font-serif text-2xl font-normal tracking-widest text-[#2C1810] uppercase">LELAKON PINATHI</h2>
                  <Icons.KawungOrnament />
                </div>
              </ScrollReveal>

              <div className="space-y-8 relative">
                {data.love_story.map((story, i) => (
                  <ScrollReveal key={i} delay={150 * i} direction="up">
                    <div className="border border-[#B8860B]/20 p-6 bg-white/40 space-y-2 text-center relative shadow-3xs">
                      {/* Javanese-inspired corner frames */}
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#B8860B]/60" />
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#B8860B]/60" />
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#B8860B]/60" />
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#B8860B]/60" />
                      
                      <span className="text-[9px] font-bold text-[#B8860B] tracking-widest uppercase">{story.date}</span>
                      <h3 className="font-serif text-lg font-normal text-[#2C1810]">{story.title}</h3>
                      <p className="text-[11px] text-[#7A5C3A] leading-relaxed">{story.description}</p>
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
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">PANGGIH WIDHI</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#2C1810] uppercase">KRAMAN AGUNG</h2>
                <Icons.KawungOrnament />
              </div>
            </ScrollReveal>

            {/* Akad */}
            <ScrollReveal delay={150} direction="up">
              <div className="border-2 border-[#B8860B]/20 bg-white/30 p-8 space-y-6 shadow-sm relative">
                <div className="absolute inset-1 border border-[#B8860B]/10 pointer-events-none" />
                <h3 className="font-serif text-2xl font-light italic text-[#B8860B]">Palakrama (Akad)</h3>
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#2C1810]">{formatEventFullDate(data.akad_date)}</p>
                  <p className="text-[10px] text-[#7A5C3A] uppercase tracking-widest font-light">{data.akad_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#B8860B]/20">
                  <p className="font-serif text-lg font-medium text-[#2C1810]">{data.akad_venue}</p>
                  <p className="text-[11px] text-[#7A5C3A] leading-relaxed max-w-xs mx-auto">{data.akad_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Akad ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white hover:bg-[#B8860B] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest cursor-pointer shadow-sm"
                >
                  <Icons.Calendar /> Catat Kalender
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi */}
            <ScrollReveal delay={200} direction="up">
              <div className="border-2 border-[#B8860B]/20 bg-white/30 p-8 space-y-6 shadow-sm relative">
                <div className="absolute inset-1 border border-[#B8860B]/10 pointer-events-none" />
                <h3 className="font-serif text-2xl font-light italic text-[#B8860B]">Pahargan (Resepsi)</h3>
                <div className="space-y-1.5">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#2C1810]">{formatEventFullDate(data.reception_date)}</p>
                  <p className="text-[10px] text-[#7A5C3A] uppercase tracking-widest font-light">{data.reception_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#B8860B]/20">
                  <p className="font-serif text-lg font-medium text-[#2C1810]">{data.reception_venue}</p>
                  <p className="text-[11px] text-[#7A5C3A] leading-relaxed max-w-xs mx-auto">{data.reception_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white hover:bg-[#B8860B] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest cursor-pointer shadow-sm"
                >
                  <Icons.Calendar /> Catat Kalender
                </a>
              </div>
            </ScrollReveal>

            {data.maps_link && (
              <ScrollReveal delay={250} direction="up">
                <a 
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2C1810] hover:bg-[#B8860B] text-white transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer shadow-md"
                >
                  <Icons.MapPin /> NAVIGASI MAPS
                </a>
              </ScrollReveal>
            )}
          </section>

          {/* Photo Gallery */}
          {galleryPhotos.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">CITRA SASMITA</span>
                  <h2 className="font-serif text-3xl font-normal tracking-widest text-[#2C1810] uppercase">MOMEN CATHETAN</h2>
                  <Icons.KawungOrnament />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-4">
                {galleryPhotos.map((url: string, idx: number) => (
                  <ScrollReveal key={idx} delay={100 * idx} direction="up">
                    <div 
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border-2 border-[#B8860B]/10 p-1.5 bg-[#F5F0E8]"
                    >
                      <img 
                        src={url} 
                        alt={`Gallery ${idx + 1}`} 
                        className="w-full h-full object-cover grayscale-[5%] hover:grayscale-0 transition-all duration-500" 
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
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">PANGGIH DHATU</span>
                <h2 className="font-serif text-3xl font-normal tracking-widest text-[#2C1810] uppercase">KONFIRMASI ARUH</h2>
                <Icons.KawungOrnament />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="up">
              <div className="border border-[#B8860B]/20 bg-white/40 p-6 shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#B8860B]/10 pointer-events-none" />
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
                  <p className="text-[11px] text-[#7A5C3A] italic text-center">Dereng wonten ucapan. Sumangga paring donga restu!</p>
                ) : (
                  wishes.map((w, i) => (
                    <div key={i} className="bg-white/50 border border-[#B8860B]/20 p-4 text-left space-y-1 shadow-3xs">
                      <div className="flex items-center justify-between border-b border-[#B8860B]/20 pb-1">
                        <span className="font-bold text-[11px] text-[#2C1810]">{w.name}</span>
                        <span className="text-[9px] text-[#7A5C3A]">{new Date(w.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-[11px] text-[#7A5C3A] leading-relaxed">{w.message}</p>
                      <div className="pt-1 text-[8px] font-bold uppercase tracking-wider text-[#B8860B]">
                        {w.attendance === "hadir" ? "• Rawuh" : w.attendance === "tidak_hadir" ? "• Alangan" : "• Dereng Pasti"}
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
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">TANDHA TRESNA</span>
                  <h2 className="font-serif text-3xl font-normal tracking-widest text-[#2C1810] uppercase">HADIAH MANDHIRI</h2>
                  <Icons.KawungOrnament />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} direction="up">
                <div className="space-y-6">
                  {accountsList.length > 0 && (
                    <div className="space-y-4">
                      {accountsList.map((acc: any, i: number) => (
                        <div key={i} className="border border-[#B8860B]/20 bg-white p-5 text-center space-y-2 relative shadow-3xs">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">{acc.bank}</p>
                          <p className="font-mono text-base font-bold text-[#2C1810] tracking-wider">{acc.number}</p>
                          <p className="text-[9px] text-[#7A5C3A] uppercase tracking-widest">a.n. {acc.name}</p>
                          <button
                            onClick={() => handleCopy(acc.number, i)}
                            className="inline-flex items-center gap-1.5 text-[9px] text-[#B8860B] font-bold hover:text-[#2C1810] transition-colors cursor-pointer uppercase tracking-widest"
                          >
                            <Icons.Copy /> {copiedIndex === i ? "Tersalin!" : "Salin Rekening"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.gift_address && (
                    <div className="border border-[#B8860B]/20 bg-white p-6 text-center space-y-2 relative shadow-3xs">
                      <p className="text-[9px] uppercase tracking-wider text-[#B8860B] font-bold">Alamat Kado</p>
                      <p className="text-[11px] text-[#2C1810] leading-relaxed max-w-xs mx-auto">{data.gift_address}</p>
                      <button
                        onClick={() => handleCopy(data.gift_address || "", 99)}
                        className="inline-flex items-center gap-1.5 text-[9px] text-[#B8860B] font-bold hover:text-[#2C1810] transition-colors cursor-pointer uppercase tracking-widest"
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
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#B8860B]">MATUR NUWUN</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-serif text-3xl font-normal text-[#2C1810]">
                {data.groom_name} &amp; {data.bride_name}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[11px] text-[#7A5C3A] leading-relaxed max-w-xs mx-auto">
                Matur nuwun sanget dhumateng rawuh lan donga pangestu Bapak/Ibu/Sederek sedaya wonten ing dinten kramaning gesang kawulo.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7A5C3A] mt-4">
                Wassalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>
          </section>

          {/* Footer Branding */}
          <div className="pt-10 border-t border-[#B8860B]/20 text-center">
            <p className="text-[9px] text-[#7A5C3A] tracking-widest uppercase">
              Dibuat oleh{" "}
              <a href="https://mypromise.id" className="text-[#B8860B] font-bold hover:underline ml-1">
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#2C1810]/90 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase shadow-xl">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </TemplateLayout>
  );
}

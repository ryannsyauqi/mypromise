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

interface JasmineTemplateProps {
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-[#6B8C6B]">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  JasmineDivider: () => (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-[#6B8C6B] opacity-75 mx-auto">
      {/* Handcrafted jasmine blossom divider path */}
      <path d="M30 10 C32 6, 38 6, 36 10 C38 14, 32 14, 30 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 10 C28 6, 22 6, 24 10 C22 14, 28 14, 30 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 10 C26 12, 26 18, 30 16 C34 18, 34 12, 30 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 10 C26 8, 26 2, 30 4 C34 2, 34 8, 30 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="30" cy="10" r="1" fill="#D4A96A" />
      <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
      <line x1="40" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
    </svg>
  )
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function JasmineTemplate({
  invitationId,
  data,
  designConfig,
  guestName,
  guestSlug,
  isDemo
}: JasmineTemplateProps) {
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
      theme="floral"
    >
      {/* 
        Jasmine: Watercolor Melati (Cream #FAF7F4, Blush #C17B8C, Sage Green #6B8C6B, Gold #D4A96A, Cormorant + DM Sans)
        Organic noise texture.
      */}
      <div className="bg-[#FAF7F4] text-[#2D2420] font-sans font-light min-h-screen relative p-4 sm:p-6 md:p-8 select-none">
        
        {/* Subtle noise paper texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none z-0">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* Structural margins */}
        <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#6B8C6B]/15 pointer-events-none z-0" />
        <div className="absolute inset-5 sm:inset-7 md:inset-9 border border-[#C17B8C]/10 pointer-events-none z-0" />

        <div className="relative z-10 max-w-lg mx-auto py-16 px-4 sm:px-6 space-y-36 text-center">
          
          {/* Opening */}
          <section className="space-y-6">
            <ScrollReveal delay={100} direction="none">
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">JASMINE BLOSSOM</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-cormorant italic text-3xl text-[#6B8C6B] leading-normal">
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7D6B5E] mb-4">
                Assalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>

            {data.love_quote && (
              <ScrollReveal delay={400} direction="up">
                <div className="py-6 px-4 border-y border-[#6B8C6B]/25 max-w-xs mx-auto space-y-4">
                  <p className="font-cormorant italic text-base text-[#7D6B5E] leading-relaxed">
                    &ldquo;{data.love_quote}&rdquo;
                  </p>
                  <Icons.JasmineDivider />
                </div>
              </ScrollReveal>
            )}
          </section>

          {/* Hero Cover (Mobile Only) */}
          <section className="space-y-6 lg:hidden">
            <ScrollReveal delay={100} direction="none">
              <div className="border border-[#6B8C6B]/20 p-2.5 bg-white shadow-xl relative max-w-xs mx-auto rounded-t-[120px] overflow-hidden">
                <div className="absolute inset-2 border border-[#C17B8C]/20 rounded-t-[110px] pointer-events-none" />
                <img 
                  src={heroImage} 
                  alt="Hero Image" 
                  className="w-full aspect-[3/4] object-cover rounded-t-[110px]" 
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <div className="space-y-3">
                <h1 className="font-cormorant text-4xl font-light tracking-wide text-[#2D2420]">
                  {data.groom_name} &amp; {data.bride_name}
                </h1>
                <p className="text-[10px] text-[#7D6B5E] tracking-[0.2em] uppercase font-bold">
                  {formatEventFullDate(data.akad_date)}
                </p>
                <div className="pt-6 max-w-xs mx-auto">
                  <CountdownTimer targetDate={data.akad_date} />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Couple profiles */}
          <section className="space-y-24">
            <ScrollReveal delay={100} direction="up">
              <div className="space-y-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">THE BEAUTIFUL SOULS</span>
                <h2 className="font-cormorant text-3xl font-light tracking-widest text-[#2D2420] uppercase">KASIH MELATI</h2>
                <Icons.JasmineDivider />
              </div>
            </ScrollReveal>

            {/* Groom */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#6B8C6B]/20 p-2 bg-white shadow-sm relative rounded-t-[100px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#C17B8C]/15 rounded-t-[90px] pointer-events-none" />
                  <img 
                    src={groomImage} 
                    alt={data.groom_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-t-[90px] grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#C17B8C]">Mempelai Pria</span>
                  <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#2D2420]">{data.groom_full_name}</h3>
                  <p className="text-[11px] text-[#7D6B5E] leading-relaxed">Putra tercinta dari {data.groom_parents}</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={100} direction="none">
              <span className="font-cormorant italic text-4xl text-[#C17B8C]">&amp;</span>
            </ScrollReveal>

            {/* Bride */}
            <div className="space-y-6 max-w-xs mx-auto">
              <ScrollReveal delay={150} direction="up">
                <div className="border border-[#6B8C6B]/20 p-2 bg-white shadow-sm relative rounded-t-[100px] overflow-hidden">
                  <div className="absolute inset-2 border border-[#C17B8C]/15 rounded-t-[90px] pointer-events-none" />
                  <img 
                    src={brideImage} 
                    alt={data.bride_full_name} 
                    className="w-full aspect-[2/3] object-cover rounded-t-[90px] grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={250} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#C17B8C]">Mempelai Wanita</span>
                  <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#2D2420]">{data.bride_full_name}</h3>
                  <p className="text-[11px] text-[#7D6B5E] leading-relaxed">Putri tercinta dari {data.bride_parents}</p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Love story with slight organic rotation */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">BLOSSOM STORIES</span>
                  <h2 className="font-cormorant text-2xl font-light tracking-widest text-[#2D2420] uppercase">PERJALANAN KITA</h2>
                  <Icons.JasmineDivider />
                </div>
              </ScrollReveal>

              <div className="space-y-8 relative">
                {data.love_story.map((story, i) => (
                  <ScrollReveal key={i} delay={150 * i} direction="up" rotate={i % 2 === 0 ? 1 : -1}>
                    <div className="border border-[#6B8C6B]/20 p-6 bg-white/60 space-y-2 text-center relative rounded-2xl shadow-3xs hover:scale-[1.01] transition-transform duration-300">
                      <span className="text-[9px] font-bold text-[#C17B8C] tracking-widest uppercase">{story.date}</span>
                      <h3 className="font-cormorant text-lg font-bold text-[#2D2420]">{story.title}</h3>
                      <p className="text-[11px] text-[#7D6B5E] leading-relaxed">{story.description}</p>
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
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">THE WEDDING DAY</span>
                <h2 className="font-cormorant text-3xl font-light tracking-widest text-[#2D2420] uppercase">HARI PERNIKAHAN</h2>
                <Icons.JasmineDivider />
              </div>
            </ScrollReveal>

            {/* Akad */}
            <ScrollReveal delay={150} direction="up">
              <div className="border border-[#6B8C6B]/25 bg-white/30 p-8 space-y-6 rounded-t-[60px] shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C17B8C]/15 rounded-t-[50px] pointer-events-none" />
                <h3 className="font-cormorant text-2xl font-light italic text-[#6B8C6B]">Akad Nikah</h3>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D2420]">{formatEventFullDate(data.akad_date)}</p>
                  <p className="text-[10px] text-[#7D6B5E] uppercase tracking-widest font-light">{data.akad_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#6B8C6B]/10">
                  <p className="font-cormorant text-lg font-medium text-[#2D2420]">{data.akad_venue}</p>
                  <p className="text-[11px] text-[#7D6B5E] leading-relaxed max-w-xs mx-auto">{data.akad_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Akad ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B8C6B] text-white hover:bg-[#C17B8C] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest rounded-full cursor-pointer shadow-sm"
                >
                  <Icons.Calendar /> Simpan Kalender
                </a>
              </div>
            </ScrollReveal>

            {/* Resepsi */}
            <ScrollReveal delay={200} direction="up">
              <div className="border border-[#6B8C6B]/25 bg-white/30 p-8 space-y-6 rounded-t-[60px] shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C17B8C]/15 rounded-t-[50px] pointer-events-none" />
                <h3 className="font-cormorant text-2xl font-light italic text-[#6B8C6B]">Resepsi</h3>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D2420]">{formatEventFullDate(data.reception_date)}</p>
                  <p className="text-[10px] text-[#7D6B5E] uppercase tracking-widest font-light">{data.reception_time} WIB</p>
                </div>
                <div className="space-y-1 pt-4 border-t border-[#6B8C6B]/10">
                  <p className="font-cormorant text-lg font-medium text-[#2D2420]">{data.reception_venue}</p>
                  <p className="text-[11px] text-[#7D6B5E] leading-relaxed max-w-xs mx-auto">{data.reception_address}</p>
                </div>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B8C6B] text-white hover:bg-[#C17B8C] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest rounded-full cursor-pointer shadow-sm"
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6B8C6B] hover:bg-[#C17B8C] text-white transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full cursor-pointer shadow-md"
                >
                  <Icons.MapPin /> NAVIGASI MAPS
                </a>
              </ScrollReveal>
            )}
          </section>

          {/* Photo Gallery with organic rotation */}
          {galleryPhotos.length > 0 && (
            <section className="space-y-12">
              <ScrollReveal delay={100} direction="up">
                <div className="space-y-2">
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">GARDEN PORTRAIT</span>
                  <h2 className="font-cormorant text-3xl font-light tracking-widest text-[#2D2420] uppercase">MOMEN INDAH</h2>
                  <Icons.JasmineDivider />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-4">
                {galleryPhotos.map((url: string, idx: number) => (
                  <ScrollReveal key={idx} delay={100 * idx} direction="up" rotate={idx % 2 === 0 ? -1.5 : 1.5}>
                    <div 
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="relative aspect-[3/4] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 border border-[#6B8C6B]/20 p-1 bg-white rounded-2xl"
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
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">CONFIRMATION</span>
                <h2 className="font-cormorant text-3xl font-light tracking-widest text-[#2D2420] uppercase">KONFIRMASI DOA</h2>
                <Icons.JasmineDivider />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150} direction="up">
              <div className="border border-[#6B8C6B]/20 bg-white/40 p-6 rounded-[32px] shadow-sm relative">
                <div className="absolute inset-1.5 border border-[#C17B8C]/15 rounded-[24px] pointer-events-none" />
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
                  <p className="text-[11px] text-[#7D6B5E] italic text-center">Belum ada ucapan doa. Tulis doa indah Anda!</p>
                ) : (
                  wishes.map((w, i) => (
                    <div key={i} className="bg-white/50 border border-[#6B8C6B]/20 p-4 text-left space-y-1 rounded-2xl shadow-3xs animate-fade-in">
                      <div className="flex items-center justify-between border-b border-[#6B8C6B]/10 pb-1">
                        <span className="font-bold text-[11px] text-[#2D2420]">{w.name}</span>
                        <span className="text-[9px] text-[#7D6B5E]">{new Date(w.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-[11px] text-[#7D6B5E] leading-relaxed">{w.message}</p>
                      <div className="pt-1 text-[8px] font-bold uppercase tracking-wider text-[#6B8C6B]">
                        {w.attendance === "hadir" ? "• Hadir" : w.attendance === "tidak_hadir" ? "• Tidak Hadir" : "• Belum Pasti"}
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
                  <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">TANDA KASIH</span>
                  <h2 className="font-cormorant text-3xl font-light tracking-widest text-[#2D2420] uppercase">KIRIM HADIAH</h2>
                  <Icons.JasmineDivider />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150} direction="up">
                <div className="space-y-6">
                  {accountsList.length > 0 && (
                    <div className="space-y-4">
                      {accountsList.map((acc: any, i: number) => (
                        <div key={i} className="border border-[#6B8C6B]/20 bg-white p-5 text-center space-y-2 rounded-2xl shadow-3xs relative">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B8C6B]">{acc.bank}</p>
                          <p className="font-mono text-base font-bold text-[#2D2420] tracking-wider">{acc.number}</p>
                          <p className="text-[9px] text-[#7D6B5E] uppercase tracking-widest">a.n. {acc.name}</p>
                          <button
                            onClick={() => handleCopy(acc.number, i)}
                            className="inline-flex items-center gap-1.5 text-[9px] text-[#6B8C6B] font-bold hover:text-[#C17B8C] transition-colors cursor-pointer uppercase tracking-widest"
                          >
                            <Icons.Copy /> {copiedIndex === i ? "Tersalin!" : "Salin Rekening"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.gift_address && (
                    <div className="border border-[#6B8C6B]/20 bg-white p-6 text-center space-y-2 rounded-2xl shadow-3xs">
                      <p className="text-[9px] uppercase tracking-wider text-[#C17B8C] font-bold">Kado Fisik</p>
                      <p className="text-[11px] text-[#2D2420] leading-relaxed max-w-xs mx-auto">{data.gift_address}</p>
                      <button
                        onClick={() => handleCopy(data.gift_address || "", 99)}
                        className="inline-flex items-center gap-1.5 text-[9px] text-[#6B8C6B] font-bold hover:text-[#C17B8C] transition-colors cursor-pointer uppercase tracking-widest"
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
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C17B8C]">DEEPEST THANKS</span>
            </ScrollReveal>

            <ScrollReveal delay={200} direction="up">
              <h2 className="font-cormorant text-3xl font-light text-[#2D2420]">
                {data.groom_name} &amp; {data.bride_name}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up">
              <p className="text-[11px] text-[#7D6B5E] leading-relaxed max-w-xs mx-auto">
                Kebaikan Bapak/Ibu/Saudara/i sekalian dalam mendoakan restu bagi pernikahan kami sangat berarti. Terima kasih.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up">
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#7D6B5E] mt-4">
                Wassalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>
          </section>

          {/* Footer Branding */}
          <div className="pt-10 border-t border-[#6B8C6B]/15 text-center">
            <p className="text-[9px] text-[#7D6B5E] tracking-widest uppercase">
              Dibuat oleh{" "}
              <a href="https://mypromise.id" className="text-[#6B8C6B] font-bold hover:underline ml-1">
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#2D2420]/90 backdrop-blur-md rounded-full border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase shadow-xl">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </TemplateLayout>
  );
}

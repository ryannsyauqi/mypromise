"use client";

import { useState, useEffect } from "react";
import TemplateLayout from "@/components/invitation/TemplateLayout";
import CountdownTimer from "@/components/invitation/CountdownTimer";
import ScrollReveal from "@/components/invitation/ScrollReveal";
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

interface AurelTemplateProps {
  invitationId: string;
  data: InvitationData;
  designConfig?: any;
  guestName?: string;
  guestSlug?: string;
  isDemo?: boolean;
}

function formatEventDayName(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", { weekday: "long" }).toUpperCase();
}

function formatEventDateNum(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.getDate().toString().padStart(2, "0");
}

function formatEventMonthYear(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const month = date.toLocaleDateString("id-ID", { month: "long" }).toUpperCase();
  const year = date.getFullYear();
  return `${month} ${year}`;
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
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline text-[#C9A96E] mx-1">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function AurelTemplate({
  invitationId,
  data,
  designConfig,
  guestName,
  guestSlug,
  isDemo
}: AurelTemplateProps) {
  const [wishes, setWishes] = useState<any[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Custom Minimalist RSVP Form states
  const displayName = guestName || "Tamu Undangan";
  const [rsvpName, setRsvpName] = useState(displayName);
  const [attendance, setAttendance] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const heroImage = data.photo_hero || PLACEHOLDER_IMAGE;
  const groomImage = data.photo_groom || PLACEHOLDER_IMAGE;
  const brideImage = data.photo_bride || PLACEHOLDER_IMAGE;
  
  const galleryPhotos = Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : (isDemo ? [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000&auto=format&fit=crop"
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

  // Sync internal RSVP name if guestName prop changes
  useEffect(() => {
    if (guestName) {
      setRsvpName(guestName);
    }
  }, [guestName]);

  // Fetch wishes
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

  // RSVP Form handler
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !attendance) return;

    if (isDemo) {
      setRsvpSubmitted(true);
      const newWish = {
        name: rsvpName,
        attendance,
        message: rsvpMessage,
        created_at: new Date().toISOString()
      };
      setWishes(prev => [newWish, ...prev]);
      return;
    }

    setRsvpLoading(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId,
          name: rsvpName,
          guestSlug,
          attendance,
          guestCount,
          message: rsvpMessage
        }),
      });

      if (!response.ok) throw new Error("Failed to save RSVP");
      
      setRsvpSubmitted(true);
      const wishesRes = await fetch(`/api/invitations/${invitationId}/wishes`);
      if (wishesRes.ok) {
        const wishData = await wishesRes.json();
        if (Array.isArray(wishData)) {
          setWishes(wishData);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim konfirmasi. Silakan coba lagi.");
    } finally {
      setRsvpLoading(false);
    }
  };

  // Keyboard navigation for Lightbox
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
      theme="elegant"
    >
      {/* 
        Aurel HIGH-END REDESIGN: Editorial Luxury Minimalist.
        - Background is a gorgeous "dotted cardstock" paper texture using subtle dot patterns.
        - Delicate blind-pressed borders and double keylines in light gray and warm gold.
        - Symmetrical balance matching classic letterpress invitations.
        - Sophisticated gold script flourishes (Great Vibes script ampersand).
        - Mat-framed portraits (p-2 background cards with inner thin gold keylines).
        - Frame-bordered cards with gold corner bracket ornaments.
        - Clean typographic editorial layout with generous breathing space.
      */}
      <div className="bg-[#FDFAF6] bg-[radial-gradient(#E8E0D4_1px,transparent_1px)] [background-size:24px_24px] text-[#1A1A1A] font-jost font-light min-h-screen relative p-4 sm:p-6 md:p-8 select-none">
        
        {/* Double-line Boutique Press Borders around the whole layout wrapper */}
        <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#E8E0D4] pointer-events-none z-0" />
        <div className="absolute inset-5 sm:inset-7 md:inset-9 border border-[#C9A96E]/20 pointer-events-none z-0" />

        {/* Main Content Area */}
        <div className="relative z-10 max-w-lg mx-auto py-20 px-4 sm:px-8 space-y-40 text-center">

          {/* ===== SECTION 1: HEADER & OPENING (THE TITLE CARD) ===== */}
          <section className="py-12 space-y-10">
            <ScrollReveal delay={100} direction="none" duration={1200}>
              <div className="space-y-3 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE WEDDING OF</span>
                
                {/* Thin gold foil luxury vector divider */}
                <div className="flex items-center justify-center gap-3 w-32 py-2">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                  <span className="text-[#C9A96E] text-[8px]">✦</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250} direction="up" duration={1000}>
              <h1 className="font-cormorant text-5xl sm:text-6xl font-light tracking-wide text-[#1A1A1A] leading-none">
                {data.groom_name}
                <span className="font-script text-5xl text-[#C9A96E] block my-2">&</span>
                {data.bride_name}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="up" duration={1000}>
              <div className="space-y-6 pt-4 flex flex-col items-center">
                <p className="font-cormorant italic text-2xl text-[#C9A96E]/90">
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-[#6B6459] leading-relaxed">
                  Assalamu&apos;alaikum Wr. Wb.
                </p>
                
                {data.love_quote && (
                  <div className="border border-[#C9A96E]/20 bg-white/40 backdrop-blur-xs p-6 relative max-w-xs mx-auto text-center shadow-xs">
                    {/* Tiny pressed gold brackets on quote card corners */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#C9A96E]/30" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#C9A96E]/30" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#C9A96E]/30" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#C9A96E]/30" />
                    
                    <p className="font-cormorant italic text-sm text-[#6B6459] leading-relaxed font-light">
                      &ldquo;{data.love_quote}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </section>

          {/* ===== SECTION 2: HERO PORTRAIT (MAT-FRAMED DESIGN) ===== */}
          <section className="space-y-8 lg:hidden flex flex-col items-center">
            <ScrollReveal delay={150} direction="none" duration={1200} className="w-full max-w-sm">
              {/* Gold Mat Frame for Portrait */}
              <div className="border border-[#C9A96E]/30 p-2.5 bg-white shadow-md relative">
                <div className="absolute inset-3 border border-[#C9A96E]/10 pointer-events-none" />
                <img 
                  src={heroImage} 
                  alt={`${data.groom_name} & ${data.bride_name}`} 
                  className="w-full aspect-[3/4] object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-700" 
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300} direction="up" className="w-full max-w-sm">
              {/* High Contrast Dark Charcoal countdown block to read white countdown timer perfectly */}
              <div className="bg-[#1A1A1A] text-white p-6 border border-[#C9A96E]/20 relative shadow-lg">
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#C9A96E]/40" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#C9A96E]/40" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#C9A96E]/40" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#C9A96E]/40" />
                
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C9A96E] block mb-4">SAVE THE DATE</span>
                <p className="text-[10px] text-[#E8E0D4] tracking-[0.2em] uppercase font-light mb-6">
                  {formatEventFullDate(data.akad_date)}
                </p>
                <div className="pt-2 border-t border-white/10">
                  <CountdownTimer targetDate={data.akad_date} />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* ===== SECTION 3: THE COUPLE ===== */}
          <section className="space-y-24">
            <ScrollReveal delay={100}>
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE COUPLE</span>
                <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Mempelai</h2>
                
                <div className="flex items-center justify-center gap-3 w-24 py-2">
                  <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                  <span className="text-[#C9A96E] text-[6px]">✦</span>
                  <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                </div>
              </div>
            </ScrollReveal>

            {/* Groom Details */}
            <div className="space-y-6 max-w-sm mx-auto">
              <ScrollReveal direction="up" delay={150}>
                {/* Mat frame for Groom photo */}
                <div className="border border-[#C9A96E]/30 p-2 bg-white shadow-xs relative">
                  <div className="absolute inset-2.5 border border-[#C9A96E]/10 pointer-events-none" />
                  <img 
                    src={groomImage} 
                    alt={data.groom_full_name} 
                    className="w-full aspect-[2/3] object-cover grayscale-[25%] hover:grayscale-0 transition-all duration-[800ms]" 
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={250}>
                <div className="space-y-3">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#C9A96E]">THE GROOM</span>
                  <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#1A1A1A]">
                    {data.groom_full_name}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#C9A96E]/40 mx-auto" />
                  <p className="text-[11px] text-[#6B6459] leading-relaxed">
                    Putra dari pasangan <br />
                    <span className="font-medium text-[#1A1A1A] text-xs font-cormorant tracking-wider block mt-1 uppercase">{data.groom_parents}</span>
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Subtle Gold Fleur Divider */}
            <div className="flex justify-center py-6 text-[#C9A96E]/30 text-xl font-light select-none">
              ✦ ✦ ✦
            </div>

            {/* Bride Details */}
            <div className="space-y-6 max-w-sm mx-auto">
              <ScrollReveal direction="up" delay={150}>
                {/* Mat frame for Bride photo */}
                <div className="border border-[#C9A96E]/30 p-2 bg-white shadow-xs relative">
                  <div className="absolute inset-2.5 border border-[#C9A96E]/10 pointer-events-none" />
                  <img 
                    src={brideImage} 
                    alt={data.bride_full_name} 
                    className="w-full aspect-[2/3] object-cover grayscale-[25%] hover:grayscale-0 transition-all duration-[800ms]" 
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={250}>
                <div className="space-y-3">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#C9A96E]">THE BRIDE</span>
                  <h3 className="font-cormorant text-2xl font-light tracking-wide text-[#1A1A1A]">
                    {data.bride_full_name}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#C9A96E]/40 mx-auto" />
                  <p className="text-[11px] text-[#6B6459] leading-relaxed">
                    Putri dari pasangan <br />
                    <span className="font-medium text-[#1A1A1A] text-xs font-cormorant tracking-wider block mt-1 uppercase">{data.bride_parents}</span>
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ===== SECTION 4: LOVE STORY ===== */}
          {data.love_story && data.love_story.length > 0 && (
            <section className="space-y-16">
              <ScrollReveal delay={100}>
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE JOURNEY</span>
                  <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Kisah Kami</h2>
                  
                  <div className="flex items-center justify-center gap-3 w-24 py-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                    <span className="text-[#C9A96E] text-[6px]">✦</span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                  </div>
                </div>
              </ScrollReveal>

              <div className="relative pl-8 border-l border-[#C9A96E]/30 max-w-xs mx-auto text-left space-y-12">
                {data.love_story.map((story, i) => (
                  <div key={i} className="relative space-y-2">
                    {/* Minimalist gold flower dot indicator */}
                    <div className="absolute -left-[37px] top-1.5 w-2.5 h-2.5 bg-[#FDFAF6] border-2 border-[#C9A96E] rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-[#C9A96E] rounded-full" />
                    </div>
                    
                    <ScrollReveal direction="left" delay={i * 100}>
                      <span className="font-cormorant italic text-[#C9A96E] text-lg font-light block">{story.date}</span>
                      <h4 className="text-[10px] font-bold text-[#1A1A1A] tracking-[0.25em] uppercase leading-none">{story.title}</h4>
                      <p className="text-xs text-[#6B6459] leading-relaxed font-light mt-2">{story.description}</p>
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== SECTION 5: ACARA DETAILS (LUXURY CORNER-BRACKETED CARDS) ===== */}
          <section className="space-y-16">
            <ScrollReveal delay={100}>
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE EVENTS</span>
                <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Waktu & Tempat</h2>
                
                <div className="flex items-center justify-center gap-3 w-24 py-2">
                  <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                  <span className="text-[#C9A96E] text-[6px]">✦</span>
                  <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                </div>
              </div>
            </ScrollReveal>

            {/* Luxury Akad Card */}
            <ScrollReveal direction="up" delay={150}>
              <div className="border border-[#C9A96E]/30 bg-white/65 backdrop-blur-xs p-8 relative rounded-none text-center space-y-6 shadow-xs max-w-sm mx-auto">
                {/* Gold foil pressed corner brackets */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C9A96E]" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#C9A96E]" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#C9A96E]" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C9A96E]" />
                
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#C9A96E] block">AKAD NIKAH</span>
                
                {/* Large print date display */}
                <div className="py-4 border-t border-b border-[#E8E0D4] grid grid-cols-3 items-center max-w-xs mx-auto">
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B6459] block">
                      {formatEventDayName(data.akad_date)}
                    </span>
                  </div>
                  <div className="text-center border-l border-r border-[#E8E0D4]">
                    <span className="font-cormorant text-4xl text-[#1A1A1A] block font-light leading-none">
                      {formatEventDateNum(data.akad_date)}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold tracking-wider text-[#6B6459] block leading-tight uppercase">
                      {formatEventMonthYear(data.akad_date)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-cormorant text-xl font-normal text-[#1A1A1A] italic">{data.akad_venue}</h3>
                  <p className="text-xs text-[#6B6459] leading-relaxed max-w-xs mx-auto font-light">{data.akad_address}</p>
                  <p className="text-xs text-[#1A1A1A] font-semibold pt-1 tracking-widest">PUKUL {data.akad_time} WIB</p>
                </div>

                <div className="pt-2">
                  <a
                    href={getGoogleCalendarUrl(`Akad Nikah ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FDFAF6] transition-all duration-500 cursor-pointer rounded-none"
                  >
                    <Icons.Calendar /> ADD TO CALENDAR
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Luxury Resepsi Card */}
            <ScrollReveal direction="up" delay={250}>
              <div className="border border-[#C9A96E]/30 bg-white/65 backdrop-blur-xs p-8 relative rounded-none text-center space-y-6 shadow-xs max-w-sm mx-auto">
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C9A96E]" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#C9A96E]" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#C9A96E]" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C9A96E]" />
                
                <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#C9A96E] block">RESEPSI PERNIKAHAN</span>
                
                {/* Large print date display */}
                <div className="py-4 border-t border-b border-[#E8E0D4] grid grid-cols-3 items-center max-w-xs mx-auto">
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B6459] block">
                      {formatEventDayName(data.reception_date)}
                    </span>
                  </div>
                  <div className="text-center border-l border-r border-[#E8E0D4]">
                    <span className="font-cormorant text-4xl text-[#1A1A1A] block font-light leading-none">
                      {formatEventDateNum(data.reception_date)}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-bold tracking-wider text-[#6B6459] block leading-tight uppercase">
                      {formatEventMonthYear(data.reception_date)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-cormorant text-xl font-normal text-[#1A1A1A] italic">{data.reception_venue}</h3>
                  <p className="text-xs text-[#6B6459] leading-relaxed max-w-xs mx-auto font-light">{data.reception_address}</p>
                  <p className="text-xs text-[#1A1A1A] font-semibold pt-1 tracking-widest">PUKUL {data.reception_time} WIB</p>
                </div>

                <div className="pt-2">
                  <a
                    href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FDFAF6] transition-all duration-500 cursor-pointer rounded-none"
                  >
                    <Icons.Calendar /> ADD TO CALENDAR
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* ===== SECTION 6: MAPS BUTTON (MINIMAL OUTLINED) ===== */}
          {data.maps_link && (
            <section className="text-center">
              <ScrollReveal delay={100}>
                <a
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-[#C9A96E] hover:text-[#1A1A1A] text-[9px] font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-md cursor-pointer rounded-none border border-[#1A1A1A]"
                >
                  <Icons.MapPin /> VIEW MAP LOCATION
                </a>
              </ScrollReveal>
            </section>
          )}

          {/* ===== SECTION 7: GALLERY (ASYNCHRONOUS FRAMED COLLAGE) ===== */}
          {galleryPhotos.length > 0 && (
            <section className="space-y-16">
              <ScrollReveal delay={100}>
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE ALBUM</span>
                  <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Momen Indah</h2>
                  
                  <div className="flex items-center justify-center gap-3 w-24 py-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                    <span className="text-[#C9A96E] text-[6px]">✦</span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                  </div>
                </div>
              </ScrollReveal>

              {/* Asymmetric Mat-Framed Collage */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {galleryPhotos.map((url: string, index: number) => {
                  const isLarge = index % 3 === 0;
                  return (
                    <ScrollReveal key={index} direction="up" delay={index * 80} className={isLarge ? "col-span-2" : "col-span-1"}>
                      <div
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`relative ${isLarge ? "aspect-[3/2]" : "aspect-[1/1]"} overflow-hidden cursor-pointer border border-[#C9A96E]/20 p-1.5 bg-white shadow-xs hover:opacity-95 transition-all duration-500 group rounded-none`}
                      >
                        <div className="absolute inset-2 border border-[#C9A96E]/5 pointer-events-none z-10" />
                        <img 
                          src={url} 
                          alt={`Gallery ${index + 1}`} 
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                        />
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </section>
          )}

          {/* ===== SECTION 8: VIDEO CINEMA ===== */}
          {(data.prewedding_video_url || data.video_url) && (
            <section className="space-y-16">
              <ScrollReveal delay={100}>
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE CINEMA</span>
                  <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Cinema</h2>
                  
                  <div className="flex items-center justify-center gap-3 w-24 py-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                    <span className="text-[#C9A96E] text-[6px]">✦</span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={150}>
                <div className="relative aspect-video w-full border border-[#C9A96E]/30 p-2 bg-white shadow-xs">
                  <div className="absolute inset-3 border border-[#C9A96E]/5 pointer-events-none" />
                  <iframe
                    src={data.prewedding_video_url || data.video_url}
                    className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)]"
                    allowFullScreen
                    title="Wedding Video"
                  />
                </div>
              </ScrollReveal>
            </section>
          )}

          {/* ===== SECTION 9: RSVP & WISHES ===== */}
          <section className="space-y-24">
            
            {/* Elegant Custom Form in a Framed Card */}
            <div className="space-y-12">
              <ScrollReveal delay={100}>
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE CONFRÈSENCE</span>
                  <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Konfirmasi Kehadiran</h2>
                  
                  <div className="flex items-center justify-center gap-3 w-24 py-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                    <span className="text-[#C9A96E] text-[6px]">✦</span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={150}>
                <div className="border border-[#C9A96E]/30 bg-white/65 backdrop-blur-xs p-8 relative rounded-none shadow-xs max-w-sm mx-auto">
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#C9A96E]" />
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#C9A96E]" />
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#C9A96E]" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#C9A96E]" />

                  {rsvpSubmitted ? (
                    <div className="py-8 space-y-4">
                      <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C9A96E] block">THANK YOU</span>
                      <h3 className="font-cormorant text-2xl font-light italic text-[#1A1A1A] leading-none">Konfirmasi Kehadiran Berhasil</h3>
                      <p className="text-xs text-[#6B6459] leading-relaxed font-light max-w-xs mx-auto">
                        Pesan dan konfirmasi Anda telah disimpan dengan baik. Kehadiran dan doa restu Anda adalah kehormatan bagi kami.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6 text-left">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="font-jost text-[8px] font-bold uppercase tracking-[0.25em] text-[#C9A96E] block">NAMA TAMU</label>
                        <input
                          type="text"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          required
                          placeholder="Masukkan nama lengkap"
                          className="w-full border-b border-[#E8E0D4] bg-transparent text-[#1A1A1A] py-2 text-xs placeholder-[#6B6459]/40 focus:border-[#C9A96E] outline-none rounded-none transition-colors"
                        />
                      </div>

                      {/* Attendance */}
                      <div className="space-y-2">
                        <label className="font-jost text-[8px] font-bold uppercase tracking-[0.25em] text-[#C9A96E] block">KONFIRMASI KEHADIRAN</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "hadir", label: "HADIR" },
                            { value: "tidak_hadir", label: "TIDAK" },
                            { value: "belum_pasti", label: "BELUM" }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setAttendance(opt.value)}
                              className={`py-2 px-1 border text-[8px] font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer ${
                                attendance === opt.value
                                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFAF6]"
                                  : "border-[#E8E0D4] bg-transparent text-[#6B6459] hover:border-[#C9A96E]"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Guest Count */}
                      {attendance === "hadir" && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="font-jost text-[8px] font-bold uppercase tracking-[0.25em] text-[#C9A96E] block">JUMLAH TAMU</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="w-full border-b border-[#E8E0D4] bg-transparent text-[#1A1A1A] py-2 text-xs focus:border-[#C9A96E] outline-none rounded-none transition-colors"
                          />
                        </div>
                      )}

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="font-jost text-[8px] font-bold uppercase tracking-[0.25em] text-[#C9A96E] block">RESTU & DO&apos;A</label>
                        <textarea
                          value={rsvpMessage}
                          onChange={(e) => setRsvpMessage(e.target.value)}
                          rows={3}
                          placeholder="Tuliskan ucapan restu Anda"
                          className="w-full border-b border-[#E8E0D4] bg-transparent text-[#1A1A1A] py-2 text-xs placeholder-[#6B6459]/40 focus:border-[#C9A96E] outline-none rounded-none transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={rsvpLoading || !rsvpName || !attendance}
                        className="w-full py-3.5 border border-[#1A1A1A] text-[#1A1A1A] text-[9px] font-bold tracking-[0.3em] uppercase hover:bg-[#1A1A1A] hover:text-[#FDFAF6] transition-all duration-500 rounded-none cursor-pointer disabled:opacity-30"
                      >
                        {rsvpLoading ? "SENDING..." : "SUBMIT RESPONSE"}
                      </button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Wishes wall (Boutique Guestbook layout) */}
            <div className="space-y-12">
              <ScrollReveal delay={100}>
                <h3 className="font-cormorant text-2xl text-[#1A1A1A] font-light tracking-wide uppercase">
                  DO&apos;A & RESTU TAMU
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={150}>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-left max-w-sm mx-auto">
                  {wishes.length === 0 ? (
                    <p className="text-center text-[#6B6459] text-xs italic py-4">Belum ada ucapan.</p>
                  ) : (
                    wishes.map((wish, i) => (
                      <div key={i} className="pb-6 border-b border-[#E8E0D4]/60 space-y-2">
                        <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-[#6B6459]">
                          <span className="text-[#1A1A1A] font-extrabold">{wish.name}</span>
                          <span className="text-[#C9A96E] font-medium">
                            {wish.attendance === "hadir" ? "• HADIR" : wish.attendance === "tidak_hadir" ? "• TIDAK HADIR" : "• BELUM PASTI"}
                          </span>
                        </div>
                        <p className="font-cormorant italic text-base text-[#6B6459] leading-relaxed font-light">&ldquo;{wish.message}&rdquo;</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ===== SECTION 10: GIFT / TRANSFER ===== */}
          {(accountsList.length > 0 || data.gift_address) && (
            <section className="space-y-16">
              <ScrollReveal delay={100}>
                <div className="space-y-2 flex flex-col items-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE OFFRINGS</span>
                  <h2 className="font-cormorant text-3xl text-[#1A1A1A] tracking-wider uppercase font-light">Hadiah Kasih</h2>
                  
                  <div className="flex items-center justify-center gap-3 w-24 py-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A96E]/60" />
                    <span className="text-[#C9A96E] text-[6px]">✦</span>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A96E]/60" />
                  </div>
                </div>
              </ScrollReveal>

              <div className="space-y-8 max-w-sm mx-auto">
                {accountsList.map((acc: any, i: number) => (
                  <ScrollReveal key={i} direction="up" delay={i * 100}>
                    <div className="border border-[#C9A96E]/20 bg-white/65 p-6 text-center space-y-3 relative rounded-none shadow-xs">
                      {/* Corner gold brackets */}
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#C9A96E]/30" />
                      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#C9A96E]/30" />
                      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#C9A96E]/30" />
                      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#C9A96E]/30" />

                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#6B6459] block">{acc.bank}</span>
                      <p className="font-mono text-base font-medium text-[#1A1A1A] tracking-wider leading-none">{acc.number}</p>
                      <p className="text-[10px] text-[#6B6459] uppercase tracking-wider font-light">a.n. {acc.name}</p>
                      
                      <button
                        onClick={() => handleCopy(acc.number || "", i)}
                        className="inline-flex items-center gap-1.5 mt-2 text-[8px] font-bold uppercase tracking-widest text-[#C9A96E] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <Icons.Copy /> {copiedIndex === i ? "COPIED" : "COPY NUMBER"}
                      </button>
                    </div>
                  </ScrollReveal>
                ))}

                {data.gift_address && (
                  <ScrollReveal direction="up" delay={150}>
                    <div className="border border-[#C9A96E]/20 bg-white/65 p-6 text-center space-y-3 relative rounded-none shadow-xs">
                      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#C9A96E]/30" />
                      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#C9A96E]/30" />
                      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#C9A96E]/30" />
                      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#C9A96E]/30" />

                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#6B6459] block">SHIPPING ADDRESS</span>
                      <p className="text-xs text-[#1A1A1A] leading-relaxed max-w-xs mx-auto font-light">{data.gift_address}</p>
                      
                      <button
                        onClick={() => handleCopy(data.gift_address || "", 99)}
                        className="inline-flex items-center gap-1.5 mt-2 text-[8px] font-bold uppercase tracking-widest text-[#C9A96E] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                      >
                        <Icons.Copy /> {copiedIndex === 99 ? "COPIED" : "COPY ADDRESS"}
                      </button>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            </section>
          )}

          {/* ===== SECTION 11: CLOSING ===== */}
          <section className="py-12 space-y-8 max-w-xs mx-auto">
            <ScrollReveal delay={100}>
              <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">THE CLOSING</span>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h2 className="font-cormorant text-4xl text-[#1A1A1A] font-light leading-none tracking-wide">
                {data.groom_name}
                <span className="font-script text-4xl text-[#C9A96E] block my-2">&</span>
                {data.bride_name}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-xs text-[#6B6459] leading-relaxed font-light">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="text-[9px] uppercase tracking-[0.25em] font-medium text-[#6B6459] leading-none pt-4 border-t border-[#E8E0D4] mt-6 block">
                Wassalamu&apos;alaikum Wr. Wb.
              </p>
            </ScrollReveal>
          </section>

          {/* Minimalist print signature */}
          <div className="pt-8 text-[#6B6459]/50 text-[7px] uppercase tracking-[0.4em] border-t border-[#E8E0D4]/30">
            INVITATION PRESENTED BY MYPROMISE.ID
          </div>

        </div>
      </div>

      {/* ===== GALLERY LIGHTBOX ROOT MODAL ===== */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xs cursor-pointer animate-fade-in"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all cursor-pointer z-50 border border-white/10"
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
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all cursor-pointer z-50 border border-white/10"
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
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all cursor-pointer z-50 border border-white/10"
                title="Berikutnya"
              >
                <Icons.ChevronRight />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-auto h-auto rounded-none overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center justify-center cursor-default animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[selectedPhotoIndex]}
              alt={`Gallery preview ${selectedPhotoIndex + 1}`}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-none shadow-2xl select-none"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1A1A1A]/95 text-white text-[9px] font-black tracking-widest uppercase shadow-md border border-white/10 select-none">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </TemplateLayout>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import CountdownTimer from "@/components/invitation/CountdownTimer";
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

interface MinimalistTemplateProps {
  invitationId: string;
  data: InvitationData;
  designConfig?: any;
  guestName?: string;
  guestSlug?: string;
  isDemo?: boolean;
}

function formatEventDate(dateStr: string) {
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
  Rings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gold-500 mx-auto">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Party: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gold-500 mx-auto">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline text-rose-400 mx-1">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 inline-block mb-1">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function MinimalistTemplate({ invitationId, data, designConfig, guestName, guestSlug, isDemo }: MinimalistTemplateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [wishes, setWishes] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  const displayName = guestName || "Tamu Undangan";
  const musicUrl = data.music_url || data.music;

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

  // Fetch real wishes
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
          } else {
            setWishes([]);
          }
        }
      } catch (error) {
        console.error("Failed to load wishes:", error);
      }
    }
    loadWishes();
  }, [invitationId, isDemo]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (musicUrl && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay prevented by browser:", err));
    }

    // Update is_opened status in database
    if (guestSlug && !isDemo) {
      fetch("/api/guests/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, guestSlug }),
      }).catch((err) => console.error("Failed to update opened status:", err));
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Play error:", err));
    }
  };

  useEffect(() => {
    if (selectedPhotoIndex === null) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex(prev => prev === null || prev === 0 ? galleryPhotos.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex(prev => prev === null || prev === galleryPhotos.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPhotoIndex, galleryPhotos.length]);

  return (
    <div className="relative min-h-screen bg-cream-50 overflow-hidden">
      {/* ===== COVER / OPENING ===== */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal-950">
          <img src={heroImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 animate-pulse-soft" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80" />
          <div className="relative z-10 text-center px-8 py-14 border border-gold-500/30 rounded-3xl backdrop-blur-xs bg-charcoal-900/50 shadow-2xl max-w-lg mx-6 animate-fade-in">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 rounded-full text-charcoal-950 text-[10px] font-extrabold uppercase tracking-[0.3em] shadow-lg">
              Undangan Pernikahan
            </div>
            <p className="text-cream-200/60 text-sm uppercase tracking-[0.3em] mb-4 mt-2">The Wedding of</p>
            <h1
              className="text-5xl sm:text-7xl font-bold text-white mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.groom_name}
            </h1>
            <p className="text-3xl sm:text-4xl text-gold-400 mb-2 font-light" style={{ fontFamily: "var(--font-great-vibes)" }}>
              &
            </p>
            <h1
              className="text-5xl sm:text-7xl font-bold text-white mb-8 tracking-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.bride_name}
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent mx-auto mb-8" />

            <div className="mb-10">
              <p className="text-cream-200/70 text-xs uppercase tracking-widest mb-1.5">Kepada Yth.</p>
              <p className="text-gold-200 text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-playfair)" }}>
                {displayName}
              </p>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="px-10 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-full hover:from-rose-400 hover:to-rose-500 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105 active:scale-95 cursor-pointer tracking-wider text-sm uppercase"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      )}

      {/* ===== FLOATING MUSIC BUTTON ===== */}
      {isOpened && musicUrl && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 ${
              isPlaying
                ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-600 scale-100"
                : "bg-charcoal-800 text-slate-300 hover:bg-charcoal-700 hover:text-white"
            }`}
            title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* AUDIO ELEMENT - Always rendered if musicUrl exists so audioRef is instantly available */}
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop className="hidden" preload="auto" />}


      {/* ===== MAIN INVITATION CONTENT ===== */}
      <div className={isOpened ? "animate-fade-in" : "hidden"}>

        {/* — Bismillah / Opening — */}
        <section className="py-24 px-6 text-center bg-gradient-to-b from-cream-100 via-cream-50 to-white relative overflow-hidden border-b border-cream-200/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
          <p className="text-gold-600/90 text-3xl sm:text-4xl mb-6 font-normal drop-shadow-xs" style={{ fontFamily: "var(--font-great-vibes)" }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-charcoal-700 font-medium text-sm sm:text-base max-w-md mx-auto leading-relaxed tracking-wide">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          {data.love_quote && (
            <div className="mt-10 max-w-xl mx-auto relative px-8 py-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-gold-200/60 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold-400 text-lg bg-white px-4 py-0.5 rounded-full border border-gold-200/60 shadow-xs">✦</div>
              <p className="text-charcoal-600 text-sm sm:text-base italic leading-relaxed whitespace-pre-line font-serif">
                &ldquo;{data.love_quote}&rdquo;
              </p>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-gold-400 text-lg bg-white px-4 py-0.5 rounded-full border border-gold-200/60 shadow-xs">✦</div>
            </div>
          )}
        </section>

        {/* — Hero — */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <img src={heroImage} alt={`${data.groom_name} & ${data.bride_name}`} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-transparent to-charcoal-900/60" />
          <div className="relative z-10 text-center mt-auto pb-20 px-6">
            <p className="text-cream-200/70 text-sm uppercase tracking-[0.25em] mb-3">The Wedding of</p>
            <h2
              className="text-4xl sm:text-6xl font-bold text-white mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.groom_name} <span className="text-gold-400" style={{ fontFamily: "var(--font-great-vibes)" }}>&</span> {data.bride_name}
            </h2>
            <p className="text-cream-200/80 text-sm mb-8">{formatEventDate(data.akad_date)}</p>
            <CountdownTimer targetDate={data.akad_date} />
          </div>
        </section>

        {/* — Couple Introduction — */}
        <section className="py-24 bg-gradient-to-b from-white via-cream-50 to-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-rose-500 text-xs font-extrabold uppercase tracking-[0.3em] mb-2">Mempelai Berbahagia</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-charcoal-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Pasangan Mempelai
              </h2>
              <div className="w-20 h-0.5 bg-rose-400/50 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
              {/* Groom */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-cream-200 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden text-center flex flex-col items-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/30 rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-52 h-52 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gold-300 shadow-2xl group-hover:border-rose-400 transition-colors duration-500">
                  <img src={groomImage} alt={data.groom_full_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-3xl font-bold text-charcoal-900 mb-2 group-hover:text-rose-600 transition-colors duration-300" style={{ fontFamily: "var(--font-playfair)" }}>
                  {data.groom_full_name}
                </h3>
                <p className="text-rose-500 font-semibold text-xs uppercase tracking-widest mb-3">Mempelai Pria</p>
                <p className="text-charcoal-500 text-sm leading-relaxed max-w-xs">Putra dari {data.groom_parents}</p>
              </div>
              {/* Bride */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-cream-200 shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden text-center flex flex-col items-center">
                <div className="absolute top-0 left-0 w-32 h-32 bg-rose-100/30 rounded-br-full -z-10 group-hover:scale-125 transition-transform duration-700" />
                <div className="relative w-52 h-52 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gold-300 shadow-2xl group-hover:border-rose-400 transition-colors duration-500">
                  <img src={brideImage} alt={data.bride_full_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h3 className="text-3xl font-bold text-charcoal-900 mb-2 group-hover:text-rose-600 transition-colors duration-300" style={{ fontFamily: "var(--font-playfair)" }}>
                  {data.bride_full_name}
                </h3>
                <p className="text-rose-500 font-semibold text-xs uppercase tracking-widest mb-3">Mempelai Wanita</p>
                <p className="text-charcoal-500 text-sm leading-relaxed max-w-xs">Putri dari {data.bride_parents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* — Love Story — */}
        {data.love_story && data.love_story.length > 0 && (
          <section className="section-padding bg-white">
            <div className="container-tight px-6">
              <div className="text-center mb-12">
                <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">Kisah Cinta</p>
                <h2 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
                  Perjalanan Kami
                </h2>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-cream-300 sm:-translate-x-px" />
                {data.love_story.map((story, i) => (
                  <div key={i} className={`relative flex items-start gap-6 mb-10 last:mb-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Dot */}
                    <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-rose-400 rounded-full border-2 border-cream-50 -translate-x-1.5 sm:-translate-x-1.5 mt-1.5 z-10" />
                    {/* Content */}
                    <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${i % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"}`}>
                      <span className="text-rose-400 text-xs font-semibold uppercase tracking-wider">{story.date}</span>
                      <h3 className="text-lg font-bold text-charcoal-800 mt-1 mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                        {story.title}
                      </h3>
                      <p className="text-charcoal-400 text-sm leading-relaxed">{story.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* — Event Details — */}
        <section className="py-24 bg-cream-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <p className="text-rose-500 text-xs font-extrabold uppercase tracking-[0.3em] mb-2">Jadwal Pelaksanaan</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-charcoal-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Waktu & Tempat Acara
              </h2>
              <div className="w-20 h-0.5 bg-rose-400/50 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              {/* Akad */}
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gold-200/60 relative overflow-hidden group flex flex-col items-center">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold-400 to-rose-400" />
                <div className="w-16 h-16 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Icons.Rings />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  Akad Nikah
                </h3>
                <div className="w-12 h-px bg-gold-300 mx-auto mb-6" />
                <p className="text-rose-600 font-bold text-base sm:text-lg mb-1">{formatEventDate(data.akad_date)}</p>
                <p className="text-charcoal-600 font-semibold text-sm mb-6 bg-cream-100 px-4 py-1.5 rounded-full inline-block shadow-xs">{data.akad_time} WIB</p>
                <p className="text-charcoal-900 font-extrabold text-base mb-2">{data.akad_venue}</p>
                <p className="text-charcoal-500 text-xs sm:text-sm leading-relaxed max-w-sm mb-8">{data.akad_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Akad Nikah ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cream-100/80 text-charcoal-800 text-xs sm:text-sm font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer group/btn"
                >
                  <Icons.Calendar /> Simpan ke Kalender
                </a>
              </div>
              {/* Reception */}
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gold-200/60 relative overflow-hidden group flex flex-col items-center">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 to-gold-400" />
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Icons.Party />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                  Resepsi
                </h3>
                <div className="w-12 h-px bg-rose-300 mx-auto mb-6" />
                <p className="text-rose-600 font-bold text-base sm:text-lg mb-1">{formatEventDate(data.reception_date)}</p>
                <p className="text-charcoal-600 font-semibold text-sm mb-6 bg-cream-100 px-4 py-1.5 rounded-full inline-block shadow-xs">{data.reception_time} WIB</p>
                <p className="text-charcoal-900 font-extrabold text-base mb-2">{data.reception_venue}</p>
                <p className="text-charcoal-500 text-xs sm:text-sm leading-relaxed max-w-sm mb-8">{data.reception_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-cream-100/80 text-charcoal-800 text-xs sm:text-sm font-bold rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer group/btn"
                >
                  <Icons.Calendar /> Simpan ke Kalender
                </a>
              </div>
            </div>
            {/* Maps */}
            {data.maps_link && (
              <div className="text-center mt-12">
                <a
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal-900 text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-rose-600 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg"
                >
                  <Icons.MapPin /> Buka Lokasi di Google Maps
                </a>
              </div>
            )}
          </div>
        </section>

        {/* — Momen Bahagia (Galeri Foto) — */}
        {galleryPhotos.length > 0 && (
          <section className="py-24 bg-white border-t border-cream-200/60 relative">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <p className="text-rose-500 text-xs uppercase tracking-[0.3em] font-extrabold mb-2 flex items-center justify-center gap-1.5">
                  <Icons.Camera /> Galeri Foto
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-charcoal-900 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  Momen Kebahagiaan Kami
                </h2>
                <div className="w-20 h-0.5 bg-rose-400/50 mx-auto" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {galleryPhotos.map((url: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-cream-200 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-cream-50"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="px-5 py-2 bg-white/90 backdrop-blur-sm text-charcoal-900 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">Lihat Foto</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* — RSVP & Wishes — */}
        <section className="section-padding bg-white">
          <div className="container-tight px-6">
            <div className="text-center mb-12">
              <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">RSVP</p>
              <h2 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
                Konfirmasi Kehadiran
              </h2>
              <p className="text-charcoal-400 text-sm mt-2">Merupakan kehormatan bagi kami atas kehadiran Anda</p>
            </div>
            <div className="bg-cream-50 rounded-2xl p-8 border border-cream-200">
              <RSVPForm 
                invitationId={invitationId} 
                guestName={guestName} 
                guestSlug={guestSlug}
                isDemo={isDemo} 
                onSuccess={() => {
                  // Refresh wishes after successful RSVP
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

            {/* Wishes Wall */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
                  Ucapan Tamu
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                {wishes.length === 0 ? (
                  <p className="text-center text-charcoal-300 text-sm italic">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
                ) : (
                  wishes.map((wish, i) => (
                    <div key={i} className="bg-cream-50 rounded-xl p-5 border border-cream-200 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-charcoal-700 text-sm">{wish.name}</span>
                        <span className="text-charcoal-300 text-[10px]">
                          {new Date(wish.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-charcoal-500 text-sm leading-relaxed">{wish.message}</p>
                      <span className={`inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        wish.attendance === "hadir" ? "bg-emerald-50 text-emerald-600" :
                        wish.attendance === "tidak_hadir" ? "bg-rose-50 text-rose-500" :
                        "bg-amber-50 text-amber-600"
                      }`}>
                        {wish.attendance === "hadir" && <Icons.Check />}
                        {wish.attendance === "hadir" ? "Hadir" : wish.attendance === "tidak_hadir" ? "Tidak Hadir" : "Belum Pasti"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* — Gift / Bank Transfer — */}
        {(accountsList.length > 0 || data.gift_address) && (
          <section className="section-padding bg-cream-50">
            <div className="container-tight px-6 text-center">
              <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">Hadiah</p>
              <h2 className="text-3xl font-bold text-charcoal-800 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Kirim Hadiah
              </h2>
              <p className="text-charcoal-400 text-sm mb-8 max-w-sm mx-auto">
                Doa restu Anda sudah cukup bagi kami. Namun jika ingin memberikan tanda kasih, bisa melalui:
              </p>
              {accountsList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                  {accountsList.map((acc: any, i: number) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm text-center">
                      <p className="text-charcoal-700 font-bold text-sm mb-1">{acc.bank}</p>
                      <p className="text-charcoal-800 font-mono text-lg font-semibold mb-1">{acc.number}</p>
                      <p className="text-charcoal-400 text-xs">a.n. {acc.name}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(acc.number || "")}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-rose-500 font-bold hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Icons.Copy /> Salin Nomor
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {data.gift_address && (
                <div className="bg-white rounded-2xl p-8 border border-cream-200 shadow-sm max-w-lg mx-auto text-center space-y-2">
                  <p className="text-xs uppercase tracking-wider text-rose-500 font-bold">Alamat Pengiriman Kado Fisik</p>
                  <p className="text-sm text-charcoal-800 font-medium leading-relaxed max-w-md mx-auto">{data.gift_address}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(data.gift_address || "")}
                    className="inline-flex items-center gap-1.5 pt-2 text-xs text-rose-500 font-bold hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Icons.Copy /> Salin Alamat
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* — Closing — */}
        <section className="relative py-24 overflow-hidden">
          <img src={heroImage} alt="Closing" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal-900/60" />
          <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
            <p className="text-cream-200/70 text-sm uppercase tracking-widest mb-4">Terima Kasih</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              {data.groom_name} & {data.bride_name}
            </h2>
            <p className="text-cream-200/80 text-sm leading-relaxed mb-6">
              Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir pada hari pernikahan kami. Atas doa restu yang diberikan, kami mengucapkan terima kasih.
            </p>
            <p className="text-cream-200/60 text-sm">
              Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
            </p>
          </div>
        </section>

        {/* — Footer Branding — */}
        <div className="py-6 bg-charcoal-800 text-center">
          <p className="text-charcoal-400 text-xs flex items-center justify-center gap-1">
            Dibuat dengan <Icons.Heart /> oleh{" "}
            <a href="https://mypromise.id" className="text-rose-400 font-bold hover:text-rose-300 transition-colors ml-1">
              MyPromise
            </a>
          </p>
        </div>
      </div>

      {/* ===== LIGHTBOX MODAL (ROOT LEVEL) ===== */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 sm:p-8 animate-fade-in backdrop-blur-md cursor-pointer"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3.5 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer z-50 border border-white/10 shadow-lg"
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
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer z-50 border border-white/10 shadow-lg"
                title="Sebelumnya (Kiri)"
              >
                <Icons.ChevronLeft />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(prev => prev === null || prev === galleryPhotos.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3.5 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer z-50 border border-white/10 shadow-lg"
                title="Berikutnya (Kanan)"
              >
                <Icons.ChevronRight />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl max-h-[90vh] w-auto h-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-scale-up flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryPhotos[selectedPhotoIndex]}
              alt={`Gallery preview ${selectedPhotoIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-3xl mx-auto shadow-2xl select-none"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-charcoal-950/85 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase shadow-xl select-none">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


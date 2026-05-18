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

interface ModernLuxeTemplateProps {
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
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 mx-auto">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  ),
  Party: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500 mx-auto">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="inline text-rose-500 mx-1">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 inline-block mb-1">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function ModernLuxeTemplate({ invitationId, data, designConfig, guestName, guestSlug, isDemo }: ModernLuxeTemplateProps) {
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
    <div className="relative min-h-screen bg-[#0d0e12] text-slate-200 overflow-hidden font-sans">
      {/* Background elegant abstract pattern */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-600/5 blur-[200px] pointer-events-none" />

      {/* ===== COVER / OPENING ===== */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090a0d]">
          <img src={heroImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-black/30 to-[#090a0d]" />
          <div className="relative z-10 text-center px-8 py-16 border border-amber-500/20 rounded-[40px] bg-slate-900/60 backdrop-blur-md shadow-2xl max-w-lg mx-6 animate-fade-in flex flex-col items-center">
            
            <span className="px-5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.25em] rounded-full mb-8">
              Wedding Invitation
            </span>

            <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-[0.3em] mb-4">The Wedding of</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-2">
              {data.groom_name}
            </h1>
            <p className="text-2xl text-amber-500 italic my-2 font-serif">&amp;</p>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-10">
              {data.bride_name}
            </h1>
            <div className="w-16 h-[2px] bg-amber-500/40 mb-10" />

            <div className="mb-10 text-center">
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Dear Honorable Guest</p>
              <p className="text-white text-2xl font-black tracking-wide uppercase">
                {displayName}
              </p>
            </div>

            <button
              onClick={handleOpenInvitation}
              className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Open Invitation
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
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 scale-100"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
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

      {/* AUDIO ELEMENT */}
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop className="hidden" preload="auto" />}

      {/* ===== MAIN CONTENT ===== */}
      <div className={isOpened ? "animate-fade-in" : "hidden"}>

        {/* — Opening / Bismillah — */}
        <section className="py-24 px-6 text-center bg-[#090a0d] border-b border-slate-900 relative">
          <p className="text-amber-500 text-2xl mb-6">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          <p className="text-slate-400 text-sm sm:text-base uppercase tracking-widest font-bold mb-4">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          {data.love_quote && (
            <div className="mt-8 max-w-xl mx-auto px-8 py-10 rounded-[32px] border border-amber-500/10 bg-slate-900/40 relative">
              <p className="text-slate-350 text-sm sm:text-base italic leading-relaxed whitespace-pre-line font-serif">
                &ldquo;{data.love_quote}&rdquo;
              </p>
            </div>
          )}
        </section>

        {/* — Hero — */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#0d0e12]" />
          <div className="relative z-10 text-center mt-auto pb-24 px-6">
            <span className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Union of Two Souls</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mb-4">
              {data.groom_name} &amp; {data.bride_name}
            </h2>
            <p className="text-slate-450 text-sm uppercase tracking-widest mb-10">{formatEventDate(data.akad_date)}</p>
            <CountdownTimer targetDate={data.akad_date} />
          </div>
        </section>

        {/* — Mempelai — */}
        <section className="py-24 bg-[#090a0d] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">Our Profiles</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">The Bride &amp; Groom</h2>
              <div className="w-12 h-1 bg-amber-500/60 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Groom */}
              <div className="bg-slate-900/30 p-10 rounded-[36px] border border-slate-800/80 text-center flex flex-col items-center group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
                <div className="relative w-52 h-52 mx-auto mb-8 rounded-[40px] overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-400 transition-colors">
                  <img src={groomImage} alt={data.groom_full_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  {data.groom_full_name}
                </h3>
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Mempelai Pria</p>
                <p className="text-slate-400 text-sm leading-relaxed">Putra tercinta dari {data.groom_parents}</p>
              </div>

              {/* Bride */}
              <div className="bg-slate-900/30 p-10 rounded-[36px] border border-slate-800/80 text-center flex flex-col items-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full pointer-events-none" />
                <div className="relative w-52 h-52 mx-auto mb-8 rounded-[40px] overflow-hidden border-2 border-amber-500/30 group-hover:border-amber-400 transition-colors">
                  <img src={brideImage} alt={data.bride_full_name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  {data.bride_full_name}
                </h3>
                <p className="text-amber-500 text-xs font-black uppercase tracking-widest mb-3">Mempelai Wanita</p>
                <p className="text-slate-400 text-sm leading-relaxed">Putri tercinta dari {data.bride_parents}</p>
              </div>
            </div>
          </div>
        </section>

        {/* — Love Story — */}
        {data.love_story && data.love_story.length > 0 && (
          <section className="py-24 bg-[#0d0e12] relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">Our Journey</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">How We Met</h2>
                <div className="w-12 h-1 bg-amber-500/60 mx-auto mt-4" />
              </div>

              <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
                {data.love_story.map((story, i) => (
                  <div key={i} className="relative pl-8 animate-fade-in group">
                    <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />
                    <span className="text-amber-500 text-xs font-black tracking-widest uppercase">{story.date}</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mt-1 mb-2">
                      {story.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{story.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* — Acara — */}
        <section className="py-24 bg-[#090a0d] relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">Join Us</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">Event Schedules</h2>
              <div className="w-12 h-1 bg-amber-500/60 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Akad */}
              <div className="bg-slate-900/20 p-8 sm:p-12 rounded-[40px] border border-slate-800 text-center flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-600 to-amber-400" />
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icons.Rings />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Akad Nikah</h3>
                <p className="text-amber-500 font-bold mb-1">{formatEventDate(data.akad_date)}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{data.akad_time} WIB</p>
                <p className="text-white font-bold mb-1">{data.akad_venue}</p>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-8">{data.akad_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Akad ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-6 py-3 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-amber-500 hover:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Icons.Calendar /> Save to Calendar
                </a>
              </div>

              {/* Resepsi */}
              <div className="bg-slate-900/20 p-8 sm:p-12 rounded-[40px] border border-slate-800 text-center flex flex-col items-center relative overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-amber-400 to-amber-600" />
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icons.Party />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Resepsi</h3>
                <p className="text-amber-500 font-bold mb-1">{formatEventDate(data.reception_date)}</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{data.reception_time} WIB</p>
                <p className="text-white font-bold mb-1">{data.reception_venue}</p>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xs mb-8">{data.reception_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-6 py-3 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-amber-500 hover:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Icons.Calendar /> Save to Calendar
                </a>
              </div>
            </div>

            {data.maps_link && (
              <div className="text-center mt-12">
                <a
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl transition-all cursor-pointer shadow-lg shadow-amber-500/15"
                >
                  <Icons.MapPin /> Navigate Google Maps
                </a>
              </div>
            )}
          </div>
        </section>

        {/* — Momen Bahagia (Galeri) — */}
        {galleryPhotos.length > 0 && (
          <section className="py-24 bg-[#0d0e12] relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
                  <Icons.Camera /> Captured Moments
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">Our Gallery</h2>
                <div className="w-12 h-1 bg-amber-500/60 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {galleryPhotos.map((url: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="relative aspect-[3/4] rounded-3xl overflow-hidden group border border-slate-800 shadow-lg cursor-pointer bg-slate-950"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <span className="px-5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider">Expand</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* — RSVP — */}
        <section className="py-24 bg-[#090a0d] relative overflow-hidden">
          <div className="container-tight px-6">
            <div className="text-center mb-12">
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">RSVP Form</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Presence Confirmation</h2>
              <p className="text-slate-400 text-sm mt-2">Kindly let us know if you can celebrate with us</p>
            </div>
            
            <div className="bg-slate-900/30 rounded-3xl p-8 border border-slate-800">
              {/* Force dark theme properties in RSVP form */}
              <div className="dark-theme-rsvp">
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
            </div>

            {/* Wishes Wall */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Wishes Wall</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                {wishes.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm italic">No wishes yet. Be the first to congratulate us!</p>
                ) : (
                  wishes.map((wish, i) => (
                    <div key={i} className="bg-slate-900/30 rounded-2xl p-5 border border-slate-800 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-sm">{wish.name}</span>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(wish.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{wish.message}</p>
                      <span className={`inline-flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        wish.attendance === "hadir" ? "bg-emerald-500/10 text-emerald-400" :
                        wish.attendance === "tidak_hadir" ? "bg-rose-500/10 text-rose-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {wish.attendance === "hadir" && <Icons.Check />}
                        {wish.attendance === "hadir" ? "Attending" : wish.attendance === "tidak_hadir" ? "Absent" : "Undecided"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* — Gift — */}
        {(accountsList.length > 0 || data.gift_address) && (
          <section className="py-24 bg-[#0d0e12] relative overflow-hidden">
            <div className="container-tight px-6 text-center">
              <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-2 block">Gift Registry</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Send Love Token</h2>
              <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">
                Your presence means the world. Should you wish to honor us with a gift, it can be sent via:
              </p>
              
              {accountsList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
                  {accountsList.map((acc: any, i: number) => (
                    <div key={i} className="bg-slate-900/30 rounded-3xl p-6 border border-slate-800 text-center">
                      <p className="text-slate-300 font-bold text-sm mb-1">{acc.bank}</p>
                      <p className="text-amber-500 font-mono text-lg font-bold mb-1">{acc.number}</p>
                      <p className="text-slate-500 text-xs">a.n. {acc.name}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(acc.number || "")}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-amber-550 font-bold hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        <Icons.Copy /> Copy Number
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {data.gift_address && (
                <div className="bg-slate-900/30 rounded-3xl p-8 border border-slate-800 max-w-lg mx-auto text-center space-y-2">
                  <p className="text-xs uppercase tracking-wider text-amber-500 font-black">Shipping Address for Physical Gifts</p>
                  <p className="text-sm text-slate-350 font-medium leading-relaxed max-w-md mx-auto">{data.gift_address}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(data.gift_address || "")}
                    className="inline-flex items-center gap-1.5 pt-2 text-xs text-amber-550 font-bold hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Icons.Copy /> Copy Address
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* — Closing — */}
        <section className="relative py-28 overflow-hidden text-center">
          <img src={heroImage} alt="Closing" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[#090a0d]/80" />
          <div className="relative z-10 max-w-lg mx-auto px-6 flex flex-col items-center">
            <span className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4">Our Deepest Thanks</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-6">
              {data.groom_name} &amp; {data.bride_name}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              It is our highest honor and delight to share our special day with you. Thank you for your warm prayers and endless love.
            </p>
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
            </p>
          </div>
        </section>

        {/* — Branding Footer — */}
        <div className="py-6 bg-[#090a0d] text-center border-t border-slate-900">
          <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
            Made with <Icons.Heart /> by{" "}
            <a href="https://mypromise.id" className="text-amber-500 font-bold hover:text-amber-400 transition-colors ml-1">
              MyPromise
            </a>
          </p>
        </div>

      </div>

      {/* ===== LIGHTBOX MODAL ===== */}
      {selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 sm:p-8 animate-fade-in backdrop-blur-md cursor-pointer"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3.5 rounded-full bg-white/10 hover:bg-white/25 transition-all cursor-pointer z-50 border border-white/10 shadow-lg"
            title="Close (Esc)"
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
                title="Previous (Left)"
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
                title="Next (Right)"
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
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-950/85 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase shadow-xl select-none">
              {selectedPhotoIndex + 1} / {galleryPhotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import CountdownTimer from "@/components/invitation/CountdownTimer";

interface InvitationData {
  groom_name: string;
  bride_name: string;
  groom_full_name: string;
  bride_full_name: string;
  akad_date: string;
  photo_hero: string;
  music_url?: string;
  music?: string;
  [key: string]: any;
}

interface TemplateLayoutProps {
  invitationId: string;
  data: InvitationData;
  guestName?: string;
  guestSlug?: string;
  isDemo?: boolean;
  theme: "elegant" | "nusantara" | "floral";
  children: ReactNode;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

// Decorative SVG Ornaments
const SVGOrnaments = {
  ElegantDivider: () => (
    <svg width="60" height="8" viewBox="0 0 60 8" fill="none" className="text-gold-400 mx-auto opacity-70">
      <path d="M30 0L34 4L30 8L26 4L30 0Z" fill="currentColor" />
      <line x1="0" y1="4" x2="22" y2="4" stroke="currentColor" strokeWidth="0.5" />
      <line x1="38" y1="4" x2="60" y2="4" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  ),
  NusantaraKawung: () => (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-[0.07] pointer-events-none">
      <defs>
        <pattern id="kawung" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 0,20 Q 10,0 20,20 Q 10,40 0,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 20,20 Q 30,0 40,20 Q 30,40 20,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 20,0 Q 20,10 20,20 Q 20,30 20,40 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
          <path d="M 0,20 Q 10,20 20,20 Q 30,20 40,20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1,2" />
          <circle cx="20" cy="20" r="1.5" fill="currentColor" />
          <circle cx="0" cy="20" r="1" fill="currentColor" />
          <circle cx="40" cy="20" r="1" fill="currentColor" />
          <circle cx="20" cy="0" r="1" fill="currentColor" />
          <circle cx="20" cy="40" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#kawung)" />
    </svg>
  ),
  FloralCornerTopLeft: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="absolute top-0 left-0 pointer-events-none opacity-60 text-sage-400">
      <path d="M0 120C0 53.7258 53.7258 0 120 0H90C90 40 50 80 0 90V120Z" fill="currentColor" />
      <path d="M0 70C20 65 45 45 50 0H40C35 25 15 35 0 40V70Z" fill="currentColor" opacity="0.6" />
      <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  ),
  FloralCornerBottomRight: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="absolute bottom-0 right-0 pointer-events-none opacity-60 text-sage-400">
      <path d="M120 0C120 66.2742 66.2742 120 0 120H30C30 80 70 40 120 30V0Z" fill="currentColor" />
      <path d="M120 50C100 55 75 75 70 120H80C85 95 105 85 120 80V50Z" fill="currentColor" opacity="0.6" />
      <circle cx="105" cy="105" r="3" fill="currentColor" opacity="0.8" />
      <circle cx="90" cy="90" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
};

export default function TemplateLayout({
  invitationId,
  data,
  guestName,
  guestSlug,
  isDemo,
  theme,
  children
}: TemplateLayoutProps) {
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const displayName = guestName || "Tamu Undangan";
  const musicUrl = data.music_url || data.music;
  const heroImage = data.photo_hero || PLACEHOLDER_IMAGE;

  // Check sessionStorage on mount
  useEffect(() => {
    if (isDemo) {
      setIsOpened(false);
      return;
    }
    const isOpenedBefore = sessionStorage.getItem(`invitation_opened_${invitationId}`);
    if (isOpenedBefore === "true") {
      setIsOpened(true);
    }
  }, [invitationId, isDemo]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (!isDemo) {
      sessionStorage.setItem(`invitation_opened_${invitationId}`, "true");
    }

    if (musicUrl && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay prevented by browser:", err));
    }

    // Update is_opened status in database for actual guests
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

  // Theme styling configurations
  const getCoverStyles = () => {
    switch (theme) {
      case "nusantara":
        return {
          overlay: "absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/70 to-stone-950/80",
          container: "relative z-10 text-center px-6 py-12 border border-amber-500/20 rounded-3xl bg-stone-900/60 backdrop-blur-xs shadow-2xl max-w-md mx-6 text-amber-50 animate-fade-in",
          namesFont: "var(--font-serif)",
          btn: "px-8 py-3.5 bg-amber-700 text-stone-900 font-extrabold rounded-lg hover:bg-amber-600 transition-all duration-300 tracking-wider text-xs uppercase shadow-lg shadow-amber-950/30",
          hasPattern: true,
          badgeColor: "bg-amber-800 text-stone-100"
        };
      case "floral":
        return {
          overlay: "absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/70",
          container: "relative z-10 text-center px-8 py-14 border border-sage-300/30 rounded-3xl bg-stone-900/50 backdrop-blur-xs shadow-2xl max-w-md mx-6 text-stone-100 animate-fade-in",
          namesFont: "var(--font-cormorant)",
          btn: "px-9 py-4 bg-emerald-700 hover:bg-emerald-600 text-stone-100 font-bold rounded-full transition-all duration-300 hover:scale-105 active:scale-95 tracking-widest text-xs uppercase shadow-lg shadow-emerald-950/30",
          hasFlorals: true,
          badgeColor: "bg-emerald-900 text-sage-100"
        };
      case "elegant":
      default:
        return {
          overlay: "absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-neutral-950/70",
          container: "relative z-10 text-center px-8 py-14 border border-gold-300/20 rounded-3xl bg-neutral-950/40 backdrop-blur-xs shadow-2xl max-w-md mx-6 text-neutral-100 animate-fade-in",
          namesFont: "var(--font-cormorant)",
          btn: "px-9 py-3.5 border border-gold-400 hover:bg-gold-500 hover:text-neutral-950 text-gold-400 font-bold rounded-none transition-all duration-500 tracking-widest text-xs uppercase shadow-lg",
          badgeColor: "bg-neutral-800 text-gold-300"
        };
    }
  };

  const cover = getCoverStyles();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* AUDIO ELEMENT */}
      {musicUrl && <audio ref={audioRef} src={musicUrl} loop className="hidden" preload="auto" />}

      {/* ===== COVER / AMPLOP DIGITAL ===== */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950">
          <img src={heroImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 animate-pulse-soft" />
          <div className={cover.overlay} />

          {/* SVG Patterns for cover */}
          {cover.hasPattern && <SVGOrnaments.NusantaraKawung />}
          {cover.hasFlorals && (
            <>
              <SVGOrnaments.FloralCornerTopLeft />
              <SVGOrnaments.FloralCornerBottomRight />
            </>
          )}

          <div className={cover.container}>
            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 ${cover.badgeColor} rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-md`}>
              Undangan Pernikahan
            </div>
            <p className="text-white/60 text-xs uppercase tracking-[0.25em] mb-4 mt-2">The Wedding of</p>
            
            <h1 className="text-4xl sm:text-5xl font-light mb-1 tracking-wide" style={{ fontFamily: cover.namesFont }}>
              {data.groom_name}
            </h1>
            <p className="text-2xl text-rose-300 font-serif italic mb-1 opacity-70">
              &
            </p>
            <h1 className="text-4xl sm:text-5xl font-light mb-8 tracking-wide" style={{ fontFamily: cover.namesFont }}>
              {data.bride_name}
            </h1>
            
            {theme === "elegant" && <div className="mb-8"><SVGOrnaments.ElegantDivider /></div>}

            <div className="mb-10">
              <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1.5">Kepada Yth.</p>
              <p className="text-white text-xl font-medium tracking-wide">
                {displayName}
              </p>
            </div>

            <button
              onClick={handleOpenInvitation}
              className={`${cover.btn} cursor-pointer`}
            >
              {theme === "floral" && <span className="mr-1">✿</span>}
              Buka Undangan
              {theme === "floral" && <span className="ml-1">✿</span>}
            </button>
          </div>
        </div>
      )}

      {/* ===== FLOATING MUSIC BUTTON ===== */}
      {isOpened && musicUrl && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={toggleAudio}
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 ${
              isPlaying
                ? "bg-rose-500 text-white shadow-rose-500/25 hover:bg-rose-600 scale-100"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            }`}
            title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="translate-x-0.5">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ===== INVITATION WRAPPER / TWO-PANEL LAYOUT ===== */}
      <div className={isOpened ? "animate-fade-in block" : "hidden"}>
        {/* DESKTOP LAYOUT (min-width: 1024px) */}
        <div className="lg:flex lg:h-screen lg:w-full">
          
          {/* LEFT PANEL: Fixed 70% Width (Hidden on Mobile) */}
          <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:w-[70%] lg:h-screen lg:overflow-hidden select-none bg-neutral-950">
            <img src={heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105" />
            <div className={cover.overlay} />

            {/* SVG Decor for left panel */}
            {theme === "nusantara" && <SVGOrnaments.NusantaraKawung />}
            {theme === "floral" && (
              <>
                <SVGOrnaments.FloralCornerTopLeft />
                <SVGOrnaments.FloralCornerBottomRight />
              </>
            )}

            {/* Left Panel Content */}
            <div className="relative z-10 h-full w-full flex flex-col justify-between p-16 text-white text-center">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/55">Undangan Pernikahan</span>
                <p className="text-xs text-white/40 tracking-wider">Kepada Yth. <span className="text-white font-bold">{displayName}</span></p>
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl font-light tracking-wider" style={{ fontFamily: cover.namesFont }}>
                  {data.groom_name} <span className="text-rose-400 text-3xl font-serif italic block my-2">&</span> {data.bride_name}
                </h1>
                {theme === "elegant" && <SVGOrnaments.ElegantDivider />}
                <p className="text-sm font-light text-white/70 tracking-widest uppercase">
                  {new Date(data.akad_date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl py-6 px-10 max-w-md mx-auto shadow-xl">
                <CountdownTimer targetDate={data.akad_date} />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Scrollable 30% Width on Desktop, 100% on Mobile */}
          <div className="w-full lg:w-[30%] lg:ml-[70%] lg:h-screen lg:overflow-y-auto lg:custom-scrollbar">
            <div className="w-full min-h-screen">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

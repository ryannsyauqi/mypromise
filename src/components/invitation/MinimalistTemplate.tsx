"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  love_story?: { date: string; title: string; description: string }[];
  photo_hero: string;
  photo_groom: string;
  photo_bride: string;
}

interface MinimalistTemplateProps {
  invitationId: string;
  data: InvitationData;
  guestName?: string;
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
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";

export default function MinimalistTemplate({ invitationId, data, guestName, isDemo }: MinimalistTemplateProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [wishes, setWishes] = useState<any[]>([]);
  const displayName = guestName || "Tamu Undangan";

  const heroImage = data.photo_hero || PLACEHOLDER_IMAGE;
  const groomImage = data.photo_groom || PLACEHOLDER_IMAGE;
  const brideImage = data.photo_bride || PLACEHOLDER_IMAGE;

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
          setWishes(wishData);
        }
      } catch (error) {
        console.error("Failed to load wishes:", error);
      }
    }
    loadWishes();
  }, [invitationId, isDemo]);

  return (
    <div className="relative min-h-screen bg-cream-50 overflow-hidden">
      {/* ===== COVER / OPENING ===== */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-charcoal-900">
          <Image src={heroImage} alt="Cover" fill className="object-cover opacity-40" />
          <div className="relative z-10 text-center px-6 animate-fade-in">
            <p className="text-cream-200/60 text-sm uppercase tracking-[0.3em] mb-4">The Wedding of</p>
            <h1
              className="text-5xl sm:text-7xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.groom_name}
            </h1>
            <p className="text-3xl sm:text-4xl text-gold-400 mb-2" style={{ fontFamily: "var(--font-great-vibes)" }}>
              &
            </p>
            <h1
              className="text-5xl sm:text-7xl font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {data.bride_name}
            </h1>

            <div className="mb-10">
              <p className="text-cream-200/70 text-sm mb-1">Kepada Yth.</p>
              <p className="text-white text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                {displayName}
              </p>
            </div>

            <button
              onClick={() => setIsOpened(true)}
              className="px-10 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30 animate-pulse-soft"
            >
              Buka Undangan
            </button>
          </div>
        </div>
      )}

      {/* ===== MAIN INVITATION CONTENT ===== */}
      <div className={isOpened ? "animate-fade-in" : "hidden"}>

        {/* — Bismillah / Opening — */}
        <section className="py-20 px-6 text-center bg-cream-50">
          <p className="text-charcoal-300 text-2xl mb-4" style={{ fontFamily: "var(--font-great-vibes)" }}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-charcoal-400 text-sm max-w-md mx-auto leading-relaxed">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          {data.love_quote && (
            <div className="mt-8 max-w-lg mx-auto">
              <div className="divider-ornament text-charcoal-300 mb-6">✦</div>
              <p className="text-charcoal-500 text-sm italic leading-relaxed whitespace-pre-line">
                {data.love_quote}
              </p>
            </div>
          )}
        </section>

        {/* — Hero — */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
          <Image src={heroImage} alt={`${data.groom_name} & ${data.bride_name}`} fill className="object-cover" priority />
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
        <section className="section-padding bg-cream-50">
          <div className="container-tight px-6">
            <div className="text-center mb-12">
              <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">Mempelai</p>
              <div className="divider-ornament text-charcoal-300">✦</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {/* Groom */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-cream-200 shadow-lg">
                  <Image src={groomImage} alt={data.groom_full_name} fill className="object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-800 mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                  {data.groom_full_name}
                </h3>
                <p className="text-charcoal-400 text-sm">Putra dari {data.groom_parents}</p>
              </div>
              {/* Bride */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-cream-200 shadow-lg">
                  <Image src={brideImage} alt={data.bride_full_name} fill className="object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-charcoal-800 mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                  {data.bride_full_name}
                </h3>
                <p className="text-charcoal-400 text-sm">Putri dari {data.bride_parents}</p>
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
        <section className="section-padding bg-cream-50">
          <div className="container-tight px-6">
            <div className="text-center mb-12">
              <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">Acara</p>
              <h2 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
                Waktu & Tempat
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Akad */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-cream-200">
                <Icons.Rings />
                <h3 className="text-xl font-bold text-charcoal-800 mb-4 mt-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  Akad Nikah
                </h3>
                <p className="text-charcoal-600 font-semibold text-sm">{formatEventDate(data.akad_date)}</p>
                <p className="text-charcoal-400 text-sm mb-3">{data.akad_time} WIB</p>
                <p className="text-charcoal-700 font-semibold text-sm">{data.akad_venue}</p>
                <p className="text-charcoal-400 text-xs mt-1 leading-relaxed">{data.akad_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Akad Nikah ${data.groom_name} & ${data.bride_name}`, data.akad_date, data.akad_time, data.akad_venue, data.akad_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-cream-100 text-charcoal-600 text-xs font-medium rounded-full hover:bg-cream-200 transition-all"
                >
                  <Icons.Calendar /> Simpan ke Kalender
                </a>
              </div>
              {/* Reception */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-cream-200">
                <Icons.Party />
                <h3 className="text-xl font-bold text-charcoal-800 mb-4 mt-4" style={{ fontFamily: "var(--font-playfair)" }}>
                  Resepsi
                </h3>
                <p className="text-charcoal-600 font-semibold text-sm">{formatEventDate(data.reception_date)}</p>
                <p className="text-charcoal-400 text-sm mb-3">{data.reception_time} WIB</p>
                <p className="text-charcoal-700 font-semibold text-sm">{data.reception_venue}</p>
                <p className="text-charcoal-400 text-xs mt-1 leading-relaxed">{data.reception_address}</p>
                <a
                  href={getGoogleCalendarUrl(`Resepsi ${data.groom_name} & ${data.bride_name}`, data.reception_date, data.reception_time, data.reception_venue, data.reception_address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-cream-100 text-charcoal-600 text-xs font-medium rounded-full hover:bg-cream-200 transition-all"
                >
                  <Icons.Calendar /> Simpan ke Kalender
                </a>
              </div>
            </div>
            {/* Maps */}
            {data.maps_link && (
              <div className="text-center mt-8">
                <a
                  href={data.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-rose-400 text-rose-500 font-semibold text-sm rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                  <Icons.MapPin /> Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </section>

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
                isDemo={isDemo} 
                onSuccess={() => {
                  // Refresh wishes after successful RSVP
                  fetch(`/api/invitations/${invitationId}/wishes`)
                    .then(res => res.json())
                    .then(data => setWishes(data));
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
        {(data.bank_account_1 || data.bank_account_2) && (
          <section className="section-padding bg-cream-50">
            <div className="container-tight px-6 text-center">
              <p className="text-rose-500 text-sm uppercase tracking-wider mb-2">Hadiah</p>
              <h2 className="text-3xl font-bold text-charcoal-800 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Kirim Hadiah
              </h2>
              <p className="text-charcoal-400 text-sm mb-8 max-w-sm mx-auto">
                Doa restu Anda sudah cukup bagi kami. Namun jika ingin memberikan tanda kasih, bisa melalui:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {[data.bank_account_1, data.bank_account_2].filter(Boolean).map((acc, i) => {
                  const parts = acc!.split("—").map(p => p.trim());
                  return (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm">
                      <p className="text-charcoal-700 font-bold text-sm mb-1">{parts[0]}</p>
                      <p className="text-charcoal-800 font-mono text-lg font-semibold mb-1">{parts[1]}</p>
                      <p className="text-charcoal-400 text-xs">a.n. {parts[2]}</p>
                      <button
                        onClick={() => navigator.clipboard.writeText(parts[1] || "")}
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-rose-500 font-bold hover:text-rose-400 transition-colors"
                      >
                        <Icons.Copy /> Salin Nomor
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* — Closing — */}
        <section className="relative py-24 overflow-hidden">
          <Image src={heroImage} alt="Closing" fill className="object-cover" />
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
    </div>
  );
}


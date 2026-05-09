"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { createClient } from "@/utils/supabase/client";
import { Template } from "@/lib/types";

export default function HomePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;
        if (data) setTemplates(data as Template[]);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Static Cinematic */}
      <section className="relative h-[75vh] flex items-center overflow-hidden bg-charcoal-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero.jpg"
            alt="MyPromise Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/40 to-transparent" />
        </div>

        <div className="container-default px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-8 animate-fade-in">
            <div className="space-y-3">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-[9px] font-black uppercase tracking-[0.4em]">
                DIGITAL WEDDING INVITATION
              </span>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tighter"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Undangan Digital <br />
                <span className="italic font-normal text-rose-400">Modern & Elegan.</span>
              </h1>
            </div>

            <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
              Dapatkan undangan pernikahan digital eksklusif dan bagikan kebahagiaan ke orang tersayang dalam hitungan menit!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#designs"
                className="px-10 py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 hover:shadow-xl transition-all duration-500 uppercase tracking-widest text-[10px] text-center"
              >
                Lihat Katalog
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 uppercase tracking-widest text-[10px] text-center flex items-center justify-center gap-3"
              >
                <Image src="/whatsapp-icon.png" alt="WA" width={18} height={18} className="brightness-0 invert" />
                Hubungi Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== USP: COMPACT & HIGH-IMPACT ===== */}
      <section className="py-16 bg-white">
        <div className="container-default px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Desain Eksklusif",
                desc: "Koleksi template dengan estetika mewah untuk momen spesial kamu.",
                icon: (
                  <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              },
              {
                title: "Fitur Lengkap",
                desc: "Personalisasi nama tamu, RSVP real-time, integrasi peta, hingga amplop digital.",
                icon: (
                  <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                )
              },
              {
                title: "Proses Cepat",
                desc: "Selesaikan informasi pernikahan kamu dan bagikan dalam hitungan menit.",
                icon: (
                  <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((usp, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {usp.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>{usp.title}</h3>
                  <p className="text-charcoal-500 text-xs leading-relaxed">{usp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FITUR UNGGULAN: SPLIT LAYOUT ===== */}
      <section id="features" className="py-24 bg-cream-50/40">
        <div className="container-default px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left Column: Narrative */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500">Fitur Lengkap</h2>
                <h3 className="text-4xl md:text-6xl font-bold text-charcoal-900 leading-[1.1]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Semua yang Kamu <br /> Butuhkan.
                </h3>
              </div>
              <p className="text-charcoal-500 text-base leading-relaxed max-w-md">
                Kami menyediakan fitur lengkap untuk memastikan pengalaman terbaik bagi kamu dan seluruh tamu undangan. Ciptakan momen spesial yang tak terlupakan dengan teknologi undangan digital terkini.
              </p>
            </div>

            {/* Right Column: Checklists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-white p-10 rounded-[40px] border border-rose-100/30 shadow-sm">
              {[
                "Desain Premium",
                "Sapaan Personal",
                "Hero Section",
                "Countdown Timer",
                "Profil Pasangan",
                "Love Story",
                "Detail Acara",
                "Google Maps",
                "Galeri Moments",
                "Embed Video",
                "RSVP & Ucapan",
                "Amplop Digital",
                "Closing Section",
                "Musik Latar",
                "Animasi Scroll",
                "Optimasi Mobile"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-rose-500 shadow-sm flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-charcoal-700 uppercase tracking-widest">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== KATALOG: REFINED CATALOGUE ===== */}
      <section id="designs" className="py-24 bg-white">
        <div className="container-default px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Pilih Desain Undanganmu
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-3xl" />
              ))
            ) : (
              templates.map((t, i) => (
                <TemplateCard key={t.id} template={t} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== CARA PESAN: COMPACT STRIP (NUMBERED CIRCLES) ===== */}
      <section id="how-it-works" className="py-24 bg-cream-50/50 border-y border-cream-100">
        <div className="container-default px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500 mb-2">Cara Pesan</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-charcoal-900 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Proses Cepat <br />
                & Praktis
              </h3>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: "Pilih Desain", desc: "Pilih dari koleksi desain premium kami." },
                { title: "Pembayaran", desc: "Lakukan pembayaran aman dan mudah." },
                { title: "Isi Data", desc: "Lengkapi detail acara dan foto kamu." },
                { title: "Undangan Ready", desc: "Undangan siap dibagikan ke kerabat." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-rose-500/20">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-charcoal-900">{step.title}</h4>
                    <p className="text-[11px] text-charcoal-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS: CLEAN & DIRECT ===== */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container-default px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500">Testimoni</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Our Happy Couples
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah & Adit", text: "Awalnya bingung cari undangan, untung ketemu MyPromise. Desainnya estetik banget dan cuma butuh 5 menit langsung jadi. Benar-benar solusi buat kita yang gak mau ribet!" },
              { name: "Budi & Citra", text: "Paling kebantu sama fitur RSVP-nya, jadi gak perlu catat manual lagi siapa aja yang mau datang. Harganya juga sangat terjangkau buat kualitas se-premium ini. Thank you!" },
              { name: "Dina & Erwan", text: "Gak nyangka bikin undangan digital bisa semudah ini. Fitur maps-nya integrasi langsung ke Google Maps, praktis banget. Sangat recommended buat yang mau sat set!" }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-cream-50/50 rounded-[2.5rem] border border-cream-100 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-charcoal-600 italic leading-relaxed text-sm">"{item.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-cream-100">
                  <span className="text-xs font-black uppercase tracking-widest text-charcoal-900">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA: FINAL PUSH ===== */}
      <section className="py-20 bg-charcoal-900 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500 blur-[120px]" />
        </div>

        <div className="container-tight px-6 relative z-10 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Siap Memulai?</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Buat Undangan Digital Impian Kamu.
            </h3>
            <p className="text-white/40 text-[13px] max-w-md mx-auto">
              Hanya butuh hitungan menit untuk membuat undangan digital eksklusif yang berkesan bagi seluruh tamu kamu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a
              href="#designs"
              className="px-12 py-4 bg-rose-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-900/40"
            >
              Pilih Desain
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Image src="/whatsapp-icon.png" alt="WA" width={16} height={16} className="brightness-0 invert" />
              Tanya Admin
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

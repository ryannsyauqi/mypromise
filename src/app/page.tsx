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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const slides = [
    "/images/hero/hero-slider1.jpeg",
    "/images/hero/hero-slider2.jpeg",
    "/images/hero/hero-slider3.jpeg",
  ];

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

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="bg-cream-50 overflow-x-hidden selection:bg-rose-100 selection:text-rose-900">
      <Navbar />

      {/* ===== HERO: DIRECT & CINEMATIC (LEFT ALIGNED) ===== */}
      <section className="relative h-[75vh] flex items-center overflow-hidden">
        {/* Slider Background */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide}
                alt={`Hero ${index + 1}`}
                fill
                className={`object-cover ${index === currentSlide ? "animate-[slow-zoom_20s_infinite_alternate]" : ""}`}
                priority={index === 0}
              />
            </div>
          ))}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container-default px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-8 animate-fade-in">
            <div className="space-y-3">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-300 text-[9px] font-black uppercase tracking-[0.4em]">
                Platform Undangan Digital Modern
              </span>
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.9] tracking-tighter"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Undangan Digital <br />
                <span className="italic font-normal text-rose-400">Eksklusif.</span>
              </h1>
            </div>

            <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed">
              Buat undangan pernikahan Anda dengan cepat, mudah, dan desain premium yang sudah dikurasi oleh profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/templates"
                className="px-10 py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 hover:shadow-xl transition-all duration-500 uppercase tracking-widest text-[10px] text-center"
              >
                Lihat Katalog
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-white/5 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300 uppercase tracking-widest text-[10px] text-center"
              >
                Hubungi Admin
              </a>
            </div>

            {/* Slider Indicators (Left Aligned) */}
            <div className="flex gap-2 pt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-8 h-1 rounded-full transition-all duration-500 ${
                    idx === currentSlide ? "bg-rose-500 w-12" : "bg-white/30"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA PESAN: COMPACT STRIP (NUMBERED CIRCLES) ===== */}
      <section className="py-16 bg-white border-b border-cream-100">
        <div className="container-default px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-rose-500 mb-2">Cara Pesan</h2>
              <h3 className="text-3xl font-bold text-charcoal-900 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Proses Cepat <br /> & Praktis.
              </h3>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Pilih Desain", desc: "Pilih dari koleksi desain premium kami." },
                { title: "Isi Data", desc: "Lengkapi detail acara dan foto Anda." },
                { title: "Kirim Undangan", desc: "Undangan siap dibagikan dalam hitungan menit." }
              ].map((step, i) => (
                <div key={i} className="flex gap-5 items-start group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-rose-500/20">
                    {i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>{step.title}</h4>
                    <p className="text-[11px] text-charcoal-500 leading-relaxed max-w-[200px]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FITUR UNGGULAN: SIMPLE CHECKLIST ===== */}
      <section id="features" className="py-20 bg-cream-50/30">
        <div className="container-default px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500">Fitur Lengkap</h2>
              <h3 className="text-4xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
                Semua yang Anda <br /> Butuhkan.
              </h3>
            </div>
            <p className="text-charcoal-500 text-xs max-w-md">
              Kami menyediakan fitur lengkap untuk memastikan pengalaman terbaik bagi Anda dan seluruh tamu undangan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
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
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-5 h-5 rounded-md bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-500 group-hover:border-rose-500 transition-all duration-300">
                  <svg 
                    className="w-3 h-3 text-rose-500 group-hover:text-white transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KATALOG: REFINED CATALOGUE ===== */}
      <section id="designs" className="py-24 bg-white">
        <div className="container-default px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Koleksi Desain.
            </h2>
            <Link href="/templates" className="text-[9px] font-black uppercase tracking-widest border-b border-charcoal-900 pb-1 hover:text-rose-500 hover:border-rose-500 transition-all">
              Semua Desain
            </Link>
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

      {/* ===== TESTIMONIALS: CLEAN & DIRECT ===== */}
      <section id="testimonials" className="py-24 bg-cream-50/50">
        <div className="container-default px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-500">Testimoni</h2>
            <h3 className="text-4xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Apa Kata Mereka.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah & Adit", text: "Desainnya sangat elegan dan prosesnya cepat sekali. Sangat membantu koordinasi di tengah kesibukan persiapan kami." },
              { name: "Budi & Citra", text: "Fitur RSVP-nya sangat memudahkan kami mengelola daftar tamu secara real-time. Benar-benar platform yang sangat praktis." },
              { name: "Dina & Erwan", text: "Undangan digital tercantik yang pernah saya lihat. Tamu-tamu kami banyak yang memuji kemudahan navigasi lokasinya." }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white rounded-[2rem] border border-cream-100 space-y-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-charcoal-600 italic leading-relaxed text-sm">"{item.text}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-cream-50">
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-[10px] font-black text-rose-500">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-charcoal-900">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA: FINAL PUSH ===== */}
      <section className="py-24 bg-charcoal-900 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500 blur-[120px]" />
        </div>
        
        <div className="container-tight px-6 relative z-10 text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Siap Memulai?</h2>
            <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Buat Undangan Digital <br /> Impian Anda Sekarang.
            </h3>
            <p className="text-white/40 text-sm max-w-lg mx-auto">
              Hanya butuh hitungan menit untuk membuat undangan digital eksklusif yang berkesan bagi seluruh tamu Anda.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/templates"
              className="px-12 py-5 bg-rose-500 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-900/40"
            >
              Lihat Katalog Desain
            </Link>
            <a
              href="https://wa.me/6281234567890"
              className="px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/10 transition-all"
            >
              Tanya Admin
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

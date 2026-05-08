import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { mockTemplates, formatRupiah, INVITATION_PRICE, PRICE_FEATURES } from "@/lib/mock-data";

export default function HomePage() {
  const featuredTemplates = mockTemplates.slice(0, 3);

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-bg.png"
          alt="Wedding background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/40 to-charcoal-900/70" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p
            className="text-cream-200/80 text-lg md:text-xl mb-4 animate-fade-in"
            style={{ fontFamily: "var(--font-great-vibes)", animationDelay: "0.2s" }}
          >
            Your love story, beautifully delivered
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Undangan Digital
            <br />
            <span className="gradient-text">Premium</span>
          </h1>
          <p className="text-cream-200/90 text-base md:text-lg mb-10 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Buat undangan pernikahan digital yang elegan dengan link personal untuk setiap tamu. Tanpa ribet, langsung jadi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Link
              href="/templates"
              className="px-8 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 text-base"
            >
              Lihat Template
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20undangan%20digital%20MyPromise"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 text-base"
            >
              Konsultasi via WA
            </a>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-indicator">
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-padding bg-cream-50">
        <div className="container-default px-6">
          <div className="text-center mb-16">
            <p className="text-rose-500 text-sm font-semibold uppercase tracking-wider mb-3">Kenapa MyPromise?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
              Semua yang Anda Butuhkan
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {[
              { icon: "🎨", title: "Desain Premium", desc: "Template elegan yang mengutamakan foto pasangan. Desain bersih, modern, dan romantis." },
              { icon: "🔗", title: "Link Personal", desc: "Setiap tamu mendapat link unik dengan nama mereka. \"Kepada Yth. Pak Rudi\" — personal & istimewa." },
              { icon: "📋", title: "RSVP & Ucapan", desc: "Tamu bisa konfirmasi kehadiran dan mengirim ucapan langsung dari undangan. Semua tercatat rapi." },
              { icon: "⏱️", title: "Countdown Timer", desc: "Hitung mundur menuju hari bahagia yang berdetak real-time di halaman undangan." },
              { icon: "📸", title: "Galeri Foto", desc: "Tampilkan hingga 10 foto prewedding terbaik dalam galeri yang indah. Foto jadi jiwa undangan." },
              { icon: "💳", title: "Bayar Langsung", desc: "Checkout & bayar langsung di website. Tanpa chat panjang, tanpa negosiasi. Simpel." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group">
                <span className="text-4xl mb-4 block group-hover:animate-float">{f.icon}</span>
                <h3 className="text-lg font-bold text-charcoal-800 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{f.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container-default px-6">
          <div className="text-center mb-16">
            <p className="text-rose-500 text-sm font-semibold uppercase tracking-wider mb-3">Mudah & Cepat</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
              Cara Kerjanya
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Pilih Template", desc: "Pilih desain undangan yang sesuai dengan gaya pernikahan Anda." },
              { step: "02", title: "Checkout & Bayar", desc: "Isi data dan bayar langsung. Tanpa chat, tanpa nego." },
              { step: "03", title: "Isi Konten", desc: "Isi form data pernikahan, upload foto, dan daftar tamu." },
              { step: "04", title: "Terima & Bagikan", desc: "Undangan siap! Bagikan link personal ke setiap tamu via WhatsApp." },
            ].map((s) => (
              <div key={s.step} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-rose-500 transition-all duration-500">
                  <span className="text-rose-500 font-bold text-lg group-hover:text-white transition-colors">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-charcoal-800 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>{s.title}</h3>
                <p className="text-sm text-charcoal-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TEMPLATE PREVIEW ===== */}
      <section className="section-padding bg-cream-50">
        <div className="container-default px-6">
          <div className="text-center mb-16">
            <p className="text-rose-500 text-sm font-semibold uppercase tracking-wider mb-3">Koleksi Template</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
              Desain Pilihan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemplates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-rose-500 text-rose-500 font-semibold rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300"
            >
              Lihat Semua Template
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section-padding bg-white">
        <div className="container-tight px-6">
          <div className="text-center mb-12">
            <p className="text-rose-500 text-sm font-semibold uppercase tracking-wider mb-3">Harga Transparan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
              Satu Harga, Semua Fitur
            </h2>
          </div>
          <div className="relative bg-gradient-to-br from-cream-50 to-rose-50 rounded-3xl p-8 md:p-12 border border-cream-200 shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Best Value
            </div>
            <div className="text-center mb-8">
              <p className="text-charcoal-400 text-sm mb-2">Undangan Digital Premium</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl md:text-6xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
                  {formatRupiah(INVITATION_PRICE)}
                </span>
              </div>
              <p className="text-charcoal-400 text-sm mt-2">per undangan · semua template</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-md mx-auto">
              {PRICE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-sage-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-charcoal-600">{f}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/templates"
                className="inline-block px-10 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/25 hover:-translate-y-0.5 text-base"
              >
                Buat Undangan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <Image src="/images/hero-bg.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/70" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Siap Buat Undangan Impian?
          </h2>
          <p className="text-cream-200/80 mb-8">
            Mulai dari pilih template hingga terima link undangan — semuanya bisa selesai dalam hitungan menit.
          </p>
          <Link
            href="/templates"
            className="inline-block px-10 py-4 bg-rose-500 text-white font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30 text-base"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

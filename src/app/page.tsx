import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { mockTemplates } from "@/lib/mock-data";

export default function HomePage() {
  const featuredTemplates = mockTemplates.slice(0, 6);

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* ===== HERO SECTION: COMPACT & HIGH CONTRAST ===== */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.png"
            alt="Wedding background"
            fill
            className="object-cover"
            priority
          />
          {/* Darker Overlay for better contrast */}
          <div className="absolute inset-0 bg-charcoal-900/60" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p 
            className="text-rose-300 text-xl md:text-2xl mb-4 animate-fade-in"
            style={{ fontFamily: "var(--font-great-vibes)" }}
          >
            Your love story, beautifully delivered.
          </p>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Undangan Digital <br /> 
            <span className="text-rose-400">Premium & Elegan</span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/templates"
              className="px-8 py-4 bg-rose-500 text-white font-bold rounded-xl transition-all duration-300 hover:bg-rose-600 shadow-lg shadow-rose-900/20"
            >
              Lihat Katalog Desain
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Konsultasi WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== GUEST EXPERIENCE FEATURES: COMPACT ===== */}
      <section id="features" className="py-20 bg-white">
        <div className="container-default px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Fitur Utama Guest Experience
          </h2>
          <div className="w-12 h-1 bg-rose-500 mx-auto rounded-full" />
        </div>
        
        <div className="container-default px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: "🔗", title: "Personal Link", desc: "Link unik per tamu" },
              { icon: "📋", title: "RSVP Online", desc: "Konfirmasi kehadiran" },
              { icon: "💬", title: "Ucapan & Doa", desc: "Wall ucapan interaktif" },
              { icon: "📍", title: "Navigasi Maps", desc: "Petunjuk arah venue" },
              { icon: "📅", title: "Add to Calendar", desc: "Reminder hari H" },
              { icon: "💳", title: "Kirim Kado", desc: "Angpao digital" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-cream-50/50 p-6 rounded-2xl text-center hover:bg-white hover:shadow-xl hover:shadow-cream-200/50 transition-all duration-300 border border-cream-100">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="text-sm font-bold text-charcoal-800 mb-1">{feature.title}</h4>
                <p className="text-[11px] text-charcoal-400 uppercase tracking-wider">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHOOSE YOUR DESIGN: COMPACT GRID ===== */}
      <section id="designs" className="py-20 bg-cream-50/30 border-y border-cream-100">
        <div className="container-default px-6 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-charcoal-800 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Choose Your Design
          </h2>
          <p className="text-charcoal-400 text-sm max-w-xl mx-auto">
            Silahkan klik Preview untuk melihat detail tampilan. Pilih desain yang paling sesuai dengan karakter pernikahan Anda.
          </p>
        </div>
        
        <div className="container-default px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-3 bg-charcoal-800 text-white font-bold rounded-xl hover:bg-charcoal-700 transition-all duration-300 shadow-md"
            >
              Lihat Semua Desain
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS: COMPACT ===== */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container-default px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Apa Kata Mereka?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah & Faisal", text: "Desainnya sangat elegan dan proses pembayarannya sangat mudah. Tamu banyak yang memuji tampilannya!", role: "Wedding in Jakarta" },
              { name: "Adit & Ratna", text: "Fitur RSVP sangat membantu kami mendata tamu. Adminnya ramah dan pengerjaannya cepat sekali.", role: "Wedding in Bandung" },
              { name: "Budi & Ayu", text: "Link personalnya bikin tamu ngerasa spesial banget. Harganya pun sangat affordable untuk kualitas segini.", role: "Wedding in Bali" }
            ].map((item, idx) => (
              <div key={idx} className="bg-cream-50/50 p-8 rounded-3xl relative border border-cream-100">
                <div className="text-rose-300 text-5xl absolute top-4 right-8 opacity-30">“</div>
                <p className="text-charcoal-600 italic text-sm mb-6 leading-relaxed relative z-10">
                  {item.text}
                </p>
                <div>
                  <p className="text-charcoal-800 font-bold text-sm">{item.name}</p>
                  <p className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

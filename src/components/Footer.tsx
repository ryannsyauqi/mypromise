import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-white py-24">
      <div className="container-default px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
              <span 
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                <span className="gradient-text">My</span>Promise
              </span>
            </Link>
            <p className="text-white/50 text-lg leading-relaxed max-w-sm">
              Membantu setiap pasangan mewujudkan undangan pernikahan impian dengan sentuhan digital yang elegan dan personal.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'WhatsApp', 'TikTok'].map(social => (
                <a 
                  key={social}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-500 group"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-white/20 group-hover:bg-white rounded-sm transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Sitemap</h4>
            <ul className="space-y-4">
              <li><Link href="/templates" className="text-white/70 hover:text-rose-400 transition-colors">Koleksi Template</Link></li>
              <li><Link href="/#pricing" className="text-white/70 hover:text-rose-400 transition-colors">Harga Paket</Link></li>
              <li><Link href="/#how-it-works" className="text-white/70 hover:text-rose-400 transition-colors">Cara Kerja</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/40">Consultation</h4>
            <div className="space-y-4">
              <p className="text-2xl font-bold text-white/90" style={{ fontFamily: "var(--font-playfair)" }}>
                Punya pertanyaan? <br />
                Hubungi tim konsultan kami.
              </p>
              <a 
                href="https://wa.me/6281234567890" 
                className="inline-block px-8 py-4 bg-rose-500 text-white font-bold rounded-full hover:bg-rose-600 transition-all duration-300 shadow-xl shadow-rose-500/10"
              >
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-xs tracking-widest uppercase">
            &copy; {currentYear} MyPromise.id — Part of Love Story Digital.
          </p>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

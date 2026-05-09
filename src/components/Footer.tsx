import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-900 text-white py-20 border-t border-white/5">
      <div className="container-default px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                <span className="text-rose-500">My</span>Promise
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm">
              Platform kurasi undangan pernikahan digital eksklusif dengan desain premium dan fitur fungsional terbaik.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'WhatsApp', 'TikTok'].map(social => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all duration-300 group"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-3 h-3 bg-white/20 group-hover:bg-white rounded-sm transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Navigasi</h4>
            <ul className="space-y-3">
              <li><Link href="/#designs" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-rose-400 transition-colors">Koleksi Desain</Link></li>
              <li><Link href="/#features" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-rose-400 transition-colors">Fitur Lengkap</Link></li>
              <li><Link href="/#how-it-works" className="text-[11px] font-bold uppercase tracking-wider text-white/60 hover:text-rose-400 transition-colors">Cara Pemesanan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Kontak Kami</h4>
            <div className="space-y-4">
              <p className="text-lg font-bold text-white/90 leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                Siap mewujudkan undangan <br /> impian Anda?
              </p>
              <a
                href="https://wa.me/6281234567890"
                className="inline-block px-8 py-3.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all duration-300 shadow-xl shadow-rose-900/20"
              >
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[9px] font-black tracking-[0.2em] uppercase">
            &copy; {currentYear} MyPromise.id — Studio Desain Undangan Digital.
          </p>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage(props: PageProps<"/checkout/success">) {
  // We can use searchParams to get order_id if needed
  
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar variant="light-bg" />
      
      <main className="pt-24 pb-24 flex items-center justify-center">
        <div className="max-w-xl w-full px-6 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/5 border border-rose-100/50 animate-scale-in">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="mb-8">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 block">Order Confirmed</span>
            <h1 className="text-3xl md:text-5xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Terima Kasih!
            </h1>
            <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed max-w-md mx-auto font-medium">
              Pesanan kamu telah berhasil diterima. Tautan pengisian konten sudah dikirim ke WhatsApp & Email kamu.
            </p>
          </div>
          
          <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-charcoal-900/[0.02] border border-slate-100 mb-10 text-left">
            <h3 className="font-black text-charcoal-900 mb-8 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Langkah Selanjutnya
            </h3>
            <div className="space-y-6">
              <div className="flex gap-5 group">
                <span className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 text-xs font-black flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-500">1</span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-charcoal-900 mb-1">Cek WhatsApp / Email</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">Buka pesan masuk untuk melihat tautan dashboard kamu.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <span className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 text-xs font-black flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-500">2</span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-charcoal-900 mb-1">Lengkapi Data Pernikahan</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">Isi detail acara dan unggah momen-momen terbaik kamu.</p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <span className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 text-xs font-black flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition-all duration-500">3</span>
                <div>
                  <h4 className="text-sm md:text-base font-bold text-charcoal-900 mb-1">Undangan Ready Untuk Disebar</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">Selesaikan konten dan bagikan kebahagiaan kamu sekarang!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link
              href="/dashboard"
              className="w-full md:w-auto px-12 py-5 bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-600 transition-all duration-500 shadow-xl shadow-rose-900/10 flex items-center justify-center gap-3"
            >
              Mulai Isi Data
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

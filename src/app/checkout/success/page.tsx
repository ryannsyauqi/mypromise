import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SuccessPage(props: PageProps<"/checkout/success">) {
  // We can use searchParams to get order_id if needed
  
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar variant="light-bg" />
      
      <main className="pt-40 pb-24 flex items-center justify-center">
        <div className="container-tight px-6 text-center">
          <div className="w-24 h-24 bg-sage-100 text-sage-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal-800 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Pembayaran Berhasil!
          </h1>
          
          <p className="text-charcoal-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Selamat! Pesanan Anda telah kami terima. Link untuk mengisi konten undangan telah kami kirimkan ke nomor WhatsApp dan Email Anda.
          </p>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200 mb-10 max-w-md mx-auto">
            <h3 className="font-bold text-charcoal-800 mb-4 uppercase tracking-widest text-xs">Langkah Selanjutnya</h3>
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <p className="text-sm text-charcoal-600">Cek pesan masuk di WhatsApp/Email.</p>
              </div>
              <div className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <p className="text-sm text-charcoal-600">Klik link dashboard untuk mengisi data pernikahan.</p>
              </div>
              <div className="flex gap-4">
                <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <p className="text-sm text-charcoal-600">Unggah foto-foto terbaik Anda.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-charcoal-800 text-white font-bold rounded-xl hover:bg-charcoal-700 transition-all duration-300"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-900/10"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

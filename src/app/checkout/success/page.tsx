import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createAdminClient } from "@/utils/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: any;
}) {
  // Handle searchParams being either a Promise (Next.js 15+) or a plain object
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const orderIdParam = resolvedSearchParams?.order_id;
  const orderNumber = Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
  
  let dashboardUrl = "/dashboard";

  if (orderNumber) {
    try {
      const supabase = createAdminClient();
      // Using ilike for more robust matching
      const { data: order, error } = await supabase
        .from('orders')
        .select('id')
        .ilike('order_number', orderNumber)
        .single();
      
      if (error) {
        console.error("SuccessPage resolution error for", orderNumber, ":", error);
      }
      
      if (order?.id) {
        dashboardUrl = `/dashboard/${order.id}`;
      } else {
        console.warn("SuccessPage: Order not found for number:", orderNumber);
      }
    } catch (err) {
      console.error("SuccessPage fatal error:", err);
    }
  } else {
    console.warn("SuccessPage: No order_id found in searchParams");
  }
  
  console.log("SuccessPage Debug - Final dashboardUrl:", dashboardUrl);
  
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
          
          <div className="mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-rose-500 mb-2 block">Order Confirmed</span>
            <h1 className="text-3xl md:text-5xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Terima Kasih!
            </h1>
            <p className="text-slate-500 text-sm md:text-base mt-4 leading-relaxed max-w-md mx-auto font-medium">
              Pembayaran berhasil! Silakan lengkapi data undangan kamu.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-left max-w-lg mx-auto flex gap-4 animate-fade-in shadow-sm">
             <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
             </div>
             <div>
                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Cek Email Kamu</h4>
                <p className="text-[11px] md:text-xs text-amber-800 leading-relaxed font-medium">
                  Tautan akses dashboard ini bersifat rahasia dan sudah kami kirimkan juga ke email kamu. <strong>Jangan sampai hilang ya!</strong> Buka email tersebut jika kamu ingin kembali mengedit undangan di lain waktu.
                </p>
             </div>
          </div>
          
          <div className="flex justify-center mb-10">
            <Link
              href={dashboardUrl}
              className="w-full md:w-auto px-12 py-5 bg-rose-500 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-600 transition-all duration-500 shadow-xl shadow-rose-900/10 flex items-center justify-center gap-3 animate-pulse-soft"
            >
              Mulai Isi Data Undangan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="max-w-3xl mx-auto border-t border-slate-100 pt-10 text-center">
            <h3 className="font-black text-charcoal-300 mb-8 uppercase tracking-[0.2em] text-[10px]">
              Langkah Selanjutnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center">1</span>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900 mb-1">Isi Data Undangan</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">Lengkapi profil mempelai, detail acara, dan galeri.</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center">2</span>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900 mb-1">Daftar Tamu</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">Buat link personal untuk setiap tamu undangan.</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center">3</span>
                <div>
                  <h4 className="text-sm font-bold text-charcoal-900 mb-1">Kirim Undangan</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">Selesai! Bagikan link tersebut ke teman & keluarga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

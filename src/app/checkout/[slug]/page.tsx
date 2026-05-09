import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "./CheckoutForm";
import { Template } from "@/lib/types";

export async function generateMetadata(
  props: PageProps<"/checkout/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `Checkout | MyPromise`,
    description: "Selesaikan pemesanan undangan digital MyPromise Anda.",
  };
}

export default async function CheckoutPage(props: PageProps<"/checkout/[slug]">) {
  const { slug } = await props.params;

  const supabase = await createClient();
  const { data: template } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar variant="light-bg" />

      <main className="pt-32 pb-24">
        <div className="container-default px-6">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-3 block">Checkout Digital Invitation </span>
              <h1 className="text-4xl md:text-5xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Konfirmasi Pemesanan
              </h1>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Summary Section - First on Mobile */}
              <div className="w-full lg:col-span-5 lg:order-2 lg:sticky lg:top-32">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-xl shadow-charcoal-900/[0.02]">
                  <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Ringkasan Order</h2>

                  <div className="flex gap-4 md:gap-5 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-slate-50">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                      <img
                        src={template.thumbnail_url || "/images/placeholder.png"}
                        alt={template.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rose-500 mb-1">{template.category}</span>
                      <h3 className="text-lg md:text-xl font-bold leading-tight text-charcoal-900">{template.name}</h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 md:mb-10">
                    <div className="flex justify-between items-center text-[11px] md:text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Harga Paket</span>
                      <span className={`font-bold text-charcoal-700 ${template.original_price && template.original_price > template.price ? 'line-through text-slate-300' : ''}`}>
                        Rp {((template.original_price && template.original_price > template.price) ? template.original_price : template.price).toLocaleString("id-ID")}
                      </span>
                    </div>

                    {template.original_price && template.original_price > template.price && (
                      <div className="flex justify-between items-center text-[11px] md:text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Diskon Eksklusif</span>
                        <span className="text-rose-500 font-black">
                          - Rp {(template.original_price - template.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[11px] md:text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Biaya Layanan</span>
                      <span className="text-emerald-500 font-black uppercase tracking-widest text-[10px]">Gratis</span>
                    </div>

                    <div className="pt-6 mt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Bayar</span>
                      <span className="text-2xl md:text-3xl font-black text-rose-500" style={{ fontFamily: "var(--font-playfair)" }}>
                        Rp {template.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-100 flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                      Tautan pengisian konten akan dikirim otomatis setelah pembayaran terverifikasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="w-full lg:col-span-7 lg:order-1">
                <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-12 shadow-xl shadow-charcoal-900/[0.02] border border-slate-100">
                  <div className="flex items-center gap-4 mb-8 md:mb-10">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Data Pembeli</h2>
                      <p className="text-[10px] md:text-xs text-slate-400 font-medium">Lengkapi data untuk pengiriman tautan undangan.</p>
                    </div>
                  </div>

                  <CheckoutForm template={template as Template} />
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-4 px-4 pb-8 lg:pb-0">
                  {[
                    { label: "Secure Payment", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
                    { label: "Fast Process", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                    { label: "Premium Quality", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
                  ].map((badge, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={badge.icon} />
                        </svg>
                      </div>
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-wider text-slate-400">{badge.label}</span>
                    </div>
                  ))}
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

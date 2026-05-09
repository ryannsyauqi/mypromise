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
    <div className="min-h-screen bg-cream-50">
      <Navbar variant="light-bg" />
      
      <main className="pt-32 pb-20">
        <div className="container-default px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
              Konfirmasi Pemesanan
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Form Section */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200">
                  <h2 className="text-xl font-bold text-charcoal-800 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                    Data Pembeli
                  </h2>
                  <CheckoutForm template={template as Template} />
                </div>
              </div>
              
              {/* Summary Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-cream-200 sticky top-32">
                  <h2 className="text-xl font-bold text-charcoal-800 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                    Ringkasan Order
                  </h2>
                  
                  <div className="flex gap-4 mb-6 pb-6 border-b border-cream-100">
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border border-cream-200">
                      <img 
                        src={template.thumbnail_url || "/images/placeholder.png"} 
                        alt={template.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-charcoal-800">{template.name}</h3>
                      <p className="text-xs text-charcoal-400 mt-1 uppercase tracking-wider">{template.category}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-400">Harga Paket</span>
                      <span className={`text-charcoal-800 font-medium ${template.original_price && template.original_price > template.price ? 'line-through text-slate-300' : ''}`}>
                        Rp {((template.original_price && template.original_price > template.price) ? template.original_price : template.price).toLocaleString("id-ID")}
                      </span>
                    </div>
                    {template.original_price && template.original_price > template.price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-400">Potongan Harga</span>
                        <span className="text-rose-500 font-bold italic">
                          - Rp {(template.original_price - template.price).toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-400">Biaya Layanan</span>
                      <span className="text-sage-500 font-medium">Gratis</span>
                    </div>
                    <div className="pt-3 border-t border-cream-100 flex justify-between items-baseline">
                      <span className="text-charcoal-800 font-bold">Total</span>
                      <span className="text-2xl font-bold text-rose-500" style={{ fontFamily: "var(--font-playfair)" }}>
                        Rp {template.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 flex gap-3">
                    <div className="shrink-0 text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                      </svg>
                    </div>
                    <p className="text-[11px] font-bold text-rose-800 leading-relaxed uppercase tracking-wider">
                      Setelah pembayaran berhasil, Anda akan diarahkan ke dashboard untuk mengisi konten undangan dan mengunggah foto.
                    </p>
                  </div>
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

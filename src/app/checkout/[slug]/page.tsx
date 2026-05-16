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

      <main className="pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="container-default px-6">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 lg:mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-3 block">Checkout Digital Invitation </span>
              <h1 className="text-3xl lg:text-5xl font-bold text-charcoal-900 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
                Konfirmasi Pemesanan
              </h1>
            </div>

            <CheckoutForm template={template as Template} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

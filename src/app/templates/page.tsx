"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplateCard from "@/components/TemplateCard";
import { createClient } from "@/utils/supabase/client";
import { Template } from "@/lib/types";

const categories = [
  "Semua",
  "Elegant Series",
  "Nusantara Series",
  "Floral Series",
  "Minimalist",
  "Romantic"
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [waNumber, setWaNumber] = useState("6281234567890");

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) setTemplates(data as Template[]);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.whatsappNumber) {
          let cleaned = data.whatsappNumber.replace(/\D/g, "");
          if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
          setWaNumber(cleaned);
        }
      })
      .catch(err => console.error("Error loading settings:", err));
  }, []);

  const filtered =
    activeCategory === "Semua"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <section className="bg-charcoal-900 text-white pt-36 pb-24 text-center">
        <div className="container-tight px-6 space-y-4">
          <h1
            className="text-4xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Koleksi Desain <span className="text-rose-500 italic">Eksklusif</span>
          </h1>
          <p className="text-white/60 max-w-lg mx-auto text-sm md:text-base">
            Temukan template undangan pernikahan yang sesuai dengan tema dan kepribadian perayaan Anda.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="py-16 bg-cream-50/30 min-h-[50vh]">
        <div className="container-default px-6">
          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mb-12 overflow-x-auto py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                    : "bg-white text-charcoal-600 hover:bg-white/80 border border-cream-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-slate-100 animate-pulse rounded-3xl" />
              ))
            ) : (
              filtered.map((t, i) => (
                <TemplateCard key={t.id} template={t} index={i} />
              ))
            )}
          </div>

          {!loading && filtered.length === 0 && (
            <p className="text-center text-charcoal-400 py-20">
              Belum ada template untuk kategori ini.
            </p>
          )}
        </div>
      </section>

      {/* WA CTA */}
      <section className="py-16 bg-white">
        <div className="container-tight px-6 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-charcoal-800 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Butuh Bantuan Memilih?
          </h2>
          <p className="text-charcoal-400 mb-8 max-w-md mx-auto">
            Konsultasikan desain undangan impian Anda langsung dengan tim kami
            via WhatsApp.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Halo,%20saya%20butuh%20bantuan%20memilih%20template%20undangan`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-full hover:bg-green-400 transition-all duration-300 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat via WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}

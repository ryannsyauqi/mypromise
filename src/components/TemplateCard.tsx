"use client";

import Image from "next/image";
import Link from "next/link";
import { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  index: number;
  variant?: "light" | "dark";
}

export default function TemplateCard({ template, index, variant = "light" }: TemplateCardProps) {
  const isDark = variant === "dark";

  return (
    <div 
      className="group relative flex flex-col overflow-hidden transition-all duration-700 animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Image Container - Square 1:1 */}
      <div className={`relative aspect-square overflow-hidden rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
        <Image
          src={template.thumbnail_url || "/images/placeholder.png"}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Simple Link Overlay */}
        <Link 
          href={`/demo/${template.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${template.name}`}
        />
      </div>

      {/* Content Area */}
      <div className="py-2 md:py-4 flex flex-col flex-grow">
        <div className="space-y-0.5 mb-2 md:mb-4">
          <h3 
            className={`text-sm md:text-xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-charcoal-800'}`}
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {template.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <span className={`font-black text-[11px] md:text-sm ${isDark ? 'text-rose-400' : 'text-rose-500'}`}>
              Rp. {template.price.toLocaleString('id-ID')}
            </span>
            {template.original_price && template.original_price > template.price && (
              <>
                <span className={`text-[9px] md:text-xs line-through ${isDark ? 'text-white/30 decoration-rose-400/30' : 'text-charcoal-300 decoration-rose-300/50'}`}>
                  Rp. {template.original_price.toLocaleString('id-ID')}
                </span>
                <span className={`text-[8px] md:text-[9px] font-black px-1 md:px-1.5 py-0.5 rounded-md ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-500'}`}>
                  -{Math.round(((template.original_price - template.price) / template.original_price) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-auto grid grid-cols-1 gap-1.5 md:gap-2 relative z-20">
          <Link
            href={`/checkout/${template.slug}`}
            className={`w-full py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl text-center transition-all duration-500 ${
              isDark 
                ? 'bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20' 
                : 'bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-900/10'
            }`}
          >
            Pilih Desain
          </Link>
          <Link
            href={`/demo/${template.slug}`}
            className={`w-full py-2 md:py-2.5 border md:border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl text-center transition-all duration-300 ${
              isDark
                ? 'border-white/20 text-white/70 hover:bg-white/5 hover:text-white'
                : 'border-rose-500 text-rose-500 hover:bg-rose-50'
            }`}
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}

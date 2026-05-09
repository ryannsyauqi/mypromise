"use client";

import Image from "next/image";
import Link from "next/link";
import { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  index: number;
}

export default function TemplateCard({ template, index }: TemplateCardProps) {
  return (
    <div 
      className="group relative flex flex-col overflow-hidden transition-all duration-700 animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Image Container - Square 1:1 */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
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

      {/* Content Area - Flush below image */}
      <div className="py-4 flex flex-col flex-grow">
        <div className="space-y-1 mb-4">
          <h3 className="text-base md:text-xl font-bold text-charcoal-800 tracking-tight leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            {template.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-rose-500 font-black text-xs md:text-sm">
              Rp. {template.price.toLocaleString('id-ID')}
            </span>
            {template.original_price && template.original_price > template.price && (
              <>
                <span className="text-charcoal-300 text-[10px] md:text-xs line-through decoration-rose-300/50">
                  Rp. {template.original_price.toLocaleString('id-ID')}
                </span>
                <span className="bg-rose-100 text-rose-500 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  -{Math.round(((template.original_price - template.price) / template.original_price) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Buttons - Restored & Compact */}
        <div className="mt-auto grid grid-cols-1 gap-2 relative z-20">
          <Link
            href={`/checkout/${template.slug}`}
            className="w-full py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-rose-600 transition-all duration-500 shadow-md shadow-rose-900/10"
          >
            Pilih Desain
          </Link>
          <Link
            href={`/demo/${template.slug}`}
            className="w-full py-2.5 border-2 border-rose-500 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-rose-50 transition-all duration-300"
          >
            Preview
          </Link>
        </div>
      </div>
    </div>
  );
}

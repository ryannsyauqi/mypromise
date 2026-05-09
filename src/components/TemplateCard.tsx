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
      className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-cream-100 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(255,232,214,0.4)] hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Image Container - Square Ratio 1:1 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={template.thumbnail_url || "/images/placeholder.png"}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        


        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow relative">
        <div className="mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-charcoal-800 tracking-tight leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              {template.name}
            </h3>
            <span className="text-rose-500 font-black text-xs">
              Rp. {template.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Buttons - Clear & Branded */}
        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-cream-50">
          <Link
            href={`/demo/${template.slug}`}
            className="px-3 py-2.5 border-2 border-rose-500 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-rose-50 transition-all duration-300"
          >
            Preview
          </Link>
          <Link
            href={`/checkout/${template.slug}`}
            className="px-3 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-rose-600 transition-all duration-500 shadow-md shadow-rose-900/10"
          >
            Pilih Desain
          </Link>
        </div>
      </div>
    </div>
  );
}

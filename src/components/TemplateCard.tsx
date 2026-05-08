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
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-100 transition-all duration-500 hover:shadow-xl animate-fade-in"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Image Container - Square Ratio 1:1 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={template.thumbnail_url || "/images/placeholder.png"}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-charcoal-800 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
            {template.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="text-lg font-bold text-charcoal-800 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              {template.name}
            </h3>
            <span className="text-rose-500 font-bold text-sm whitespace-nowrap">
              Rp {(template.price / 1000).toFixed(0)}k
            </span>
          </div>
          <p className="text-charcoal-400 text-[13px] line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Buttons - Always Visible at the Bottom */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-cream-50">
          <Link
            href={`/demo/${template.slug}`}
            className="px-3 py-2.5 border border-cream-200 text-charcoal-700 text-xs font-bold rounded-lg text-center hover:bg-cream-50 transition-colors"
          >
            Preview
          </Link>
          <Link
            href={`/checkout/${template.slug}`}
            className="px-3 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-lg text-center hover:bg-rose-600 transition-all duration-300 shadow-sm"
          >
            Pilih Desain
          </Link>
        </div>
      </div>
    </div>
  );
}

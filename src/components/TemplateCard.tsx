import Image from "next/image";
import Link from "next/link";
import { Template } from "@/lib/types";
import { formatRupiah } from "@/lib/mock-data";

interface TemplateCardProps {
  template: Template;
  index?: number;
}

export default function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={template.thumbnail_url}
          alt={template.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
          <Link
            href={template.demo_url}
            className="w-full py-3 bg-white/95 text-charcoal-800 text-sm font-semibold rounded-xl text-center backdrop-blur-sm hover:bg-white transition-all duration-300"
          >
            Lihat Demo
          </Link>
        </div>
        {/* Category badge */}
        <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-charcoal-600 rounded-full">
          {template.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-lg font-semibold text-charcoal-800 mb-1"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {template.name}
        </h3>
        <p className="text-sm text-charcoal-400 mb-4 line-clamp-2">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-rose-500 font-bold text-lg">
            {formatRupiah(template.price)}
          </span>
          <Link
            href={`/templates?select=${template.id}`}
            className="px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/25"
          >
            Pilih
          </Link>
        </div>
      </div>
    </div>
  );
}

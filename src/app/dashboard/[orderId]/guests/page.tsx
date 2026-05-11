"use client";

import GuestList from "./GuestList";

export default function GuestsPage() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
            Daftar Tamu Undangan
          </h1>
          <p className="text-charcoal-400 mt-2">Kelola daftar tamu dan buat link undangan personal untuk setiap tamu.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-cream-200 shadow-sm overflow-hidden">
        <GuestList />
      </div>
    </div>
  );
}

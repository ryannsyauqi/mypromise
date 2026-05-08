"use client";

import { useState } from "react";

interface RSVPFormProps {
  guestName?: string;
  isDemo?: boolean;
}

export default function RSVPForm({ guestName, isDemo }: RSVPFormProps) {
  const [name, setName] = useState(guestName || "");
  const [attendance, setAttendance] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setSubmitted(true);
      return;
    }
    // TODO: submit to API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 animate-scale-in">
        <span className="text-5xl mb-4 block">💌</span>
        <h3 className="text-xl font-semibold text-charcoal-800 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Terima Kasih!
        </h3>
        <p className="text-charcoal-400 text-sm">
          Konfirmasi dan ucapan Anda sudah kami terima. Sampai jumpa di hari bahagia kami! 🤍
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Nama Tamu</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nama lengkap Anda"
          className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all"
        />
      </div>

      {/* Attendance */}
      <div>
        <label className="block text-sm font-medium text-charcoal-600 mb-2">Konfirmasi Kehadiran</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "hadir", label: "Hadir", emoji: "✅" },
            { value: "tidak_hadir", label: "Tidak Hadir", emoji: "😔" },
            { value: "belum_pasti", label: "Belum Pasti", emoji: "🤔" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAttendance(opt.value)}
              className={`py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-300 ${
                attendance === opt.value
                  ? "border-rose-400 bg-rose-50 text-rose-600 shadow-sm"
                  : "border-cream-300 bg-white text-charcoal-500 hover:border-rose-200"
              }`}
            >
              <span className="text-lg block mb-1">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guest count */}
      {attendance === "hadir" && (
        <div className="animate-fade-in">
          <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Jumlah Tamu</label>
          <input
            type="number"
            min={1}
            max={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all"
          />
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-charcoal-600 mb-1.5">Ucapan & Doa</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
          className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!name || !attendance}
        className="w-full py-3.5 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-rose-500/25"
      >
        Kirim Konfirmasi
      </button>
    </form>
  );
}

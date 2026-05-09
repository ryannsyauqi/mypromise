"use client";

import { useState } from "react";

interface RSVPFormProps {
  guestName?: string;
  isDemo?: boolean;
}

const Icons = {
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-rose-400 mx-auto mb-4">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-1">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-1">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" transform="rotate(45 12 12)"/>
    </svg>
  ),
  Question: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-1">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline text-rose-400 mx-1">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
};

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
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 animate-scale-in">
        <Icons.Mail />
        <h3 className="text-xl font-semibold text-charcoal-800 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Terima Kasih!
        </h3>
        <p className="text-charcoal-400 text-sm flex items-center justify-center">
          Konfirmasi dan ucapan Anda sudah kami terima. Sampai jumpa di hari bahagia kami! <Icons.Heart />
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
            { value: "hadir", label: "Hadir", icon: <Icons.Check /> },
            { value: "tidak_hadir", label: "Tidak Hadir", icon: <Icons.Close /> },
            { value: "belum_pasti", label: "Belum Pasti", icon: <Icons.Question /> },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAttendance(opt.value)}
              className={`py-4 px-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                attendance === opt.value
                  ? "border-rose-400 bg-rose-50 text-rose-600 shadow-sm"
                  : "border-cream-300 bg-white text-charcoal-500 hover:border-rose-200"
              }`}
            >
              <div className={attendance === opt.value ? "text-rose-500" : "text-charcoal-300"}>
                {opt.icon}
              </div>
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
        className="w-full py-4 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-rose-500/25 uppercase tracking-widest text-xs"
      >
        Kirim Konfirmasi
      </button>
    </form>
  );
}


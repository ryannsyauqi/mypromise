"use client";

import { useState } from "react";

interface Guest {
  id: string;
  name: string;
  status: "pending" | "hadir" | "tidak_hadir" | "belum_pasti";
  guest_count: number;
}

export default function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: "1", name: "Pak Rudi", status: "hadir", guest_count: 2 },
    { id: "2", name: "Bu Sari", status: "hadir", guest_count: 3 },
    { id: "3", name: "Tante Lina", status: "belum_pasti", guest_count: 0 },
    { id: "4", name: "Mas Adi", status: "pending", guest_count: 0 },
  ]);
  const [newGuestName, setNewGuestName] = useState("");

  const addGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newGuestName,
      status: "pending",
      guest_count: 0,
    };

    setGuests([newGuest, ...guests]);
    setNewGuestName("");
  };

  const copyInvitationLink = (guestName: string) => {
    const baseUrl = window.location.origin;
    // For demo, we use the minimalist slug
    const invitationUrl = `${baseUrl}/demo/minimalist-elegance?to=${encodeURIComponent(guestName)}`;
    
    navigator.clipboard.writeText(invitationUrl);
    alert(`Link untuk ${guestName} berhasil disalin!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir": return <span className="px-3 py-1 bg-sage-100 text-sage-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Hadir</span>;
      case "tidak_hadir": return <span className="px-3 py-1 bg-blush-100 text-blush-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Tidak Hadir</span>;
      case "belum_pasti": return <span className="px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Belum Pasti</span>;
      default: return <span className="px-3 py-1 bg-charcoal-50 text-charcoal-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Belum Dibuka</span>;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Add Guest Header */}
      <div className="p-8 border-b border-cream-100 bg-cream-50/30">
        <form onSubmit={addGuest} className="flex gap-4">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Tulis nama tamu... (Contoh: Bpk. Rudi & Keluarga)"
            className="flex-grow dashboard-input"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-charcoal-800 text-white font-bold rounded-2xl hover:bg-charcoal-700 transition-all text-sm whitespace-nowrap"
          >
            Tambah Tamu
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-cream-100">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Nama Tamu</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Status RSVP</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400">Jumlah Tamu</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-charcoal-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-50">
            {guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-cream-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-bold text-charcoal-800">{guest.name}</p>
                </td>
                <td className="px-8 py-5">
                  {getStatusBadge(guest.status)}
                </td>
                <td className="px-8 py-5">
                  <span className="text-charcoal-500 font-medium">{guest.guest_count || "-"}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => copyInvitationLink(guest.name)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-cream-200 text-charcoal-600 text-xs font-bold rounded-xl hover:bg-white hover:border-rose-400 hover:text-rose-500 transition-all"
                  >
                    <span>🔗</span> Salin Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-8 bg-cream-50/50 flex flex-wrap gap-8 border-t border-cream-100">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-300 mb-1">Total Tamu</p>
          <p className="text-xl font-bold text-charcoal-800">{guests.length}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-300 mb-1">Sudah Konfirmasi</p>
          <p className="text-xl font-bold text-sage-500">{guests.filter(g => g.status === 'hadir').length}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal-300 mb-1">Total Pack</p>
          <p className="text-xl font-bold text-charcoal-800">{guests.reduce((acc, g) => acc + g.guest_count, 0)}</p>
        </div>
      </div>
    </div>
  );
}

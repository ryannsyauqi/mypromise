"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function GuestList() {
  const params = useParams();
  const orderId = params.orderId as string;
  const supabase = createClient();
  const [guests, setGuests] = useState<any[]>([]);
  const [invitation, setInvitation] = useState<any>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!orderId) return;

      // We still need the invitation for the slug/base URL
      // Since this is a client component, we use the regular client.
      // We might need to fetch this from a server component too if RLS blocks it.
      const { data: invData } = await supabase
        .from('invitations')
        .select('*')
        .eq('order_id', orderId)
        .single();
      
      if (invData) {
        setInvitation(invData);
        // Get guests via API
        const response = await fetch(`/api/guests?order_id=${orderId}`);
        const guestData = await response.json();
        if (Array.isArray(guestData)) setGuests(guestData);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase, orderId]);

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !invitation) return;

    const urlParam = newGuestName.toLowerCase().replace(/\s+/g, '-');
    
    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          name: newGuestName,
          url_param: urlParam,
          full_url: `${window.location.origin}/${invitation.slug}?to=${urlParam}`
        }),
      });

      const newGuest = await response.json();
      if (response.ok) {
        setGuests([newGuest, ...guests]);
        setNewGuestName("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const copyInvitationLink = (guest: any) => {
    if (!invitation) return;
    const personalUrl = `${window.location.origin}/${invitation.slug}?to=${guest.url_param}`;
    
    navigator.clipboard.writeText(personalUrl);
    alert(`Link untuk ${guest.name} berhasil disalin!`);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border transition-all duration-500";
    switch (status) {
      case "hadir": return <span className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-100/50`}>Hadir</span>;
      case "tidak_hadir": return <span className={`${baseClasses} bg-rose-50 text-rose-600 border-rose-100/50`}>Tidak Hadir</span>;
      case "belum_pasti": return <span className={`${baseClasses} bg-amber-50 text-amber-600 border-amber-100/50`}>Belum Pasti</span>;
      default: return <span className={`${baseClasses} bg-slate-50 text-slate-400 border-slate-100`}>Belum Dibuka</span>;
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
    </div>
  );

  return (
    <div className="flex flex-col bg-white">
      {/* Add Guest Header */}
      <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/30">
        <form onSubmit={addGuest} className="flex flex-col sm:flex-row gap-4 max-w-3xl">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Tulis nama tamu... (Contoh: Bpk. Rudi & Keluarga)"
            className="flex-grow w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-white font-bold text-charcoal-800 placeholder:text-slate-300 placeholder:font-medium text-sm"
          />
          <button
            type="submit"
            className="px-10 py-4 bg-charcoal-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-charcoal-900/10 whitespace-nowrap"
          >
            Tambah Tamu
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nama Tamu</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status RSVP</th>
              <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-10 py-20 text-center">
                  <p className="text-slate-400 font-medium text-sm">Belum ada tamu yang ditambahkan.</p>
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="font-bold text-charcoal-900 text-sm">{guest.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{guest.url_param}</p>
                  </td>
                  <td className="px-10 py-6">
                    {getStatusBadge(guest.status || 'pending')}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => copyInvitationLink(guest)}
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-100 text-charcoal-900 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-500 shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Salin Link
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="p-10 bg-slate-50/50 flex flex-wrap gap-12 border-t border-slate-100">
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Total Tamu</p>
          <p className="text-2xl font-black text-charcoal-900">{guests.length}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Sudah Konfirmasi</p>
          <p className="text-2xl font-black text-emerald-500">{guests.filter(g => g.status === 'hadir').length}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Belum Mengisi</p>
          <p className="text-2xl font-black text-slate-400">{guests.filter(g => !g.status || g.status === 'pending').length}</p>
        </div>
      </div>
    </div>
  );
}

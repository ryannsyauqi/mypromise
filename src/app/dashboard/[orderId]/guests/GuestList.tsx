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

    let urlParam = newGuestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let counter = 1;
    let finalSlug = urlParam;
    while (guests.some((g) => g.url_param === finalSlug)) {
      finalSlug = `${urlParam}-${counter}`;
      counter++;
    }
    urlParam = finalSlug;
    
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

  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const saveEdit = async (guestId: string) => {
    if (!editName.trim() || !editSlug.trim()) return;
    
    // Check for conflict
    const conflict = guests.find(g => g.id !== guestId && g.url_param === editSlug);
    if (conflict) {
      alert("Slug ini sudah dipakai oleh tamu lain!");
      return;
    }
    
    setIsSavingEdit(true);
    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          url_param: editSlug,
          full_url: `${window.location.origin}/${invitation?.slug}?to=${editSlug}`
        }),
      });

      if (response.ok) {
        setGuests(guests.map(g => g.id === guestId ? { 
          ...g, 
          name: editName, 
          url_param: editSlug, 
          full_url: `${window.location.origin}/${invitation?.slug}?to=${editSlug}` 
        } : g));
        setEditingGuestId(null);
      }
    } catch (error) {
      console.error(error);
    }
    setIsSavingEdit(false);
  };

  const deleteGuest = async (guestId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tamu ini?")) return;
    
    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGuests(guests.filter(g => g.id !== guestId));
      } else {
        alert("Gagal menghapus tamu");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyInvitationLink = (guest: any) => {
    if (!invitation) return;
    const personalUrl = `${window.location.origin}/${invitation.slug}?to=${guest.url_param}`;
    
    navigator.clipboard.writeText(personalUrl);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRsvpBadge = (status: string) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border transition-all duration-500 inline-block";
    if (status === "hadir") return <span className={`${baseClasses} bg-emerald-50 text-emerald-600 border-emerald-100/50`}>Hadir</span>;
    if (status === "tidak_hadir") return <span className={`${baseClasses} bg-rose-50 text-rose-600 border-rose-100/50`}>Tidak Hadir</span>;
    return <span className={`${baseClasses} bg-slate-50 text-slate-400 border-slate-200/50`}>Belum Konfirmasi</span>;
  };

  const getOpenedBadge = (isOpened: boolean) => {
    const baseClasses = "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border transition-all duration-500 inline-block";
    if (isOpened) return <span className={`${baseClasses} bg-blue-50 text-blue-600 border-blue-100/50`}>Sudah</span>;
    return <span className={`${baseClasses} bg-slate-50 text-slate-400 border-slate-200/50`}>Belum</span>;
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
    </div>
  );

  return (
    <div className="flex flex-col bg-white h-full">
      {/* Top Header - 1 Row for Stats & Add Guest */}
      <div className="flex flex-col xl:flex-row gap-8 p-8 md:px-10 border-b border-slate-100 bg-slate-50/30 items-start xl:items-center justify-between">
        
        {/* Statistics */}
        <div className="flex flex-wrap gap-8 w-full xl:w-auto">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Total Tamu</p>
            <p className="text-xl md:text-2xl font-black text-charcoal-900">{guests.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Hadir</p>
            <p className="text-xl md:text-2xl font-black text-emerald-500">{guests.filter(g => g.status === 'hadir').length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Tidak Hadir</p>
            <p className="text-xl md:text-2xl font-black text-rose-500">{guests.filter(g => g.status === 'tidak_hadir').length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Belum Konfirmasi</p>
            <p className="text-xl md:text-2xl font-black text-slate-400">{guests.filter(g => !g.status || g.status === 'belum_konfirmasi' || g.status === 'pending').length}</p>
          </div>
        </div>

        {/* Add Guest Form */}
        <form onSubmit={addGuest} className="flex gap-3 w-full xl:w-auto shrink-0 xl:min-w-[400px]">
          <input
            type="text"
            value={newGuestName}
            onChange={(e) => setNewGuestName(e.target.value)}
            placeholder="Tambah nama tamu..."
            className="flex-grow min-w-0 px-5 py-3 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-white font-bold text-charcoal-800 placeholder:text-slate-400 text-sm shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-charcoal-900 text-white font-black uppercase tracking-[0.1em] text-[10px] rounded-xl hover:bg-rose-500 transition-all duration-300 shadow-md shrink-0 whitespace-nowrap cursor-pointer"
          >
            Tambah
          </button>
        </form>
      </div>

      {/* Table - Scrollable */}
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left relative min-w-[800px]">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 min-w-[200px]">Nama Tamu</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Slug URL</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Status Buka</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Status RSVP</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 min-w-[200px]">Ucapan</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right border-b border-slate-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <p className="text-slate-400 font-medium text-sm">Belum ada tamu yang ditambahkan.</p>
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors group">
                  {editingGuestId === guest.id ? (
                    <>
                      <td className="px-8 py-4">
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-2 border border-slate-200/80 rounded-lg text-sm font-bold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-inner" />
                      </td>
                      <td className="px-8 py-4">
                        <input type="text" value={editSlug} onChange={e => setEditSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="w-full px-4 py-2 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-inner" />
                      </td>
                      <td className="px-8 py-4">{getOpenedBadge(guest.is_opened)}</td>
                      <td className="px-8 py-4">{getRsvpBadge(guest.status)}</td>
                      <td className="px-8 py-4 text-xs text-slate-500 italic max-w-xs truncate">{guest.message || "-"}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                           <button onClick={() => setEditingGuestId(null)} className="px-3 py-2 text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Batal</button>
                           <button onClick={() => saveEdit(guest.id)} disabled={isSavingEdit} className="px-4 py-2 bg-charcoal-900 text-white rounded-lg text-[10px] uppercase font-black tracking-widest hover:bg-rose-500 transition-colors shadow-md disabled:opacity-50 cursor-pointer">{isSavingEdit ? "..." : "Simpan"}</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-8 py-4">
                        <p className="font-bold text-charcoal-900 text-sm whitespace-nowrap">{guest.name}</p>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {guest.url_param}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        {getOpenedBadge(guest.is_opened)}
                      </td>
                      <td className="px-8 py-4">
                        {getRsvpBadge(guest.status)}
                      </td>
                      <td className="px-8 py-4 text-xs text-slate-500 italic max-w-[200px] break-words whitespace-normal">
                        {guest.message || "-"}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingGuestId(guest.id);
                              setEditName(guest.name);
                              setEditSlug(guest.url_param);
                            }}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-charcoal-800 hover:bg-slate-100 transition-colors rounded-lg cursor-pointer"
                            title="Edit Data"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => deleteGuest(guest.id)}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                            title="Hapus Tamu"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => copyInvitationLink(guest)}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border text-[9px] font-black uppercase tracking-wide rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer ${
                              copiedId === guest.id
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white border-slate-200/80 text-charcoal-900 hover:bg-rose-500 hover:text-white hover:border-rose-500"
                            }`}
                          >
                            {copiedId === guest.id ? (
                              <>
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                                Tersalin
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Salin Link
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

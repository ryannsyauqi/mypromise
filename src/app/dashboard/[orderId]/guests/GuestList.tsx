"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import * as XLSX from "xlsx";
import { createPortal } from "react-dom";

export default function GuestList() {
  const params = useParams();
  const orderId = params.orderId as string;
  const supabase = createClient();
  const [guests, setGuests] = useState<any[]>([]);
  const [invitation, setInvitation] = useState<any>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [loading, setLoading] = useState(true);

  // Import Excel/CSV States
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<"paste" | "upload">("paste");
  const [pasteData, setPasteData] = useState("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const filteredGuests = guests.filter(guest => {
    const name = (guest.name || "").toLowerCase();
    const slug = (guest.url_param || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return name.includes(query) || slug.includes(query);
  });

  const [sortField, setSortField] = useState<"name" | "url_param" | "is_opened" | "status" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: "name" | "url_param" | "is_opened" | "status") => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'boolean') {
      aVal = aVal ? 1 : 0;
      bVal = bVal ? 1 : 0;
    } else {
      aVal = (aVal || "").toString().toLowerCase().trim();
      bVal = (bVal || "").toString().toLowerCase().trim();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field: "name" | "url_param" | "is_opened" | "status") => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 text-slate-300 ml-1.5 inline-block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-3 h-3 text-rose-500 ml-1.5 inline-block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-rose-500 ml-1.5 inline-block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Auto parsing names when paste input changes
  useEffect(() => {
    if (importTab === "paste") {
      const names = pasteData
        .split("\n")
        .map(n => n.trim())
        .filter(n => n.length > 0);
      setImportPreview(names);
    }
  }, [pasteData, importTab]);

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

  // Helper to generate a unique slug during bulk imports
  const generateUniqueSlug = (name: string, existingSlugs: Set<string>) => {
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!slug) slug = 'tamu';

    let counter = 1;
    let finalSlug = slug;
    while (existingSlugs.has(finalSlug) || guests.some(g => g.url_param === finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    existingSlugs.add(finalSlug);
    return finalSlug;
  };

  // Parses CSV/Excel file (.xlsx, .xls, .csv) uploads on client-side
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);

    const reader = new FileReader();
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Header: 1 returns sheets as a 2D array of rows
          const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
          const names: string[] = [];

          for (const row of rows) {
            if (!Array.isArray(row) || row.length === 0) continue;
            const cellValue = String(row[0] || '').trim();
            if (cellValue) {
              names.push(cellValue);
            }
          }
          setImportPreview(names);
        } catch (err) {
          console.error("Error parsing Excel file:", err);
          showToast("Gagal membaca file Excel. Pastikan file tidak rusak.", "error");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Fallback for CSV
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/);
        const names: string[] = [];

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;

          // Clean cells separated by comma or semicolon
          const cells = line.split(/[;,]/).map(c => c.replace(/^["']|["']$/g, '').trim());
          if (cells[0]) {
            names.push(cells[0]);
          }
        }
        setImportPreview(names);
      };
      reader.readAsText(file);
    }
  };

  // Submits bulk imported guests to database
  const handleImportSave = async () => {
    if (importPreview.length === 0 || !invitation) return;
    setImporting(true);

    try {
      const existingSlugs = new Set<string>();
      const baseUrl = `${window.location.origin}/${invitation.slug}?to=`;

      const guestsToInsert = importPreview.map(name => {
        const slug = generateUniqueSlug(name, existingSlugs);
        return {
          order_id: orderId,
          name,
          url_param: slug,
          full_url: `${baseUrl}${slug}`
        };
      });

      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestsToInsert),
      });

      if (!response.ok) throw new Error("Gagal mengimpor daftar tamu");

      const importedGuests = await response.json();

      // Merge with existing list
      setGuests(prev => [...importedGuests, ...prev]);

      // Reset inputs & close
      setPasteData("");
      setImportFile(null);
      setImportPreview([]);
      setIsImportModalOpen(false);

      showToast(`Berhasil mengimpor ${importedGuests.length} tamu!`, "success");
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Terjadi kesalahan saat mengimpor", "error");
    } finally {
      setImporting(false);
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
      showToast("Slug ini sudah dipakai oleh tamu lain!", "error");
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

  const confirmDeleteGuest = async () => {
    if (!guestToDelete) return;

    try {
      const response = await fetch(`/api/guests/${guestToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGuests(guests.filter(g => g.id !== guestToDelete.id));
        showToast("Tamu berhasil dihapus", "success");
      } else {
        showToast("Gagal menghapus tamu", "error");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGuestToDelete(null);
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

        {/* Search Field & Bulk Add Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full xl:w-auto shrink-0 xl:min-w-[560px]">
          {/* Cari Tamu Input */}
          <div className="relative flex-grow min-w-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tamu..."
              className="w-full pl-11 pr-5 py-3 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all bg-white font-bold text-charcoal-800 placeholder:text-slate-400 text-sm shadow-sm"
            />
          </div>

          {/* Button 1: Tambah Tamu */}
          <button
            type="button"
            onClick={() => {
              setIsImportModalOpen(true);
              setImportTab("paste");
              setImportFile(null);
              setImportPreview([]);
            }}
            className="px-4 py-3 border border-slate-200/80 text-slate-700 bg-white hover:bg-slate-50 font-black uppercase tracking-[0.1em] text-[10px] rounded-xl transition-all duration-300 shadow-sm shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Tamu
          </button>

          {/* Button 2: Unggah Excel */}
          <button
            type="button"
            onClick={() => {
              setIsImportModalOpen(true);
              setImportTab("upload");
              setPasteData("");
              setImportPreview([]);
            }}
            className="px-4 py-3 border border-slate-200/80 text-slate-700 bg-white hover:bg-slate-50 font-black uppercase tracking-[0.1em] text-[10px] rounded-xl transition-all duration-300 shadow-sm shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Unggah Excel / CSV
          </button>
        </div>
      </div>

      {/* Table - Scrollable */}
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left relative min-w-[800px]">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <tr>
              <th 
                onClick={() => handleSort("name")}
                className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 min-w-[200px] cursor-pointer hover:text-slate-600 transition-colors select-none"
              >
                Nama Tamu {renderSortIcon("name")}
              </th>
              <th 
                onClick={() => handleSort("url_param")}
                className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors select-none"
              >
                Slug / Link {renderSortIcon("url_param")}
              </th>
              <th 
                onClick={() => handleSort("is_opened")}
                className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors select-none"
              >
                Status Buka {renderSortIcon("is_opened")}
              </th>
              <th 
                onClick={() => handleSort("status")}
                className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 cursor-pointer hover:text-slate-600 transition-colors select-none"
              >
                Status RSVP {renderSortIcon("status")}
              </th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 min-w-[200px]">Ucapan</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right border-b border-slate-100">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <p className="text-slate-400 font-medium text-sm">
                    {searchQuery ? "Tidak ditemukan tamu yang cocok dengan pencarian." : "Belum ada tamu yang ditambahkan."}
                  </p>
                </td>
              </tr>
            ) : (
              sortedGuests.map((guest) => (
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
                            onClick={() => setGuestToDelete(guest)}
                            className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-lg cursor-pointer"
                            title="Hapus Tamu"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <button
                            onClick={() => copyInvitationLink(guest)}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border text-[9px] font-black uppercase tracking-wide rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer ${copiedId === guest.id
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

      {/* ===== MODAL IMPORT TAMU (EXCEL / CSV) ===== */}
      {isImportModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
                  {importTab === "paste" ? "Tambah Tamu Undangan" : "Unggah Daftar Tamu"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {importTab === "paste"
                    ? "Salin nama-nama tamu dari daftar catatan / list kamu"
                    : "Pilih berkas Excel (.xlsx, .xls) atau CSV dari komputer Anda"
                  }
                </p>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setPasteData("");
                  setImportFile(null);
                  setImportPreview([]);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto flex-grow space-y-6">
              {importTab === "paste" ? (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Tempel Daftar Nama Tamu
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed bg-cream-50/50 border border-cream-100 p-3 rounded-2xl italic">
                    💡 Tips: Salin nama-nama tamu dari daftar catatan / list kamu, lalu tempel di bawah ini (satu nama per baris).
                  </p>
                  <textarea
                    rows={6}
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    placeholder="Contoh:&#10;Budi Santoso&#10;Siti Rahma&#10;Ahmad Firdaus"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-bold text-sm text-charcoal-800 placeholder:text-slate-400 shadow-inner bg-slate-50/50"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Unggah Berkas Excel atau CSV
                  </label>

                  <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center hover:border-rose-500/50 transition-colors relative bg-slate-50/30">
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-bold text-charcoal-800">
                      {importFile ? importFile.name : "Pilih berkas Excel (.xlsx, .xls) atau CSV Anda"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : "Seret & lepas berkas ke sini, atau klik untuk memilih"}
                    </p>
                  </div>

                  <div className="bg-cream-50/50 border border-cream-100 p-3.5 rounded-2xl text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-600">⚠️ Format File yang Didukung:</p>
                    <p>• File berekstensi .xlsx, .xls, atau .csv.</p>
                    <p>• Kolom pertama wajib diisi dengan Nama Tamu.</p>
                  </div>
                </div>
              )}

              {/* Preview Block */}
              {importPreview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Pratinjau Tamu ({importPreview.length})
                    </span>
                    <button
                      onClick={() => {
                        setPasteData("");
                        setImportFile(null);
                        setImportPreview([]);
                      }}
                      className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  </div>

                  <div className="max-h-[160px] overflow-y-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-2 custom-scrollbar shadow-inner">
                    {importPreview.map((name, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-bold text-charcoal-700 shadow-sm flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setPasteData("");
                  setImportFile(null);
                  setImportPreview([]);
                }}
                className="flex-1 py-3.5 px-4 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={importPreview.length === 0 || importing}
                onClick={handleImportSave}
                className="flex-1 py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-wider transition-colors shadow-md shadow-rose-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Mengimpor...
                  </>
                ) : (
                  `Simpan ${importPreview.length} Tamu`
                )}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ===== MODAL KONFIRMASI HAPUS TAMU ===== */}
      {guestToDelete && mounted && createPortal(
        <div className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 md:p-8 text-center shadow-2xl border border-slate-100 flex flex-col items-center space-y-4 animate-scale-up">

            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-base font-black text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>
                Hapus Tamu Undangan?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus <span className="font-bold text-charcoal-800">"{guestToDelete.name}"</span>? Aksi ini akan menghapusnya secara permanen dari daftar undangan.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full pt-2 shrink-0">
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteGuest}
                className="flex-1 py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider transition-colors shadow-md shadow-rose-500/20 cursor-pointer text-center"
              >
                Hapus
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ===== FLOATING TOAST NOTIFICATION ===== */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[10000] animate-scale-up">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-xs font-black uppercase tracking-wider ${
            toast.type === "success" 
              ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-500/25" 
              : "bg-rose-500 border-rose-600 text-white shadow-rose-500/25"
          }`}>
            {toast.type === "success" ? (
              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

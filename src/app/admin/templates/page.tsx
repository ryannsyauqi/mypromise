"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, original_price: 0, is_active: true, thumbnail_url: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search, Filter, & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, archived
  const [sortBy, setSortBy] = useState("newest"); // newest, price-high, price-low, name

  const supabase = createClient();

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch("/api/admin/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      if (data.templates) setTemplates(data.templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  }

  // Derived filtered and sorted templates
  const filteredTemplates = templates
    .filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && t.is_active) || 
                           (filterStatus === "archived" && !t.is_active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... existing logic ...
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 Uploading via Server API...");

      const response = await fetch("/api/admin/templates/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload");
      }

      const { publicUrl } = await response.json();
      setEditForm(prev => ({ ...prev, thumbnail_url: publicUrl }));

      // Automatically save to database immediately after upload
      console.log("💾 Automatically saving to database...");
      await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: editingId, 
          ...editForm, 
          thumbnail_url: publicUrl 
        }),
      });

      fetchTemplates(); // Refresh the list
      
    } catch (error: any) {
      console.error("Upload error detail:", error);
      alert(`Gagal mengupload: ${error.message || "Error tidak diketahui"}.`);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (template: any) => {
    setEditingId(template.id);
    setEditForm({
      name: template.name,
      price: template.price,
      original_price: template.original_price || 0,
      is_active: template.is_active,
      thumbnail_url: template.thumbnail_url || "",
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update template");
      }
      
      setEditingId(null);
      fetchTemplates();
    } catch (error: any) {
      alert(`Gagal mengupdate template: ${error.message}`);
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse mt-3"></div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="p-8 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-6 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Template</h1>
          <p className="text-slate-500 mt-1 font-medium text-base">Kelola produk, harga, dan ketersediaan di website.</p>
        </div>
        
        {/* Controls Bar - subtle normal estetik, clean proportions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-56">
            <input 
              type="text" 
              placeholder="Cari template..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 w-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300"
            />
            <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 bg-white/90 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-rose-500/80 focus:ring-2 focus:ring-rose-500/10 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-slate-300"
          >
            <option value="newest">Terbaru</option>
            <option value="price-high">Harga Tertinggi</option>
            <option value="price-low">Harga Terendah</option>
            <option value="name">Nama A-Z</option>
          </select>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleImageUpload}
      />

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Template</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Promo</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga Coret</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTemplates.length > 0 ? filteredTemplates.map((template) => (
                <tr key={template.id} className={`hover:bg-slate-50/30 transition-colors group ${editingId === template.id ? 'bg-rose-50/30' : ''}`}>
                  {/* Column 1: Preview */}
                  <td className="px-6 py-5">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      <img 
                        src={(editingId === template.id ? editForm.thumbnail_url : template.thumbnail_url) || "/images/placeholder.png"} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      {editingId === template.id && (
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-charcoal-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className={`w-5 h-5 text-white ${uploading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Column 2: Nama Template */}
                  <td className="px-6 py-5">
                    {editingId === template.id ? (
                      <input 
                        type="text" 
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nama Template"
                        className="px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold focus:outline-none focus:border-rose-500 w-full min-w-[150px]"
                      />
                    ) : (
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{template.name}</span>
                    )}
                  </td>

                  {/* Column 3: Slug */}
                  <td className="px-6 py-5">
                    {editingId === template.id ? (
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <input 
                          type="text" 
                          value={editForm.thumbnail_url}
                          readOnly
                          placeholder="Thumbnail URL"
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-mono focus:outline-none w-full text-slate-400"
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 bg-rose-500 text-white text-[9px] font-bold rounded uppercase whitespace-nowrap"
                        >
                          {uploading ? '...' : 'URL'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">/{template.slug}</span>
                    )}
                  </td>

                  {/* Column 4: Kategori */}
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg uppercase tracking-wider text-[9px] font-bold text-slate-500 whitespace-nowrap">
                      {template.category}
                    </span>
                  </td>

                  {/* Column 5: Harga Promo */}
                  <td className="px-6 py-5">
                    {editingId === template.id ? (
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-bold">Rp</span>
                        <input 
                          type="number" 
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-black text-slate-900 whitespace-nowrap">Rp {template.price.toLocaleString("id-ID")}</span>
                    )}
                  </td>

                  {/* Column 6: Harga Coret */}
                  <td className="px-6 py-5">
                    {editingId === template.id ? (
                      <div className="flex items-center gap-1.5 min-w-[100px]">
                        <span className="text-[10px] text-slate-400 font-bold">Rp</span>
                        <input 
                          type="number" 
                          value={editForm.original_price}
                          onChange={(e) => setEditForm({ ...editForm, original_price: parseInt(e.target.value) })}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-rose-300 text-slate-400"
                        />
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 line-through whitespace-nowrap">
                        {template.original_price && template.original_price > template.price ? `Rp ${template.original_price.toLocaleString("id-ID")}` : '-'}
                      </span>
                    )}
                  </td>

                  {/* Column 7: Status */}
                  <td className="px-6 py-5">
                    {editingId === template.id ? (
                      <button 
                        onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${editForm.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                      >
                        {editForm.is_active ? 'Active' : 'Archived'}
                      </button>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${template.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {template.is_active ? 'Active' : 'Archived'}
                      </span>
                    )}
                  </td>

                  {/* Column 8: Aksi */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === template.id ? (
                        <>
                          <button 
                            onClick={() => handleSave(template.id)}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-slate-800 transition-colors"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(template)}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Edit Template"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <a 
                            href={template.demo_url} 
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            title="View Demo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    Tidak ada template yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

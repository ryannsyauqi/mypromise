"use client";

import { useState, useEffect } from "react";
import { mockTemplates } from "@/lib/mock-data";
import { FieldSchema } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

const Icons = {
  Couple: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 2h-6c-1.1 0-2 .9-2 2v5h2v-5h2v5h2v-5h2v-5c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  Event: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.45 7.55L22 12l-7.55 2.45L12 22l-2.45-7.55L2 12l7.55-2.45L12 2z"/>
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm9-8h-3.17L16 2H8L6.17 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Error: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
};

export default function InvitationForm() {
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState("mempelai");

  useEffect(() => {
    async function loadData() {
      const { data: invData, error } = await supabase
        .from('invitations')
        .select('*, orders(*, templates(*))')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (invData) {
        setData(invData);
        setFormData(invData.content || {});
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id) return;

    setSaveStatus("saving");
    
    const { error } = await supabase
      .from('invitations')
      .update({ content: formData })
      .eq('id', data.id);

    if (error) {
      console.error(error);
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const template = data?.orders?.templates;
  const fieldSchema = template?.field_schema || [];

  const groomBrideFields = fieldSchema.filter((f: any) => f.key.startsWith('groom') || f.key.startsWith('bride'));
  const eventFields = fieldSchema.filter((f: any) => f.key.startsWith('akad') || f.key.startsWith('reception') || f.key.includes('maps') || f.key.includes('date'));
  const otherFields = fieldSchema.filter((f: any) => !groomBrideFields.includes(f) && !eventFields.includes(f));

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FieldSchema) => {
    const commonClasses = "w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-slate-50/50 font-bold text-charcoal-800 placeholder:text-slate-300 placeholder:font-medium text-sm";
    
    return (
      <div key={field.key} className="space-y-2.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          {field.label} 
          {field.required && <span className="text-rose-500">*</span>}
        </label>
        
        {field.type === "textarea" ? (
          <textarea 
            className={`${commonClasses} min-h-[120px] resize-none`}
            required={field.required}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder || "Tuliskan di sini..."}
          />
        ) : (
          <input 
            type={field.type} 
            className={commonClasses}
            required={field.required}
            placeholder={field.placeholder || field.hint}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        )}
        {field.hint && <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{field.hint}</p>}
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-xl shadow-charcoal-900/[0.02] border border-slate-100 overflow-hidden">
      {/* Sidebar Tabs */}
      <div className="lg:w-72 bg-slate-50/50 border-r border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-3">
        {[
          { id: "mempelai", label: "Profil Mempelai", icon: <Icons.Couple /> },
          { id: "acara", label: "Detail Acara", icon: <Icons.Event /> },
          { id: "lainnya", label: "Konten Tambahan", icon: <Icons.Sparkles /> },
          { id: "media", label: "Media & Galeri", icon: <Icons.Camera /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl mb-1 ${
              activeTab === tab.id
                ? "bg-white text-rose-500 shadow-sm border border-slate-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-grow p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50 text-[10px] font-black uppercase tracking-widest animate-fade-in">
              <Icons.Check /> Perubahan Berhasil Disimpan
            </div>
          )}
          
          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/50 text-[10px] font-black uppercase tracking-widest animate-fade-in">
              <Icons.Error /> Gagal Menyimpan. Silakan Coba Lagi.
            </div>
          )}

          {activeTab === "mempelai" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Profil Mempelai</h2>
                <p className="text-xs text-slate-400 font-medium">Lengkapi detail profil untuk calon pengantin pria dan wanita.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {groomBrideFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "acara" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Waktu & Lokasi Acara</h2>
                <p className="text-xs text-slate-400 font-medium">Pastikan detail waktu dan alamat sudah benar agar tamu tidak tersesat.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {eventFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "lainnya" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Cerita & Pesan Tambahan</h2>
                <p className="text-xs text-slate-400 font-medium">Tambahkan sentuhan personal untuk menyapa para tamu undangan.</p>
              </div>
              <div className="space-y-8">
                {otherFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-10 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Media & Galeri Foto</h2>
                <p className="text-xs text-slate-400 font-medium">Unggah foto-foto terbaik kamu untuk menghiasi undangan digital.</p>
              </div>
              
              <div className="text-center py-16 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 border-spacing-4">
                 <div className="w-16 h-16 bg-white text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <Icons.Camera />
                </div>
                <h3 className="font-bold text-charcoal-900 text-lg">Pilih Foto Galeri</h3>
                <p className="text-slate-400 text-xs mt-2 font-medium max-w-xs mx-auto mb-8">
                  Format JPG, PNG, atau WEBP. Maksimum 5MB per file.
                </p>
                <button type="button" className="px-10 py-4 bg-white border border-slate-100 text-charcoal-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                  Pilih File
                </button>
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-emerald-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Sistem Ready</span>
            </div>
            <button
              type="submit"
              disabled={saveStatus === "saving" || !data?.id}
              className="w-full md:w-auto px-12 py-5 bg-charcoal-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-charcoal-900/10 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


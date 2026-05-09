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
  const template = mockTemplates[0]; // Logic fetch template by order
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Fetch existing data on mount
  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .limit(1)
        .single();
      
      if (data) {
        setInvitationId(data.id);
        setFormData(data.content || {});
      }
    }
    loadData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId) return;

    setSaveStatus("saving");
    
    const { error } = await supabase
      .from('invitations')
      .update({ content: formData })
      .eq('id', invitationId);

    if (error) {
      console.error(error);
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const groomBrideFields = template.field_schema.filter(f => f.key.startsWith('groom') || f.key.startsWith('bride'));
  const eventFields = template.field_schema.filter(f => f.key.startsWith('akad') || f.key.startsWith('reception') || f.key.includes('maps'));
  const otherFields = template.field_schema.filter(f => !groomBrideFields.includes(f) && !eventFields.includes(f));

  const [activeTab, setActiveTab] = useState("mempelai");

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FieldSchema) => {
    const commonClasses = "dashboard-input";
    
    return (
      <div key={field.key} className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          {field.label} {field.required && <span className="text-rose-500">*</span>}
        </label>
        
        {field.type === "textarea" ? (
          <textarea 
            className={commonClasses} 
            rows={3}
            required={field.required}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        ) : (
          <input 
            type={field.type} 
            className={commonClasses}
            required={field.required}
            placeholder={field.hint}
            value={formData[field.key] || ""}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
          />
        )}
        {field.hint && <p className="text-[10px] text-charcoal-300 italic">{field.hint}</p>}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px]">
      {/* Sidebar Tabs */}
      <div className="lg:w-64 bg-cream-50/50 border-r border-cream-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar">
        {[
          { id: "mempelai", label: "Mempelai", icon: <Icons.Couple /> },
          { id: "acara", label: "Acara", icon: <Icons.Event /> },
          { id: "lainnya", label: "Lainnya", icon: <Icons.Sparkles /> },
          { id: "media", label: "Media & Foto", icon: <Icons.Camera /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 lg:flex-none flex items-center gap-3 px-6 py-5 text-sm font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-white text-rose-500 border-b-2 lg:border-b-0 lg:border-r-4 border-rose-500"
                : "text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-grow p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-sm font-bold animate-fade-in">
              <Icons.Check /> Perubahan berhasil disimpan!
            </div>
          )}
          
          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 text-sm font-bold animate-fade-in">
              <Icons.Error /> Gagal menyimpan. Silakan coba lagi.
            </div>
          )}
          {activeTab === "mempelai" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {groomBrideFields.map(renderField)}
            </div>
          )}

          {activeTab === "acara" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {eventFields.map(renderField)}
            </div>
          )}

          {activeTab === "lainnya" && (
            <div className="space-y-6 animate-fade-in">
              {otherFields.map(renderField)}
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-8 animate-fade-in text-center py-12">
               <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.Camera />
              </div>
              <h3 className="font-bold text-charcoal-800 text-lg">Upload Foto Terindah Anda</h3>
              <p className="text-charcoal-400 text-sm">Media di-render secara otomatis dari storage.</p>
              <button type="button" className="px-8 py-4 border-2 border-dashed border-cream-200 rounded-3xl text-charcoal-400 font-bold">
                Pilih File
              </button>
            </div>
          )}

          <div className="pt-8 border-t border-cream-100 flex justify-between items-center">
            <button type="button" className="text-charcoal-400 font-bold text-xs uppercase tracking-widest">
              Draft Tersimpan Otomatis
            </button>
            <button
              type="submit"
              disabled={saveStatus === "saving" || !invitationId}
              className="px-10 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-900/10 disabled:opacity-50"
            >
              {saveStatus === "saving" ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


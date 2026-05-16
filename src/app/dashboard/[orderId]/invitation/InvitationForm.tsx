"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { FieldSchema } from "@/lib/types";

const Icons = {
  Couple: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 2h-6c-1.1 0-2 .9-2 2v5h2v-5h2v5h2v-5h2v-5c0-1.1-.9-2-2-2z" />
    </svg>
  ),
  Event: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
    </svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.45 7.55L22 12l-7.55 2.45L12 22l-2.45-7.55L2 12l7.55-2.45L12 2z" />
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm9-8h-3.17L16 2H8L6.17 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
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
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
};

function InvitationFormContent({ initialData }: { initialData?: any }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const initialTab = searchParams.get("tab") || "mempelai";

  const supabase = createClient();
  const [data, setData] = useState<any>(initialData || null);
  const [formData, setFormData] = useState<Record<string, any>>(initialData?.content || {});
  const [loading, setLoading] = useState(!initialData);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab && initialTab !== "pengaturan") {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setFormData(initialData.content || {});
      setLoading(false);
      return;
    }

    async function loadData() {
      if (!orderId) return;

      const { data: invData } = await supabase
        .from('invitations')
        .select('*, orders(*, templates(*))')
        .eq('order_id', orderId)
        .single();

      if (invData) {
        setData(invData);
        setFormData(invData.content || {});
      }
      setLoading(false);
    }
    loadData();
  }, [supabase, orderId, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.id) return;

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/invitations/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to save");
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setSaveStatus("error");
    }
  };

  const handleFileUpload = async (key: string, originalFile: File, isMulti = false) => {
    if (!data?.id) return;

    setUploadingField(key);

    // Auto convert image to AVIF/WEBP to save space
    let file = originalFile;
    if (originalFile.type.startsWith("image/")) {
      file = await new Promise<File>((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(originalFile);
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(originalFile);
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob && blob.type === "image/avif") {
              resolve(new File([blob], originalFile.name.replace(/\.[^/.]+$/, "") + ".avif", { type: "image/avif" }));
            } else {
              canvas.toBlob((webpBlob) => {
                if (webpBlob) {
                  resolve(new File([webpBlob], originalFile.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" }));
                } else resolve(originalFile);
              }, "image/webp", 0.8);
            }
          }, "image/avif", 0.8);
        };
        img.onerror = () => resolve(originalFile);
      });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${data.id}/${key}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("path", filePath);

      const response = await fetch("/api/invitations/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Gagal mengunggah foto.");
      }

      const { publicUrl } = await response.json();

      if (isMulti) {
        const currentFiles = formData[key] || [];
        handleInputChange(key, [...currentFiles, publicUrl]);
      } else {
        handleInputChange(key, publicUrl);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploadingField(null);
    }
  };

  const removeFile = (key: string, index?: number) => {
    if (index !== undefined) {
      const currentFiles = [...(formData[key] || [])];
      currentFiles.splice(index, 1);
      handleInputChange(key, currentFiles);
    } else {
      handleInputChange(key, null);
    }
  };

  const order = data?.orders;
  const template = Array.isArray(order?.templates) ? order.templates[0] : order?.templates;
  const fieldSchema = template?.field_schema || [];

  const mediaFields = fieldSchema.filter((f: any) => f.type === 'file' || f.type === 'multi_file' || f.type === 'image' || f.type === 'gallery');
  const groomBrideFields = fieldSchema.filter((f: any) => (f.key.startsWith('groom') || f.key.startsWith('bride')) && !mediaFields.includes(f));
  const eventFields = fieldSchema.filter((f: any) => (f.key.startsWith('akad') || f.key.startsWith('reception') || f.key.includes('maps') || f.key.includes('date')) && !mediaFields.includes(f));
  const otherFields = fieldSchema.filter((f: any) => !groomBrideFields.includes(f) && !eventFields.includes(f) && !mediaFields.includes(f));

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FieldSchema) => {
    const commonClasses = "w-full px-4 py-3 md:py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 bg-white font-bold text-charcoal-900 placeholder:text-slate-300 text-sm transition-all shadow-xs";

    if (field.type === "file" || field.type === "multi_file" || field.type === "image" || field.type === "gallery") {
      const isMulti = field.type === "multi_file" || field.type === "gallery";
      const value = formData[field.key];

      return (
        <div key={field.key} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 col-span-full">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-charcoal-900 flex items-center gap-2">
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider">{isMulti ? "Multi Foto" : "1 Foto"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {isMulti ? (
              (value || []).map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group/img border border-slate-200 shadow-sm bg-white">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeFile(field.key, idx)}
                      className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all shadow-md transform active:scale-95"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              value && (
                <div className="relative aspect-square rounded-xl overflow-hidden group/img border border-slate-200 shadow-sm bg-white">
                  <img src={value} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeFile(field.key)}
                      className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all shadow-md transform active:scale-95"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              )
            )}

            <label className={`aspect-square rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 flex flex-col items-center justify-center cursor-pointer transition-all group/upload shadow-inner ${uploadingField === field.key ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/webp, image/avif, image/heic"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(field.key, file, isMulti);
                }}
              />
              {uploadingField === field.key ? (
                <div className="w-5 h-5 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="text-rose-500 mb-1 transform group-hover/upload:-translate-y-0.5 transition-transform"><Icons.Upload /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">Pilih File</span>
                </>
              )}
            </label>
          </div>
          {field.hint && <p className="text-[10px] text-slate-500 font-medium leading-relaxed flex items-center gap-1.5"><Icons.Sparkles /> {field.hint}</p>}
        </div>
      );
    }

    return (
      <div key={field.key} className={`space-y-1.5 ${field.type === 'textarea' ? 'col-span-full' : ''}`}>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          {field.label}
          {field.required && <span className="text-rose-500">*</span>}
        </label>

        {field.type === "textarea" ? (
          <textarea
            className={`${commonClasses} min-h-[100px] resize-y`}
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
        {field.hint && <p className="text-[10px] text-slate-400 font-medium">{field.hint}</p>}
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-3 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-2xl shadow-charcoal-900/[0.04] border border-slate-100/80 overflow-hidden min-h-[700px] my-4">
      {/* Sidebar Tabs */}
      <div className="lg:w-80 bg-slate-50/60 border-b lg:border-b-0 lg:border-r border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-6 gap-3">
        <div className="hidden lg:flex items-center gap-3.5 px-4 pb-6 mb-4 border-b border-slate-200/60 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 shrink-0">
            <Icons.Couple />
          </div>
          <div>
            <h3 className="font-bold text-charcoal-900 text-base leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>Data Pengantin</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mt-0.5">Live Template Sync</p>
          </div>
        </div>

        {[
          { id: "mempelai", label: "Profil Mempelai", desc: "Nama & Orang Tua", icon: <Icons.Couple /> },
          { id: "acara", label: "Waktu & Lokasi", desc: "Akad & Resepsi", icon: <Icons.Event /> },
          { id: "lainnya", label: "Informasi Ekstra", desc: "Cerita & Hadiah", icon: <Icons.Sparkles /> },
          { id: "media", label: "Galeri Foto", desc: "Prewedding & Musik", icon: <Icons.Camera /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-4 px-6 py-4 transition-all duration-300 rounded-[24px] text-left shrink-0 lg:shrink ${activeTab === tab.id
              ? "bg-rose-500 text-white shadow-xl shadow-rose-500/25 font-bold"
              : "bg-white/60 hover:bg-white text-slate-400 hover:text-charcoal-900 border border-slate-100 shadow-xs"
              }`}
          >
            <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:text-rose-500"}`}>
              {tab.icon}
            </div>
            <div>
              <div className="text-xs md:text-sm font-black uppercase tracking-wider">{tab.label}</div>
              <div className={`text-[10px] font-semibold mt-0.5 ${activeTab === tab.id ? "text-rose-100" : "text-slate-400"}`}>{tab.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex-grow p-6 sm:p-10 lg:p-16">
        <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto">
          {saveStatus === "success" && (
            <div className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-700 rounded-[28px] border border-emerald-200/80 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm"><Icons.Check /></div>
              <span>Perubahan Berhasil Disimpan & Tersinkronisasi ke Undangan Live</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="flex items-center gap-3 p-6 bg-rose-50 text-rose-700 rounded-[28px] border border-rose-200/80 text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/10 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm"><Icons.Error /></div>
              <span>{errorMessage || "Gagal Menyimpan. Silakan Periksa Jaringan & Coba Lagi."}</span>
            </div>
          )}

          {activeTab === "mempelai" && (
            <div className="space-y-8 animate-fade-in">
              <div className="pb-6 border-b border-slate-100">
                <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 1 / 4</span>
                <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 mt-3 mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Profil Mempelai</h2>
                <p className="text-sm text-slate-400 font-medium">Lengkapi nama lengkap, nama panggilan, serta detail orang tua dari masing-masing mempelai.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groomBrideFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "acara" && (
            <div className="space-y-8 animate-fade-in">
              <div className="pb-6 border-b border-slate-100">
                <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 2 / 4</span>
                <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 mt-3 mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Waktu & Lokasi Acara</h2>
                <p className="text-sm text-slate-400 font-medium">Tentukan jadwal pelaksanaan akad nikah dan resepsi, serta tautan peta Google Maps lokasi acara.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {eventFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "lainnya" && (
            <div className="space-y-8 animate-fade-in">
              <div className="pb-6 border-b border-slate-100">
                <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 3 / 4</span>
                <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 mt-3 mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Informasi Tambahan</h2>
                <p className="text-sm text-slate-400 font-medium">Sematkan kata sambutan, kutipan ayat cinta, atau informasi rekening/kado digital untuk tamu undangan.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {otherFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-8 animate-fade-in">
              <div className="pb-6 border-b border-slate-100">
                <span className="px-3 py-1 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] rounded-full">Kategori 4 / 4</span>
                <h2 className="text-3xl md:text-4xl font-black text-charcoal-900 mt-3 mb-2 tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>Galeri & Media Foto</h2>
                <p className="text-sm text-slate-400 font-medium">Unggah koleksi foto prewedding terbaik Anda untuk mempercantik galeri undangan digital.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {mediaFields.length > 0 ? (
                  mediaFields.map(renderField)
                ) : (
                  <div className="text-center py-20 bg-slate-50/70 rounded-[36px] border-2 border-dashed border-slate-200 shadow-inner">
                    <div className="w-20 h-20 bg-white text-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-100">
                      <Icons.Camera />
                    </div>
                    <h3 className="font-black text-charcoal-900 text-xl md:text-2xl" style={{ fontFamily: "var(--font-playfair)" }}>Galeri Tidak Diperlukan</h3>
                    <p className="text-slate-400 text-sm mt-3 font-medium max-w-md mx-auto leading-relaxed">
                      Desain template undangan yang Anda pilih bernuansa minimalis elegan dan tidak menggunakan galeri foto eksternal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-center gap-6">
            <button
              type="submit"
              disabled={saveStatus === "saving" || !data?.id}
              className="group relative w-full sm:w-auto px-14 py-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black uppercase tracking-[0.25em] text-xs rounded-2xl hover:from-rose-600 hover:to-rose-700 transition-all duration-500 shadow-2xl shadow-rose-500/25 disabled:opacity-50 flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer"
            >
              {saveStatus === "saving" ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan Sistem...</span>
                </>
              ) : (
                <>
                  <span>Simpan Perubahan</span>
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvitationForm({ initialData }: { initialData?: any }) {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <InvitationFormContent initialData={initialData} />
    </Suspense>
  );
}

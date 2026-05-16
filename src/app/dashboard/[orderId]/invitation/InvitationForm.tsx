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
    const commonClasses = "w-full px-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-500 transition-all bg-slate-50/50 font-bold text-charcoal-800 placeholder:text-slate-300 placeholder:font-medium text-sm";

    if (field.type === "file" || field.type === "multi_file" || field.type === "image" || field.type === "gallery") {
      const isMulti = field.type === "multi_file" || field.type === "gallery";
      const value = formData[field.key];

      return (
        <div key={field.key} className="space-y-4 col-span-full">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isMulti ? (
              (value || []).map((url: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(field.key, idx)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              ))
            ) : (
              value && (
                <div className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100">
                  <img src={value} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(field.key)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              )
            )}

            <label className={`aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all ${uploadingField === field.key ? 'opacity-50 pointer-events-none' : ''}`}>
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
                <div className="w-6 h-6 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <div className="text-slate-300 mb-2"><Icons.Upload /></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Upload</span>
                </>
              )}
            </label>
          </div>
          {field.hint && <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{field.hint}</p>}
        </div>
      );
    }

    return (
      <div key={field.key} className={`space-y-2.5 ${field.type === 'textarea' ? 'col-span-full' : ''}`}>
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
    <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-xl shadow-charcoal-900/[0.02] border border-slate-100 overflow-hidden min-h-[600px]">
      {/* Sidebar Tabs */}
      <div className="lg:w-72 bg-slate-50/50 border-r border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-3">
        {[
          { id: "mempelai", label: "Profil Mempelai", icon: <Icons.Couple /> },
          { id: "acara", label: "Detail Acara", icon: <Icons.Event /> },
          { id: "lainnya", label: "Lainnya", icon: <Icons.Sparkles /> },
          { id: "media", label: "Media & Galeri", icon: <Icons.Camera /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 lg:flex-none flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-2xl mb-1 ${activeTab === tab.id
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
              <Icons.Error /> {errorMessage || "Gagal Menyimpan. Silakan Coba Lagi."}
            </div>
          )}

          {activeTab === "mempelai" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Profil Mempelai</h2>
                  <p className="text-xs text-slate-400 font-medium">Lengkapi detail profil untuk calon pengantin pria dan wanita.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {groomBrideFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "acara" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Waktu & Lokasi Acara</h2>
                  <p className="text-xs text-slate-400 font-medium">Pastikan detail waktu dan alamat sudah benar agar tamu tidak tersesat.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {eventFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "lainnya" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Lainnya</h2>
                  <p className="text-xs text-slate-400 font-medium">Tambahkan sentuhan personal untuk menyapa para tamu undangan.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {otherFields.map(renderField)}
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-10 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-charcoal-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Media & Galeri Foto</h2>
                  <p className="text-xs text-slate-400 font-medium">Unggah foto-foto terbaik kamu untuk menghiasi undangan digital.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {mediaFields.length > 0 ? (
                  mediaFields.map(renderField)
                ) : (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                    <div className="w-16 h-16 bg-white text-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                      <Icons.Camera />
                    </div>
                    <h3 className="font-bold text-charcoal-900 text-lg">Belum Ada Field Media</h3>
                    <p className="text-slate-400 text-xs mt-2 font-medium max-w-xs mx-auto">
                      Template yang kamu pilih mungkin tidak membutuhkan unggahan media tambahan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-end items-center gap-6">
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

export default function InvitationForm({ initialData }: { initialData?: any }) {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <InvitationFormContent initialData={initialData} />
    </Suspense>
  );
}

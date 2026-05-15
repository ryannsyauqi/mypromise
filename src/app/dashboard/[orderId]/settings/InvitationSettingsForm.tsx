"use client";

import { useState } from "react";
import Link from "next/link";

const Icons = {
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Error: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  )
};

export default function InvitationSettingsForm({ initialData }: { initialData: any }) {
  const [slug, setSlug] = useState(initialData.slug || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveStatus("saving");
    setErrorMessage("");
    
    try {
      const response = await fetch(`/api/invitations/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to save");
      }

      if (resData.data?.slug) {
        setSlug(resData.data.slug);
      }

      setSaveStatus("success");
      setIsEditing(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setSaveStatus("error");
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-charcoal-800" style={{ fontFamily: "var(--font-playfair)" }}>
          Pengaturan Link Undangan
        </h1>
        <p className="text-charcoal-400 mt-2">Kustomisasi alamat website undangan agar lebih personal dan mudah diingat.</p>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl shadow-charcoal-900/[0.02] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          
          <div className="space-y-6">
            <div className={`p-10 rounded-[40px] transition-all duration-500 relative overflow-hidden ${
              isEditing ? 'bg-white border-2 border-rose-500 shadow-2xl shadow-rose-500/10' : 'bg-slate-50/50 border border-slate-100'
            }`}>
              {/* Decorative Background Elements */}
              {isEditing && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full -mr-16 -mt-16 animate-pulse"></div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isEditing ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-white text-slate-300 border border-slate-100'
                  }`}>
                    <Icons.Globe />
                  </div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block">Alamat Undangan (URL SLUG)</label>
                </div>
                
                <div className="flex items-center gap-3">
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setSlug(initialData.slug || "");
                      }}
                      className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                      Batal
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                    disabled={saveStatus === "saving"}
                    className={`group flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 ${
                      isEditing 
                        ? 'bg-rose-500 text-white hover:bg-rose-600' 
                        : 'bg-white text-charcoal-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {saveStatus === "saving" ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : isEditing ? (
                      <><Icons.Check /> Simpan</>
                    ) : (
                      <><Icons.Edit /> Edit Link</>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className={`flex flex-col md:flex-row items-stretch gap-4 transition-all ${isEditing ? 'scale-[1.01]' : ''}`}>
                  <div className={`flex-grow flex items-center gap-0 px-1 py-1 rounded-[24px] border transition-all duration-300 w-full overflow-hidden ${
                    isEditing ? 'bg-white border-rose-500 ring-8 ring-rose-500/5 shadow-inner' : 'bg-white border-slate-200'
                  }`}>
                    <div className="bg-slate-50 px-6 py-4 rounded-l-[20px] border-r border-slate-100 flex items-center justify-center shrink-0">
                       <span className="text-slate-400 text-sm font-bold tracking-tight">mypromise.id/</span>
                    </div>
                    <input 
                      type="text"
                      value={slug}
                      disabled={!isEditing}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="flex-grow bg-transparent border-none focus:outline-none px-6 py-4 font-black text-charcoal-900 text-lg lowercase disabled:text-slate-300 placeholder:text-slate-200"
                      placeholder="nama-pengantin"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium min-h-[32px]">
                  {saveStatus === "success" && (
                    <div className="flex items-center gap-2 text-emerald-600 animate-scale-in">
                       <Icons.Check /> <span>Berhasil Diperbarui</span>
                    </div>
                  )}
                  {saveStatus === "error" && (
                    <div className="flex items-center gap-2 text-rose-600 animate-scale-in">
                       <Icons.Error /> <span>{errorMessage}</span>
                    </div>
                  )}
                  {!saveStatus || saveStatus === "idle" ? (
                    isEditing ? (
                      <div className="flex items-center gap-2 text-rose-500/70 bg-rose-50 px-4 py-2 rounded-lg animate-fade-in">
                         <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                         <span>Huruf kecil & tanda hubung. Contoh: <strong className="text-rose-600">ryan-nurul</strong></span>
                      </div>
                    ) : (
                      <span className="text-slate-400 px-2 italic">Klik edit untuk mengubah alamat website undangan.</span>
                    )
                  ) : null}
                </div>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-default">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Link</h4>
                    <p className="text-xl font-bold text-charcoal-900">Aktif & Siap</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Icons.Check />
                  </div>
               </div>

               <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-default">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Aktif</h4>
                    <p className="text-xl font-bold text-charcoal-900">365 Hari</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

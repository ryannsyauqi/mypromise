"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const order = initialData?.orders;
  const isLifetime = order?.notes?.includes('Selamanya') || order?.expires_at?.startsWith('2099') || false;

  let remainingText = "365 Hari";
  let exactExpiryDateFormatted = "";
  if (!isLifetime && order && order.created_at) {
    const createdDate = new Date(order.created_at);
    const expiryDate = order.expires_at ? new Date(order.expires_at) : new Date(new Date(createdDate.getTime()).setFullYear(createdDate.getFullYear() + 1));
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    remainingText = diffDays > 0 ? `${diffDays} Hari` : "Expired";

    const monthsId = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    exactExpiryDateFormatted = `${expiryDate.getDate()} ${monthsId[expiryDate.getMonth()]} ${expiryDate.getFullYear()}`;
  }

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
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setSaveStatus("error");
    }
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="p-8 md:p-12">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
               <h2 className="text-lg md:text-xl font-bold text-charcoal-900" style={{ fontFamily: "var(--font-playfair)" }}>Edit URL / Link undangan</h2>
            </div>
            
            <div className="flex items-center gap-4">
              {isEditing && (
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSlug(initialData.slug || "");
                  }}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-charcoal-900 transition-colors"
                >
                  Batal
                </button>
              )}
              <button 
                type="button"
                onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
                disabled={saveStatus === "saving"}
                className={`group flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                  isEditing 
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20' 
                    : 'bg-charcoal-900 text-white hover:bg-charcoal-800 shadow-lg shadow-charcoal-900/10'
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

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-4 transition-all duration-300">
              <div className={`flex-grow flex items-center gap-0 px-2 py-2 rounded-[20px] border transition-all duration-300 w-full overflow-hidden ${
                isEditing ? 'bg-white border-rose-500 ring-4 ring-rose-500/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="pl-5 pr-2 py-3 flex items-center justify-center shrink-0">
                   <span className={`text-sm font-bold ${isEditing ? 'text-charcoal-400' : 'text-slate-400'}`}>mypromise.id/</span>
                </div>
                <input 
                  type="text"
                  value={slug}
                  disabled={!isEditing}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="flex-grow bg-transparent border-none focus:outline-none pr-5 py-3 font-black text-charcoal-900 text-base md:text-xl lowercase disabled:text-charcoal-600 placeholder:text-slate-300 w-full"
                  placeholder="nama-pengantin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-medium min-h-[24px]">
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
                  <div className="flex items-center gap-2 text-slate-500 animate-fade-in text-xs">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
                     <span>Gunakan huruf kecil & tanda hubung. Contoh: <strong className="text-charcoal-900 font-bold">niafahmiforever</strong> atau <strong className="text-charcoal-900 font-bold">nia-dan-fahmi</strong></span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-start gap-2.5 text-amber-700 text-xs font-medium bg-amber-50/60 border border-amber-200/80 px-4 py-3 rounded-xl shadow-2xs">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Catatan:</strong> Hindari mengubah Link/URL setelah undangan disebarkan agar link tetap bisa diakses.</span>
              </div>
            </div>

            {/* Masa Aktif Info - Minimalist & Real */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Masa Aktif:</span>
                <span className={`font-bold ${isLifetime ? 'text-rose-600 font-black tracking-wide' : 'text-charcoal-900'}`}>
                  {isLifetime ? 'Selamanya (VIP)' : `${remainingText}`}
                </span>
              </div>
              {!isLifetime && exactExpiryDateFormatted && (
                <div>
                  Berlaku hingga: <span className="text-charcoal-900 font-bold">{exactExpiryDateFormatted}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

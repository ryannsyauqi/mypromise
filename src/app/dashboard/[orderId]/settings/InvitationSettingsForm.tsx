"use client";

import { useState } from "react";
import Link from "next/link";

const Icons = {
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

export default function InvitationSettingsForm({ initialData }: { initialData: any }) {
  const [slug, setSlug] = useState(initialData.slug || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setSaveStatus("error");
    }
  };

  return (
    <div className="p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
        {saveStatus === "success" && (
          <div className="flex items-center gap-3 p-5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50 text-[10px] font-black uppercase tracking-widest animate-fade-in">
            <Icons.Check /> Link Berhasil Diperbarui
          </div>
        )}
        
        {saveStatus === "error" && (
          <div className="flex items-center gap-3 p-5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/50 text-[10px] font-black uppercase tracking-widest animate-fade-in">
            <Icons.Error /> {errorMessage || "Gagal Menyimpan. Silakan Coba Lagi."}
          </div>
        )}

        <div className="space-y-6">
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Alamat Undangan (URL Slug)</label>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-grow flex items-center gap-2 px-6 py-4 bg-white rounded-2xl border border-slate-200 w-full overflow-hidden">
                <span className="text-slate-300 text-xs font-medium shrink-0">mypromise.id/</span>
                <input 
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="flex-grow bg-transparent border-none focus:outline-none font-bold text-charcoal-900 text-sm lowercase"
                  placeholder="nama-pengantin"
                />
              </div>
              <Link 
                href={`/${slug}`}
                target="_blank"
                className="shrink-0 px-6 py-4 bg-white text-rose-500 border border-rose-100 font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-rose-50 transition-all flex items-center gap-2"
              >
                Cek Link
              </Link>
            </div>
            <p className="mt-4 text-[9px] text-slate-400 font-medium uppercase tracking-wider leading-relaxed">
              Tips: Gunakan kombinasi nama kalian, contoh: <span className="text-rose-500 font-bold">ryan-nurul</span>. Hanya gunakan huruf, angka, dan tanda hubung (-).
            </p>
          </div>

          <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-4">
             <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Icons.Error />
             </div>
             <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">Peringatan Penting</h4>
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Jika kamu mengubah URL setelah menyebarkan undangan, link yang lama tidak akan bisa diakses lagi oleh tamu. Pastikan untuk memperbarui link yang sudah Anda sebar.
                </p>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="w-full md:w-auto px-12 py-5 bg-charcoal-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-rose-500 transition-all duration-500 shadow-xl shadow-charcoal-900/10 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saveStatus === "saving" ? "Menyimpan..." : "Perbarui Link Undangan"}
          </button>
        </div>
      </form>
    </div>
  );
}

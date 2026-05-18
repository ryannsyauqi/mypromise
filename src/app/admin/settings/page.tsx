"use client";

import { useState, useEffect } from "react";

const Icons = {
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  ),
  Store: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
    </svg>
  ),
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    websiteName: "MyPromise",
    whatsappNumber: "6281234567890",
    notificationEmail: "hello@mypromise.id",
    adminUsername: "admin",
    adminPassword: ""
  });
  const [pwdConfirm, setPwdConfirm] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            websiteName: data.websiteName || "MyPromise",
            whatsappNumber: data.whatsappNumber || "6281234567890",
            notificationEmail: data.notificationEmail || "hello@mypromise.id",
            adminUsername: data.adminUsername || "admin",
            adminPassword: ""
          });
        }
      })
      .catch(err => console.error("Error loading settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (settings.adminPassword && settings.adminPassword !== pwdConfirm) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    setSaving(true);
    try {
      const payload: any = { ...settings };
      if (!payload.adminPassword) {
        delete payload.adminPassword; // Don't overwrite if not typed
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");
      alert("Pengaturan berhasil disimpan!");
      setPwdConfirm("");
      setSettings(prev => ({ ...prev, adminPassword: "" }));
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", name: "Umum", icon: <Icons.Store /> },
    { id: "security", name: "Keamanan", icon: <Icons.Shield /> },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Sistem
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-base">Konfigurasi operasional dan keamanan akun operator.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-500/20 transition-all cursor-pointer flex items-center gap-2"
        >
          {saving ? "Menyimpan..." : <><Icons.Save /> Simpan Perubahan</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-2 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-white text-slate-900 font-bold shadow-sm border border-slate-200" 
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <span className={activeTab === tab.id ? "text-rose-500" : "text-slate-300"}>
                {tab.icon}
              </span>
              {tab.name}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-grow bg-white rounded-[40px] border border-slate-200 shadow-sm p-10">
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6">Informasi Toko</h3>
                {loading ? (
                  <div className="py-8 text-center text-slate-400 animate-pulse">Memuat pengaturan...</div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Website</label>
                      <input 
                        type="text" 
                        value={settings.websiteName}
                        onChange={e => setSettings({ ...settings, websiteName: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp Support (Gunakan awalan 08 / 628 / +62)</label>
                      <input 
                        type="text" 
                        value={settings.whatsappNumber}
                        onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Notifikasi</label>
                      <input 
                        type="email" 
                        value={settings.notificationEmail}
                        onChange={e => setSettings({ ...settings, notificationEmail: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6">Akun Administrator</h3>
                {loading ? (
                  <div className="py-8 text-center text-slate-400 animate-pulse">Memuat pengaturan...</div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username Admin</label>
                      <input 
                        type="text" 
                        value={settings.adminUsername}
                        onChange={e => setSettings({ ...settings, adminUsername: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password Baru (Biarkan kosong jika tidak ingin mengubah)</label>
                      <input 
                        type="password" 
                        value={settings.adminPassword}
                        onChange={e => setSettings({ ...settings, adminPassword: e.target.value })}
                        placeholder="Masukkan password baru"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Konfirmasi Password Baru</label>
                      <input 
                        type="password" 
                        value={pwdConfirm}
                        onChange={e => setPwdConfirm(e.target.value)}
                        placeholder="Ulangi password baru"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

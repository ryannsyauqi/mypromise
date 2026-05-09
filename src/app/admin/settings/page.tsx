"use client";

import { useState } from "react";

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
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
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

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Pengaturan berhasil disimpan!");
    }, 1000);
  };

  const tabs = [
    { id: "general", name: "Umum", icon: <Icons.Store /> },
    { id: "payment", name: "Pembayaran", icon: <Icons.CreditCard /> },
    { id: "security", name: "Keamanan", icon: <Icons.Shield /> },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Sistem
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Konfigurasi operasional dan integrasi pihak ketiga.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : <><Icons.Save /> Simpan Perubahan</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-2">
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
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Website</label>
                    <input 
                      type="text" 
                      defaultValue="MyPromise"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp Support (Order)</label>
                    <input 
                      type="text" 
                      defaultValue="+62 812 3456 7890"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Notifikasi</label>
                    <input 
                      type="email" 
                      defaultValue="hello@mypromise.id"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6">Integrasi Midtrans</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4 p-6 bg-amber-50 border border-amber-100 rounded-3xl mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Icons.Shield />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-800">Mode Sandbox Aktif</p>
                      <p className="text-[10px] text-amber-600 font-medium">Transaksi saat ini menggunakan kredensial testing.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Midtrans Client Key</label>
                    <input 
                      type="password" 
                      defaultValue="SB-Mid-client-xxxxxxxxxxxx"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Midtrans Server Key</label>
                    <input 
                      type="password" 
                      defaultValue="SB-Mid-server-xxxxxxxxxxxx"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Environment</label>
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none">
                      <option>Sandbox (Testing)</option>
                      <option>Production (Live)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6">Akun Administrator</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</label>
                    <input 
                      type="text" 
                      defaultValue="admin_mypromise"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ganti Password</label>
                    <input 
                      type="password" 
                      placeholder="Masukkan password baru"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      placeholder="Ulangi password baru"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

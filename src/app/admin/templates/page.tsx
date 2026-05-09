"use client";

import { useState, useEffect } from "react";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0, is_active: true });

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

  const startEdit = (template: any) => {
    setEditingId(template.id);
    setEditForm({
      name: template.name,
      price: template.price,
      is_active: template.is_active,
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch("/api/admin/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });

      if (!response.ok) throw new Error("Failed to update template");
      
      setEditingId(null);
      fetchTemplates();
    } catch (error) {
      alert("Gagal mengupdate template");
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Loading Catalog...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Template</h1>
        <p className="text-slate-500 mt-2 font-medium">Kelola produk, harga, dan ketersediaan di website.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Template</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Harga</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {templates.map((template) => (
                <tr key={template.id} className={`hover:bg-slate-50/30 transition-colors group ${editingId === template.id ? 'bg-rose-50/30' : ''}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <img 
                          src={template.thumbnail_url || "/images/placeholder.png"} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        {editingId === template.id ? (
                          <input 
                            type="text" 
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold focus:outline-none focus:border-rose-500"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 text-sm">{template.name}</span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-0.5">/{template.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-medium text-slate-500">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg uppercase tracking-wider text-[9px] font-bold">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {editingId === template.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 font-bold">Rp</span>
                        <input 
                          type="number" 
                          value={editForm.price}
                          onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) })}
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded text-sm font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-black text-slate-900">Rp {template.price.toLocaleString("id-ID")}</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
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
                  <td className="px-8 py-5 text-right">
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
                            ✏️
                          </button>
                          <a 
                            href={template.demo_url} 
                            target="_blank"
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            title="View Demo"
                          >
                            👁️
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

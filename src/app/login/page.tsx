"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Navbar variant="light-bg" />
      
      <main className="flex-grow flex items-center justify-center p-6 pt-32">
        <div className="w-full max-w-md bg-white rounded-[40px] border border-cream-200 shadow-xl shadow-cream-200/50 p-10 md:p-12 animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-charcoal-800 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Selamat Datang Kembali
            </h1>
            <p className="text-charcoal-400 text-sm">Masuk ke dashboard untuk mengelola undangan Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dashboard-input"
                placeholder="email@anda.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="dashboard-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all disabled:opacity-50 shadow-xl shadow-rose-900/10"
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-charcoal-400">
              Belum punya undangan? <Link href="/templates" className="text-rose-500 font-bold hover:underline">Pilih Template</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

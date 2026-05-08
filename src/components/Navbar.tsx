"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-default flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-2xl font-bold tracking-tight transition-colors duration-300"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="gradient-text">My</span>
            <span className={scrolled ? "text-charcoal-800" : "text-white"}>Promise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/templates"
            className={`text-sm font-medium transition-colors duration-300 hover:text-rose-500 ${
              scrolled ? "text-charcoal-600" : "text-white/90"
            }`}
          >
            Template
          </Link>
          <Link
            href="#pricing"
            className={`text-sm font-medium transition-colors duration-300 hover:text-rose-500 ${
              scrolled ? "text-charcoal-600" : "text-white/90"
            }`}
          >
            Harga
          </Link>
          <Link
            href="#how-it-works"
            className={`text-sm font-medium transition-colors duration-300 hover:text-rose-500 ${
              scrolled ? "text-charcoal-600" : "text-white/90"
            }`}
          >
            Cara Kerja
          </Link>
          <Link
            href="/templates"
            className="px-5 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-400 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5"
          >
            Buat Undangan
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-charcoal-800" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-charcoal-800" : "bg-white"
              } ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-charcoal-800" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden glass overflow-hidden transition-all duration-400 ${
          mobileOpen ? "max-h-80 border-t border-cream-200" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          <Link
            href="/templates"
            className="text-charcoal-700 font-medium py-2 hover:text-rose-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Template
          </Link>
          <Link
            href="#pricing"
            className="text-charcoal-700 font-medium py-2 hover:text-rose-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Harga
          </Link>
          <Link
            href="#how-it-works"
            className="text-charcoal-700 font-medium py-2 hover:text-rose-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Cara Kerja
          </Link>
          <Link
            href="/templates"
            className="mt-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full text-center hover:bg-rose-400 transition-all duration-300"
            onClick={() => setMobileOpen(false)}
          >
            Buat Undangan
          </Link>
        </div>
      </div>
    </nav>
  );
}

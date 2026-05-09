"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  /** Set to true when navbar is overlaying a light background (no hero image behind it) */
  variant?: "dark-bg" | "light-bg";
}

export default function Navbar({ variant = "dark-bg" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text should be white if we're on a dark-bg hero (not scrolled) 
  // OR if we're scrolled (since the scrolled bg is now charcoal-900/80)
  const isLightText = variant === "dark-bg" || scrolled;

  const navLinks = [
    { label: "Koleksi", href: "/#designs" },
    { label: "Fitur", href: "/#features" },
    { label: "Pemesanan", href: "/#how-it-works" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-charcoal-900/90 backdrop-blur-md border-b border-white/5 py-3"
          : variant === "light-bg"
            ? "bg-cream-50/80 backdrop-blur-sm py-5"
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
            <span className="text-rose-500">My</span>
            <span className={isLightText ? "text-white" : "text-charcoal-800"}>Promise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 hover:text-rose-500 ${isLightText ? "text-white/90" : "text-charcoal-600"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#designs"
            className="px-8 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all duration-300 shadow-lg shadow-rose-900/10"
          >
            Lihat Katalog
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isLightText ? "bg-white" : "bg-charcoal-800"
                } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isLightText ? "bg-white" : "bg-charcoal-800"
                } ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${isLightText ? "bg-white" : "bg-charcoal-800"
                } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${mobileOpen ? "max-h-80 glass border-t border-white/10" : "max-h-0 border-t-0"
          }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-charcoal-700 text-xs font-black uppercase tracking-[0.2em] py-2 hover:text-rose-500 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#designs"
            className="mt-2 px-6 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center hover:bg-rose-600 transition-all duration-300 shadow-md"
            onClick={() => setMobileOpen(false)}
          >
            Lihat Katalog
          </a>
        </div>
      </div>
    </nav>
  );
}

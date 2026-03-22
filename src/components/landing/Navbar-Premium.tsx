"use client";

/**
 * Premium Floating Navbar - Taste-Skill Enhanced
 * Features:
 * - Floating glass pill design (detached from top)
 * - Magnetic hover physics
 * - Smooth spring transitions
 * - Custom cubic-bezier easing
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export const NavbarPremium = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "#problem", label: "Problem" },
    { href: "#solution", label: "Solution" },
    { href: "#trust", label: "Trust" },
  ];

  return (
    <>
      {/* Floating Navbar - Glass Pill */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 pt-6 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled ? "pt-4" : "pt-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Outer Shell - Double Bezel */}
          <div className="relative">
            {/* Diffusion Shadow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-blue-400/10 to-emerald-400/20 rounded-full blur-xl opacity-40 transition-opacity duration-500 group-hover:opacity-60" />

            {/* Glass Pill Container */}
            <div className="relative px-2 py-2 rounded-full bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="group flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-500 hover:bg-emerald-50/80">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                      <Shield size={18} weight="bold" className="text-white" />
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col leading-tight">
                    <span className="text-sm font-black tracking-tight text-zinc-900">
                      CARBON UPI
                    </span>
                    <span className="text-[9px] tracking-[0.2em] text-emerald-600 font-bold uppercase">
                      Climate DPI
                    </span>
                  </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-2">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <button className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.08em] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95">
                        {link.label}
                      </button>
                    </Link>
                  ))}
                </div>

                {/* CTA Button - Nested Architecture */}
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors active:scale-95"
                  >
                    {menuOpen ? (
                      <X size={18} weight="bold" className="text-zinc-700" />
                    ) : (
                      <List size={18} weight="bold" className="text-zinc-700" />
                    )}
                  </button>

                  {/* Primary CTA */}
                  <Link href="/demo" className="hidden sm:block">
                    <div className="group relative">
                      {/* Magnetic Hover Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                      {/* Button Shell */}
                      <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-[0_6px_24px_rgba(16,185,129,0.35)] active:scale-[0.98]">
                        <span className="text-xs font-bold uppercase tracking-[0.1em] text-white">
                          Try Demo
                        </span>
                        {/* Button-in-Button Icon */}
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                          <ArrowRight size={12} weight="bold" className="text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Staggered Reveal */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Glassmorphism Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-zinc-50/95 to-white/95 backdrop-blur-3xl" />

        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-8 px-8">
          {navLinks.map((link, i) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              <button
                className="text-3xl font-black tracking-tighter text-zinc-900 hover:text-emerald-600 transition-all duration-500 hover:scale-110"
                style={{
                  transform: menuOpen
                    ? "translateY(0) opacity(1)"
                    : "translateY(48px) opacity(0)",
                  transitionDelay: menuOpen ? `${i * 100}ms` : "0ms",
                }}
              >
                {link.label}
              </button>
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link href="/demo" onClick={() => setMenuOpen(false)}>
            <div
              className="mt-8"
              style={{
                transform: menuOpen
                  ? "translateY(0) opacity(1)"
                  : "translateY(48px) opacity(0)",
                transitionDelay: menuOpen ? "400ms" : "0ms",
              }}
            >
              <div className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-[0_8px_32px_rgba(16,185,129,0.3)] text-white font-bold uppercase tracking-[0.1em] text-sm">
                Try Demo
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

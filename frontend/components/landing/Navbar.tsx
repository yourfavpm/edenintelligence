"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "Features", href: "#features" },
    { name: "Security", href: "#security" },
    { name: "Resources", href: "#resources" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-200 ${
          scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[15px] font-medium text-claeron-text/70 hover:text-claeron-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-[15px] font-medium text-claeron-text/80 hover:text-claeron-primary transition-colors px-4 py-2 rounded-lg"
            >
              Login
            </Link>
            <Link href="/auth/signup">
              <button className="h-10 px-5 rounded-lg bg-gradient-to-r from-claeron-primary to-claeron-accent text-white text-[15px] font-medium shadow-sm hover:shadow-md hover:shadow-claeron-accent/20 transition-all duration-200 hover:-translate-y-0.5">
                Start Recording
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-claeron-text hover:bg-claeron-bg rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-claeron-primary/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Panel */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-claeron-text hover:bg-claeron-bg rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[18px] font-medium text-claeron-text hover:text-claeron-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full h-12 flex items-center justify-center border border-claeron-primary/10 rounded-lg text-claeron-primary font-medium text-[16px]"
              >
                Login
              </Link>
              <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full h-12 rounded-lg bg-gradient-to-r from-claeron-primary to-claeron-accent text-white font-medium text-[16px] shadow-sm">
                  Start Recording
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

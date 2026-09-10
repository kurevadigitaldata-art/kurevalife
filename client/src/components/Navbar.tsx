import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "/#servicios" },
    { label: "Calculadora", href: "/calculadora" },
    { label: "Recursos", href: "/recursos" },
    { label: "Probar KurevaLife", href: "/kurevalife#simulacro", tag: "Piloto" },
    { label: "Método", href: "/#metodo" },
  ];

  return (
    <>
      <a href="#contenido-principal" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#D9FF2B] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[#0F3A2D] focus:shadow-xl">Saltar al contenido principal</a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#DCD4C4] py-3.5 shadow-xs"
            : "bg-transparent py-5"
        }`}
      >
      <div className="container flex items-center justify-between">
        {/* Brand logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#0F3A2D] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 p-2">
            <svg viewBox="0 0 800 800" className="w-full h-full" fill="none" stroke="#F5F1E7" strokeWidth="96" strokeLinecap="round" strokeLinejoin="round">
              <path d="M236 628V252C236 118 414 118 414 252V372" />
              <path d="M414 372L634 164" />
              <path d="M414 372L634 606" />
              <path d="M300 491L404 383" stroke="#D9FF2B" strokeWidth="28" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl tracking-tight text-[#0F3A2D]">
              Kureva
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5E806E] -mt-1">
              Autonomía Digital
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#173A2E] hover:text-[#0F3A2D] transition-colors relative py-1 group"
            >
              {link.label}
              {link.tag && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-[#D9FF2B] text-[#0F3A2D]">
                  {link.tag}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0F3A2D] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="/#contacto"
            className="kureva-btn-primary text-xs py-2.5 px-5 shadow-xs"
          >
            <span>Iniciar diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#0F3A2D] hover:bg-black/5 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav modal */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F0] border-b border-[#DCD4C4] px-6 py-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#0F3A2D] py-2 flex items-center justify-between border-b border-[#DCD4C4]/50"
              >
                <span>{link.label}</span>
                {link.tag && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#D9FF2B] text-[#0F3A2D]">
                    {link.tag}
                  </span>
                )}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <a
                href="/#contacto"
                onClick={() => setMobileMenuOpen(false)}
                className="kureva-btn-primary text-center justify-center"
              >
                <span>Iniciar diagnóstico</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
};

import React from "react";
import { Accessibility, ArrowDown, Ear, Eye, HeartHandshake, Keyboard, ShieldCheck, Sparkles } from "lucide-react";

export function PilotWelcome() {
  return (
    <section id="simulacro" className="py-16 md:py-22 bg-[#FFFDF8] border-b border-[#DCD4C4] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#D9FF2B]/25 blur-3xl rounded-full pointer-events-none" />
      <div className="container relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-stretch">
          <div className="rounded-3xl bg-[#0F3A2D] p-7 sm:p-10 text-[#F5F1E7] shadow-xl space-y-7">
            <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Bienvenida al simulacro de prueba</div>
            <div className="space-y-4">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">Gracias por entrar antes de que todo esté terminado.</h2>
              <p className="text-white/75 text-base sm:text-lg leading-relaxed">Esta no es todavía la app final. Es un simulacro para probar con calma, señalar lo que no se entiende y decidir juntos qué debe mejorar. Lo que crece aquí no es una plataforma por encima de las personas: es Kureva con las personas.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-white/8 border border-white/10 p-4"><span className="font-mono text-[#D9FF2B] text-xs">01</span><strong className="block mt-2">Explora</strong><span className="block text-white/65 text-xs mt-1">Usa ejemplos ficticios.</span></div>
              <div className="rounded-xl bg-white/8 border border-white/10 p-4"><span className="font-mono text-[#D9FF2B] text-xs">02</span><strong className="block mt-2">Cuestiona</strong><span className="block text-white/65 text-xs mt-1">Di lo que no funciona.</span></div>
              <div className="rounded-xl bg-white/8 border border-white/10 p-4"><span className="font-mono text-[#D9FF2B] text-xs">03</span><strong className="block mt-2">Acompaña</strong><span className="block text-white/65 text-xs mt-1">Deja una sugerencia anónima.</span></div>
            </div>
            <a href="#demo" className="kureva-btn-accent w-fit text-sm">Empezar el simulacro <ArrowDown className="w-4 h-4" /></a>
          </div>

          <aside className="rounded-3xl border border-[#DCD4C4] bg-[#F5F1E7] p-7 sm:p-9 space-y-6">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center"><Accessibility className="w-5 h-5" /></div><div><h3 className="font-display text-xl font-bold text-[#0F3A2D]">Acceso fácil, siempre</h3><p className="text-xs text-[#5E806E] mt-0.5">Diseño en revisión continua con personas reales.</p></div></div>
            <p className="text-sm text-[#5E806E] leading-relaxed">Kureva nace de investigación, procesos de selección y escucha. Aun así, ninguna investigación reemplaza la experiencia de quien usa la pantalla cada día. Por eso tu mirada importa.</p>
            <div className="space-y-3">
              <div className="flex gap-3"><Eye className="w-4 h-4 mt-0.5 text-[#0F3A2D] shrink-0" /><p className="text-sm text-[#5E806E]"><strong className="text-[#173A2E]">Personas ciegas o con baja visión:</strong> contraste, estructura comprensible y compatibilidad progresiva con lectores de pantalla.</p></div>
              <div className="flex gap-3"><Ear className="w-4 h-4 mt-0.5 text-[#0F3A2D] shrink-0" /><p className="text-sm text-[#5E806E]"><strong className="text-[#173A2E]">Personas sordas o con discapacidad auditiva:</strong> la información importante no debe depender solo del sonido.</p></div>
              <div className="flex gap-3"><Keyboard className="w-4 h-4 mt-0.5 text-[#0F3A2D] shrink-0" /><p className="text-sm text-[#5E806E]"><strong className="text-[#173A2E]">Distintas formas de interactuar:</strong> uso por teclado, tamaño de lectura, atención y destreza son parte del diseño, no un añadido.</p></div>
            </div>
            <div className="rounded-xl bg-white border border-[#DCD4C4] p-4 text-xs text-[#5E806E] leading-relaxed"><ShieldCheck className="w-4 h-4 inline-block align-text-bottom text-[#0F3A2D] mr-1.5" /> Los bloques, notas y cambios del simulacro quedan solo en este navegador mientras lo estás usando. Solo se registra la sugerencia que tú decidas enviar.</div>
          </aside>
        </div>
      </div>
    </section>
  );
}

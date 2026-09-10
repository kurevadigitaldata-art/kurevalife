import React from "react";
import { Compass, HeartHandshake, Quote, Sprout, UsersRound } from "lucide-react";

export function FounderStory() {
  return (
    <section id="nathalia" className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[#DCD4C4]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-10 lg:gap-16 items-center">
          <div className="rounded-3xl bg-[#0F3A2D] text-[#F5F1E7] p-8 sm:p-10 shadow-xl relative overflow-hidden min-h-[390px] flex flex-col justify-between">
            <div className="absolute -right-18 -bottom-16 w-64 h-64 rounded-full bg-[#D9FF2B]/15 blur-3xl" />
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><Compass className="w-6 h-6" /></div>
              <div className="mt-8 text-[#D9FF2B] text-xs uppercase tracking-wider font-bold">Detrás de Kureva</div>
              <div className="font-display text-4xl sm:text-5xl font-bold text-white mt-2">Nathalia<br />Romero</div>
            </div>
            <div className="relative pt-8 border-t border-white/15 text-sm text-white/70 leading-relaxed">Una historia de ciclos reales: aprender, tropezar, volver a empezar y acompañar con más claridad.</div>
          </div>

          <div className="space-y-6">
            <span className="kureva-badge"><HeartHandshake className="w-3.5 h-3.5" /> Una marca con experiencia vivida</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D] leading-tight">Kureva no habla desde una torre. Habla desde el camino.</h2>
            <div className="space-y-4 text-[#5E806E] leading-relaxed">
              <p>Detrás de Kureva está <strong className="text-[#173A2E]">Nathalia Romero</strong>: visionaria y soñadora, pero sobre todo una persona que ha estudiado, se ha equivocado, ha emprendido, ha fracasado, ha sido empleada, líder y emprendedora de nuevo. No como una línea recta, sino como un ciclo continuo de aprendizaje.</p>
              <p>Viene de una familia de emprendedores y padres empresarios; ha recorrido marketing político, comercial, digital y tradicional, y ha vivido el negocio desde distintos lados. Kureva recoge esa experiencia personal y profesional para enseñar métodos que le han servido sin fingir que existe una receta idéntica para todas las personas.</p>
              <p><strong className="text-[#173A2E]">El principio es sencillo:</strong> cada emprendimiento, microempresa o negocio merece ser entendido con respeto, contexto y humanidad. La pantalla es una herramienta; la relación, la escucha y la autonomía son el trabajo de fondo.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl bg-[#F5F1E7] border border-[#DCD4C4] p-4"><Sprout className="w-4 h-4 text-[#0F3A2D] mb-2" /><strong className="block text-sm text-[#0F3A2D]">Dinamismo</strong><span className="text-xs text-[#5E806E]">Aprender y ajustar.</span></div>
              <div className="rounded-xl bg-[#F5F1E7] border border-[#DCD4C4] p-4"><UsersRound className="w-4 h-4 text-[#0F3A2D] mb-2" /><strong className="block text-sm text-[#0F3A2D]">Acompañamiento</strong><span className="text-xs text-[#5E806E]">Sin dejar a nadie atrás.</span></div>
              <div className="rounded-xl bg-[#F5F1E7] border border-[#DCD4C4] p-4"><Quote className="w-4 h-4 text-[#0F3A2D] mb-2" /><strong className="block text-sm text-[#0F3A2D]">Humanidad</strong><span className="text-xs text-[#5E806E]">Primero la persona.</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

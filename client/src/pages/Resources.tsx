import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { publicPath } from "@/lib/publicPath";
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  FileText,
  LockKeyhole,
  Search,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const resources = [
  {
    category: "Diagnóstico",
    icon: CheckSquare,
    title: "Checklist de autonomía digital",
    description: "Doce comprobaciones para saber si tu negocio puede continuar sin pedir permiso: cuentas, dominios, código, datos, copias y continuidad.",
    time: "5 min de lectura",
    label: "Guía de conversación",
  },
  {
    category: "Contratación",
    icon: LockKeyhole,
    title: "Plantilla de propiedad digital",
    description: "Cláusulas operativas y preguntas para contratar desarrollo, diseño o soporte sin perder el control de tus cuentas, archivos y salida.",
    time: "7 min de lectura",
    label: "Plantilla en preparación",
  },
  {
    category: "Decisión",
    icon: BookOpen,
    title: "Guía para elegir tecnología",
    description: "Siete preguntas y una matriz breve para decidir entre herramientas, integraciones o desarrollo propio sin comprar por una demo atractiva.",
    time: "6 min de lectura",
    label: "Guía en preparación",
  },
];

export default function Resources() {
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);

  const filteredResources = resources.filter((resource) =>
    `${resource.title} ${resource.description} ${resource.category}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleFutureResource = () => {
    setShowMore(true);
    toast.success("Te avisaremos cuando publiquemos la siguiente guía Kureva.");
  };

  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E]">
      <Navbar />
      <main id="contenido-principal" className="pt-28 md:pt-32">
        <section className="relative overflow-hidden border-b border-[#DCD4C4] bg-[#0F3A2D] text-[#F5F1E7]">
          <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "460px 460px", filter: "brightness(0) invert(1)" }} />
          <div className="container relative py-18 md:py-24">
            <div className="max-w-3xl space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D9FF2B] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Recursos abiertos de Kureva
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.04] text-white">
                Herramientas para depender menos y decidir mejor
              </h1>
              <p className="max-w-2xl text-lg text-white/75 leading-relaxed">
                Guías breves, directas e imprimibles para fundadores, microempresas y equipos. Sin formularios de captura, sin muros de pago y sin jerga innecesaria.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#D9FF2B] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#D9FF2B]" />
                Elaboradas desde San Miguel de Salinas, Alicante · abiertas para usar y compartir
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between mb-10">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#5E806E] mb-2">Biblioteca inicial</div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D]">Tres recursos para empezar hoy</h2>
            </div>
            <label className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5E806E]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por tema..."
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#DCD4C4] bg-[#FFFDF8] text-sm focus:outline-hidden focus:border-[#0F3A2D]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <article key={resource.title} className="flex flex-col rounded-2xl bg-[#FFFDF8] border border-[#DCD4C4] p-6 hover:border-[#0F3A2D] hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 flex items-center justify-center text-[#0F3A2D]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9FF2B] text-[#0F3A2D]">{resource.category}</span>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="text-xs font-semibold text-[#5E806E]">{resource.label} · {resource.time}</div>
                    <h3 className="font-display text-xl font-bold text-[#0F3A2D] leading-tight">{resource.title}</h3>
                    <p className="text-sm text-[#5E806E] leading-relaxed">{resource.description}</p>
                  </div>
                  <div className="mt-7 pt-5 border-t border-[#DCD4C4]/70">
                    <a href={publicPath("#contacto")} className="kureva-btn-secondary text-xs px-3 py-2.5">
                      Solicitar este recurso <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="rounded-2xl p-10 bg-[#FFFDF8] border border-dashed border-[#DCD4C4] text-center">
              <FileText className="w-8 h-8 mx-auto text-[#5E806E] mb-3" />
              <p className="text-sm text-[#5E806E]">No hay recursos que coincidan con esa búsqueda. Prueba “autonomía”, “contrato” o “tecnología”.</p>
            </div>
          )}
        </section>

        <section className="border-y border-[#DCD4C4] bg-[#FFFDF8] py-16 md:py-20">
          <div className="container grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="space-y-4">
              <span className="kureva-badge">Cómo usar estos recursos</span>
              <h2 className="font-display text-3xl font-bold text-[#0F3A2D]">Primero hazte las preguntas. Después contrata con criterio.</h2>
              <p className="text-[#5E806E] leading-relaxed max-w-xl">
                Estas guías no te convierten en especialista ni sustituyen una asesoría legal o de seguridad. Su función es más sencilla: permitirte conversar con proveedores desde una posición informada y mantener las decisiones importantes en tu empresa.
              </p>
              <a href={publicPath("calculadora")} className="inline-flex items-center gap-2 text-sm font-bold text-[#0F3A2D] hover:text-[#5E806E] transition-colors">
                Ver la calculadora de costes ocultos <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="rounded-3xl bg-[#F5F1E7] border border-[#DCD4C4] p-6 sm:p-8">
              <div className="font-mono text-xs uppercase tracking-wider text-[#5E806E] mb-4">Protocolo de uso en 20 minutos</div>
              <ol className="space-y-4">
                {[
                  "Elige la guía relacionada con la decisión que vas a tomar esta semana.",
                  "Compártela con la persona que aprueba el gasto o firma el contrato.",
                  "Marca lo que todavía no puedes responder de tu negocio.",
                  "Convierte esos huecos en requisitos para tu próximo proveedor.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-4 text-sm text-[#173A2E]">
                    <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0F3A2D] text-[#D9FF2B] font-display font-bold text-xs">{index + 1}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <div className="rounded-3xl bg-[#0F3A2D] p-8 md:p-12 text-[#F5F1E7] flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Próxima publicación</div>
              <h2 className="font-display text-3xl font-bold text-white">¿Qué guía necesitas para ganar autonomía?</h2>
              <p className="text-white/70 text-sm leading-relaxed">Estamos preparando recursos sobre costes de software, IA aplicada a pequeños negocios y traspaso de cuentas. Dinos qué bloqueo quieres resolver primero.</p>
            </div>
            <button onClick={handleFutureResource} className="kureva-btn-accent whitespace-nowrap text-sm">Proponer una guía</button>
          </div>
          {showMore && (
            <div className="mt-4 text-sm text-[#0F3A2D] text-center">Gracias. La siguiente guía partirá de necesidades reales, no de contenido de relleno.</div>
          )}
        </section>
      </main>
    </div>
  );
}

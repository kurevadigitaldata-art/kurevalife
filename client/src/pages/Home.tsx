import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DiagnosticModal } from "@/components/DiagnosticModal";
import { FounderStory } from "@/components/FounderStory";
import { publicPath } from "@/lib/publicPath";
import {
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  Workflow,
  CheckCircle,
  Laptop,
  BookOpen,
  Zap,
  Check,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"agencia" | "formacion" | "ecosistema">("agencia");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    toast.success("Mensaje recibido. Te contactaremos en menos de 24 horas con un enfoque claro.");
  };

  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E] flex flex-col selection:bg-[#D9FF2B] selection:text-[#0F3A2D]">
      <Navbar />
      <DiagnosticModal isOpen={isDiagnosticOpen} onClose={() => setIsDiagnosticOpen(false)} />
      <main id="contenido-principal">

      {/* =========================================================================
          HERO SECTION: High-impact typography, asymmetric grid, real brand tokens
         ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden border-b border-[#DCD4C4]/60">
        {/* Subtle background SVG pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')",
            backgroundSize: "480px 480px",
          }}
        />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Col: Hero copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0F3A2D]/8 border border-[#0F3A2D]/15 text-[#0F3A2D] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#D9FF2B] animate-pulse" />
                <span>Mentoría y estrategia para negocios reales</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0F3A2D] tracking-tight leading-[1.08]">
                El marketing digital no tiene <br />
                <span className="text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-wavy decoration-2">
                  una receta única.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#5E806E] max-w-2xl font-normal leading-relaxed">
                Ayudamos a emprendedores y microempresas a entender qué necesitan, qué deben pedir y en qué merece la pena invertir. <strong>Menos publicaciones vacías. Más estrategia, criterio y autonomía.</strong>
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="kureva-btn-primary"
                >
                  <span>Evaluar mi autonomía digital</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={publicPath("#metodo")}
                  className="kureva-btn-secondary"
                >
                  <span>Conocer cómo trabajamos</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-[#DCD4C4] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">1:1</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Mentoría adaptada a tu negocio</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">0</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Packs genéricos sin contexto</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">4</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Perspectivas de experiencia real</div>
                </div>
              </div>
            </div>

            {/* Right Col: Brand Mark System Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-[#0F3A2D] p-8 sm:p-10 shadow-2xl text-[#F5F1E7] overflow-hidden border border-[#164D3C]">
                {/* Decorative cut */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#D9FF2B]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D9FF2B]" />
                    <span className="text-xs font-mono tracking-widest uppercase opacity-75">KUREVA · DESDE EL CAMINO</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90">ESTRATEGIA REAL</span>
                </div>

                {/* Big Master K Icon */}
                <div className="my-6 flex items-center justify-center py-6">
                  <div className="w-48 h-48 rounded-2xl bg-[#09241B] flex items-center justify-center p-6 border border-white/10 shadow-inner group transition-transform duration-300 hover:scale-105 relative overflow-hidden">
                    <div className="w-36 h-36 flex items-center justify-center">
                      <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-md kureva-k-rotate" fill="none" stroke="#F5F1E7" strokeWidth="86" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M236 628V252C236 118 414 118 414 252V372" />
                        <path d="M414 372L634 164" />
                        <path d="M414 372L634 606" />
                        <path d="M300 491L404 383" stroke="#D9FF2B" strokeWidth="26" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#09241B]/80 rounded-2xl p-4 border border-white/5 text-xs">
                  <div className="flex justify-between items-center text-white/60">
                    <span>Para:</span>
                    <strong className="text-white font-medium">Emprendedores y microempresas</strong>
                  </div>
                  <div className="flex justify-between items-center text-white/60">
                    <span>Partimos de:</span>
                    <strong className="text-[#D9FF2B] font-medium">Escucha y contexto</strong>
                  </div>
                  <div className="flex justify-between items-center text-white/60">
                    <span>Buscamos:</span>
                    <strong className="text-white font-medium">Decisiones con criterio</strong>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#D9FF2B]" />
                    Tu negocio antes que una plantilla
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#D9FF2B]" />
                    Acompañamiento sin humo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MANIFESTO SECTION: What Kureva stands for (Anti-dependency)
         ========================================================================= */}
      <section id="manifiesto" className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[#DCD4C4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="kureva-badge">El Manifiesto desde el Camino</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              Marketing real para negocios reales
            </h2>
            <p className="text-[#5E806E] text-base sm:text-lg">
              Kureva nace de haber estado en los cuatro lados del escritorio: como emprendedora, empleada, cliente y especialista. No vendemos una receta idéntica para todos; ayudamos a entender cada negocio antes de proponer una herramienta o una campaña.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                01
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Estrategia antes que cámara
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                Tu marca no necesita hacer ruido para tener valor. Necesita escucha, contexto y una estrategia que sepa qué objetivo comercial debe sostener cada acción.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                02
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Especialistas, no un todólogo
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                Crear contenido, diseñar, programar, vender y pautar son trabajos distintos. Te ayudamos a elegir y coordinar a las personas adecuadas, sin pedirle a una sola figura que haga todo.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                03
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Autonomía para quien decide
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                No buscamos que dependas de Kureva para siempre. Queremos que comprendas lo que pagas, sepas qué exigir y puedas tomar decisiones sin que nadie te venda espejitos de colores.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-[#0F3A2D] text-[#F5F1E7] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-bold shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm md:text-base font-medium">
                ¿Sientes que inviertes en marketing sin saber qué te está dando resultado? Empezamos escuchando tu negocio y aclarando la siguiente decisión.
              </p>
            </div>
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="kureva-btn-accent text-xs whitespace-nowrap"
            >
              Solicitar sesión de diagnóstico
            </button>
          </div>
        </div>
      </section>

      <FounderStory />

      {/* =========================================================================
          SERVICES SECTION: Kureva Digital offerings
         ========================================================================= */}
      <section id="servicios" className="py-20 md:py-28 border-b border-[#DCD4C4]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="kureva-badge">Acompañamiento con criterio</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
                Lo que tu negocio necesita, no lo que vende un paquete
              </h2>
            </div>
            <p className="text-[#5E806E] max-w-md text-sm">
              Mentoría, asesoría y decisiones digitales explicadas en lenguaje claro para emprendedores y microempresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#DCD4C4] space-y-5 flex flex-col justify-between hover:border-[#0F3A2D] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 text-[#0F3A2D] flex items-center justify-center">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                  Elegir la herramienta adecuada
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Antes de invertir, aclaramos si necesitas una landing para una acción, una web institucional para dar credibilidad o una app para una operación recurrente.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Landing: validar o convertir una acción concreta
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Web: explicar, posicionar y dar confianza
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    App: resolver un proceso que se usa a menudo
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Resultado: una decisión que entiendes antes de contratar</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#DCD4C4] space-y-5 flex flex-col justify-between hover:border-[#0F3A2D] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 text-[#0F3A2D] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                  Mentoría estratégica 1 a 1
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Sesiones para traducir tus objetivos a prioridades reales: qué comunicar, qué medir, qué delegar y cuándo no necesitas gastar más.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Lectura crítica de presupuestos y propuestas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Criterio para contratar y pedir resultados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Plan de acción adaptado a tu rubro
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Para: personas que necesitan claridad antes de ejecutar</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#DCD4C4] space-y-5 flex flex-col justify-between hover:border-[#0F3A2D] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 text-[#0F3A2D] flex items-center justify-center">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                  Asesoría estratégica de negocio
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Revisamos lo que está ocurriendo hoy en tu comunicación, tus procesos o tu equipo para encontrar la decisión que más puede mover el negocio.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Análisis de rubro, cliente y momento de negocio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Revisión de procesos y prioridades comerciales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Orientación para coordinar especialistas
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Sin plantillas: cada propuesta parte de tu contexto</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          METHODOLOGY SECTION: The 4-step progressive handover
         ========================================================================= */}
      <section id="metodo" className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[#DCD4C4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="kureva-badge">El Método Kureva</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              De la duda a una decisión clara en 4 etapas
            </h2>
            <p className="text-[#5E806E] text-base">
              Un proceso simple para convertir una preocupación concreta en una prioridad realista para tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Escucha y diagnóstico",
                desc: "Entendemos el momento de tu negocio, el problema que quieres resolver y lo que ya has probado.",
              },
              {
                step: "02",
                title: "Prioridades y estrategia",
                desc: "Ordenamos objetivos, público, mensajes y herramientas para no gastar energía donde no toca.",
              },
              {
                step: "03",
                title: "Plan de acción",
                desc: "Traducimos la estrategia a próximos pasos, responsables y preguntas que debes llevar a tu equipo o proveedores.",
              },
              {
                step: "04",
                title: "Acompañamiento con autonomía",
                desc: "Te acompañamos a ejecutar, medir y ajustar sin crear dependencia ni esconder la información importante.",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] relative group hover:border-[#0F3A2D] transition-colors"
              >
                <div className="font-mono text-xs font-bold text-[#5E806E] mb-3">
                  FASE {item.step}
                </div>
                <h4 className="font-display font-bold text-lg text-[#0F3A2D] mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-[#5E806E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          KUREVALIFE SECTION: The future product ecosystem (Clear distinction)
         ========================================================================= */}
      <section id="kurevalife" className="py-20 md:py-28 border-b border-[#DCD4C4] bg-[#F5F1E7]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F3A2D] text-[#D9FF2B] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>También creamos herramientas propias</span>
              </div>

              <div className="space-y-2">
                <div className="mb-2 flex items-center gap-3 text-[#0F3A2D]">
                  <img
                    src={`${import.meta.env.BASE_URL}kurevalife-profile-mark.png`}
                    alt=""
                    aria-hidden="true"
                    className="size-12 rounded-xl object-cover kureva-k-rotate"
                  />
                  <span className="grid leading-none">
                    <strong className="font-display text-2xl tracking-[-0.04em]">KurevaLife</strong>
                    <small className="mt-1 text-[0.625rem] font-extrabold tracking-[0.12em] text-[#5E806E]">BY KUREVA</small>
                  </span>
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#5E806E]">
                  ORGANIZACIÓN PERSONAL · BETA DE PRUEBA
                </p>
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D] leading-tight">
                KurevaLife: organización y bienestar personal sin clichés clínicos
              </h2>

              <p className="text-base text-[#5E806E] leading-relaxed">
                KurevaLife es el primer producto digital propio del ecosistema Kureva. Nace bajo la misma filosofía: <strong>ayudar a ordenar el día a día, la agenda y las consultas personales sin adoptar un lenguaje médico ni promesas terapéuticas vacías.</strong>
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-[#173A2E]">
                    <strong>Identidad unificada:</strong> Comparte la K fluida, la paleta bosque-crema y los principios de accesibilidad universal de Kureva.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-[#173A2E]">
                    <strong>Privacidad extrema:</strong> Tus datos de organización quedan en tu dispositivo con almacenamiento local primero (Local-First).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-sm text-[#173A2E]">
                    <strong>Cero parafernalia médica:</strong> Sin cruces, sin hojas, sin diagnósticos falsos. Una herramienta práctica de gestión.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href={publicPath("vida")}
                  className="kureva-btn-primary text-xs"
                >
                  <span>Conocer la beta de KurevaLife</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right preview: official KurevaLife landing artwork, not an app screen specification. */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#FFFDF8] p-4 sm:p-6 border border-[#DCD4C4] shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCD4C4]/60 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <img src={`${import.meta.env.BASE_URL}kurevalife-profile-mark.png`} alt="" aria-hidden="true" className="size-6 rounded-md object-cover kureva-k-rotate" loading="lazy" />
                    <span className="font-semibold text-[#0F3A2D]">Portada oficial KurevaLife</span>
                  </div>
                  <span className="text-[#5E806E]">Sistema K Fluida</span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#DCD4C4]">
                  <img
                    src={`${import.meta.env.BASE_URL}kurevalife-youtube-cover.svg`}
                    alt="Portada oficial de KurevaLife"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[#5E806E] px-1">
                  <span>Identidad KurevaLife propia</span>
                  <span className="font-mono text-[#0F3A2D]">NO ES PANTALLA OPERATIVA</span>
                </div>
                <p className="mt-3 px-1 text-xs leading-relaxed text-[#5E806E]">La beta conserva su navegación mobile-first y sus cuatro destinos aprobados; esta portada comunica la marca sin sustituir las pantallas funcionales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          FAQ SECTION: Answering common hesitations
         ========================================================================= */}
      <section className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[#DCD4C4]">
        <div className="container max-w-4xl">
          <div className="text-center space-y-4 mb-16">
            <span className="kureva-badge">Preguntas Claras</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              Todo lo que necesitas saber antes de trabajar juntos
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "¿Me vas a hacer los flyers o las publicaciones de Instagram?",
                a: "No trabajamos desde un paquete automático de publicaciones. Empezamos por la estrategia que necesita tu negocio y, si hay que producir contenido o coordinar a un equipo, te ayudamos a saber qué pedir y a quién delegarlo.",
              },
              {
                q: "¿Cómo sé si necesito una landing, una web o una app?",
                a: "Una landing concentra una acción; una web explica tu negocio y construye confianza; una app sirve cuando existe un proceso recurrente que las personas necesitan usar. Lo decidimos a partir de tu objetivo, no por la herramienta más cara.",
              },
              {
                q: "¿Necesito saber de marketing o tecnología para empezar?",
                a: "No. La mentoría está pensada para quienes conocen su negocio pero necesitan ordenar prioridades, comprender presupuestos y tomar decisiones sin sentirse fuera de lugar por la jerga técnica o comercial.",
              },
              {
                q: "¿Por qué dos profesionales pueden cobrar importes tan distintos?",
                a: "Porque no es lo mismo ejecutar una tarea que investigar, decidir y sostener una estrategia. Te enseñamos a valorar el tiempo, el alcance y el resultado esperado para comparar propuestas con criterio, no solo por el número de entregables.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-2"
              >
                <h4 className="font-display font-bold text-lg text-[#0F3A2D] flex items-center justify-between">
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT / CONVERSION SECTION
         ========================================================================= */}
      <section id="contacto" className="py-20 md:py-28 bg-[#0F3A2D] text-[#F5F1E7] relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9FF2B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D9FF2B] text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Primer contacto sin compromiso</span>
              </span>

              <h2 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight">
                Hablemos de tu autonomía digital
              </h2>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                Cuéntanos en qué punto está tu negocio o idea. Te responderemos con un diagnóstico sincero y un plan de acción concreto, no con una propuesta comercial de 40 páginas.
              </p>

              <div className="space-y-4 pt-2 text-sm text-white/70">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D9FF2B]/20 text-[#D9FF2B] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Respuesta garantizada en menos de 24 horas laborables</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D9FF2B]/20 text-[#D9FF2B] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Acuerdo de confidencialidad estándar incluido</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D9FF2B]/20 text-[#D9FF2B] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Reunión de 30 min por videollamada para alinear prioridades</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-6">
              <div className="bg-[#FFFDF8] rounded-3xl p-8 sm:p-10 text-[#173A2E] shadow-2xl border border-white/20">
                {!contactSubmitted ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <h3 className="font-display font-bold text-2xl text-[#0F3A2D] mb-1">
                      Inicia tu proyecto
                    </h3>
                    <p className="text-xs text-[#5E806E] mb-4">
                      Completa los datos y te propondremos un primer enfoque práctico.
                    </p>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                        Nombre o empresa
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ana Martínez"
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ana@empresa.es"
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                        ¿Qué necesitas resolver principalmente?
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]">
                        <option value="web">Desarrollar una web / app autónoma</option>
                        <option value="mentoria">Mentoría para entender mi tecnología</option>
                        <option value="kurevalife">Interés en el ecosistema KurevaLife</option>
                        <option value="auditoria">Auditoría de activos y costes técnicos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                        Breve descripción de tu situación
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tenemos una web que nos cuesta mucho mantener y queremos pasar a un sistema propio..."
                        className="w-full px-4 py-3 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full kureva-btn-primary py-3.5 mt-2 justify-center"
                    >
                      <span>Enviar mensaje a Kureva</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-display font-bold text-2xl text-[#0F3A2D]">
                      Mensaje enviado con éxito
                    </h4>
                    <p className="text-sm text-[#5E806E] max-w-sm mx-auto">
                      Hemos recibido tu información. Un consultor sénior de Kureva te escribirá antes de finalizar la jornada.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="kureva-btn-secondary text-xs mt-4"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      </main>

      <footer className="bg-[#09241B] text-[#F5F1E7]/70 py-16 text-xs border-t border-white/10">
        <div className="container space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F3A2D] flex items-center justify-center border border-white/10">
                  <img
                    src={publicPath("kureva-app-icon.svg")}
                    alt="Isotipo Kureva"
                    className="w-5 h-5 kureva-k-rotate"
                  />
                </div>
                <span className="font-display font-bold text-xl text-white">Kureva</span>
              </div>
              <p className="text-[#8CA999] text-xs leading-relaxed">
                Agencia y escuela de autonomía digital. Impulsamos la soberanía tecnológica de empresas y creadores.
              </p>
              <div className="text-[11px] font-mono text-[#D9FF2B]">
                Estrategia, mentoría y autonomía digital
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Ecosistema Kureva
              </h5>
              <ul className="space-y-2">
                <li><a href={publicPath("#servicios")} className="hover:text-white transition-colors">Servicios Kureva</a></li>
                <li><a href={publicPath("#servicios")} className="hover:text-white transition-colors">KurevaMentoría</a></li>
                <li><a href={publicPath("vida")} className="hover:text-[#D9FF2B] transition-colors">KurevaLife (Beta)</a></li>
                <li><a href={publicPath("calculadora")} className="hover:text-white transition-colors">Calculadora de costes</a></li>
                <li><a href={publicPath("recursos")} className="hover:text-white transition-colors">Recursos abiertos</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Criterio &amp; Legal
              </h5>
              <ul className="space-y-2">
                <li><a href={publicPath("#manifiesto")} className="hover:text-white transition-colors">Manifiesto desde el Camino</a></li>
                <li><span className="opacity-75">No es una entidad sanitaria</span></li>
                <li><span className="opacity-75">Privacidad por diseño (GDPR)</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Contacto
              </h5>
              <p className="text-xs text-[#8CA999] mb-3 leading-relaxed">
                ¿Prefieres conversar directamente?
              </p>
              <a
                href="mailto:hola@kureva.es"
                className="inline-block text-white font-semibold hover:text-[#D9FF2B] transition-colors text-sm"
              >
                hola@kureva.es
              </a>
              <div className="mt-4">
                <button
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition-colors"
                >
                  Test de Autonomía
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8CA999]">
            <div>
              © 2026 Kureva. Todos los derechos reservados. Sistema visual registrado K Fluida.
            </div>
            <div className="flex items-center gap-6">
              <span>Marketing real para negocios reales</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

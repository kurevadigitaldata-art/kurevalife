import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DiagnosticModal } from "@/components/DiagnosticModal";
import {
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Cpu,
  Compass,
  Code2,
  Lock,
  Workflow,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Laptop,
  BookOpen,
  Shirt,
  ShoppingBag,
  Package,
  Terminal,
  Download,
  Zap,
  Check,
  Send,
  Users
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
                <span>Agencia y escuela de autonomía digital</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0F3A2D] tracking-tight leading-[1.08]">
                Lo digital, <br />
                <span className="text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-wavy decoration-2">
                  en tus manos.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#5E806E] max-w-2xl font-normal leading-relaxed">
                Ayudamos a emprendedores, fundadores y equipos a comprender, construir y sostener sus propios sistemas digitales. <strong>Sin cajas negras. Sin rehenes técnicos. Con autonomía real.</strong>
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
                  href="#metodo"
                  className="kureva-btn-secondary"
                >
                  <span>Ver nuestro método</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-[#DCD4C4] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">100%</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Código y cuentas de tu propiedad</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">0</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Dependencias sanitarias o clínicas</div>
                </div>
                <div>
                  <div className="font-display font-bold text-2xl text-[#0F3A2D]">3x</div>
                  <div className="text-xs text-[#5E806E] font-medium leading-tight">Mayor velocidad de iteración propia</div>
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
                    <span className="text-xs font-mono tracking-widest uppercase opacity-75">SISTEMA K FLUIDA</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90">v1.0 ACTIVA</span>
                </div>

                {/* Big Master K Icon */}
                <div className="my-6 flex items-center justify-center py-6">
                  <div className="w-48 h-48 rounded-2xl bg-[#09241B] flex items-center justify-center p-6 border border-white/10 shadow-inner group transition-transform duration-300 hover:scale-105 relative overflow-hidden">
                    <div className="w-36 h-36 flex items-center justify-center">
                      <svg viewBox="0 0 800 800" className="w-full h-full drop-shadow-md" fill="none" stroke="#F5F1E7" strokeWidth="86" strokeLinecap="round" strokeLinejoin="round">
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
                    <span>Marca matriz:</span>
                    <strong className="text-white font-medium">Kureva España</strong>
                  </div>
                  <div className="flex justify-between items-center text-white/60">
                    <span>Ecosistema futuro:</span>
                    <strong className="text-[#D9FF2B] font-medium">KurevaLife (Digital App)</strong>
                  </div>
                  <div className="flex justify-between items-center text-white/60">
                    <span>Arquitectura de valor:</span>
                    <strong className="text-white font-medium">Autonomía &amp; Mentoría</strong>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#D9FF2B]" />
                    Verde bosque dominante
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#D9FF2B]" />
                    Sin fondo negro
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
            <span className="kureva-badge">El Manifiesto de Autonomía</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              La tecnología debe liberarte, no atarte a un contrato eterno
            </h2>
            <p className="text-[#5E806E] text-base sm:text-lg">
              Durante años, las agencias tradicionales han construido muros de complejidad para mantener a sus clientes cautivos. Kureva nació para demoler ese modelo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                01
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Propiedad desde el minuto uno
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                Tus repositorios de código, tus cuentas de DNS, tus bases de datos y tus claves API pertenecen a tu empresa. Si mañana decides prescindir de nosotros, tu negocio no se detiene ni un segundo.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                02
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Aprender mientras se construye
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                No te entregamos un entregable ciego. Cada solución incluye sesiones de transferencia técnica donde te enseñamos a ti y a tu equipo a modificar, iterar y gobernar la herramienta creada.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display font-bold text-lg">
                03
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                Arquitectura limpia y abierta
              </h3>
              <p className="text-sm text-[#5E806E] leading-relaxed">
                Usamos estándares modernos, código documentado y servicios desacoplados. Nada de frameworks propietarios oscuros que solo un gurú pueda reparar.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-[#0F3A2D] text-[#F5F1E7] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-bold shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-sm md:text-base font-medium">
                ¿Tienes dudas sobre si actualmente eres dueño de tus activos digitales? Realizamos una auditoría técnica en 48 horas.
              </p>
            </div>
            <button
              onClick={() => setIsDiagnosticOpen(true)}
              className="kureva-btn-accent text-xs whitespace-nowrap"
            >
              Solicitar revisión de activos
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SERVICES SECTION: Kureva Digital offerings
         ========================================================================= */}
      <section id="servicios" className="py-20 md:py-28 border-b border-[#DCD4C4]">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="kureva-badge">Servicios y Transferencia</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
                Lo que hacemos y lo que te enseñamos a sostener
              </h2>
            </div>
            <p className="text-[#5E806E] max-w-md text-sm">
              Modelos de trabajo flexibles: desde la conceptualización integral hasta mentorías individuales para líderes técnicos no programadores.
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
                  Desarrollo de Aplicaciones &amp; Web
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Creamos landing pages de alta conversión, plataformas web progresivas (PWA) y portales de clientes rápidos, accesibles y listos para producción.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    React, Next.js, Vite &amp; Tailwind
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Despliegue sin costes ocultos en Cloudflare / Vercel
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Accesibilidad WCAG AA verificada
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Entregable: Código abierto + Guía de despliegue</span>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#DCD4C4] space-y-5 flex flex-col justify-between hover:border-[#0F3A2D] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 text-[#0F3A2D] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                  KurevaMentoría: Sesiones de Autonomía
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Acompañamiento 1 a 1 para fundadores y emprendedores. Te enseñamos a auditar a proveedores, tomar decisiones técnicas y usar IA con criterio propio.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Auditoría de presupuestos ajenos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Entrenamiento en herramientas no-code/low-code
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Documentación de procesos internos
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Modalidad: 4 sesiones intensivas + soporte</span>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-[#FFFDF8] rounded-2xl p-8 border border-[#DCD4C4] space-y-5 flex flex-col justify-between hover:border-[#0F3A2D] transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3A2D]/10 text-[#0F3A2D] flex items-center justify-center">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#0F3A2D]">
                  Diseño de Sistemas &amp; Identidad
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Construcción de sistemas de diseño coherentes, manuales imprimibles, tokens de marca y kits de merchandising aplicados con rigor técnico.
                </p>
                <ul className="text-xs space-y-2 text-[#173A2E] pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Tokens listos para código (JSON/CSS)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Manual vectorial de identidad en PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-[#0F3A2D]" />
                    Directrices de merchandising ético
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#DCD4C4]/60">
                <span className="text-xs font-semibold text-[#0F3A2D]">Entregable: Manual + Archivos SVG maestros</span>
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
              De la necesidad al control absoluto en 4 etapas
            </h2>
            <p className="text-[#5E806E] text-base">
              Un proceso estructurado para que cada línea de código y cada decisión de diseño quede plenamente asimilada por tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Diagnóstico & Arquitectura",
                desc: "Revisamos tus herramientas actuales, eliminamos redundancias de costes y diseñamos la estructura más ligera posible.",
              },
              {
                step: "02",
                title: "Construcción Transparente",
                desc: "Desarrollamos con repositorios abiertos a tu vista, con código limpio y sin librerías cautivas.",
              },
              {
                step: "03",
                title: "Acompañamiento Práctico",
                desc: "Te mostramos cómo opera cada componente mediante grabaciones cortas y sesiones de trabajo en vivo.",
              },
              {
                step: "04",
                title: "Traspaso & Autonomía",
                desc: "Recibes credenciales maestras, documentación y la certeza de que no necesitas depender de nosotros para seguir creciendo.",
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
                <span>Producto en fase de incubación</span>
              </div>

              <div className="space-y-2">
                <div className="w-48 h-auto mb-2">
                  <img
                    src="/manus-storage/kurevalife-lockup_f908d233.svg"
                    alt="KurevaLife by Kureva"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#5E806E]">
                  SUBMARCA DIGITAL · SISTEMA MAESTRO K FLUIDA
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
                  href="#contacto"
                  className="kureva-btn-primary text-xs"
                >
                  <span>Unirme a la lista de espera de KurevaLife</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right preview: UI Direction preview */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[#FFFDF8] p-4 sm:p-6 border border-[#DCD4C4] shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCD4C4]/60 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F3A2D]" />
                    <span className="font-semibold text-[#0F3A2D]">KurevaLife UI Preview</span>
                  </div>
                  <span className="text-[#5E806E]">Arquitectura accesible</span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-[#DCD4C4]">
                  <img
                    src="/manus-storage/kureva-ui-direction_89c54ed0.png"
                    alt="Dirección de interfaz KurevaLife"
                    className="w-full h-auto object-cover hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-[#5E806E] px-1">
                  <span>Paneles de gestión por bloques</span>
                  <span className="font-mono text-[#0F3A2D]">WCAG AA Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BRAND IDENTITY & MANUAL SECTION (Document download and system info)
         ========================================================================= */}
      <section id="identidad" className="py-20 md:py-28 bg-[#FFFDF8] border-b border-[#DCD4C4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="kureva-badge">Sistema Maestro de Marca</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              La K Fluida: geometría, color y directrices oficiales
            </h2>
            <p className="text-[#5E806E] text-base">
              Todo el sistema gráfico de Kureva ha sido condensado en un manual imprimible de 22 páginas para asegurar coherencia en cualquier soporte físico o digital.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            <div className="lg:col-span-7">
              <div className="rounded-3xl overflow-hidden border border-[#DCD4C4] shadow-lg">
                <img
                  src="/manus-storage/kureva-k-fluida-brand-system_743efa9d.png"
                  alt="Sistema de Identidad K Fluida"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <h3 className="font-display font-bold text-2xl text-[#0F3A2D]">
                  Manual de Identidad Oficial (v1.0)
                </h3>
                <p className="text-sm text-[#5E806E] leading-relaxed">
                  Documento técnico e imprimible que define proporciones, área de protección, paleta cromática de alta fidelidad, normas de rotulación y casos de uso prohibidos.
                </p>
              </div>

              {/* Palette tokens quick view */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-[#0F3A2D]">Paleta oficial:</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="p-2.5 rounded-xl bg-[#0F3A2D] text-[#F5F1E7]">
                    <strong>#0F3A2D</strong>
                    <div className="text-[9px] opacity-80">Bosque</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F5F1E7] text-[#0F3A2D] border border-[#DCD4C4]">
                    <strong>#F5F1E7</strong>
                    <div className="text-[9px] text-[#5E806E]">Crema</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#5E806E] text-[#F5F1E7]">
                    <strong>#5E806E</strong>
                    <div className="text-[9px] opacity-80">Musgo</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#D9FF2B] text-[#0F3A2D]">
                    <strong>#D9FF2B</strong>
                    <div className="text-[9px] font-bold">Lima</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#DCD4C4] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#0F3A2D]">
                  <span>Especificaciones técnicas</span>
                  <span>22 páginas · PDF/X</span>
                </div>
                <p className="text-[#5E806E]">
                  Tipografía: Noto Sans / Space Grotesk. Sin fondo negro. Aprobado para impresión offset y serigrafía.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="/manus-storage/kureva-k-fluida-brand-system_743efa9d.png"
                  target="_blank"
                  rel="noreferrer"
                  className="kureva-btn-primary text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Ver Lámina del Sistema</span>
                </a>
                <a
                  href="/manus-storage/kureva-isotipo_24d6eb8a.svg"
                  target="_blank"
                  rel="noreferrer"
                  className="kureva-btn-secondary text-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Descargar Isotipo SVG</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MERCHANDISING SHOWCASE: Realistic mockups with ethical narrative
         ========================================================================= */}
      <section id="merchandising" className="py-20 md:py-28 border-b border-[#DCD4C4]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="kureva-badge">Colección de Presencia</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0F3A2D]">
              Merchandising tangible para talleres y equipo
            </h2>
            <p className="text-[#5E806E] text-base">
              Objetos sobrios y duraderos. La camiseta verde bosque marca el eje cromático de la colección, sin logos saturados ni estampas desechables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Item 1: T-Shirt */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#DCD4C4] group hover:border-[#0F3A2D] transition-all">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F0] aspect-4/5 mb-4">
                <img
                  src="/manus-storage/kureva-tshirt_ae2f5beb.png"
                  alt="Camiseta verde bosque Kureva"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-display font-bold text-base text-[#0F3A2D]">
                Camiseta Bosque Kureva
              </h4>
              <p className="text-xs text-[#5E806E] mt-1">
                Algodón peinado 240g, serigrafía crema a 2 tintas con toque lima en pecho.
              </p>
            </div>

            {/* Item 2: Tote */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#DCD4C4] group hover:border-[#0F3A2D] transition-all">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F0] aspect-4/5 mb-4">
                <img
                  src="/manus-storage/kureva-tote_bc7bcbb6.png"
                  alt="Tote bag cruda Kureva"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-display font-bold text-base text-[#0F3A2D]">
                Tote Bag Algodón Crudo
              </h4>
              <p className="text-xs text-[#5E806E] mt-1">
                Lona 320g, K fluida frontal en bosque y acento lima. Asas reforzadas.
              </p>
            </div>

            {/* Item 3: Notebook */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#DCD4C4] group hover:border-[#0F3A2D] transition-all">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F0] aspect-4/5 mb-4">
                <img
                  src="/manus-storage/kureva-notebook_88463de6.png"
                  alt="Libreta de trabajo A5 Kureva"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-display font-bold text-base text-[#0F3A2D]">
                Libreta de Trabajo A5
              </h4>
              <p className="text-xs text-[#5E806E] mt-1">
                Cubierta rígida bosque mate, bajo relieve crema y elástico en crema natural.
              </p>
            </div>

            {/* Item 4: Sleeve */}
            <div className="bg-[#FFFDF8] rounded-2xl p-4 border border-[#DCD4C4] group hover:border-[#0F3A2D] transition-all">
              <div className="rounded-xl overflow-hidden bg-[#FAF7F0] aspect-4/5 mb-4">
                <img
                  src="/manus-storage/kureva-laptop-sleeve_50416f9d.png"
                  alt="Funda de portátil Kureva"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-display font-bold text-base text-[#0F3A2D]">
                Funda Laptop en Fieltro
              </h4>
              <p className="text-xs text-[#5E806E] mt-1">
                Fieltro reciclado crema con ribete verde bosque y bordado de alta definición.
              </p>
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
                q: "¿Qué significa exactamente que 'lo digital queda en mis manos'?",
                a: "Significa que todas las cuentas principales (hosting, dominios, repositorios de código, accesos a Stripe o CRM) se abren a nombre de tu sociedad desde el primer día. Nosotros trabajamos como colaboradores técnicos invitados. Si decides continuar con otro equipo o gestionarlo internamente, no tienes que pedirnos permiso ni pagar tarifas de liberación.",
              },
              {
                q: "¿Por qué Kureva no es una marca médica ni de salud?",
                a: "Porque creemos en la honestidad radical. Nuestra especialidad es la ingeniería de software, la accesibilidad y la pedagogía digital para emprendedores. KurevaLife será una herramienta de organización personal y citas, pero no emite diagnósticos, no receta medicamentos ni reemplaza a profesionales sanitarios colegiados.",
              },
              {
                q: "¿Necesito conocimientos técnicos para aprovechar las mentorías?",
                a: "No. De hecho, el programa está diseñado especialmente para fundadores no técnicos que se sienten abrumados por la jerga de los programadores. Te enseñamos a entender qué te están cobrando, cómo evaluar tiempos y cómo gobernar tus herramientas sin sentirte perdido.",
              },
              {
                q: "¿Qué costes recurrentes tendré al terminar un proyecto web?",
                a: "Optimizamos para el coste mínimo viable. Por ejemplo, utilizando arquitecturas estáticas en Cloudflare Pages o Vercel y bases de datos modernas, la mayoría de microempresas pagan entre 0 € y 20 € al mes en infraestructura, en lugar de cuotas abusivas de mantenimiento.",
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
      <footer className="bg-[#09241B] text-[#F5F1E7]/70 py-16 text-xs border-t border-white/10">
        <div className="container space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F3A2D] flex items-center justify-center border border-white/10">
                  <img
                    src="/manus-storage/kureva-isotipo_24d6eb8a.svg"
                    alt="Isotipo Kureva"
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-display font-bold text-xl text-white">Kureva</span>
              </div>
              <p className="text-[#8CA999] text-xs leading-relaxed">
                Agencia y escuela de autonomía digital. Impulsamos la soberanía tecnológica de empresas y creadores.
              </p>
              <div className="text-[11px] font-mono text-[#D9FF2B]">
                Sistema K Fluida · Madrid, España
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Ecosistema Kureva
              </h5>
              <ul className="space-y-2">
                <li><a href="#servicios" className="hover:text-white transition-colors">Kureva Digital</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">KurevaMentoría</a></li>
                <li><a href="#kurevalife" className="hover:text-[#D9FF2B] transition-colors">KurevaLife (App)</a></li>
                <li><a href="#identidad" className="hover:text-white transition-colors">Manual de Marca</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Criterio &amp; Legal
              </h5>
              <ul className="space-y-2">
                <li><a href="#manifiesto" className="hover:text-white transition-colors">Manifiesto de Autonomía</a></li>
                <li><span className="opacity-75">No es una entidad sanitaria</span></li>
                <li><span className="opacity-75">Privacidad por diseño (GDPR)</span></li>
                <li><span className="opacity-75">Código bajo licencia del cliente</span></li>
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
              <span>Paleta: Bosque #0F3A2D · Crema #F5F1E7 · Lima #D9FF2B</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from "react";
import { Navbar } from "@/components/Navbar";
import { KurevaLifeDemo } from "@/components/KurevaLifeDemo";
import { PilotInterestForm } from "@/components/PilotInterestForm";
import { PilotWelcome } from "@/components/PilotWelcome";
import {
  ArrowRight,
  BellRing,
  Check,
  ChevronRight,
  Clock3,
  CloudOff,
  Download,
  Eye,
  FileClock,
  HeartHandshake,
  KeyRound,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function KurevaLife() {
  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E] selection:bg-[#D9FF2B] selection:text-[#0F3A2D]">
      <Navbar />
      <main id="contenido-principal" className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0F3A2D] text-[#F5F1E7] border-b border-[#164D3C]">
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "520px 520px", filter: "brightness(0) invert(1)" }} />
          <div className="container relative z-10 py-16 md:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D9FF2B] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Simulacro de prueba · antes de la beta cerrada
                </div>

                <div className="w-62 max-w-full">
                  <img src="/manus-storage/kurevalife-lockup_f908d233.svg" alt="KurevaLife by Kureva" className="w-full h-auto brightness-0 invert" />
                </div>

                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.04] text-white max-w-2xl">
                  Tu vida en orden. <span className="text-[#D9FF2B]">Tus decisiones cerca.</span>
                </h1>
                <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl">
                  KurevaLife quiere reunir tus citas, preguntas, recordatorios y documentos en un espacio sencillo para que no tengas que recordarlo todo de memoria. Antes de crear la app definitiva, este simulacro escucha a personas reales con ejemplos ficticios y sin crear una cuenta.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="#demo" className="kureva-btn-accent text-sm">
                    Entrar al simulacro <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                    Conocer el proceso
                  </a>
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#D9FF2B] border border-[#D9FF2B]/35 hover:bg-white/10 transition-colors">
                    Probar la vista diaria
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3 text-xs text-white/70">
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D9FF2B]" /> Sin cuenta ni datos reales durante la prueba</span>
                  <span className="inline-flex items-center gap-2"><Eye className="w-4 h-4 text-[#D9FF2B]" /> Diseño accesible</span>
                  <span className="inline-flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-[#D9FF2B]" /> Tu sugerencia mejora el camino</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-[#D9FF2B]/12 rounded-full blur-3xl" />
                <div className="relative rounded-3xl bg-[#FFFDF8] p-3 sm:p-5 border border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between px-2 pb-4 text-xs">
                    <div className="flex items-center gap-2 text-[#0F3A2D] font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-[#0F3A2D]" /> Vista diaria por bloques</div>
                    <span className="font-mono text-[#5E806E]">SIMULACRO 01</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-[#DCD4C4] bg-[#F5F1E7]">
                    <img src="/manus-storage/kureva-ui-direction_89c54ed0.png" alt="Vista conceptual de KurevaLife con paneles por bloques" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PilotWelcome />

        {/* What it is */}
        <section id="como-funciona" className="py-18 md:py-24 bg-[#FFFDF8] border-b border-[#DCD4C4]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
              <span className="kureva-badge">Una herramienta de organización personal</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D]">Una pantalla clara para lo que importa hoy</h2>
              <p className="text-[#5E806E] text-base sm:text-lg leading-relaxed">KurevaLife no interpreta pruebas ni sustituye conversaciones con profesionales. Quiere ofrecer un espacio personal para llegar a ellas con tus cosas en orden.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Clock3, title: "Ordena tus recordatorios", desc: "Reserva espacio para citas, tareas y recordatorios sin llenar tu pantalla de avisos." },
                { icon: FileClock, title: "Prepara tus consultas", desc: "Reúne preguntas, notas y documentos que quieras tener a mano para hablar con tu médico." },
                { icon: BellRing, title: "Recuerda sin perseguirte", desc: "Configura avisos claros de medicación, citas o registros. Elige la frecuencia y apágalos cuando no los necesites." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-2xl border border-[#DCD4C4] bg-[#F5F1E7] p-7 space-y-4 hover:border-[#0F3A2D] transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center"><Icon className="w-6 h-6" /></div>
                    <h3 className="font-display text-xl font-bold text-[#0F3A2D]">{item.title}</h3>
                    <p className="text-sm text-[#5E806E] leading-relaxed">{item.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <KurevaLifeDemo />

        {/* Local first */}
        <section className="py-18 md:py-24 bg-[#F5F1E7] border-b border-[#DCD4C4]">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl bg-[#0F3A2D] p-7 sm:p-10 text-[#F5F1E7] shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#D9FF2B]/10 blur-3xl" />
              <div className="relative space-y-7">
                <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><LockKeyhole className="w-4 h-4" /> Privacidad como requisito</div>
                <h2 className="font-display text-3xl font-bold text-white leading-tight">Tus notas no son el producto.</h2>
                <p className="text-white/75 leading-relaxed">La versión final debe diseñarse para que puedas entender dónde se guardan tus datos, elegir qué compartes, exportarlo y revocar accesos. Este simulacro todavía no guarda información personal ni clínica.</p>
                <div className="space-y-3">
                  {[
                    "Diseño con almacenamiento y exportación explicados",
                    "Sin venta de perfiles personales",
                    "Sin publicidad basada en información personal",
                    "Configuración de privacidad comprensible",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm"><span className="w-5 h-5 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>{item}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <span className="kureva-badge">Arquitectura explicada sin jerga</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D] leading-tight">Lo importante está cerca de ti.</h2>
              <p className="text-[#5E806E] leading-relaxed">Pensamos KurevaLife como una libreta digital con inteligencia práctica, no como una plataforma que absorbe información. Antes de guardar datos reales, la arquitectura y las medidas de privacidad deberán estar implementadas, explicadas y revisadas.</p>
              <div className="space-y-4">
                {[
                  { icon: Smartphone, title: "1. Primero tu dispositivo", desc: "El objetivo es que la agenda, las notas y los ajustes estén cerca de ti y se expliquen con claridad." },
                  { icon: Layers3, title: "2. Copia bajo tu control", desc: "La versión final deberá permitir exportar o guardar una copia antes de activar cualquier conexión." },
                  { icon: KeyRound, title: "3. Accesos claros", desc: "Los permisos no deben quedar escondidos: deben verse, modificarse y poder revocarse." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0F3A2D]/10 flex items-center justify-center text-[#0F3A2D] shrink-0"><Icon className="w-5 h-5" /></div>
                      <div><h3 className="font-display font-bold text-base text-[#0F3A2D]">{item.title}</h3><p className="text-sm text-[#5E806E] leading-relaxed">{item.desc}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Explicit boundary */}
        <section className="py-14 bg-[#FFFDF8] border-b border-[#DCD4C4]">
          <div className="container max-w-5xl">
            <div className="rounded-2xl border border-[#DCD4C4] bg-[#F5F1E7] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6" /></div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-[#0F3A2D]">KurevaLife es organización, no atención sanitaria.</h2>
                <p className="text-sm text-[#5E806E] leading-relaxed">La app no realiza diagnósticos, no interpreta información clínica, no prescribe ni sustituye a profesionales cualificados. Su función es ayudarte a preparar y recordar lo que tú decides llevar a una conversación o cita.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pilot updates */}
        <section id="beta" className="py-18 md:py-24 bg-[#0F3A2D] text-[#F5F1E7] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "500px 500px", filter: "brightness(0) invert(1)" }} />
          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 items-center">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Grupo de confianza · simulacro 01</span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.08]">No vienes a probar una pantalla. Vienes a construir con nosotros.</h2>
                <p className="text-lg text-white/75 leading-relaxed max-w-xl">Kureva crece cuando las experiencias reales marcan el camino. Si decides dejarnos tu correo, te contaremos qué hemos aprendido, cuándo se abre el siguiente paso y cómo recibir los futuros materiales de Kureva.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Sin coste ni obligación</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Feedback voluntario y anónimo</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Datos de ejemplo, no una cuenta</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Baja sencilla en cualquier momento</div>
                </div>
              </div>

              <PilotInterestForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

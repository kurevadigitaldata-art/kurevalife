import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { KurevaLifeDemo } from "@/components/KurevaLifeDemo";
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
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function KurevaLife() {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("persona");

  const joinBeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setJoined(true);
    toast.success("Tu interés por la beta de KurevaLife ha quedado registrado.");
  };

  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E] selection:bg-[#D9FF2B] selection:text-[#0F3A2D]">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0F3A2D] text-[#F5F1E7] border-b border-[#164D3C]">
          <div className="absolute inset-0 opacity-[0.10] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "520px 520px", filter: "brightness(0) invert(1)" }} />
          <div className="container relative z-10 py-16 md:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D9FF2B] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Beta cerrada · producto propio de Kureva
                </div>

                <div className="w-62 max-w-full">
                  <img src="/manus-storage/kurevalife-lockup_f908d233.svg" alt="KurevaLife by Kureva" className="w-full h-auto brightness-0 invert" />
                </div>

                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.04] text-white max-w-2xl">
                  Tu día en orden. <span className="text-[#D9FF2B]">Tu consulta más clara.</span>
                </h1>
                <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl">
                  KurevaLife te ayuda a organizar tus consultas, recordatorios y notas de forma sencilla. Diseñada para personas que quieren menos ruido, más claridad y control de sus propios datos.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="#beta" className="kureva-btn-accent text-sm">
                    Solicitar acceso a la beta <ArrowRight className="w-4 h-4" />
                  </a>
                  <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                    Ver cómo funciona
                  </a>
                  <a href="#demo" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[#D9FF2B] border border-[#D9FF2B]/35 hover:bg-white/10 transition-colors">
                    Probar la vista diaria
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3 text-xs text-white/70">
                  <span className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D9FF2B]" /> Datos locales primero</span>
                  <span className="inline-flex items-center gap-2"><Eye className="w-4 h-4 text-[#D9FF2B]" /> Diseño accesible</span>
                  <span className="inline-flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-[#D9FF2B]" /> Sin lenguaje clínico</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-[#D9FF2B]/12 rounded-full blur-3xl" />
                <div className="relative rounded-3xl bg-[#FFFDF8] p-3 sm:p-5 border border-white/15 shadow-2xl">
                  <div className="flex items-center justify-between px-2 pb-4 text-xs">
                    <div className="flex items-center gap-2 text-[#0F3A2D] font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-[#0F3A2D]" /> Vista diaria por bloques</div>
                    <span className="font-mono text-[#5E806E]">EARLY BUILD</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-[#DCD4C4] bg-[#F5F1E7]">
                    <img src="/manus-storage/kureva-ui-direction_89c54ed0.png" alt="Vista conceptual de KurevaLife con paneles por bloques" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What it is */}
        <section id="como-funciona" className="py-18 md:py-24 bg-[#FFFDF8] border-b border-[#DCD4C4]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
              <span className="kureva-badge">Una herramienta de organización personal</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D]">Una pantalla clara para lo que importa hoy</h2>
              <p className="text-[#5E806E] text-base sm:text-lg leading-relaxed">KurevaLife no intenta sustituir conversaciones importantes ni tomar decisiones por ti. Te ofrece un espacio personal para llegar a ellas con tus cosas en orden.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Clock3, title: "Organiza tu día por bloques", desc: "Reserva espacio para citas, tareas y recordatorios sin llenar tu pantalla de opciones." },
                { icon: FileClock, title: "Prepara tus consultas", desc: "Guarda preguntas, notas y documentos que quieras tener a mano antes de una conversación importante." },
                { icon: BellRing, title: "Recuerda sin perseguirte", desc: "Configura avisos claros y modificables. Elige la frecuencia y apágalos cuando no los necesites." },
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
                <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><LockKeyhole className="w-4 h-4" /> Local-first por diseño</div>
                <h2 className="font-display text-3xl font-bold text-white leading-tight">Tus notas no son el producto.</h2>
                <p className="text-white/75 leading-relaxed">KurevaLife empieza guardando los datos en tu dispositivo. La sincronización, cuando exista, será opcional, visible y controlada por ti. La app está diseñada para que puedas exportar y conservar tus datos.</p>
                <div className="space-y-3">
                  {[
                    "Almacenamiento local y exportable",
                    "Sin venta de perfiles personales",
                    "Sin publicidad basada en tu información",
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
              <p className="text-[#5E806E] leading-relaxed">Pensamos KurevaLife como una libreta digital con inteligencia práctica, no como una plataforma que absorbe información. La arquitectura se publicará por capas para que cada persona sepa qué ocurre con sus datos.</p>
              <div className="space-y-4">
                {[
                  { icon: Smartphone, title: "1. Tu dispositivo", desc: "La agenda, tus notas y los ajustes viven primero en tu móvil o navegador." },
                  { icon: Layers3, title: "2. Copia bajo tu control", desc: "Podrás elegir exportar o guardar una copia. La app te lo explica antes de activar una conexión." },
                  { icon: KeyRound, title: "3. Accesos claros", desc: "Los permisos no quedan escondidos: se ven, se modifican y se pueden revocar." },
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

        {/* Beta form */}
        <section id="beta" className="py-18 md:py-24 bg-[#0F3A2D] text-[#F5F1E7] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "500px 500px", filter: "brightness(0) invert(1)" }} />
          <div className="container relative">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-12 items-center">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Beta cerrada · primeras conversaciones</span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.08]">Ayúdanos a construir una app que no te trate como un dato.</h2>
                <p className="text-lg text-white/75 leading-relaxed max-w-xl">Buscamos personas que quieran probar el enfoque, señalar lo que sobra y ayudarnos a mantener el producto simple, humano y respetuoso.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80">
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Acceso temprano sin coste</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Sesiones de feedback voluntarias</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Datos de prueba, sin obligación</div>
                  <div className="flex items-center gap-2"><Check className="w-4 h-4 text-[#D9FF2B]" /> Cancelación sencilla</div>
                </div>
              </div>

              <div className="rounded-3xl bg-[#FFFDF8] p-7 sm:p-9 text-[#173A2E] shadow-2xl">
                {!joined ? (
                  <form onSubmit={joinBeta} className="space-y-5">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-[#5E806E] mb-2">Acceso anticipado</div>
                      <h3 className="font-display text-2xl font-bold text-[#0F3A2D]">Solicita tu plaza beta</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-2">Tu correo</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="tu@correo.es" className="w-full h-12 px-4 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-2">¿Cómo te gustaría participar?</label>
                      <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]">
                        <option value="persona">Como persona usuaria</option>
                        <option value="cuidador">Como familiar o persona de apoyo</option>
                        <option value="profesional">Como profesional interesado en organización accesible</option>
                        <option value="comunidad">Como parte de una asociación o comunidad local</option>
                      </select>
                    </div>
                    <label className="flex items-start gap-2.5 text-xs text-[#5E806E] leading-relaxed">
                      <input required type="checkbox" className="mt-0.5 accent-[#0F3A2D]" />
                      <span>Acepto que Kureva use este correo únicamente para responder a mi solicitud de beta. Podré solicitar su eliminación cuando quiera.</span>
                    </label>
                    <button type="submit" className="kureva-btn-primary w-full justify-center">Solicitar acceso a KurevaLife <ArrowRight className="w-4 h-4" /></button>
                    <p className="text-[11px] text-[#5E806E] text-center">La beta se activa por grupos pequeños. Responderemos con los siguientes pasos cuando abramos plazas.</p>
                  </form>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-15 h-15 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center mx-auto"><Check className="w-8 h-8" /></div>
                    <h3 className="font-display text-2xl font-bold text-[#0F3A2D]">Solicitud recibida</h3>
                    <p className="text-sm text-[#5E806E] max-w-sm mx-auto">Gracias. Cuando abramos el siguiente grupo, te escribiremos a <strong>{email}</strong> con el proceso y las condiciones de participación.</p>
                    <button onClick={() => setJoined(false)} className="kureva-btn-secondary text-xs">Registrar otro correo</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

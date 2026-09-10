import React, { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import {
  AlarmClock,
  Apple,
  BellRing,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  Droplets,
  FileText,
  HeartHandshake,
  Info,
  LockKeyhole,
  MessageCircleHeart,
  Pill,
  Plus,
  RefreshCw,
  Salad,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  TextCursorInput,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PilotFeedback } from "@/components/PilotFeedback";
import { PilotInterestForm } from "@/components/PilotInterestForm";
import {
  type CommunityCategory,
  type CommunityMessage,
  loadCommunityMessages,
  loadPilotWindow,
  submitCommunityMessage,
} from "@/lib/pilotFeedback";

type AppTab = "hoy" | "salud" | "alimentos" | "kivi" | "participar";
type DemoBlock = { id: string; time: string; title: string; detail: string; tag: string; tone: "forest" | "lime" | "cream" | "moss" };
type SessionItem = { id: string; title: string; createdAt: string };
type HealthProfile = { age: string; weight: string; diagnoses: string[] };
type AnalyticDocument = { id: string; title: string; date: string };

const INITIAL_BLOCKS: DemoBlock[] = [
  { id: "medicacion", time: "09:00", title: "Recordatorio de medicación", detail: "Ejemplo de un aviso que tú configurarías con el horario indicado por tu profesional.", tag: "Recordatorio", tone: "forest" },
  { id: "consulta", time: "12:15", title: "Preparar una consulta", detail: "Reúne preguntas, una nota y documentos que quieras llevar contigo.", tag: "Cita", tone: "lime" },
  { id: "pausa", time: "16:00", title: "Pausa sin pantalla", detail: "Un momento sencillo para moverte, respirar o parar a tu ritmo.", tag: "Bienestar", tone: "cream" },
];

const FOOD = [
  { id: "higo", name: "Higo", type: "Fruta de temporada", vitamin: "Aporta fibra y contiene vitamina B6.", idea: "Prueba medio higo con yogur natural o en una tostada.", color: "bg-[#5C3D5A]", icon: Apple },
  { id: "granada", name: "Granada", type: "Fruta de temporada", vitamin: "Aporta fibra y vitamina C.", idea: "Añade unos granos a una ensalada o a un bol de yogur.", color: "bg-[#A63744]", icon: Apple },
  { id: "pimiento", name: "Pimiento rojo", type: "Verdura de temporada", vitamin: "Destaca por su vitamina C y provitamina A.", idea: "Asado, en tiras con legumbres o en una crema suave.", color: "bg-[#C94E3E]", icon: Salad },
  { id: "calabaza", name: "Calabaza", type: "Verdura de temporada", vitamin: "Aporta betacarotenos, precursores de la vitamina A.", idea: "En crema, al horno o acompañando un plato de arroz.", color: "bg-[#CB7A2A]", icon: Salad },
];

const FAQS = [
  { id: "cita", question: "¿Cómo preparo una cita?", answer: "Puedes reunir preguntas, anotar molestias con tus palabras y llevar documentos que ya tengas. Kivi no interpreta resultados ni sustituye a tu profesional de salud." },
  { id: "avisos", question: "¿Los avisos son reales?", answer: "En este simulador los avisos se registran de forma visual para que pruebes el recorrido. No envía notificaciones reales al móvil ni sustituye la pauta de tu médico o farmacéutico." },
  { id: "privacidad", question: "¿Quién puede ver lo que pruebo?", answer: "Los bloques, alarmas y registros que creas dentro de esta simulación viven solo mientras la página está abierta. Tu valoración privada se guarda únicamente si decides enviarla." },
  { id: "urgencia", question: "¿Y si tengo una urgencia?", answer: "KurevaLife no es un servicio de urgencias. Ante una urgencia, contacta con los servicios de emergencia o un profesional sanitario." },
];

const COMMUNITY_CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: "daily_blocks", label: "Bloques y recordatorios" },
  { value: "medical_organization", label: "Citas y organización" },
  { value: "nutrition", label: "Alimentos y bienestar" },
  { value: "accessibility", label: "Accesibilidad" },
  { value: "privacy", label: "Privacidad" },
  { value: "kivi_support", label: "Kivi y soporte" },
  { value: "family_mode", label: "Modo familiar" },
  { value: "general", label: "Idea general" },
];

const TONE_CLASSES: Record<DemoBlock["tone"], string> = {
  forest: "bg-[#0F3A2D] text-white border-[#0F3A2D]",
  lime: "bg-[#D9FF2B] text-[#0F3A2D] border-[#C6E923]",
  cream: "bg-[#FFFDF8] text-[#0F3A2D] border-[#DCD4C4]",
  moss: "bg-[#DCE8DD] text-[#0F3A2D] border-[#B9D0BE]",
};

function formatRemaining(iso: string) {
  const milliseconds = Math.max(0, new Date(iso).getTime() - Date.now());
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function KurevaLifeApp() {
  const [started, setStarted] = useState(false);
  const [welcomeStep, setWelcomeStep] = useState(0);
  const [tab, setTab] = useState<AppTab>("hoy");
  const [seconds, setSeconds] = useState(300);
  const [blocks, setBlocks] = useState<DemoBlock[]>(INITIAL_BLOCKS);
  const [activeBlockId, setActiveBlockId] = useState(INITIAL_BLOCKS[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [alarms, setAlarms] = useState<SessionItem[]>([]);
  const [records, setRecords] = useState<SessionItem[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({ age: "", weight: "", diagnoses: [] });
  const [analyticDocuments, setAnalyticDocuments] = useState<AnalyticDocument[]>([]);
  const [newBlockOpen, setNewBlockOpen] = useState(false);
  const [newBlock, setNewBlock] = useState({ title: "", time: "18:30", detail: "" });
  const [note, setNote] = useState("Ejemplo: recordar preguntar por las opciones y escribir la respuesta con mis palabras.");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState("higo");
  const [activeFaqId, setActiveFaqId] = useState("cita");
  const [participationView, setParticipationView] = useState<"privado" | "grupo" | "novedades">("privado");

  useEffect(() => {
    if (!started || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, seconds]);

  const activeBlock = blocks.find((block) => block.id === activeBlockId) ?? blocks[0];
  const selectedFood = FOOD.find((food) => food.id === selectedFoodId) ?? FOOD[0];
  const activeFaq = FAQS.find((item) => item.id === activeFaqId) ?? FAQS[0];
  const timerProgress = ((300 - seconds) / 300) * 100;

  const startTest = () => {
    setStarted(true);
    setTab("hoy");
    document.getElementById("kurevalife-app")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetTest = () => {
    setSeconds(300);
    setBlocks(INITIAL_BLOCKS);
    setActiveBlockId(INITIAL_BLOCKS[0].id);
    setCompleted([]);
    setAlarms([]);
    setRecords([]);
    setHealthProfile({ age: "", weight: "", diagnoses: [] });
    setAnalyticDocuments([]);
    setNewBlockOpen(false);
    setNewBlock({ title: "", time: "18:30", detail: "" });
    setNote("Ejemplo: recordar preguntar por las opciones y escribir la respuesta con mis palabras.");
    setTab("hoy");
    toast.success("La prueba se ha reiniciado en este dispositivo.");
  };

  const addAlarm = () => {
    if (!activeBlock) return;
    if (alarms.some((alarm) => alarm.id === activeBlock.id)) {
      toast.info("Esta alarma de prueba ya está registrada.");
      return;
    }
    setAlarms((current) => [...current, { id: activeBlock.id, title: `${activeBlock.time} · ${activeBlock.title}`, createdAt: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) }]);
    toast.success("Alarma anotada en tu sesión de prueba. No se enviará una notificación real.");
  };

  const registerRecord = (title: string) => {
    setRecords((current) => [...current, { id: `${title}-${Date.now()}`, title, createdAt: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) }]);
    toast.success(`${title} añadido al resumen de prueba. No se ha guardado como dato clínico.`);
  };

  const addBlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newBlock.title.trim()) return;
    const block: DemoBlock = { id: `block-${Date.now()}`, time: newBlock.time, title: newBlock.title.trim(), detail: newBlock.detail.trim() || "Bloque creado durante esta prueba.", tag: "Mi bloque", tone: "moss" };
    setBlocks((current) => [...current, block]);
    setActiveBlockId(block.id);
    setNewBlock({ title: "", time: "18:30", detail: "" });
    setNewBlockOpen(false);
    toast.success("Bloque añadido a esta sesión de prueba.");
  };

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const forest: [number, number, number] = [15, 58, 45];
    const cream: [number, number, number] = [245, 241, 231];
    const ink: [number, number, number] = [23, 58, 46];
    const moss: [number, number, number] = [94, 128, 110];
    const lime: [number, number, number] = [217, 255, 43];
    const width = doc.internal.pageSize.getWidth();
    const text = (copy: string, x: number, y: number, size = 10, color: [number, number, number] = ink, style: "normal" | "bold" = "normal") => { doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(...color); doc.text(copy, x, y); };
    const body = (copy: string, x: number, y: number, maxWidth: number) => { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...moss); const lines = doc.splitTextToSize(copy, maxWidth) as string[]; doc.text(lines, x, y, { lineHeightFactor: 1.45 }); return y + lines.length * 4.6; };

    doc.setFillColor(...cream); doc.rect(0, 0, width, 297, "F");
    doc.setFillColor(...forest); doc.rect(0, 0, width, 42, "F");
    doc.setFillColor(...lime); doc.circle(width - 18, 16, 8, "F");
    text("K", width - 20.6, 20.2, 11, forest, "bold");
    text("KUREVALIFE", 18, 15, 10, cream, "bold");
    text("RESUMEN DE PRUEBA · NO CLÍNICO", 18, 23, 7.3, lime, "bold");
    text("Mi recorrido de prueba", 18, 62, 23, forest, "bold");
    let y = body("Este documento resume interacciones de una sesión de simulación. No contiene ni interpreta datos médicos, no es un historial clínico y no sustituye la información que se comparte con un profesional sanitario.", 18, 76, 172);
    y += 12;
    text("Bloques explorados", 18, y, 13, forest, "bold"); y += 9;
    blocks.forEach((block) => { text(`${completed.includes(block.id) ? "✓" : "○"} ${block.time} · ${block.title}`, 20, y, 9, ink, "bold"); y += 6; });
    y += 8;
    text("Alarmas de prueba", 18, y, 13, forest, "bold"); y += 9;
    if (alarms.length === 0) { text("No se registraron alarmas durante esta prueba.", 20, y, 9, moss); y += 6; } else { alarms.forEach((alarm) => { text(`• ${alarm.title}`, 20, y, 9, ink); y += 6; }); }
    y += 8;
    text("Registros realizados", 18, y, 13, forest, "bold"); y += 9;
    if (records.length === 0) { text("No se registraron mediciones o molestias durante esta prueba.", 20, y, 9, moss); y += 6; } else { records.forEach((record) => { text(`• ${record.title} · ${record.createdAt}`, 20, y, 9, ink); y += 6; }); }
    y += 8;
    text("Ficha de prueba", 18, y, 13, forest, "bold"); y += 8;
    body(`Edad: ${healthProfile.age || "Sin registrar"} · Peso: ${healthProfile.weight ? `${healthProfile.weight} kg` : "Sin registrar"} · Diagnósticos anotados: ${healthProfile.diagnoses.length ? healthProfile.diagnoses.join(", ") : "Ninguno"}.`, 20, y, 168);
    y += 19;
    text("Documentos analíticos de prueba", 18, y, 13, forest, "bold"); y += 9;
    if (analyticDocuments.length === 0) { text("No se añadieron documentos analíticos en esta prueba.", 20, y, 9, moss); y += 6; } else { analyticDocuments.forEach((document) => { text(`• ${document.date || "Sin fecha"} · ${document.title}`, 20, y, 9, ink); y += 6; }); }
    y += 8;
    text("Nota de ejemplo", 18, y, 13, forest, "bold"); y += 8;
    body(note || "Sin nota.", 20, y, 168);
    doc.setDrawColor(220, 212, 196); doc.line(18, 279, width - 18, 279);
    text("KurevaLife · sesión de prueba local", 18, 286, 7.3, moss);
    text(new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()), width - 18, 286, 7.3, moss, "normal");
    doc.save(`KurevaLife_resumen_prueba_${new Intl.DateTimeFormat("sv-SE").format(new Date())}.pdf`);
    toast.success("Resumen PDF preparado en tu dispositivo.");
  };

  if (!started) return <WelcomeScreen step={welcomeStep} setStep={setWelcomeStep} onStart={startTest} />;

  return (
    <section id="kurevalife-app" className="min-h-[calc(100vh-5rem)] bg-[#F5F1E7] py-5 sm:py-8">
      <div className={`container max-w-7xl ${largeText ? "text-[112.5%]" : ""}`}>
        <div className={`rounded-3xl border shadow-2xl overflow-hidden ${highContrast ? "bg-white border-[#09241B]" : "bg-[#FFFDF8] border-[#DCD4C4]"}`}>
          <header className="bg-[#0F3A2D] text-white px-5 sm:px-7 py-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display font-bold text-xl">K</div><div><div className="font-display font-bold">KurevaLife</div><div className="text-[11px] text-white/65">Prueba guiada · todo lo que creas permanece en esta sesión</div></div></div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10">Salir de KurevaLife</a>
              <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5" aria-label={`Temporizador de prueba: ${formatTime(seconds)}`}><div className="relative w-7 h-7 rounded-full" style={{ background: `conic-gradient(#D9FF2B ${timerProgress}%, rgba(255,255,255,.18) 0)` }}><div className="absolute inset-[3px] rounded-full bg-[#0F3A2D]" /></div><span className="font-mono text-xs text-[#D9FF2B]">{seconds ? formatTime(seconds) : "Listo"}</span></div>
              <button onClick={() => setLargeText((value) => !value)} aria-pressed={largeText} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10"><TextCursorInput className="w-3.5 h-3.5" /> {largeText ? "Texto normal" : "Texto +"}</button>
              <button onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-[11px] hover:bg-white/10"><Sun className="w-3.5 h-3.5" /> Contraste</button>
              <button onClick={exportPdf} className="inline-flex items-center gap-1.5 rounded-full bg-[#D9FF2B] text-[#0F3A2D] px-3 py-1.5 text-[11px] font-bold hover:bg-[#e6ff5a]"><Download className="w-3.5 h-3.5" /> Exportar PDF</button>
            </div>
          </header>

          <div className="grid xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="bg-[#FAF7F0] border-b xl:border-b-0 xl:border-r border-[#DCD4C4] p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E] mb-3">Mi KurevaLife</div>
              <nav className="flex xl:flex-col gap-2 overflow-x-auto pb-1" aria-label="Secciones del simulador">
                {[
                  { id: "hoy" as AppTab, label: "Mi día", icon: Clock3, note: `${alarms.length} alarma${alarms.length === 1 ? "" : "s"}` },
                  { id: "salud" as AppTab, label: "Mi salud", icon: Stethoscope, note: `${records.length} registro${records.length === 1 ? "" : "s"}` },
                  { id: "alimentos" as AppTab, label: "Alimentos", icon: Apple, note: "Temporada" },
                  { id: "kivi" as AppTab, label: "Kivi", icon: MessageCircleHeart, note: "Ayuda" },
                  { id: "participar" as AppTab, label: "Tu opinión", icon: HeartHandshake, note: "Privada o grupo" },
                ].map((item) => { const Icon = item.icon; const selected = tab === item.id; return <button key={item.id} onClick={() => setTab(item.id)} aria-pressed={selected} className={`shrink-0 xl:w-full min-w-35 text-left rounded-xl p-3 transition-colors ${selected ? "bg-[#0F3A2D] text-white shadow-md" : "text-[#0F3A2D] hover:bg-white"}`}><div className="flex gap-2 items-center"><Icon className={`w-4 h-4 ${selected ? "text-[#D9FF2B]" : "text-[#5E806E]"}`} /><span className="font-display font-bold text-sm">{item.label}</span></div><span className={`block text-[10px] mt-1.5 ${selected ? "text-white/65" : "text-[#5E806E]"}`}>{item.note}</span></button>; })}
              </nav>
              <div className="hidden xl:block rounded-xl bg-white border border-[#DCD4C4] mt-6 p-4 text-[11px] leading-relaxed text-[#5E806E]"><LockKeyhole className="w-4 h-4 text-[#0F3A2D] mb-2" /> Los bloques, alarmas, registros y notas de esta prueba no se mandan a ninguna base de datos.</div>
              <button onClick={resetTest} className="hidden xl:inline-flex mt-4 text-xs font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-4">Reiniciar mi prueba</button>
            </aside>
            <main className="p-5 sm:p-7 min-w-0">
              {tab === "hoy" && <TodayPanel blocks={blocks} activeBlock={activeBlock} activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} completed={completed} setCompleted={setCompleted} alarms={alarms} addAlarm={addAlarm} newBlockOpen={newBlockOpen} setNewBlockOpen={setNewBlockOpen} newBlock={newBlock} setNewBlock={setNewBlock} addBlock={addBlock} note={note} setNote={setNote} />}
              {tab === "salud" && <HealthPanel records={records} registerRecord={registerRecord} healthProfile={healthProfile} setHealthProfile={setHealthProfile} analyticDocuments={analyticDocuments} setAnalyticDocuments={setAnalyticDocuments} />}
              {tab === "alimentos" && <FoodPanel selectedFoodId={selectedFoodId} setSelectedFoodId={setSelectedFoodId} selectedFood={selectedFood} />}
              {tab === "kivi" && <KiviPanel activeFaqId={activeFaqId} setActiveFaqId={setActiveFaqId} activeFaq={activeFaq} />}
              {tab === "participar" && <ParticipationPanel view={participationView} setView={setParticipationView} />}
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

function WelcomeScreen({ step, setStep, onStart }: { step: number; setStep: React.Dispatch<React.SetStateAction<number>>; onStart: () => void }) {
  const pages = [
    { eyebrow: "Bienvenida a KurevaLife", title: "Tu vida en orden. Tus decisiones cerca.", copy: "Esta es una prueba guiada de una app para reunir recordatorios, citas, preguntas, documentos y pequeñas rutinas de bienestar en un lugar más claro.", note: "No es una aplicación médica, no diagnostica y no sustituye la atención de un profesional sanitario." },
    { eyebrow: "Prueba sin riesgo", title: "Explora como si fuera tu app, pero sin crear cuenta.", copy: "Durante cinco minutos podrás marcar bloques, registrar una alarma de ejemplo, tocar tensión o glucosa, abrir frutas y verduras de temporada y hablar con Kivi. Nada de eso se guarda de forma permanente.", note: "El temporizador solo guía tu recorrido. Puedes seguir explorando cuando llegue a cero." },
    { eyebrow: "Tu opinión hace crecer Kureva", title: "Al final podrás valorar la experiencia y proponer mejoras.", copy: "La sugerencia privada solo la recibe el registro interno del piloto. La conversación de grupo es opcional y visible únicamente a las personas con este enlace durante una ventana temporal de 24 horas.", note: "No incluyas diagnósticos, medicación, analíticas, teléfonos, correos ni información personal en el espacio de grupo." },
  ];
  const page = pages[step];
  return <section className="min-h-screen bg-[#F5F1E7] flex items-center py-8"><div className="container max-w-5xl"><a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#0F3A2D] mb-5"><span className="w-8 h-8 rounded-lg bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display">K</span> Kureva <span className="font-normal text-[#5E806E]">· volver a la web</span></a><div className="rounded-3xl overflow-hidden shadow-2xl border border-[#164D3C] bg-[#0F3A2D] text-white grid lg:grid-cols-[1.1fr_0.9fr]"><div className="p-7 sm:p-11 space-y-7"><div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> {page.eyebrow}</div><div className="w-55 max-w-full"><img src="/manus-storage/kurevalife-lockup_f908d233.svg" alt="KurevaLife by Kureva" className="w-full brightness-0 invert" /></div><h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">{page.title}</h1><p className="text-white/75 text-lg leading-relaxed max-w-xl">{page.copy}</p><div className="rounded-xl bg-white/10 border border-white/10 p-4 text-sm text-white/75 leading-relaxed"><ShieldCheck className="w-4 h-4 inline-block align-text-bottom text-[#D9FF2B] mr-1.5" /> {page.note}</div><div className="flex gap-3 flex-wrap">{step < pages.length - 1 ? <button onClick={() => setStep((value) => value + 1)} className="kureva-btn-accent">Siguiente <ChevronRight className="w-4 h-4" /></button> : <button onClick={onStart} className="kureva-btn-accent">Comenzar prueba de 5 minutos <ChevronRight className="w-4 h-4" /></button>}{step > 0 && <button onClick={() => setStep((value) => value - 1)} className="px-4 py-3 font-semibold text-sm text-white/80 hover:text-white">Anterior</button>}</div></div><aside className="bg-[#09241B] p-7 sm:p-11 flex flex-col justify-between gap-12"><div><div className="relative w-30 h-30 rounded-full border border-[#D9FF2B]/30 motion-safe:animate-[spin_18s_linear_infinite]"><div className="absolute -left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-2xl font-bold">K</div></div><h2 className="font-display text-2xl font-bold mt-7">Una prueba a tu ritmo.</h2><p className="text-sm text-white/65 mt-2">Podrás ampliar texto, subir el contraste y navegar con teclado. No hay rachas, puntos ni penalizaciones.</p></div><div className="space-y-2">{pages.map((item, index) => <button key={item.eyebrow} onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} className={`w-full text-left rounded-xl px-3 py-3 flex items-center gap-3 ${step === index ? "bg-white/10" : "hover:bg-white/5"}`}><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index <= step ? "bg-[#D9FF2B] text-[#0F3A2D]" : "bg-white/10 text-white/65"}`}>{index < step ? <Check className="w-3.5 h-3.5" /> : index + 1}</span><span className={`text-xs ${step === index ? "text-white" : "text-white/60"}`}>{item.eyebrow}</span></button>)}</div></aside></div></div></section>;
}

function TodayPanel({ blocks, activeBlock, activeBlockId, setActiveBlockId, completed, setCompleted, alarms, addAlarm, newBlockOpen, setNewBlockOpen, newBlock, setNewBlock, addBlock, note, setNote }: { blocks: DemoBlock[]; activeBlock: DemoBlock | undefined; activeBlockId: string; setActiveBlockId: React.Dispatch<React.SetStateAction<string>>; completed: string[]; setCompleted: React.Dispatch<React.SetStateAction<string[]>>; alarms: SessionItem[]; addAlarm: () => void; newBlockOpen: boolean; setNewBlockOpen: React.Dispatch<React.SetStateAction<boolean>>; newBlock: { title: string; time: string; detail: string }; setNewBlock: React.Dispatch<React.SetStateAction<{ title: string; time: string; detail: string }>>; addBlock: (event: React.FormEvent) => void; note: string; setNote: React.Dispatch<React.SetStateAction<string>> }) {
  const markComplete = (id: string) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Mi día · prueba guiada</div><h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Hoy, a tu ritmo.</h2><p className="text-sm text-[#5E806E] mt-2">Prueba los bloques, marca uno como hecho y registra una alarma visual.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-[#DCE8DD] border border-[#B9D0BE] px-3 py-2 text-xs text-[#0F3A2D]"><ShieldCheck className="w-3.5 h-3.5" /> Sesión local · sin cuenta</span></div><div className="grid xl:grid-cols-[minmax(0,1fr)_300px] gap-6"><div className="space-y-3">{blocks.map((block) => { const selected = activeBlockId === block.id; const done = completed.includes(block.id); return <button key={block.id} onClick={() => setActiveBlockId(block.id)} className={`w-full rounded-2xl border p-4 text-left transition-all ${TONE_CLASSES[block.tone]} ${selected ? "ring-2 ring-[#D9FF2B] ring-offset-2" : "hover:translate-x-0.5"} ${done ? "opacity-60" : ""}`}><div className="flex justify-between gap-4"><div><div className={`text-[10px] font-bold uppercase tracking-wider ${block.tone === "forest" ? "text-[#D9FF2B]" : "opacity-60"}`}>{block.time} · {block.tag}</div><h3 className={`font-display font-bold text-lg mt-1 ${done ? "line-through" : ""}`}>{block.title}</h3><p className={`text-xs mt-1 leading-relaxed ${block.tone === "forest" ? "text-white/70" : "opacity-75"}`}>{block.detail}</p></div>{done ? <CheckCircle2 className="w-5 h-5 shrink-0 text-[#D9FF2B]" /> : <Circle className={`w-5 h-5 shrink-0 ${block.tone === "forest" ? "text-white/50" : "text-[#5E806E]"}`} />}</div></button>; })}<button onClick={() => setNewBlockOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F3A2D] text-white text-xs font-bold hover:bg-[#09241B]"><Plus className="w-3.5 h-3.5" /> Añadir bloque de prueba</button>{newBlockOpen && <form onSubmit={addBlock} className="rounded-2xl border border-[#0F3A2D] bg-[#F5F1E7] p-5 grid sm:grid-cols-[1fr_110px] gap-3"><input value={newBlock.title} onChange={(event) => setNewBlock((current) => ({ ...current, title: event.target.value }))} required placeholder="Ej.: Llamar a la farmacia" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><input type="time" value={newBlock.time} onChange={(event) => setNewBlock((current) => ({ ...current, time: event.target.value }))} className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><input value={newBlock.detail} onChange={(event) => setNewBlock((current) => ({ ...current, detail: event.target.value }))} placeholder="Nota opcional" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><div className="flex gap-2"><button type="submit" className="kureva-btn-primary flex-1 justify-center text-xs">Añadir</button><button type="button" onClick={() => setNewBlockOpen(false)} className="w-10 rounded-xl border border-[#DCD4C4] bg-white flex items-center justify-center" aria-label="Cancelar"><X className="w-4 h-4" /></button></div></form>}</div><aside className="space-y-4"><div className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4"><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Bloque seleccionado</div>{activeBlock && <><div><h3 className="font-display font-bold text-xl text-[#0F3A2D]">{activeBlock.title}</h3><p className="text-sm text-[#5E806E] mt-2">{activeBlock.detail}</p></div><div className="rounded-xl bg-[#F5F1E7] px-3 py-2 flex justify-between text-xs"><span className="text-[#5E806E]">Hora sugerida</span><strong className="text-[#0F3A2D]">{activeBlock.time}</strong></div><button onClick={() => markComplete(activeBlock.id)} className={`w-full rounded-xl py-2.5 text-xs font-bold inline-flex justify-center gap-2 ${completed.includes(activeBlock.id) ? "bg-[#DCE8DD] text-[#0F3A2D]" : "bg-[#0F3A2D] text-white"}`}>{completed.includes(activeBlock.id) ? <><Check className="w-4 h-4" /> Marcado como hecho</> : <><CheckCircle2 className="w-4 h-4" /> Marcar como hecho</>}</button><button onClick={addAlarm} className="w-full rounded-xl py-2.5 text-xs font-bold inline-flex justify-center gap-2 border border-[#0F3A2D] text-[#0F3A2D] hover:bg-[#F5F1E7]"><AlarmClock className="w-4 h-4" /> Registrar alarma de recordatorio</button></>}</div><div className="rounded-2xl bg-white border border-[#DCD4C4] p-5"><div className="flex gap-2 items-center text-[#0F3A2D]"><BellRing className="w-4 h-4" /><h3 className="font-display font-bold text-sm">Alarmas de esta sesión</h3></div>{alarms.length === 0 ? <p className="text-xs text-[#5E806E] mt-3">Aún no has registrado ninguna. No se activarán notificaciones reales.</p> : <ul className="mt-3 space-y-2">{alarms.map((alarm) => <li key={alarm.id} className="rounded-lg bg-[#DCE8DD] px-3 py-2 text-xs text-[#173A2E]"><strong>{alarm.title}</strong><span className="block text-[#5E806E] mt-0.5">Añadida a las {alarm.createdAt}</span></li>)}</ul>}</div><div className="rounded-2xl bg-white border border-[#DCD4C4] p-5"><div className="flex gap-2 items-center text-[#0F3A2D]"><FileText className="w-4 h-4" /><h3 className="font-display font-bold text-sm">Nota para mí</h3></div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-3 w-full resize-none rounded-xl bg-[#F5F1E7] px-3 py-2 text-xs text-[#173A2E] focus:outline-hidden focus:ring-1 focus:ring-[#0F3A2D]" /><p className="text-[10px] text-[#5E806E] mt-2"><LockKeyhole className="w-3 h-3 inline-block mr-1" />No se guarda en esta prueba.</p></div></aside></div></div>;
}

function HealthPanel({ records, registerRecord, healthProfile, setHealthProfile, analyticDocuments, setAnalyticDocuments }: { records: SessionItem[]; registerRecord: (title: string) => void; healthProfile: HealthProfile; setHealthProfile: React.Dispatch<React.SetStateAction<HealthProfile>>; analyticDocuments: AnalyticDocument[]; setAnalyticDocuments: React.Dispatch<React.SetStateAction<AnalyticDocument[]>> }) {
  const [diagnosisText, setDiagnosisText] = useState("");
  const [analyticTitle, setAnalyticTitle] = useState("Analítica general");
  const [analyticDate, setAnalyticDate] = useState("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const commonDiagnoses = ["Hipertensión", "Diabetes", "Migrañas", "Otra condición"];
  const toggleDiagnosis = (diagnosis: string) => setHealthProfile((current) => ({ ...current, diagnoses: current.diagnoses.includes(diagnosis) ? current.diagnoses.filter((item) => item !== diagnosis) : [...current.diagnoses, diagnosis] }));
  const addDiagnosis = () => { const diagnosis = diagnosisText.trim(); if (!diagnosis) return; if (!healthProfile.diagnoses.includes(diagnosis)) setHealthProfile((current) => ({ ...current, diagnoses: [...current.diagnoses, diagnosis] })); setDiagnosisText(""); };
  const addAnalytic = (event: React.FormEvent) => { event.preventDefault(); if (!analyticDate) { toast.error("Selecciona una fecha de ejemplo para continuar."); return; } setAnalyticDocuments((current) => [...current, { id: `analytic-${Date.now()}`, title: analyticTitle.trim() || "Analítica", date: analyticDate }].sort((a, b) => b.date.localeCompare(a.date))); setAnalyticDate(""); setAnalyticTitle("Analítica general"); toast.success("Documento analítico añadido solo a esta sesión de prueba."); };
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Organización personal · prueba local</div><h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Mi salud, con lo importante a mano.</h2><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">Aquí puedes ver cómo se organizarían tus datos básicos, diagnósticos que tú decidas documentar y analíticas. Esta prueba no guarda información real, no interpreta resultados y no sustituye a tu médico.</p></div><div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-5"><article className="rounded-2xl bg-[#0F3A2D] text-white p-6 sm:p-7"><div className="flex items-start gap-3"><div className="w-10 h-10 shrink-0 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><Stethoscope className="w-5 h-5" /></div><div><div className="text-[10px] text-[#D9FF2B] font-bold uppercase tracking-wider">Mi ficha de salud · prueba</div><h3 className="font-display text-xl font-bold mt-1">Datos para recordar, no para diagnosticar.</h3></div></div><div className="grid sm:grid-cols-2 gap-3 mt-5"><div><label htmlFor="health-age" className="text-xs text-white/75">Edad</label><div className="mt-1 flex items-center rounded-xl bg-white/10 border border-white/15 overflow-hidden"><input id="health-age" type="number" min="0" max="130" value={healthProfile.age} onChange={(event) => setHealthProfile((current) => ({ ...current, age: event.target.value }))} placeholder="Ej.: 42" className="w-full h-11 px-3 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-hidden" /><span className="pr-3 text-xs text-white/55">años</span></div></div><div><label htmlFor="health-weight" className="text-xs text-white/75">Peso</label><div className="mt-1 flex items-center rounded-xl bg-white/10 border border-white/15 overflow-hidden"><input id="health-weight" type="number" min="0" max="500" step="0.1" value={healthProfile.weight} onChange={(event) => setHealthProfile((current) => ({ ...current, weight: event.target.value }))} placeholder="Ej.: 68" className="w-full h-11 px-3 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-hidden" /><span className="pr-3 text-xs text-white/55">kg</span></div></div></div><div className="mt-5"><div className="text-xs text-white/75 mb-2">Diagnósticos o condiciones que quieres tener presentes</div><div className="flex flex-wrap gap-2">{commonDiagnoses.map((diagnosis) => { const active = healthProfile.diagnoses.includes(diagnosis); return <button key={diagnosis} onClick={() => toggleDiagnosis(diagnosis)} aria-pressed={active} className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${active ? "bg-[#D9FF2B] border-[#D9FF2B] text-[#0F3A2D]" : "bg-white/10 border-white/15 text-white hover:bg-white/15"}`}>{active && <Check className="inline-block w-3 h-3 mr-1" />}{diagnosis}</button>; })}</div><div className="flex gap-2 mt-3"><input value={diagnosisText} onChange={(event) => setDiagnosisText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addDiagnosis(); } }} placeholder="Añadir otra condición" className="h-10 flex-1 rounded-xl bg-white/10 border border-white/15 px-3 text-sm text-white placeholder:text-white/40 focus:outline-hidden" /><button onClick={addDiagnosis} type="button" className="w-10 h-10 rounded-xl bg-white text-[#0F3A2D] flex items-center justify-center" aria-label="Añadir condición"><Plus className="w-4 h-4" /></button></div></div><div className="mt-5 rounded-xl bg-white/10 p-3 text-xs text-white/70 leading-relaxed"><LockKeyhole className="w-4 h-4 inline-block align-text-bottom text-[#D9FF2B] mr-1.5" /> Esta ficha desaparece al salir de esta prueba. La aplicación final deberá explicar con claridad dónde se guardan los datos y quién puede acceder a ellos.</div></article><article className="rounded-2xl bg-white border border-[#DCD4C4] p-6 sm:p-7"><div className="text-[10px] text-[#5E806E] font-bold uppercase tracking-wider">Próxima cita · ejemplo</div><h3 className="font-display text-xl font-bold text-[#0F3A2D] mt-1">Consulta de seguimiento</h3><div className="mt-4 rounded-xl bg-[#F5F1E7] p-4 text-sm text-[#173A2E]">Jueves · 18:00<br /><span className="text-xs text-[#5E806E]">Preguntas: “¿Qué debo vigilar?”, “¿Puedo llevar mis notas?”</span></div><div className="mt-5 border-t border-[#DCD4C4] pt-4"><div className="flex items-center gap-2 text-[#0F3A2D]"><FileText className="w-4 h-4" /><h4 className="font-display font-bold text-sm">Cómo se usaría</h4></div><p className="text-sm text-[#5E806E] mt-2">KurevaLife prepara tus preguntas y documentos. No interpreta valores, no indica cambios de tratamiento y no reemplaza la conversación con tu profesional.</p></div></article></div><div className="grid sm:grid-cols-3 gap-4">{[{ icon: Droplets, label: "Registrar tensión" }, { icon: Droplets, label: "Registrar glucosa" }, { icon: HeartHandshake, label: "Registrar molestia" }].map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => registerRecord(item.label.replace("Registrar ", ""))} className="rounded-2xl border border-[#DCD4C4] bg-[#F5F1E7] p-5 text-left hover:border-[#0F3A2D] transition-colors"><Icon className="w-5 h-5 text-[#0F3A2D]" /><strong className="font-display block text-[#0F3A2D] mt-3">{item.label}</strong><span className="block text-xs text-[#5E806E] mt-1">Se añade visualmente al resumen de esta sesión.</span></button>; })}</div><div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-5"><form onSubmit={addAnalytic} className="rounded-2xl border border-[#DCD4C4] bg-white p-6"><div className="flex gap-2 items-center text-[#0F3A2D]"><FileText className="w-5 h-5" /><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Analíticas · prueba local</div><h3 className="font-display font-bold text-lg">Registrar mi última analítica</h3></div></div><p className="text-sm text-[#5E806E] mt-3">Añade solo el nombre y la fecha de ejemplo: no se piden archivos ni valores clínicos durante el simulador.</p><div className="grid sm:grid-cols-2 gap-3 mt-4"><div><label htmlFor="analytic-title" className="block text-xs font-bold text-[#5E806E] mb-1.5">Nombre del documento</label><input id="analytic-title" value={analyticTitle} onChange={(event) => setAnalyticTitle(event.target.value)} maxLength={80} className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm" /></div><div><label htmlFor="analytic-date" className="block text-xs font-bold text-[#5E806E] mb-1.5">Fecha</label><input id="analytic-date" type="date" value={analyticDate} onChange={(event) => setAnalyticDate(event.target.value)} required className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm" /></div></div><button type="submit" className="kureva-btn-primary mt-4 text-xs"><Plus className="w-3.5 h-3.5" /> Añadir a la prueba</button></form><article className="rounded-2xl border border-[#B9D0BE] bg-[#DCE8DD] p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Documentos anotados</div><h3 className="font-display font-bold text-lg text-[#0F3A2D] mt-1">{analyticDocuments.length} analítica{analyticDocuments.length === 1 ? "" : "s"} de prueba</h3></div>{analyticDocuments.length >= 2 && <button onClick={() => setComparisonOpen((value) => !value)} className="kureva-btn-secondary text-xs"><FileText className="w-3.5 h-3.5" /> {comparisonOpen ? "Ocultar" : "Comparar"}</button>}</div>{analyticDocuments.length === 0 ? <p className="text-sm text-[#5E806E] mt-3">Cuando tengas dos o más documentos anotados, la prueba te mostrará cómo podría organizarse una comparación visual, sin interpretar resultados.</p> : <ul className="mt-4 space-y-2">{analyticDocuments.map((document) => <li key={document.id} className="rounded-xl bg-white/70 px-3 py-2 text-sm text-[#173A2E]"><strong>{document.title}</strong><span className="block text-xs text-[#5E806E]">{new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${document.date}T12:00:00`))}</span></li>)}</ul>}{comparisonOpen && analyticDocuments.length >= 2 && <div className="mt-4 rounded-xl bg-white/70 border border-white p-4 motion-safe:animate-in motion-safe:fade-in duration-200"><div className="text-xs font-bold uppercase tracking-wider text-[#0F3A2D]">Comparación de documentos · ejemplo</div><p className="text-sm text-[#5E806E] mt-2">KurevaLife podría mostrar las fechas y los documentos seleccionados lado a lado para una consulta. No compara, clasifica ni saca conclusiones sobre valores de salud.</p><div className="grid sm:grid-cols-2 gap-2 mt-3">{analyticDocuments.slice(0, 2).map((document) => <div key={document.id} className="rounded-lg bg-white px-3 py-2 text-xs text-[#173A2E]"><strong>{document.title}</strong><span className="block text-[#5E806E]">{document.date}</span></div>)}</div></div>}</article></div><div className="rounded-2xl border border-[#B9D0BE] bg-[#DCE8DD] p-5"><div className="flex gap-3"><Pill className="w-5 h-5 text-[#0F3A2D] shrink-0" /><div><h3 className="font-display font-bold text-[#0F3A2D]">Registros de esta prueba</h3>{records.length === 0 ? <p className="text-sm text-[#5E806E] mt-1">Pulsa una tarjeta para comprobar que aparece aquí y se incorporará al PDF local.</p> : <ul className="mt-3 grid sm:grid-cols-2 gap-2">{records.map((record) => <li key={record.id} className="rounded-xl bg-white/70 px-3 py-2 text-sm text-[#173A2E]"><Check className="w-3.5 h-3.5 inline-block text-[#0F3A2D] mr-1.5" />{record.title}<span className="text-xs text-[#5E806E]"> · {record.createdAt}</span></li>)}</ul>}</div></div></div></div>;
}

function FoodPanel({ selectedFoodId, setSelectedFoodId, selectedFood }: { selectedFoodId: string; setSelectedFoodId: React.Dispatch<React.SetStateAction<string>>; selectedFood: typeof FOOD[number] }) {
  const SelectedIcon = selectedFood.icon;
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Septiembre · referencia en España</div><h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Frutas y verduras de temporada.</h2><p className="text-sm text-[#5E806E] mt-2">Pulsa una tarjeta: la explicación se abre directamente en ella. Es información general; ante cualquier duda sobre salud, medicación o alimentación, consulta con un profesional sanitario.</p></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{FOOD.map((food) => { const Icon = food.icon; const open = food.id === selectedFoodId; return <article key={food.id} className={`rounded-2xl overflow-hidden border transition-all ${open ? "border-[#0F3A2D] ring-2 ring-[#D9FF2B] ring-offset-2" : "border-[#DCD4C4]"} bg-white`}><button onClick={() => setSelectedFoodId(food.id)} aria-expanded={open} className="w-full text-left p-5 hover:bg-[#F5F1E7] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0F3A2D]"><div className={`w-10 h-10 rounded-xl ${food.color} text-white flex items-center justify-center`}><Icon className="w-5 h-5" /></div><div className="text-[10px] text-[#5E806E] mt-4">{food.type}</div><h3 className="font-display font-bold text-[#0F3A2D] mt-1">{food.name}</h3><span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F3A2D] mt-3 underline decoration-[#D9FF2B] decoration-2 underline-offset-4">{open ? "Ficha abierta" : "Ver ficha"}<ChevronRight className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-90" : ""}`} /></span></button>{open && <div className="border-t border-[#DCD4C4] bg-[#F5F1E7] px-5 py-4 text-xs motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-200"><p className="text-[#173A2E] leading-relaxed"><strong>Aporte general:</strong> {food.vitamin}</p><p className="text-[#5E806E] leading-relaxed mt-2"><strong className="text-[#173A2E]">Idea sencilla:</strong> {food.idea}</p></div>}</article>; })}</div><div className="rounded-3xl bg-[#0F3A2D] text-white p-6 sm:p-8 grid md:grid-cols-[auto_1fr] gap-5 items-start"><div className={`w-14 h-14 rounded-2xl ${selectedFood.color} text-white flex items-center justify-center`}><SelectedIcon className="w-7 h-7" /></div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Ficha seleccionada</div><h3 className="font-display text-2xl font-bold mt-1">{selectedFood.name}</h3><p className="text-sm text-white/75 mt-3">{selectedFood.vitamin}</p><div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/75"><Info className="w-4 h-4 inline-block mr-1.5 text-[#D9FF2B]" /> No son recomendaciones personalizadas ni sustituyen consejo médico o nutricional.</div></div></div></div>;
}

function KiviPanel({ activeFaqId, setActiveFaqId, activeFaq }: { activeFaqId: string; setActiveFaqId: React.Dispatch<React.SetStateAction<string>>; activeFaq: typeof FAQS[number] }) {
  return <div className="space-y-6"><div className="rounded-3xl bg-[#0F3A2D] text-white p-7 sm:p-9"><div className="flex gap-4"><div className="w-13 h-13 shrink-0 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display font-bold text-xl">K</div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Hola, soy Kivi</div><h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">Te ayudo a encontrar tu camino dentro de KurevaLife.</h2><p className="text-sm text-white/75 mt-3 max-w-2xl">Soy una guía de navegación en esta prueba. No soy médico, no diagnostico y no sustituyo una atención urgente o profesional.</p></div></div></div><div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-5"><div className="space-y-2"><div className="text-xs uppercase tracking-wider font-bold text-[#5E806E] mb-3">Preguntas frecuentes</div>{FAQS.map((faq) => <button key={faq.id} onClick={() => setActiveFaqId(faq.id)} aria-pressed={activeFaqId === faq.id} className={`w-full rounded-xl p-4 text-left text-sm border ${activeFaqId === faq.id ? "bg-[#DCE8DD] border-[#B9D0BE] text-[#0F3A2D]" : "bg-white border-[#DCD4C4] text-[#173A2E] hover:border-[#0F3A2D]"}`}>{faq.question}</button>)}</div><div className="rounded-2xl bg-white border border-[#DCD4C4] p-6"><div className="flex gap-2 items-center text-[#0F3A2D]"><MessageCircleHeart className="w-5 h-5" /><h3 className="font-display font-bold">Respuesta de Kivi</h3></div><p className="text-sm text-[#5E806E] leading-relaxed mt-4">{activeFaq.answer}</p><button onClick={() => toast.info("Puedes dejarla en la pestaña “Tu opinión” para que el equipo de Kureva la considere.")} className="mt-6 text-sm font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-4">Proponer una nueva pregunta</button></div></div></div>;
}

function ParticipationPanel({ view, setView }: { view: "privado" | "grupo" | "novedades"; setView: React.Dispatch<React.SetStateAction<"privado" | "grupo" | "novedades">> }) {
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Participar en KurevaLife</div><h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Tu opinión puede ser privada o compartida con el grupo.</h2><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">La opción privada se guarda en el registro interno del piloto. El grupo temporal es voluntario y solo lo pueden ver las personas que tienen este enlace mientras la ventana esté abierta.</p></div><div className="flex gap-2 overflow-x-auto pb-1">{[{ id: "privado" as const, label: "Sugerencia privada", icon: LockKeyhole }, { id: "grupo" as const, label: "Grupo de prueba", icon: UsersRound }, { id: "novedades" as const, label: "Novedades", icon: BellRing }].map((item) => { const Icon = item.icon; const selected = view === item.id; return <button key={item.id} onClick={() => setView(item.id)} aria-pressed={selected} className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border ${selected ? "bg-[#0F3A2D] text-white border-[#0F3A2D]" : "bg-white text-[#0F3A2D] border-[#DCD4C4]"}`}><Icon className={`w-4 h-4 ${selected ? "text-[#D9FF2B]" : ""}`} />{item.label}</button>; })}</div>{view === "privado" && <PilotFeedback defaultArea="kurevalife_simulator" />}{view === "grupo" && <CommunityPanel />}{view === "novedades" && <div className="max-w-2xl"><PilotInterestForm /></div>}</div>;
}

function CommunityPanel() {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [windowEndsAt, setWindowEndsAt] = useState<string | null>(null);
  const [category, setCategory] = useState<CommunityCategory>("general");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [now, setNow] = useState(Date.now());
  const refresh = async () => { setLoading(true); try { const [loaded, window] = await Promise.all([loadCommunityMessages(), loadPilotWindow()]); setMessages(loaded); setWindowEndsAt(window?.ends_at ?? null); } catch (error) { toast.error(error instanceof Error ? error.message : "No se ha podido cargar el grupo."); } finally { setLoading(false); } };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  const closed = Boolean(windowEndsAt && new Date(windowEndsAt).getTime() <= now);
  const publish = async (event: React.FormEvent) => { event.preventDefault(); if (message.trim().length < 10) { toast.error("Escribe una idea de al menos 10 caracteres."); return; } if (!anonymous && name.trim().length < 2) { toast.error("Escribe un nombre o selecciona la opción anónima."); return; } if (!consent) { toast.error("Confirma que entiendes que el mensaje será visible para el grupo temporal."); return; } setSending(true); try { await submitCommunityMessage({ display_name: anonymous ? "Persona Kureva" : name.trim(), is_anonymous: anonymous, category, message: message.trim(), consent_public: true, visible_until: new Date(Date.now() + 86_400_000).toISOString() }); setMessage(""); setConsent(false); await refresh(); toast.success("Idea compartida con el grupo de prueba."); } catch (error) { toast.error(error instanceof Error ? error.message : "No se ha podido publicar la idea."); } finally { setSending(false); } };
  const liveMessages = messages.filter((item) => new Date(item.visible_until).getTime() > now);
  return <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-5"><div className="space-y-4"><div className="rounded-2xl bg-[#0F3A2D] text-white p-5"><div className="flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Clock3 className="w-4 h-4" /> Conversación temporal</div><div className="font-display text-3xl font-bold mt-2">{closed ? "Cerrada" : windowEndsAt ? formatRemaining(windowEndsAt) : "24 h"}</div><p className="text-xs text-white/65 mt-2">{windowEndsAt ? "La conversación se cierra para todos al terminar esta ventana." : "La ventana compartida empieza con la primera publicación."}</p></div><div className="rounded-xl bg-[#FFF7D8] border border-[#E8D592] p-4 text-xs text-[#5A4B13] leading-relaxed"><ShieldAlert className="w-4 h-4 inline-block align-text-bottom mr-1" /> Comparte solo ideas de producto. No publiques información de salud, documentos, correos, direcciones, teléfonos ni contraseñas.</div><form onSubmit={publish} className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4"><div><h3 className="font-display text-lg font-bold text-[#0F3A2D]">Compartir con el grupo</h3><p className="text-xs text-[#5E806E] mt-1">Visible únicamente a quienes tienen este enlace mientras dure la prueba.</p></div><select value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm"><>{COMMUNITY_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</></select><label className="flex gap-2 text-xs text-[#5E806E] cursor-pointer"><input checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} type="checkbox" className="mt-0.5 size-4 accent-[#0F3A2D]" /><span><strong className="text-[#173A2E]">Publicar de forma anónima.</strong> Aparecerá como “Persona Kureva”.</span></label>{!anonymous && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre visible durante la prueba" required className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm" />}<textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={500} rows={4} placeholder="Ej.: Me serviría que la información de alimentos se abriera dentro de la tarjeta." className="w-full rounded-xl border border-[#DCD4C4] p-3 text-sm resize-y" /><label className="flex gap-2 text-xs text-[#5E806E] cursor-pointer"><input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" required className="mt-0.5 size-4 accent-[#0F3A2D]" /><span>Entiendo que este comentario será visible para el grupo durante 24 horas y que no incluye datos personales o de salud.</span></label><button disabled={sending || closed} type="submit" className="kureva-btn-primary w-full justify-center disabled:opacity-60"><Send className="w-4 h-4" /> {closed ? "Ventana cerrada" : sending ? "Compartiendo…" : "Compartir idea"}</button></form></div><div className="rounded-2xl border border-[#DCD4C4] bg-white p-5"><div className="flex items-start justify-between gap-4 mb-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Ideas del grupo</div><h3 className="font-display text-lg font-bold text-[#0F3A2D]">Conversación activa</h3></div><button onClick={refresh} className="w-9 h-9 rounded-lg border border-[#DCD4C4] flex items-center justify-center" aria-label="Actualizar conversación"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button></div>{loading ? <div className="py-8 text-center text-sm text-[#5E806E]">Cargando ideas…</div> : liveMessages.length === 0 ? <div className="rounded-xl bg-[#F5F1E7] p-5 text-center text-sm text-[#5E806E]">Aún no hay ideas compartidas. La primera publicación inicia la ventana de 24 horas.</div> : <div className="space-y-3">{liveMessages.map((item) => <article key={item.id} className="rounded-xl border border-[#DCD4C4] bg-[#FFFDF8] p-4"><div className="flex justify-between gap-3"><div><strong className="font-display text-sm text-[#0F3A2D]">{item.display_name}</strong><div className="text-[10px] text-[#5E806E] mt-0.5">{COMMUNITY_CATEGORIES.find((categoryItem) => categoryItem.value === item.category)?.label}</div></div><span className="text-[10px] text-[#5E806E] whitespace-nowrap">{formatRemaining(item.visible_until)}</span></div><p className="text-sm text-[#5E806E] leading-relaxed mt-3">{item.message}</p></article>)}</div>}</div></div>;
}

import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  Activity,
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
  LoaderCircle,
  MessageCircleHeart,
  Pill,
  Plus,
  RefreshCw,
  Salad,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  Volume2,
  VolumeX,
  Moon,
  TextCursorInput,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PilotFeedback } from "@/components/PilotFeedback";
import { PilotInterestForm } from "@/components/PilotInterestForm";
import { InstallKurevaLife } from "@/components/InstallKurevaLife";
import {
  type CommunityCategory,
  type CommunityMessage,
  loadCommunityMessages,
  loadPilotWindow,
  submitCommunityMessage,
} from "@/lib/pilotFeedback";

type AppTab = "inicio" | "salud" | "avisos" | "alimentos" | "kivi" | "participar";
type TrackChoice = "tension" | "glucosa" | "peso" | "edad" | "medicacion" | "citas" | "agua" | "sueno";
type RecordKind = "Tensión" | "Glucosa" | "Peso" | "Molestia";
type HealthRecord = { id: string; kind: RecordKind; value: string; note: string; createdAt: string };
type Reminder = { id: string; label: string; time: string; frequency: string; createdAt: string };
type DocumentItem = { id: string; name: string; date: string; source: "manual" | "archivo" };
type Profile = { age: string; weight: string; gender: string; diagnoses: string[] };
type Registration = { firstName: string; lastName: string; email: string; password: string; gender: string; privacy: boolean };

type Food = { id: string; name: string; type: string; vitamin: string; idea: string; color: string; icon: typeof Apple };

const FOOD: Food[] = [
  { id: "higo", name: "Higo", type: "Fruta de temporada", vitamin: "Aporta fibra y contiene vitamina B6.", idea: "Prueba medio higo con yogur natural o en una tostada.", color: "bg-[#5C3D5A]", icon: Apple },
  { id: "granada", name: "Granada", type: "Fruta de temporada", vitamin: "Aporta fibra y vitamina C.", idea: "Añade unos granos a una ensalada o a un bol de yogur.", color: "bg-[#A63744]", icon: Apple },
  { id: "pimiento", name: "Pimiento rojo", type: "Verdura de temporada", vitamin: "Destaca por su vitamina C y provitamina A.", idea: "Asado, en tiras con legumbres o en una crema suave.", color: "bg-[#C94E3E]", icon: Salad },
  { id: "calabaza", name: "Calabaza", type: "Verdura de temporada", vitamin: "Aporta betacarotenos, precursores de la vitamina A.", idea: "En crema, al horno o acompañando un plato de arroz.", color: "bg-[#CB7A2A]", icon: Salad },
];

const TRACKS: { id: TrackChoice; label: string; detail: string; icon: typeof Activity }[] = [
  { id: "tension", label: "Tensión", detail: "Anotar una medida", icon: Activity },
  { id: "glucosa", label: "Glucosa", detail: "Registrar una lectura", icon: Activity },
  { id: "peso", label: "Peso y edad", detail: "Tener datos básicos a mano", icon: Scale },
  { id: "medicacion", label: "Medicación", detail: "Crear recordatorios", icon: Pill },
  { id: "citas", label: "Citas médicas", detail: "Reunir notas y preguntas", icon: FileText },
  { id: "agua", label: "Agua", detail: "Organizar recordatorios", icon: Droplets },
  { id: "sueno", label: "Descanso y molestias", detail: "Anotar cómo me siento", icon: HeartHandshake },
  { id: "edad", label: "Mi información", detail: "Organizar la ficha personal", icon: Stethoscope },
];

const COMMON_DIAGNOSES = ["Hipertensión", "Migraña", "Hipotiroidismo", "Hipertiroidismo", "Insomnio", "Cirugía reciente", "Otra condición"];
const KUREVA_HOME_URL = "https://kurevadigitaldata.manus.space/";
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

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function formatRemaining(iso: string) {
  const milliseconds = Math.max(0, new Date(iso).getTime() - Date.now());
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

function currentTime() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function KurevaLifeApp() {
  const [started, setStarted] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [registration, setRegistration] = useState<Registration>({ firstName: "", lastName: "", email: "", password: "", gender: "prefiero no decirlo", privacy: false });
  const [tracks, setTracks] = useState<TrackChoice[]>(["tension", "medicacion", "citas"]);
  const [openTopic, setOpenTopic] = useState("");
  const [tab, setTab] = useState<AppTab>("inicio");
  const [seconds, setSeconds] = useState(300);
  const [paused, setPaused] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [profile, setProfile] = useState<Profile>({ age: "", weight: "", gender: "prefiero no decirlo", diagnoses: [] });
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState("higo");
  const [participationView, setParticipationView] = useState<"privado" | "grupo" | "novedades">("privado");
  const [completionShown, setCompletionShown] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    if (!started || paused || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, paused, seconds]);

  useEffect(() => {
    if (started && seconds === 0 && !completionShown) {
      setCompletionShown(true);
      setTab("participar");
      toast.success("Has completado el recorrido. Gracias por acompañar a KurevaLife.");
    }
  }, [started, seconds, completionShown]);

  const firstName = registration.firstName.trim() || "amiga";
  const selectedFood = FOOD.find((item) => item.id === selectedFoodId) ?? FOOD[0];
  const timerProgress = ((300 - seconds) / 300) * 100;

  const toggleTrack = (id: TrackChoice) => setTracks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const playConfirmationSound = () => {
    if (!soundOn) return;
    try {
      const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Audio) return;
      const context = new Audio();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.14);
      gain.gain.setValueAtTime(0.001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.19);
    } catch { /* Device audio is optional. */ }
  };

  const toggleReading = () => {
    if (!("speechSynthesis" in window)) {
      toast.info("La lectura en voz alta depende de las opciones de accesibilidad de este dispositivo.");
      return;
    }
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }
    const activeContent = document.querySelector("[data-kureva-content]")?.textContent ?? "";
    if (!activeContent.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeContent.slice(0, 4200));
    utterance.lang = "es-ES";
    utterance.rate = 0.94;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    setIsReading(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  const startSimulation = () => {
    setStarted(true);
    setPaused(false);
    setTab("inicio");
    playConfirmationSound();
    toast.success(`Hola ${firstName}, tu prueba local de KurevaLife ya ha comenzado.`);
  };

  const restartSimulation = () => {
    setSeconds(300);
    setPaused(false);
    setTab("inicio");
    setRecords([]);
    setReminders([]);
    setProfile({ age: "", weight: "", gender: registration.gender, diagnoses: [] });
    setDocuments([]);
    setCompletionShown(false);
    toast.success("La simulación se ha reiniciado. Tus datos de prueba se han borrado de este dispositivo.");
  };

  const addRecord = (record: Omit<HealthRecord, "id" | "createdAt">) => {
    setRecords((current) => [{ ...record, id: `${record.kind}-${Date.now()}`, createdAt: currentTime() }, ...current]);
    playConfirmationSound();
    toast.success(`${record.kind} registrado correctamente en esta sesión de prueba.`);
  };

  const addReminder = (reminder: Omit<Reminder, "id" | "createdAt">) => {
    setReminders((current) => [{ ...reminder, id: `reminder-${Date.now()}`, createdAt: currentTime() }, ...current]);
    playConfirmationSound();
    toast.success("Recordatorio visual creado. Las notificaciones push se activarán cuando KurevaLife esté online.");
  };

  const exportPdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const forest: [number, number, number] = [15, 58, 45];
    const cream: [number, number, number] = [245, 241, 231];
    const ink: [number, number, number] = [23, 58, 46];
    const moss: [number, number, number] = [94, 128, 110];
    const lime: [number, number, number] = [217, 255, 43];
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const text = (copy: string, x: number, y: number, size = 10, color: [number, number, number] = ink, style: "normal" | "bold" = "normal", align: "left" | "center" | "right" = "left") => { doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(...color); doc.text(copy, x, y, { align }); };
    const paragraph = (copy: string, x: number, y: number, maxWidth: number, color: [number, number, number] = moss) => { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...color); const lines = doc.splitTextToSize(copy, maxWidth) as string[]; doc.text(lines, x, y, { lineHeightFactor: 1.45 }); return y + lines.length * 4.6; };
    const footer = () => { doc.setDrawColor(220, 212, 196); doc.line(18, height - 18, width - 18, height - 18); text("KurevaLife · informe local de simulación", 18, height - 11, 7.3, moss); text(new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()), width - 18, height - 11, 7.3, moss, "normal", "right"); };
    const page = () => { footer(); doc.addPage(); doc.setFillColor(...cream); doc.rect(0, 0, width, height, "F"); doc.setFillColor(...forest); doc.rect(0, 0, width, 22, "F"); text("KUREVALIFE · INFORME LOCAL", 18, 14, 8, cream, "bold"); return 38; };

    doc.setFillColor(...cream); doc.rect(0, 0, width, height, "F");
    doc.setFillColor(...forest); doc.rect(0, 0, width, 46, "F");
    doc.setDrawColor(...lime); doc.setLineWidth(0.5); doc.circle(width - 22, 20, 13, "S"); doc.setFillColor(...lime); doc.roundedRect(width - 28, 14, 12, 12, 3, 3, "F");
    text("K", width - 22, 22.3, 11, forest, "bold", "center");
    text("KUREVALIFE", 18, 16, 11, cream, "bold");
    text("BY KUREVA · INFORME DE PRUEBA", 18, 24, 7.2, lime, "bold");
    text("Mi resumen de simulación", 18, 64, 23, forest, "bold");
    let y = paragraph(`Sesión creada para ${firstName}. Este documento reúne solo lo que se ha escrito durante esta simulación local.`, 18, 78, 172);
    y += 6;
    doc.setFillColor(220, 232, 221); doc.roundedRect(18, y, 172, 20, 4, 4, "F");
    text("Observación importante", 23, y + 6, 8, forest, "bold");
    paragraph("No somos médicos ni sustituimos el trabajo de tu médico. KurevaLife organiza los registros que tú elijas para ayudarte a no olvidar lo importante, pero no interpreta resultados ni indica tratamientos.", 23, y + 11, 160, forest);
    y += 29;
    const fit = (needed: number) => { if (y + needed > height - 28) y = page(); };
    const heading = (label: string) => { fit(15); text(label, 18, y, 12.5, forest, "bold"); y += 8; };
    const item = (label: string) => { fit(7); text(`• ${label}`, 21, y, 9, ink); y += 6; };

    heading("Ficha anotada");
    paragraph(`Edad: ${profile.age || "sin registrar"} · Peso: ${profile.weight ? `${profile.weight} kg` : "sin registrar"} · Género: ${profile.gender || "sin indicar"}.`, 21, y, 168); y += 10;
    if (profile.diagnoses.length) { paragraph(`Condiciones documentadas: ${profile.diagnoses.join(", ")}.`, 21, y, 168); y += 10; }
    heading("Registros de esta sesión");
    if (!records.length) item("No se registraron mediciones o molestias.");
    records.forEach((record) => item(`${record.kind}: ${record.value || "sin valor"}${record.note ? ` · ${record.note}` : ""} · ${record.createdAt}`));
    heading("Recordatorios de prueba");
    if (!reminders.length) item("No se registraron recordatorios.");
    reminders.forEach((reminder) => item(`${reminder.label} · ${reminder.time} · ${reminder.frequency}`));
    heading("Documentos anotados");
    if (!documents.length) item("No se adjuntaron o anotaron documentos.");
    documents.forEach((document) => item(`${document.name}${document.date ? ` · ${document.date}` : ""} · ${document.source === "archivo" ? "archivo local de prueba" : "anotación manual"}`));
    footer();

    const filename = `KurevaLife_informe_local_${new Intl.DateTimeFormat("sv-SE").format(new Date())}.pdf`;
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isAppleMobile) window.setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 120);
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    playConfirmationSound();
    toast.success(isAppleMobile ? "El informe se ha abierto para que puedas guardarlo o compartirlo desde tu iPhone o iPad." : "PDF preparado y descargado. Revisa la carpeta Descargas de tu navegador.");
  };

  if (!started) return <Onboarding registration={registration} setRegistration={setRegistration} tracks={tracks} toggleTrack={toggleTrack} openTopic={openTopic} setOpenTopic={setOpenTopic} step={onboardingStep} setStep={setOnboardingStep} start={startSimulation} />;

  const nav: { id: AppTab; label: string; icon: typeof Clock3; note: string }[] = [
    { id: "inicio", label: "Inicio", icon: Clock3, note: "Mi recorrido" },
    { id: "salud", label: "Registrar", icon: Stethoscope, note: `${records.length} registro${records.length === 1 ? "" : "s"}` },
    { id: "avisos", label: "Avisos", icon: BellRing, note: `${reminders.length} alerta${reminders.length === 1 ? "" : "s"}` },
    { id: "alimentos", label: "Alimentos", icon: Apple, note: "Temporada" },
    { id: "kivi", label: "Kivi y soporte", icon: MessageCircleHeart, note: "Guía" },
    { id: "participar", label: "Tu opinión", icon: HeartHandshake, note: "Valoración" },
  ];

  return <section id="kurevalife-app" className={`kurevalife-shell min-h-[100dvh] ${nightMode ? "bg-[#071C15]" : "bg-[#F5F1E7]"} py-0 sm:py-5`}><div className={`w-full max-w-7xl mx-auto ${largeText ? "text-[112.5%]" : ""}`}><div className={`min-h-[100dvh] sm:min-h-0 sm:rounded-3xl overflow-hidden border shadow-2xl ${nightMode ? "bg-[#0B2B21] border-[#335E4D]" : highContrast ? "bg-white border-[#09241B]" : "bg-[#FFFDF8] border-[#DCD4C4]"}`}>
    <header className="kureva-app-header bg-[#0F3A2D] text-white px-4 sm:px-7 py-3.5 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
      <div className="flex items-center gap-3"><div className="relative w-11 h-11 shrink-0"><div className="absolute inset-0 rounded-full border border-[#D9FF2B]/50 kureva-k-orbit" /><div className="absolute inset-1.5 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display font-bold text-xl kureva-k-pulse">K</div></div><div><div className="font-display font-bold">KurevaLife</div><div className="text-[11px] text-white/65">Hola, {firstName} · sesión privada en este dispositivo</div></div></div>
      <div className="kureva-app-actions flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5" aria-label={`Temporizador virtual: ${formatTime(seconds)}`}><div className="relative w-7 h-7 rounded-full" style={{ background: `conic-gradient(#D9FF2B ${timerProgress}%, rgba(255,255,255,.18) 0)` }}><div className="absolute inset-[3px] rounded-full bg-[#0F3A2D]" /></div><span className="font-mono text-xs text-[#D9FF2B]">{seconds ? formatTime(seconds) : "Listo"}</span></div>
        <button onClick={() => setPaused((value) => !value)} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold hover:bg-white/10">{paused ? "Continuar" : "Pausar"}</button>
        <button onClick={() => setToolsOpen((value) => !value)} aria-expanded={toolsOpen} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold hover:bg-white/10">{toolsOpen ? "Cerrar ajustes" : "Ajustes"}</button>
        <button onClick={exportPdf} className="rounded-full bg-[#D9FF2B] text-[#0F3A2D] px-3 py-1.5 text-[11px] font-bold hover:bg-[#e6ff5a]"><Download className="w-3.5 h-3.5 inline mr-1" />Descargar informe</button>
        {toolsOpen && <div className="kureva-extra-tools flex flex-wrap items-center gap-2 basis-full xl:basis-auto"><button onClick={restartSimulation} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-bold hover:bg-white/10">Reiniciar</button><button onClick={() => setLargeText((value) => !value)} aria-pressed={largeText} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white/10"><TextCursorInput className="w-3.5 h-3.5 inline mr-1" />Texto +</button><button onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white/10"><Sun className="w-3.5 h-3.5 inline mr-1" />Contraste</button><button onClick={() => setNightMode((value) => !value)} aria-pressed={nightMode} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white/10"><Moon className="w-3.5 h-3.5 inline mr-1" />{nightMode ? "Día" : "Noche"}</button><button onClick={toggleReading} aria-pressed={isReading} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white/10">{isReading ? <VolumeX className="w-3.5 h-3.5 inline mr-1" /> : <Volume2 className="w-3.5 h-3.5 inline mr-1" />}{isReading ? "Detener voz" : "Escuchar"}</button><button onClick={() => setSoundOn((value) => !value)} aria-pressed={soundOn} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px] hover:bg-white/10">{soundOn ? <Volume2 className="w-3.5 h-3.5 inline mr-1" /> : <VolumeX className="w-3.5 h-3.5 inline mr-1" />}{soundOn ? "Sonido sí" : "Sonido no"}</button></div>}
      </div>
    </header>
    <div className="grid xl:grid-cols-[230px_minmax(0,1fr)]"><aside className="kureva-app-nav bg-[#FAF7F0] border-b xl:border-b-0 xl:border-r border-[#DCD4C4] p-4 sm:p-5"><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E] mb-3">Mi KurevaLife</div><nav className="kureva-app-nav-grid flex xl:flex-col gap-2 overflow-x-auto pb-1" aria-label="Secciones del simulador">{nav.map((item) => { const Icon = item.icon; const selected = tab === item.id; return <button key={item.id} onClick={() => setTab(item.id)} aria-pressed={selected} className={`shrink-0 min-w-37 xl:w-full rounded-xl p-3 text-left transition-colors ${selected ? "bg-[#0F3A2D] text-white shadow-md" : "text-[#0F3A2D] hover:bg-white"}`}><div className="flex gap-2 items-center"><Icon className={`w-4 h-4 ${selected ? "text-[#D9FF2B]" : "text-[#5E806E]"}`} /><span className="font-display font-bold text-sm">{item.label}</span></div><span className={`block text-[10px] mt-1.5 ${selected ? "text-white/65" : "text-[#5E806E]"}`}>{item.note}</span></button>; })}</nav><div className="hidden xl:block rounded-xl bg-white border border-[#DCD4C4] mt-6 p-4 text-[11px] leading-relaxed text-[#5E806E]"><LockKeyhole className="w-4 h-4 text-[#0F3A2D] mb-2" /> Tus registros de salud, fotos y documentos de esta simulación no se envían a Kureva. Solo la valoración que decidas enviar se registra por separado.</div></aside>
    <main data-kureva-content className={`kureva-app-main p-4 sm:p-7 min-w-0 ${nightMode ? "kureva-night-content" : ""}`}>{tab === "inicio" && <HomePanel firstName={firstName} seconds={seconds} paused={paused} tracks={tracks} reminders={reminders} records={records} setTab={setTab} onFinish={() => { setPaused(true); setCompletionShown(true); setTab("participar"); }} />}{tab === "salud" && <HealthPanel profile={profile} setProfile={setProfile} records={records} addRecord={addRecord} documents={documents} setDocuments={setDocuments} />}{tab === "avisos" && <RemindersPanel firstName={firstName} reminders={reminders} addReminder={addReminder} />}{tab === "alimentos" && <FoodPanel selectedFoodId={selectedFoodId} setSelectedFoodId={setSelectedFoodId} selectedFood={selectedFood} />}{tab === "kivi" && <KiviPanel firstName={firstName} onOpenFeedback={() => setTab("participar")} />}{tab === "participar" && <ParticipationPanel view={participationView} setView={setParticipationView} />}</main></div></div></div></section>;
}

function Onboarding({ registration, setRegistration, tracks, toggleTrack, openTopic, setOpenTopic, step, setStep, start }: { registration: Registration; setRegistration: React.Dispatch<React.SetStateAction<Registration>>; tracks: TrackChoice[]; toggleTrack: (id: TrackChoice) => void; openTopic: string; setOpenTopic: React.Dispatch<React.SetStateAction<string>>; step: number; setStep: React.Dispatch<React.SetStateAction<number>>; start: () => void }) {
  const canContinue = step === 0 ? Boolean(registration.firstName.trim() && registration.lastName.trim() && registration.email.trim() && registration.password && registration.privacy) : step === 1 ? tracks.length > 0 : true;
  const next = () => { if (!canContinue) { toast.error(step === 0 ? "Completa los campos y confirma la privacidad para seguir." : "Elige al menos un tema que quieras probar."); return; } setStep((value) => Math.min(2, value + 1)); };
  const topic = openTopic.trim();
  return <section className="kureva-onboarding min-h-[100dvh] bg-[#F5F1E7] flex sm:items-center py-0 sm:py-10"><div className="kureva-onboarding-shell w-full max-w-5xl mx-auto sm:container"><div className="kureva-onboarding-card min-h-[100dvh] sm:min-h-0 sm:rounded-3xl overflow-hidden shadow-2xl border border-[#164D3C] bg-[#0F3A2D] text-white grid lg:grid-cols-[1.08fr_0.92fr]"><div className="kureva-onboarding-form p-7 sm:p-10 space-y-6"><div className="inline-flex items-center gap-2 text-sm font-bold text-white/80"><span className="relative w-8 h-8"><span className="absolute -inset-1 rounded-xl border border-[#D9FF2B]/45 kureva-k-orbit" /><span className="relative w-8 h-8 rounded-lg bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display">K</span></span> Kureva <span className="font-normal text-white/60">· Lo digital, en tus manos</span></div><div className="flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> Simulación guiada · paso {step + 1} de 3</div><div className="w-55 max-w-full"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTAwIDgwMCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsbGVkYnk9InRpdGxlIGRlc2MiPgogIDx0aXRsZSBpZD0idGl0bGUiPkZpcm1hIEt1cmV2YUxpZmU8L3RpdGxlPgogIDxkZXNjIGlkPSJkZXNjIj5TdWJtYXJjYSBLdXJldmFMaWZlIHJlc3BhbGRhZGEgcG9yIGVsIGlzb3RpcG8gSyBmbHVpZGEgZGUgS3VyZXZhLjwvZGVzYz4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MCAwKSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMEYzQTJEIiBzdHJva2Utd2lkdGg9Ijg2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgogICAgPHBhdGggZD0iTTIzNiA2MjhWMjUyQzIzNiAxMTggNDE0IDExOCA0MTQgMjUyVjM3MiIvPgogICAgPHBhdGggZD0iTTQxNCAzNzJMNjM0IDE2NCIvPgogICAgPHBhdGggZD0iTTQxNCAzNzJMNjM0IDYwNiIvPgogIDwvZz4KICA8cGF0aCBkPSJNMzQwIDQ5MUw0NDQgMzgzIiBmaWxsPSJub25lIiBzdHJva2U9IiNEOUZGMkIiIHN0cm9rZS13aWR0aD0iMjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDx0ZXh0IHg9IjgxMCIgeT0iNDA1IiBmaWxsPSIjMEYzQTJEIiBmb250LWZhbWlseT0iTm90byBTYW5zLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMTAiIGZvbnQtd2VpZ2h0PSI2NTAiIGxldHRlci1zcGFjaW5nPSItOSI+S3VyZXZhTGlmZTwvdGV4dD4KICA8dGV4dCB4PSI4MjAiIHk9IjUyMCIgZmlsbD0iIzVFODA2RSIgZm9udC1mYW1pbHk9Ik5vdG8gU2FucywgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDciIGZvbnQtd2VpZ2h0PSI1MDAiIGxldHRlci1zcGFjaW5nPSI3Ij5CWSBLVVJFVkE8L3RleHQ+Cjwvc3ZnPgo=" alt="KurevaLife by Kureva" className="w-full brightness-0 invert" /></div>{step === 0 && <><h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">Regístrate para iniciar tu recorrido de prueba.</h1><p className="text-white/75 leading-relaxed"><strong className="text-white">Gracias por acompañar el nacimiento de KurevaLife.</strong> Esto crea una sesión ficticia y local, no una cuenta real. Tu nombre se usa solo para personalizar esta experiencia y desaparece cuando la reinicias o cierras.</p><div className="grid sm:grid-cols-2 gap-3"><Field label="Nombre" id="first-name" value={registration.firstName} onChange={(value) => setRegistration((current) => ({ ...current, firstName: value }))} placeholder="Ej.: Nathalia" /><Field label="Apellidos" id="last-name" value={registration.lastName} onChange={(value) => setRegistration((current) => ({ ...current, lastName: value }))} placeholder="Tus apellidos" /><Field label="Correo" id="register-email" value={registration.email} onChange={(value) => setRegistration((current) => ({ ...current, email: value }))} type="email" placeholder="tu@correo.es" /><Field label="Contraseña de prueba" id="register-password" value={registration.password} onChange={(value) => setRegistration((current) => ({ ...current, password: value }))} type="password" placeholder="No se guarda" /><div className="sm:col-span-2"><label htmlFor="register-gender" className="text-xs font-bold text-white/75">Cómo quieres identificarte</label><select id="register-gender" value={registration.gender} onChange={(event) => setRegistration((current) => ({ ...current, gender: event.target.value }))} className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm"><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="prefiero no decirlo">Prefiero no decirlo</option></select></div></div><label className="flex gap-3 text-xs leading-relaxed text-white/75 cursor-pointer"><input checked={registration.privacy} onChange={(event) => setRegistration((current) => ({ ...current, privacy: event.target.checked }))} type="checkbox" className="mt-0.5 size-4 accent-[#D9FF2B]" /><span><strong className="text-white">Entiendo que esto es una simulación.</strong> Mis datos de registro, notas de salud, archivos y fotos se quedan únicamente en este navegador durante la prueba. No se crea una cuenta ni se guarda información clínica.</span></label></>}{step === 1 && <><h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">Cuéntanos qué quieres organizar.</h1><p className="text-white/75 leading-relaxed">Elige los temas que te interesan. Así KurevaLife te mostrará un recorrido más cercano a lo que necesitarías en una aplicación real.</p><div className="grid sm:grid-cols-2 gap-3">{TRACKS.map((track) => { const Icon = track.icon; const selected = tracks.includes(track.id); return <button type="button" key={track.id} onClick={() => toggleTrack(track.id)} aria-pressed={selected} className={`rounded-2xl text-left p-4 border transition-colors ${selected ? "bg-[#D9FF2B] text-[#0F3A2D] border-[#D9FF2B]" : "bg-white/8 text-white border-white/15 hover:bg-white/12"}`}><Icon className={`w-5 h-5 ${selected ? "text-[#0F3A2D]" : "text-[#D9FF2B]"}`} /><strong className="font-display block mt-3">{track.label}</strong><span className={`block text-xs mt-1 ${selected ? "text-[#173A2E]/75" : "text-white/60"}`}>{track.detail}</span>{selected && <Check className="w-4 h-4 float-right -mt-4" />}</button>; })}</div><label className="block text-xs font-bold text-white/75">¿Hay algo más que quieras registrar?<textarea value={openTopic} onChange={(event) => setOpenTopic(event.target.value)} maxLength={300} rows={3} placeholder="Ej.: evolución de una cirugía, preguntas para una cita, hábitos…" className="block w-full mt-2 rounded-xl bg-white/10 border border-white/15 p-3 text-sm text-white placeholder:text-white/40" /></label></>}{step === 2 && <><div className="relative w-24 h-24"><div className="absolute inset-0 rounded-full border border-[#D9FF2B]/45 kureva-k-orbit" /><div className="absolute inset-3 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-3xl font-bold kureva-k-pulse">K</div></div><h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">Hola, {registration.firstName}. Bienvenida a KurevaLife.</h1><p className="text-white/75 leading-relaxed">Ahora empieza tu recorrido virtual de cinco minutos. Podrás pausar, reiniciar, registrar tensión o glucosa con datos de ejemplo, añadir una foto o archivo solo de forma local, probar recordatorios y descargar tu informe local.</p>{topic && <div className="rounded-xl bg-white/10 border border-white/10 p-4 text-sm text-white/75"><strong className="text-[#D9FF2B]">También tendremos presente:</strong> {topic}</div>}<div className="rounded-xl bg-[#DCE8DD] text-[#0F3A2D] p-4 text-sm leading-relaxed"><ShieldCheck className="w-4 h-4 inline-block mr-1.5" /><strong>Antes de empezar:</strong> KurevaLife organiza; no diagnostica, no interpreta analíticas ni sustituye a tu médico. Ante una duda de salud, consulta con tu profesional.</div></>}</div><aside className="kureva-onboarding-guide bg-[#09241B] p-7 sm:p-10 flex flex-col justify-between gap-10"><div><div className="relative w-32 h-32"><div className="absolute inset-0 rounded-full border border-[#D9FF2B]/35 kureva-k-orbit" /><div className="absolute inset-5 rounded-full border border-white/10 kureva-k-orbit-reverse" /><div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-2xl font-bold kureva-k-breathe">K</div></div><h2 className="font-display text-2xl font-bold mt-7">Una app que acompaña.</h2><p className="text-sm text-white/65 mt-2">Tu prueba incluye pausa, texto ampliado, alto contraste, Kivi y un informe descargable.</p></div><div className="space-y-2">{["Registro de simulación", "Elijo lo que quiero organizar", "Empiezo mi recorrido"].map((label, index) => <button type="button" key={label} onClick={() => setStep(index)} className={`w-full text-left rounded-xl px-3 py-3 flex items-center gap-3 ${step === index ? "bg-white/10" : "hover:bg-white/5"}`}><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index <= step ? "bg-[#D9FF2B] text-[#0F3A2D]" : "bg-white/10 text-white/65"}`}>{index < step ? <Check className="w-3.5 h-3.5" /> : index + 1}</span><span className={`text-xs ${step === index ? "text-white" : "text-white/60"}`}>{label}</span></button>)}</div><div className="flex flex-wrap gap-2">{step > 0 && <button onClick={() => setStep((value) => value - 1)} className="px-4 py-2.5 text-sm font-bold text-white/80">Anterior</button>}{step < 2 ? <button onClick={next} className="kureva-btn-accent">Siguiente <ChevronRight className="w-4 h-4" /></button> : <button onClick={start} className="kureva-btn-accent">Empezar simulación <ChevronRight className="w-4 h-4" /></button>}</div></aside></div></div></section>;
}

function Field({ label, id, value, onChange, placeholder, type = "text" }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) { return <label htmlFor={id} className="block text-xs font-bold text-white/75">{label}<input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm" /></label>; }

function HomePanel({ firstName, seconds, paused, tracks, reminders, records, setTab, onFinish }: { firstName: string; seconds: number; paused: boolean; tracks: TrackChoice[]; reminders: Reminder[]; records: HealthRecord[]; setTab: React.Dispatch<React.SetStateAction<AppTab>>; onFinish: () => void }) {
  const selected = TRACKS.filter((item) => tracks.includes(item.id));
  return <div className="space-y-6"><div className="rounded-3xl bg-[#0F3A2D] text-white overflow-hidden p-6 sm:p-8 relative"><div className="absolute -right-9 -top-12 w-52 h-52 rounded-full border border-[#D9FF2B]/20 kureva-k-orbit" /><div className="relative grid lg:grid-cols-[1fr_auto] gap-5 items-center"><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Tu recorrido de prueba</div><h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">Hola, {firstName}. Kureva es tu fiel recordatorio.</h1><p className="text-sm text-white/75 mt-3 max-w-2xl">{paused ? "Has pausado el recorrido. Puedes continuar cuando quieras." : seconds ? "Explora a tu ritmo: ningún dato clínico de esta sesión se guarda fuera de este navegador." : "El temporizador ha terminado, pero puedes continuar explorando o reiniciar desde la cabecera."}</p></div><div className="rounded-2xl bg-white/10 border border-white/10 p-4 min-w-50"><div className="text-[10px] text-white/60 uppercase tracking-wider">Próximo paso</div><strong className="font-display block text-xl mt-1">{reminders[0]?.label ?? "Añade tu primer aviso"}</strong><span className="text-xs text-[#D9FF2B]">{reminders[0] ? `${reminders[0].time} · ${reminders[0].frequency}` : "Prueba los recordatorios"}</span></div></div></div><div className="grid sm:grid-cols-3 gap-4">{[{ title: "Registros", value: records.length, text: "Tensión, glucosa, peso o molestias", action: "Registrar ahora", tab: "salud" as AppTab, icon: Activity }, { title: "Avisos", value: reminders.length, text: "Medicación, agua o citas", action: "Crear aviso", tab: "avisos" as AppTab, icon: BellRing }, { title: "Informe", value: "PDF", text: "Resumen local para una cita", action: "Está en la cabecera", tab: "salud" as AppTab, icon: FileText }].map((card) => { const Icon = card.icon; return <button key={card.title} onClick={() => setTab(card.tab)} className="rounded-2xl border border-[#DCD4C4] bg-white p-5 text-left hover:border-[#0F3A2D] transition-colors"><Icon className="w-5 h-5 text-[#0F3A2D]" /><div className="flex items-baseline gap-2 mt-4"><strong className="font-display text-2xl text-[#0F3A2D]">{card.value}</strong><span className="text-xs text-[#5E806E]">{card.title}</span></div><p className="text-xs text-[#5E806E] mt-1">{card.text}</p><span className="inline-flex mt-3 text-xs font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-3">{card.action}</span></button>; })}</div><button type="button" onClick={onFinish} className="w-full sm:w-auto kureva-btn-accent mt-4"><CheckCircle2 className="w-4 h-4" />He terminado la prueba</button><div><div className="flex items-center justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Lo que elegiste organizar</div><h2 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Tu recorrido personalizado</h2></div><span className="text-xs rounded-full bg-[#DCE8DD] px-3 py-1.5 text-[#0F3A2D]"><Check className="w-3.5 h-3.5 inline mr-1" /> {selected.length} temas</span></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">{selected.map((item) => { const Icon = item.icon; return <div key={item.id} className="rounded-xl bg-[#F5F1E7] border border-[#DCD4C4] p-4"><Icon className="w-4 h-4 text-[#0F3A2D]" /><strong className="font-display block text-sm text-[#0F3A2D] mt-2">{item.label}</strong><span className="text-xs text-[#5E806E]">{item.detail}</span></div>; })}</div></div></div>;
}

function HealthPanel({ profile, setProfile, records, addRecord, documents, setDocuments }: { profile: Profile; setProfile: React.Dispatch<React.SetStateAction<Profile>>; records: HealthRecord[]; addRecord: (record: Omit<HealthRecord, "id" | "createdAt">) => void; documents: DocumentItem[]; setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>> }) {
  const [kind, setKind] = useState<RecordKind | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [diagnosisText, setDiagnosisText] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Analítica general");
  const [documentDate, setDocumentDate] = useState("");
  const [localFile, setLocalFile] = useState<File | null>(null);
  const saveRecord = (event: React.FormEvent) => { event.preventDefault(); if (!kind) return; if (!draftValue.trim() && !draftNote.trim()) { toast.error("Añade una medida o una nota de ejemplo para registrar."); return; } addRecord({ kind, value: draftValue.trim(), note: draftNote.trim() }); setKind(null); setDraftValue(""); setDraftNote(""); };
  const toggleDiagnosis = (diagnosis: string) => setProfile((current) => ({ ...current, diagnoses: current.diagnoses.includes(diagnosis) ? current.diagnoses.filter((item) => item !== diagnosis) : [...current.diagnoses, diagnosis] }));
  const addDiagnosis = () => { const value = diagnosisText.trim(); if (!value) return; setProfile((current) => ({ ...current, diagnoses: current.diagnoses.includes(value) ? current.diagnoses : [...current.diagnoses, value] })); setDiagnosisText(""); toast.success("Condición anotada solo en esta sesión de prueba."); };
  const addManualDocument = (event: React.FormEvent) => { event.preventDefault(); if (!documentDate) { toast.error("Elige una fecha de ejemplo para el documento."); return; } setDocuments((current) => [{ id: `manual-${Date.now()}`, name: documentTitle.trim() || "Analítica", date: documentDate, source: "manual" }, ...current]); setDocumentTitle("Analítica general"); setDocumentDate(""); toast.success("Documento anotado en tu simulación."); };
  const addLocalFile = () => { if (!localFile) { toast.error("Selecciona primero una foto, captura o archivo."); return; } setDocuments((current) => [{ id: `file-${Date.now()}`, name: localFile.name, date: "", source: "archivo" }, ...current]); setLocalFile(null); toast.success("Vista local preparada. El archivo no se ha subido ni enviado a Kureva."); };
  const valueHint = kind === "Tensión" ? "Ej.: 120/80 mmHg" : kind === "Glucosa" ? "Ej.: 98 mg/dL" : kind === "Peso" ? "Ej.: 68 kg" : "Ej.: dolor de cabeza leve";
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Registro personal · solo simulación</div><h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Registra lo que quieres tener presente.</h1><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">Los botones abren un registro real dentro de esta sesión. Prueba con datos inventados o no sensibles: nada se sube a la nube, no se interpreta y no sustituye a tu médico.</p></div>{kind && <form onSubmit={saveRecord} className="rounded-3xl bg-[#0F3A2D] text-white p-6 sm:p-7 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 duration-200"><div className="flex justify-between gap-4"><div><div className="text-xs text-[#D9FF2B] uppercase font-bold tracking-wider">Nuevo registro de prueba</div><h2 className="font-display text-2xl font-bold mt-1">Registrar {kind.toLowerCase()}</h2></div><button type="button" onClick={() => setKind(null)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center" aria-label="Cerrar registro"><X className="w-4 h-4" /></button></div><div className="grid sm:grid-cols-2 gap-4 mt-5"><FieldLight label={kind === "Molestia" ? "Cómo la describirías" : "Valor o ejemplo"} id="record-value" value={draftValue} setValue={setDraftValue} placeholder={valueHint} /><label htmlFor="record-note" className="block text-xs font-bold text-white/75">Nota opcional<textarea id="record-note" value={draftNote} onChange={(event) => setDraftNote(event.target.value)} rows={2} placeholder="Ej.: antes de desayunar, anotar para comentarlo en consulta…" className="w-full mt-1 rounded-xl bg-white text-[#173A2E] p-3 text-sm" /></label></div><div className="flex flex-wrap gap-3 mt-5"><button type="submit" className="kureva-btn-accent"><Check className="w-4 h-4" />Guardar registro local</button><span className="inline-flex items-center text-xs text-white/65"><LockKeyhole className="w-3.5 h-3.5 mr-1" />No se guarda fuera de la prueba</span></div></form>}<div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{([{ label: "Registrar tensión", kind: "Tensión" as RecordKind, icon: Activity, detail: "Anota una medida o nota" }, { label: "Registrar glucosa", kind: "Glucosa" as RecordKind, icon: Activity, detail: "Guarda una lectura de ejemplo" }, { label: "Registrar peso", kind: "Peso" as RecordKind, icon: Scale, detail: "Tenlo presente en tu ficha" }, { label: "Registrar molestia", kind: "Molestia" as RecordKind, icon: HeartHandshake, detail: "Descríbela con tus palabras" }]).map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => setKind(item.kind)} className="rounded-2xl border border-[#DCD4C4] bg-white p-5 text-left hover:border-[#0F3A2D] hover:-translate-y-0.5 transition-all"><Icon className="w-5 h-5 text-[#0F3A2D]" /><strong className="font-display block text-[#0F3A2D] mt-3">{item.label}</strong><span className="block text-xs text-[#5E806E] mt-1">{item.detail}</span><span className="inline-flex mt-3 text-xs font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-3">Abrir registro</span></button>; })}</div><div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5"><article className="rounded-2xl bg-[#0F3A2D] text-white p-6 sm:p-7"><div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><Stethoscope className="w-5 h-5" /></div><div><div className="text-[10px] text-[#D9FF2B] uppercase font-bold tracking-wider">Mi ficha · prueba local</div><h2 className="font-display text-xl font-bold mt-1">Documenta, no te autodiagnostiques.</h2></div></div><div className="grid sm:grid-cols-3 gap-3 mt-5"><FieldDark label="Edad" id="profile-age" value={profile.age} setValue={(value) => setProfile((current) => ({ ...current, age: value }))} placeholder="Ej.: 42" /><FieldDark label="Peso" id="profile-weight" value={profile.weight} setValue={(value) => setProfile((current) => ({ ...current, weight: value }))} placeholder="Ej.: 68 kg" /><label htmlFor="profile-gender" className="text-xs font-bold text-white/75">Cómo te identificas<select id="profile-gender" value={profile.gender} onChange={(event) => setProfile((current) => ({ ...current, gender: event.target.value }))} className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm"><option value="mujer">Mujer</option><option value="hombre">Hombre</option><option value="prefiero no decirlo">Prefiero no decirlo</option></select></label></div><div className="mt-5"><div className="text-xs font-bold text-white/75 mb-2">¿Tienes un diagnóstico o una condición que quieras recordar?</div><div className="flex flex-wrap gap-2">{COMMON_DIAGNOSES.map((diagnosis) => { const active = profile.diagnoses.includes(diagnosis); return <button key={diagnosis} type="button" onClick={() => toggleDiagnosis(diagnosis)} aria-pressed={active} className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${active ? "bg-[#D9FF2B] border-[#D9FF2B] text-[#0F3A2D]" : "bg-white/10 border-white/15 text-white"}`}>{active && <Check className="w-3 h-3 inline mr-1" />}{diagnosis}</button>; })}</div><div className="flex gap-2 mt-3"><input value={diagnosisText} onChange={(event) => setDiagnosisText(event.target.value)} placeholder="Ej.: otra condición o cirugía" className="h-10 flex-1 rounded-xl bg-white/10 border border-white/15 px-3 text-sm text-white placeholder:text-white/40" /><button type="button" onClick={addDiagnosis} className="w-10 h-10 rounded-xl bg-white text-[#0F3A2D] flex items-center justify-center" aria-label="Añadir condición"><Plus className="w-4 h-4" /></button></div></div><div className="mt-5 rounded-xl bg-white/10 p-3 text-xs text-white/70 leading-relaxed"><ShieldCheck className="w-4 h-4 inline mr-1.5 text-[#D9FF2B]" /> Solo se documenta para tenerlo presente. KurevaLife no guía tratamientos ni hace valoraciones médicas.</div></article><article className="rounded-2xl bg-[#DCE8DD] border border-[#B9D0BE] p-6 sm:p-7"><div className="text-[10px] text-[#5E806E] font-bold uppercase tracking-wider">En esta sesión</div><h2 className="font-display text-xl font-bold text-[#0F3A2D] mt-1">Tus registros locales</h2>{records.length ? <ul className="mt-4 space-y-2">{records.map((record) => <li key={record.id} className="rounded-xl bg-white/75 px-3 py-3 text-sm text-[#173A2E]"><CheckCircle2 className="w-4 h-4 inline mr-1.5 text-[#0F3A2D]" /><strong>{record.kind}</strong>{record.value && ` · ${record.value}`}<span className="block text-xs text-[#5E806E] mt-1">{record.note || "Sin nota"} · {record.createdAt}</span></li>)}</ul> : <p className="text-sm text-[#5E806E] mt-3">Pulsa un botón de registro, escribe una medida de ejemplo y guarda. Aparecerá aquí y en tu PDF.</p>}</article></div><div className="grid xl:grid-cols-[.95fr_1.05fr] gap-5"><div className="rounded-2xl bg-white border border-[#DCD4C4] p-6"><div className="flex gap-2 items-center"><FileText className="w-5 h-5 text-[#0F3A2D]" /><div><div className="text-[10px] uppercase font-bold tracking-wider text-[#5E806E]">Analítica manual</div><h2 className="font-display font-bold text-lg text-[#0F3A2D]">Anotar mi última analítica</h2></div></div><form onSubmit={addManualDocument} className="grid sm:grid-cols-2 gap-3 mt-4"><FieldPlain label="Nombre" id="document-title" value={documentTitle} setValue={setDocumentTitle} placeholder="Analítica general" /><label htmlFor="document-date" className="text-xs font-bold text-[#5E806E]">Fecha<input id="document-date" type="date" value={documentDate} onChange={(event) => setDocumentDate(event.target.value)} required className="w-full h-11 mt-1 rounded-xl border border-[#DCD4C4] px-3 text-sm" /></label><button type="submit" className="sm:col-span-2 kureva-btn-primary text-xs"><Plus className="w-3.5 h-3.5" />Añadir a esta prueba</button></form></div><div className="rounded-2xl bg-white border border-[#DCD4C4] p-6"><div className="flex gap-2 items-center"><Upload className="w-5 h-5 text-[#0F3A2D]" /><div><div className="text-[10px] uppercase font-bold tracking-wider text-[#5E806E]">Fotos, capturas o PDF</div><h2 className="font-display font-bold text-lg text-[#0F3A2D]">Adjuntar de forma local</h2></div></div><p className="text-xs text-[#5E806E] mt-3">En esta prueba el archivo se muestra solo como una simulación local: no se sube, no se comparte y no llega a Kureva. La sincronización segura llegará cuando la app esté online.</p><div className="flex flex-col sm:flex-row gap-3 mt-4"><input aria-label="Seleccionar foto, captura o PDF" type="file" accept="image/*,.pdf" onChange={(event) => setLocalFile(event.target.files?.[0] ?? null)} className="flex-1 text-xs text-[#5E806E] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F5F1E7] file:px-3 file:py-2 file:font-bold file:text-[#0F3A2D]" /><button type="button" onClick={addLocalFile} className="kureva-btn-secondary text-xs"><Upload className="w-3.5 h-3.5" />Adjuntar localmente</button></div>{localFile && <p className="mt-2 text-xs text-[#0F3A2D]">Preparado: <strong>{localFile.name}</strong> · no se ha enviado.</p>}</div></div><div className="rounded-2xl border border-[#B9D0BE] bg-[#DCE8DD] p-5"><div className="flex justify-between gap-4 items-start"><div><div className="text-[10px] uppercase font-bold tracking-wider text-[#5E806E]">Documentos anotados</div><h2 className="font-display font-bold text-lg text-[#0F3A2D]">{documents.length} documento{documents.length === 1 ? "" : "s"} local{documents.length === 1 ? "" : "es"}</h2></div><span className="text-xs text-[#5E806E]">Se incluirán como títulos en el PDF</span></div>{documents.length ? <ul className="grid sm:grid-cols-2 gap-2 mt-4">{documents.map((document) => <li key={document.id} className="rounded-xl bg-white/75 p-3 text-sm text-[#173A2E]"><FileText className="w-4 h-4 inline mr-1.5" /><strong>{document.name}</strong><span className="block text-xs text-[#5E806E] mt-1">{document.date || "Archivo local"} · {document.source === "archivo" ? "sin subir" : "manual"}</span></li>)}</ul> : <p className="text-sm text-[#5E806E] mt-3">Añade un título, fecha o archivo local de ejemplo para probar este recorrido.</p>}</div></div>;
}

function RemindersPanel({ firstName, reminders, addReminder }: { firstName: string; reminders: Reminder[]; addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => void }) {
  const [label, setLabel] = useState("Mi medicación");
  const [time, setTime] = useState("09:00");
  const [frequency, setFrequency] = useState("Cada día");
  const [waterGoal, setWaterGoal] = useState("8 vasos");
  const [season, setSeason] = useState("Verano");
  const [activity, setActivity] = useState("Actividad moderada");
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!label.trim()) { toast.error("Escribe qué quieres recordar."); return; } addReminder({ label: label.trim(), time, frequency }); };
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Kureva, tu fiel recordatorio</div><h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Crea avisos de prueba para lo importante.</h1><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">Los recordatorios se registran y se muestran dentro de la simulación. Las alarmas push, de móvil o por correo se conectarán cuando KurevaLife esté online y con tu consentimiento.</p></div><div className="grid xl:grid-cols-[.95fr_1.05fr] gap-5"><form onSubmit={submit} className="rounded-3xl bg-[#0F3A2D] text-white p-6 sm:p-7"><div className="flex gap-3"><div className="w-10 h-10 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><AlarmClock className="w-5 h-5" /></div><div><div className="text-xs uppercase tracking-wider font-bold text-[#D9FF2B]">Nuevo aviso</div><h2 className="font-display text-xl font-bold mt-1">¿Qué quieres que te recuerde?</h2></div></div><div className="grid sm:grid-cols-2 gap-3 mt-5"><FieldDark label="Recordatorio" id="reminder-label" value={label} setValue={setLabel} placeholder="Ej.: Tomar medicación" /><label htmlFor="reminder-time" className="text-xs font-bold text-white/75">Horario<input id="reminder-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm" /></label><label htmlFor="reminder-frequency" className="sm:col-span-2 text-xs font-bold text-white/75">Cuándo<select id="reminder-frequency" value={frequency} onChange={(event) => setFrequency(event.target.value)} className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm"><option>Cada día</option><option>De lunes a domingo</option><option>Solo hoy</option><option>Una fecha concreta</option><option>Solo días laborales</option></select></label></div><button type="submit" className="kureva-btn-accent mt-5"><BellRing className="w-4 h-4" />Crear aviso visual</button><div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/70"><Info className="w-4 h-4 inline mr-1.5 text-[#D9FF2B]" /> En la app final recibirías una notificación tipo: “Hola, {firstName}, recuerda tu medicación”. Durante esta prueba solo verás el aviso dentro de la app.</div></form><article className="rounded-3xl bg-white border border-[#DCD4C4] p-6 sm:p-7"><div className="flex gap-2 items-center"><Droplets className="w-5 h-5 text-[#0F3A2D]" /><div><div className="text-[10px] uppercase tracking-wider font-bold text-[#5E806E]">Agua · plan personal</div><h2 className="font-display text-xl font-bold text-[#0F3A2D]">Organiza un recordatorio de hidratación.</h2></div></div><p className="text-sm text-[#5E806E] mt-3">Elige tu propio objetivo de prueba y ajusta el contexto. KurevaLife no calculará una necesidad médica de líquidos: esta puede variar por salud, medicación y recomendaciones profesionales.</p><div className="grid sm:grid-cols-3 gap-3 mt-4"><FieldPlain label="Mi objetivo" id="water-goal" value={waterGoal} setValue={setWaterGoal} placeholder="Ej.: 8 vasos" /><label htmlFor="water-season" className="text-xs font-bold text-[#5E806E]">Estación<select id="water-season" value={season} onChange={(event) => setSeason(event.target.value)} className="w-full h-11 mt-1 rounded-xl border border-[#DCD4C4] px-3 text-sm"><option>Verano</option><option>Invierno</option><option>Primavera</option><option>Otoño</option></select></label><label htmlFor="water-activity" className="text-xs font-bold text-[#5E806E]">Actividad<select id="water-activity" value={activity} onChange={(event) => setActivity(event.target.value)} className="w-full h-11 mt-1 rounded-xl border border-[#DCD4C4] px-3 text-sm"><option>Actividad baja</option><option>Actividad moderada</option><option>Actividad alta</option></select></label></div><button type="button" onClick={() => addReminder({ label: `Beber agua · meta personal: ${waterGoal || "sin definir"}`, time: "11:00", frequency: `${season} · ${activity}` })} className="kureva-btn-primary mt-5 text-xs"><Droplets className="w-3.5 h-3.5" />Recordarme beber agua</button></article></div><div className="rounded-2xl border border-[#B9D0BE] bg-[#DCE8DD] p-5"><div className="flex gap-2 items-center"><BellRing className="w-5 h-5 text-[#0F3A2D]" /><h2 className="font-display font-bold text-lg text-[#0F3A2D]">Tus avisos en esta prueba</h2></div>{reminders.length ? <ul className="grid sm:grid-cols-2 gap-3 mt-4">{reminders.map((reminder) => <li key={reminder.id} className="rounded-xl bg-white/75 px-4 py-3"><strong className="text-sm text-[#173A2E]">Hola, {firstName}: {reminder.label}</strong><span className="block text-xs text-[#5E806E] mt-1">{reminder.time} · {reminder.frequency} · creado a las {reminder.createdAt}</span><span className="inline-flex mt-2 text-[10px] font-bold text-[#5E806E]"><BellRing className="w-3 h-3 mr-1" />Push cuando esté online</span></li>)}</ul> : <p className="text-sm text-[#5E806E] mt-3">Aún no hay avisos. Prueba creando uno de medicación, tensión, glucosa, cita o agua.</p>}</div></div>;
}

function FoodPanel({ selectedFoodId, setSelectedFoodId, selectedFood }: { selectedFoodId: string; setSelectedFoodId: React.Dispatch<React.SetStateAction<string>>; selectedFood: Food }) {
  const SelectedIcon = selectedFood.icon;
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Septiembre · referencia en España</div><h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Frutas y verduras de temporada.</h1><p className="text-sm text-[#5E806E] mt-2">Cada tarjeta abre su información directamente al hacer clic. Son ideas generales, no consejos médicos ni dietas personalizadas.</p></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{FOOD.map((food) => { const Icon = food.icon; const open = selectedFoodId === food.id; return <article key={food.id} className={`rounded-2xl overflow-hidden border transition-all ${open ? "border-[#0F3A2D] ring-2 ring-[#D9FF2B] ring-offset-2" : "border-[#DCD4C4]"} bg-white`}><button onClick={() => setSelectedFoodId(food.id)} aria-expanded={open} className="w-full text-left p-5 hover:bg-[#F5F1E7]"><div className={`w-10 h-10 rounded-xl ${food.color} text-white flex items-center justify-center`}><Icon className="w-5 h-5" /></div><div className="text-[10px] text-[#5E806E] mt-4">{food.type}</div><h2 className="font-display font-bold text-[#0F3A2D] mt-1">{food.name}</h2><span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F3A2D] mt-3 underline decoration-[#D9FF2B] decoration-2 underline-offset-4">{open ? "Ficha abierta" : "Ver ficha"}<ChevronRight className={`w-3.5 h-3.5 ${open ? "rotate-90" : ""}`} /></span></button>{open && <div className="border-t border-[#DCD4C4] bg-[#F5F1E7] px-5 py-4 text-xs motion-safe:animate-in motion-safe:fade-in duration-200"><p className="text-[#173A2E] leading-relaxed"><strong>Aporte general:</strong> {food.vitamin}</p><p className="text-[#5E806E] leading-relaxed mt-2"><strong className="text-[#173A2E]">Idea sencilla:</strong> {food.idea}</p></div>}</article>; })}</div><div className="rounded-3xl bg-[#0F3A2D] text-white p-6 sm:p-8 grid md:grid-cols-[auto_1fr] gap-5"><div className={`w-14 h-14 rounded-2xl ${selectedFood.color} text-white flex items-center justify-center`}><SelectedIcon className="w-7 h-7" /></div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Ficha seleccionada</div><h2 className="font-display text-2xl font-bold mt-1">{selectedFood.name}</h2><p className="text-sm text-white/75 mt-3">{selectedFood.vitamin}</p><div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/75"><Info className="w-4 h-4 inline mr-1.5 text-[#D9FF2B]" /> Ante cualquier duda sobre salud, medicación o alimentación, consulta con tu profesional.</div></div></div></div>;
}

function KiviPanel({ firstName, onOpenFeedback }: { firstName: string; onOpenFeedback: () => void }) {
  const [messages, setMessages] = useState([{ from: "kivi", text: `Hola, ${firstName}. Soy Kivi, tu guía en esta simulación. ¿Quieres registrar algo, crear un aviso o abrir una ficha de alimentos?` }]);
  const [message, setMessage] = useState("");
  const [thinking, setThinking] = useState(false);
  const ask = (text?: string) => { const question = (text ?? message).trim(); if (!question) return; setMessages((current) => [...current, { from: "user", text: question }]); setMessage(""); setThinking(true); window.setTimeout(() => { setMessages((current) => [...current, { from: "kivi", text: "En esta prueba puedo guiarte por las secciones y recoger la necesidad que tienes. No puedo interpretar resultados, diagnosticar ni dar indicaciones sobre tratamiento. Si es una duda de salud, consulta con tu médico o profesional. Para una idea de producto, puedes dejarla en Tu opinión." }]); setThinking(false); }, 450); };
  const faqs = ["¿Cómo registro una tensión?", "¿Dónde adjunto una analítica?", "¿Cuándo funcionarán las alarmas?", "¿Cómo comparto una sugerencia?"];
  return <div className="space-y-6"><div className="rounded-3xl bg-[#0F3A2D] text-white p-7 sm:p-8"><div className="flex gap-4"><div className="relative w-14 h-14 shrink-0"><div className="absolute inset-0 rounded-full border border-[#D9FF2B]/50 kureva-k-orbit" /><div className="absolute inset-2 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display font-bold text-xl">K</div></div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Kivi · guía virtual</div><h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">Estoy contigo dentro de KurevaLife.</h1><p className="text-sm text-white/75 mt-3">Kivi guía el recorrido y explica qué hace cada sección. El soporte humano y el chat conectado serán una función de la app online; esta prueba enseña cómo se sentiría la experiencia sin prometer atención médica.</p></div></div></div><div className="grid xl:grid-cols-[.85fr_1.15fr] gap-5"><aside className="rounded-2xl bg-white border border-[#DCD4C4] p-5"><div className="text-xs uppercase font-bold tracking-wider text-[#5E806E]">Preguntas rápidas</div><div className="space-y-2 mt-3">{faqs.map((faq) => <button key={faq} onClick={() => ask(faq)} className="w-full rounded-xl bg-[#F5F1E7] hover:bg-[#DCE8DD] p-3 text-left text-sm font-semibold text-[#0F3A2D]">{faq}</button>)}</div><button onClick={onOpenFeedback} className="mt-5 text-sm font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-4">Necesito proponer una mejora</button></aside><section className="rounded-2xl bg-white border border-[#DCD4C4] overflow-hidden flex flex-col min-h-105"><div className="p-5 border-b border-[#DCD4C4] flex items-center gap-2"><MessageCircleHeart className="w-5 h-5 text-[#0F3A2D]" /><div><h2 className="font-display font-bold text-[#0F3A2D]">Hablar con Kivi</h2><p className="text-[11px] text-[#5E806E]">Modo de simulación · sin almacenar el chat</p></div></div><div className="flex-1 p-5 space-y-3 max-h-85 overflow-y-auto" aria-live="polite">{messages.map((item, index) => <div key={`${item.from}-${index}`} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${item.from === "kivi" ? "bg-[#DCE8DD] text-[#173A2E]" : "bg-[#0F3A2D] text-white ml-auto"}`}>{item.text}</div>)}{thinking && <div className="inline-flex items-center gap-2 rounded-2xl bg-[#DCE8DD] px-4 py-3 text-sm text-[#173A2E]"><LoaderCircle className="w-4 h-4 animate-spin" />Kivi está preparando una respuesta…</div>}</div><form onSubmit={(event) => { event.preventDefault(); ask(); }} className="border-t border-[#DCD4C4] p-4 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={300} placeholder="Escribe una pregunta sobre la app…" className="flex-1 h-11 rounded-xl bg-[#F5F1E7] px-3 text-sm" /><button type="submit" className="w-11 h-11 rounded-xl bg-[#0F3A2D] text-white flex items-center justify-center" aria-label="Enviar a Kivi"><Send className="w-4 h-4" /></button></form></section></div></div>;
}

function ParticipationPanel({ view, setView }: { view: "privado" | "grupo" | "novedades"; setView: React.Dispatch<React.SetStateAction<"privado" | "grupo" | "novedades">> }) { return <div className="space-y-6"><InstallKurevaLife /><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Participar en KurevaLife · piloto de 72 horas</div><h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3A2D] mt-1">Gracias por completar el recorrido.</h1><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">Tu valoración de una a cinco estrellas y tu sugerencia son la parte más importante de esta prueba. También puedes dejar una reseña para la Comunidad Kureva o elegir qué novedades te gustaría recibir.</p><a href={KUREVA_HOME_URL} className="inline-flex mt-4 items-center gap-2 text-sm font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-4">Conocer Kureva · Lo digital, en tus manos <ChevronRight className="w-4 h-4" /></a></div><div className="flex gap-2 overflow-x-auto pb-1">{[{ id: "privado" as const, label: "Valoración privada", icon: LockKeyhole }, { id: "grupo" as const, label: "Comunidad de prueba", icon: UsersRound }, { id: "novedades" as const, label: "Novedades", icon: BellRing }].map((item) => { const Icon = item.icon; const selected = view === item.id; return <button key={item.id} onClick={() => setView(item.id)} className={`shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border ${selected ? "bg-[#0F3A2D] text-white border-[#0F3A2D]" : "bg-white text-[#0F3A2D] border-[#DCD4C4]"}`}><Icon className={`w-4 h-4 ${selected ? "text-[#D9FF2B]" : ""}`} />{item.label}</button>; })}</div>{view === "privado" && <PilotFeedback defaultArea="kurevalife_simulator" />}{view === "grupo" && <CommunityPanel />}{view === "novedades" && <div className="max-w-2xl"><PilotInterestForm /></div>}</div>; }

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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [now, setNow] = useState(Date.now());
  const refresh = async () => { setLoading(true); try { const [loaded, window] = await Promise.all([loadCommunityMessages(), loadPilotWindow()]); setMessages(loaded); setWindowEndsAt(window?.ends_at ?? null); } catch (error) { toast.error(error instanceof Error ? error.message : "No se ha podido cargar el grupo."); } finally { setLoading(false); } };
  useEffect(() => { refresh(); }, []);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60_000); return () => window.clearInterval(timer); }, []);
  const closed = Boolean(windowEndsAt && new Date(windowEndsAt).getTime() <= now);
  const choosePhoto = (file: File | null) => { if (!file) return; setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); };
  const publish = async (event: React.FormEvent) => { event.preventDefault(); if (message.trim().length < 10) { toast.error("Escribe una idea de al menos 10 caracteres."); return; } if (!anonymous && name.trim().length < 2) { toast.error("Escribe un nombre o selecciona el modo anónimo."); return; } if (!consent) { toast.error("Confirma que entiendes la visibilidad temporal de esta publicación."); return; } setSending(true); try { await submitCommunityMessage({ display_name: anonymous ? "Persona Kureva" : name.trim(), is_anonymous: anonymous, category, message: message.trim(), consent_public: true, visible_until: new Date(Date.now() + 259_200_000).toISOString() }); setMessage(""); setConsent(false); if (photo) toast.success("Tu idea se ha compartido. La foto era solo una vista local y no se ha publicado."); else toast.success("Tu idea ya está visible para el grupo de prueba."); setPhoto(null); setPhotoPreview(""); await refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "No se ha podido publicar la idea."); } finally { setSending(false); } };
  const liveMessages = messages.filter((item) => new Date(item.visible_until).getTime() > now && !/^(Prueba técnica|QA-|KUREVA-PRIVATE-)/i.test(item.message));
  return <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-5"><div className="space-y-4"><div className="rounded-2xl bg-[#0F3A2D] text-white p-5"><div className="flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Clock3 className="w-4 h-4" /> Comunidad temporal</div><div className="font-display text-3xl font-bold mt-2">{closed ? "Cerrada" : windowEndsAt ? formatRemaining(windowEndsAt) : "24 h"}</div><p className="text-xs text-white/65 mt-2">Comparte mejoras de producto, hábitos generales o ideas de accesibilidad. Las publicaciones no son consultas médicas.</p></div><div className="rounded-xl bg-[#FFF7D8] border border-[#E8D592] p-4 text-xs text-[#5A4B13] leading-relaxed"><ShieldAlert className="w-4 h-4 inline mr-1" /><strong>No publiques:</strong> diagnósticos, medicación, analíticas, datos de contacto o fotos donde se pueda identificar a una persona. La foto de menú que eliges aquí se queda solo en tu dispositivo durante la prueba.</div><form onSubmit={publish} className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4"><div><h2 className="font-display text-lg font-bold text-[#0F3A2D]">Compartir una idea pública de prueba</h2><p className="text-xs text-[#5E806E] mt-1">Visible solo para personas con este enlace mientras dure la prueba de 72 horas.</p></div><select value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm">{COMMUNITY_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><label className="flex gap-2 text-xs text-[#5E806E] cursor-pointer"><input checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} type="checkbox" className="mt-0.5 size-4 accent-[#0F3A2D]" /><span><strong className="text-[#173A2E]">Publicar de forma anónima.</strong> Aparecerá como “Persona Kureva”.</span></label>{!anonymous && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre visible durante la prueba" required className="w-full h-11 rounded-xl border border-[#DCD4C4] px-3 text-sm" />}<textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={500} rows={4} placeholder="Ej.: Me serviría poder marcar una comida saludable en mi día." className="w-full rounded-xl border border-[#DCD4C4] p-3 text-sm resize-y" /><div className="rounded-xl bg-[#F5F1E7] p-3"><label className="block text-xs font-bold text-[#0F3A2D]">Foto de menú o actividad · vista local<input type="file" accept="image/*" onChange={(event) => choosePhoto(event.target.files?.[0] ?? null)} className="block mt-2 w-full text-xs" /></label>{photoPreview && <div className="mt-3 flex gap-3 items-center"><img src={photoPreview} alt="Vista local de foto seleccionada" className="w-18 h-18 rounded-lg object-cover" /><p className="text-[11px] text-[#5E806E]"><strong>{photo?.name}</strong><br />Vista previa: no se subirá ni se publicará durante este piloto.</p></div>}</div><label className="flex gap-2 text-xs text-[#5E806E] cursor-pointer"><input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" required className="mt-0.5 size-4 accent-[#0F3A2D]" /><span>Entiendo que mi texto será visible para el grupo durante la prueba de 72 horas y que no incluye información personal o de salud.</span></label><button disabled={sending || closed} type="submit" className="kureva-btn-primary w-full justify-center disabled:opacity-60">{sending ? <><LoaderCircle className="w-4 h-4 animate-spin" />Compartiendo…</> : closed ? "Ventana cerrada" : <><Send className="w-4 h-4" />Compartir idea</>}</button></form></div><div className="rounded-2xl border border-[#DCD4C4] bg-white p-5"><div className="flex items-start justify-between gap-4 mb-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Ideas del grupo</div><h2 className="font-display text-lg font-bold text-[#0F3A2D]">Conversación activa</h2></div><button onClick={refresh} className="w-9 h-9 rounded-lg border border-[#DCD4C4] flex items-center justify-center" aria-label="Actualizar conversación"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button></div>{loading ? <div className="py-8 text-center text-sm text-[#5E806E]">Cargando ideas…</div> : liveMessages.length === 0 ? <div className="rounded-xl bg-[#F5F1E7] p-5 text-center text-sm text-[#5E806E]">Aún no hay ideas compartidas. La prueba compartida estará disponible durante 72 horas.</div> : <div className="space-y-3">{liveMessages.map((item) => <article key={item.id} className="rounded-xl border border-[#DCD4C4] bg-[#FFFDF8] p-4"><div className="flex justify-between gap-3"><div><strong className="font-display text-sm text-[#0F3A2D]">{item.display_name}</strong><div className="text-[10px] text-[#5E806E] mt-0.5">{COMMUNITY_CATEGORIES.find((categoryItem) => categoryItem.value === item.category)?.label}</div></div><span className="text-[10px] text-[#5E806E] whitespace-nowrap">{formatRemaining(item.visible_until)}</span></div><p className="text-sm text-[#5E806E] leading-relaxed mt-3">{item.message}</p></article>)}</div>}</div></div>;
}

function FieldLight({ label, id, value, setValue, placeholder }: { label: string; id: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label htmlFor={id} className="text-xs font-bold text-white/75">{label}<input id={id} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="w-full h-11 mt-1 rounded-xl bg-white text-[#173A2E] px-3 text-sm" /></label>; }
function FieldDark({ label, id, value, setValue, placeholder }: { label: string; id: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label htmlFor={id} className="text-xs font-bold text-white/75">{label}<input id={id} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="w-full h-11 mt-1 rounded-xl bg-white/10 border border-white/15 px-3 text-sm text-white placeholder:text-white/40" /></label>; }
function FieldPlain({ label, id, value, setValue, placeholder }: { label: string; id: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label htmlFor={id} className="text-xs font-bold text-[#5E806E]">{label}<input id={id} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} className="w-full h-11 mt-1 rounded-xl border border-[#DCD4C4] px-3 text-sm text-[#173A2E]" /></label>; }

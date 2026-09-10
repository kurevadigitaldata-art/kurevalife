import React, { useMemo, useState } from "react";
import { PilotFeedback } from "@/components/PilotFeedback";
import {
  Apple,
  BellRing,
  BookHeart,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardPenLine,
  Droplets,
  FileText,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  MessageCircleHeart,
  MoreHorizontal,
  Pill,
  Plus,
  Printer,
  RotateCcw,
  Salad,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  TextCursorInput,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

type DayKey = "hoy" | "manana" | "viernes";
type DemoTab = "dia" | "salud" | "alimentos" | "kivi" | "familia";
type BlockTone = "forest" | "lime" | "cream" | "moss";

type DayBlock = {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: BlockTone;
  tag: string;
};

const starterBlocks: Record<DayKey, DayBlock[]> = {
  hoy: [
    { id: "medicine", time: "09:00", title: "Recordatorio de medicación", detail: "Ejemplo: revisa tu horario personal antes de marcarlo.", tone: "forest", tag: "Recordatorio" },
    { id: "consulta", time: "12:15", title: "Preparar una consulta", detail: "Preguntas, documentos y un recordatorio para tu cita.", tone: "lime", tag: "Cita" },
    { id: "pause", time: "16:00", title: "Pausa sin pantalla", detail: "Quince minutos para respirar o moverte a tu ritmo.", tone: "cream", tag: "Bienestar" },
  ],
  manana: [
    { id: "pressure", time: "10:00", title: "Registrar una medición", detail: "Ejemplo de tensión, glucosa o una nota sobre cómo te encuentras.", tone: "moss", tag: "Registro" },
    { id: "followup", time: "18:00", title: "Revisar preguntas pendientes", detail: "Solo una cosa: la que quieras llevar a tu próxima cita.", tone: "forest", tag: "Preparación" },
  ],
  viernes: [
    { id: "week", time: "11:00", title: "Revisar la semana", detail: "Conservar lo útil y quitar lo que no te acompaña.", tone: "lime", tag: "Revisión" },
    { id: "family", time: "17:30", title: "Compartir un resumen", detail: "Ejemplo de recordatorio para hablar con una persona de apoyo.", tone: "moss", tag: "Acompañamiento" },
  ],
};

const days: { id: DayKey; label: string; date: string }[] = [
  { id: "hoy", label: "Hoy", date: "Mié 09" },
  { id: "manana", label: "Mañana", date: "Jue 10" },
  { id: "viernes", label: "Viernes", date: "Vie 11" },
];

const toneClass: Record<BlockTone, string> = {
  forest: "bg-[#0F3A2D] text-white border-[#0F3A2D]",
  lime: "bg-[#D9FF2B] text-[#0F3A2D] border-[#C6E923]",
  cream: "bg-[#FFFDF8] text-[#0F3A2D] border-[#DCD4C4]",
  moss: "bg-[#DCE8DD] text-[#0F3A2D] border-[#B9D0BE]",
};

const toneDot: Record<BlockTone, string> = {
  forest: "bg-[#0F3A2D]",
  lime: "bg-[#D9FF2B]",
  cream: "bg-[#F5F1E7] border border-[#DCD4C4]",
  moss: "bg-[#5E806E]",
};

const seasonalFoods = [
  { id: "higo", name: "Higo", type: "Fruta de temporada", vitamin: "Aporta fibra y contiene vitamina B6.", idea: "Prueba medio higo con yogur natural o en una tostada.", color: "bg-[#5C3D5A]", icon: Apple },
  { id: "granada", name: "Granada", type: "Fruta de temporada", vitamin: "Aporta fibra y vitamina C.", idea: "Añade unos granos a una ensalada o a un bol de yogur.", color: "bg-[#A63744]", icon: Apple },
  { id: "pimiento", name: "Pimiento rojo", type: "Verdura de temporada", vitamin: "Destaca por su vitamina C y provitamina A.", idea: "Asado, en tiras con legumbres o en una crema suave.", color: "bg-[#C94E3E]", icon: Salad },
  { id: "calabaza", name: "Calabaza", type: "Verdura de temporada", vitamin: "Aporta betacarotenos, precursores de la vitamina A.", idea: "En crema, al horno o acompañando un plato de arroz.", color: "bg-[#CB7A2A]", icon: Salad },
];

const kiviFAQs = [
  { id: "cita", question: "¿Cómo preparo una cita?", answer: "Puedes reunir preguntas, anotar molestias con tus palabras y llevar documentos que ya tengas. Kivi no interpreta resultados ni sustituye a tu profesional de salud." },
  { id: "recordatorio", question: "¿Cómo funcionarán los avisos?", answer: "La versión final permitirá crear horarios claros y modificables. Este simulacro solo enseña cómo podrían verse; no envía alarmas reales." },
  { id: "privacidad", question: "¿Quién ve mis notas?", answer: "En este simulacro no se guardan. La app final deberá explicar de forma verificable dónde se guardan los datos y quién puede acceder a ellos antes de activarla." },
  { id: "urgencia", question: "¿Y si tengo una urgencia?", answer: "KurevaLife no es un servicio de urgencias ni ofrece diagnóstico. Ante una urgencia, contacta con los servicios de emergencia o un profesional sanitario." },
];

const demoNavigation: { id: DemoTab; label: string; icon: React.ElementType; subtitle: string }[] = [
  { id: "dia", label: "Mi día", icon: CalendarDays, subtitle: "Bloques y avisos" },
  { id: "salud", label: "Mi salud", icon: FileText, subtitle: "Citas y registros" },
  { id: "alimentos", label: "Alimentos", icon: Apple, subtitle: "Temporada y consejos" },
  { id: "kivi", label: "Kivi", icon: MessageCircleHeart, subtitle: "Ayuda y preguntas" },
  { id: "familia", label: "Familia", icon: UsersRound, subtitle: "Propuesta futura" },
];

export function KurevaLifeDemo() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("hoy");
  const [activeTab, setActiveTab] = useState<DemoTab>("dia");
  const [blocks, setBlocks] = useState(starterBlocks);
  const [activeId, setActiveId] = useState("medicine");
  const [completed, setCompleted] = useState<string[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [newBlock, setNewBlock] = useState({ title: "", time: "18:30", detail: "" });
  const [note, setNote] = useState("Ejemplo: recordar preguntar por las opciones y escribir la respuesta con mis palabras.");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [privateMode, setPrivateMode] = useState(true);
  const [selectedFood, setSelectedFood] = useState(seasonalFoods[0]);
  const [activeFaq, setActiveFaq] = useState(kiviFAQs[0].id);
  const [showComparison, setShowComparison] = useState(false);
  const [measurementCount, setMeasurementCount] = useState(0);
  const [migraineNoted, setMigraineNoted] = useState(false);

  const currentBlocks = blocks[selectedDay];
  const activeBlock = currentBlocks.find((block) => block.id === activeId) ?? currentBlocks[0];
  const completedCount = completed.filter((id) => currentBlocks.some((block) => block.id === id)).length;
  const dayPosition = days.findIndex((day) => day.id === selectedDay);
  const activeFaqData = useMemo(() => kiviFAQs.find((item) => item.id === activeFaq) ?? kiviFAQs[0], [activeFaq]);

  const switchDay = (direction: -1 | 1) => {
    const next = days[Math.max(0, Math.min(days.length - 1, dayPosition + direction))];
    if (!next) return;
    setSelectedDay(next.id);
    setActiveId(blocks[next.id][0]?.id ?? "");
  };

  const toggleComplete = (id: string) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const addBlock = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newBlock.title.trim()) return;
    const block: DayBlock = {
      id: `custom-${Date.now()}`,
      time: newBlock.time || "18:30",
      title: newBlock.title.trim(),
      detail: newBlock.detail.trim() || "Bloque de demostración creado en este dispositivo.",
      tone: "moss",
      tag: "Mi bloque",
    };
    setBlocks((current) => ({ ...current, [selectedDay]: [...current[selectedDay], block] }));
    setActiveId(block.id);
    setNewBlock({ title: "", time: "18:30", detail: "" });
    setShowComposer(false);
    toast.success("Bloque añadido solo a este simulacro. No se ha guardado en ningún servidor.");
  };

  const resetDemo = () => {
    setBlocks(starterBlocks);
    setSelectedDay("hoy");
    setActiveTab("dia");
    setActiveId("medicine");
    setCompleted([]);
    setNote("Ejemplo: recordar preguntar por las opciones y escribir la respuesta con mis palabras.");
    setShowComposer(false);
    setMeasurementCount(0);
    setMigraineNoted(false);
    toast.success("Simulacro restablecido.");
  };

  const addDemoMeasurement = (label: string) => {
    setMeasurementCount((count) => count + 1);
    toast.success(`${label} añadida solo como ejemplo en este simulacro.`);
  };

  return (
    <section id="demo" className="py-18 md:py-24 bg-[#F5F1E7] border-y border-[#DCD4C4]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-14">
          <span className="kureva-badge"><Sparkles className="w-3.5 h-3.5" /> Simulacro navegable de KurevaLife</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D]">Una libreta personal para tu día, tus preguntas y tus recordatorios.</h2>
          <p className="text-[#5E806E] text-base sm:text-lg leading-relaxed">Explora con ejemplos ficticios. Este simulacro no crea una cuenta, no envía alarmas reales y no guarda lo que escribes dentro de la vista. Después puedes valorar la experiencia y dejar una sugerencia.</p>
        </div>

        <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${highContrast ? "border-[#09241B] bg-white" : "border-[#DCD4C4] bg-[#FFFDF8]"}`} style={{ fontSize: largeText ? "112.5%" : "100%" }}>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 px-5 sm:px-7 py-4 border-b border-[#DCD4C4] bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F3A2D] flex items-center justify-center text-[#D9FF2B]"><Sparkles className="w-4 h-4" /></div>
              <div>
                <div className="font-display font-bold text-sm text-[#0F3A2D]">KurevaLife · simulacro personal</div>
                <div className="text-[11px] text-[#5E806E]">Contenido ficticio · sin cuenta · no es atención sanitaria</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setLargeText((value) => !value)} aria-pressed={largeText} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${largeText ? "bg-[#0F3A2D] text-white border-[#0F3A2D]" : "bg-[#F5F1E7] text-[#0F3A2D] border-[#DCD4C4]"}`}><TextCursorInput className="w-3.5 h-3.5" /> {largeText ? "Texto normal" : "Texto más grande"}</button>
              <button onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${highContrast ? "bg-[#09241B] text-white border-[#09241B]" : "bg-[#F5F1E7] text-[#0F3A2D] border-[#DCD4C4]"}`}><Sun className="w-3.5 h-3.5" /> {highContrast ? "Contraste estándar" : "Más contraste"}</button>
              <button onClick={() => setPrivateMode((value) => !value)} aria-pressed={privateMode} className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${privateMode ? "bg-[#DCE8DD] text-[#0F3A2D] border-[#B9D0BE]" : "bg-[#F5F1E7] text-[#5E806E] border-[#DCD4C4]"}`}><LockKeyhole className="w-3.5 h-3.5" /> {privateMode ? "Modo privado · demo" : "Avisos de privacidad"}</button>
              <button onClick={resetDemo} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-[#5E806E] hover:bg-[#F5F1E7] transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Restablecer</button>
            </div>
          </div>

          {!privateMode && <div className="px-5 sm:px-7 py-3 bg-[#FFF7D8] border-b border-[#E8D592] text-xs text-[#5A4B13] flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /> En el simulacro nada de esta pantalla se guarda. La opción de privacidad total de la aplicación real requerirá una explicación técnica y legal verificable antes de activarse.</div>}

          <div className="grid grid-cols-1 xl:grid-cols-[210px_minmax(0,1fr)] min-h-[650px]">
            <aside className="border-b xl:border-b-0 xl:border-r border-[#DCD4C4] p-4 sm:p-5 bg-[#FAF7F0]">
              <div className="flex xl:block items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Mi espacio</div>
                  <div className="font-display font-bold text-base text-[#0F3A2D] mt-1">A tu ritmo</div>
                </div>
                <span className="text-[11px] text-[#5E806E] xl:hidden">Elige una vista</span>
              </div>
              <nav className="flex xl:flex-col gap-2 overflow-x-auto pb-1 xl:pb-0" aria-label="Vistas del simulacro KurevaLife">
                {demoNavigation.map((item) => {
                  const Icon = item.icon;
                  const selected = activeTab === item.id;
                  return <button key={item.id} onClick={() => setActiveTab(item.id)} aria-pressed={selected} className={`shrink-0 min-w-34 xl:w-full text-left rounded-xl p-3 transition-all ${selected ? "bg-[#0F3A2D] text-white shadow-md" : "hover:bg-white text-[#0F3A2D]"}`}><div className="flex items-center gap-2"><Icon className={`w-4 h-4 ${selected ? "text-[#D9FF2B]" : "text-[#5E806E]"}`} /><span className="font-display font-bold text-sm">{item.label}</span></div><div className={`text-[10px] mt-1.5 ${selected ? "text-white/70" : "text-[#5E806E]"}`}>{item.subtitle}</div></button>;
                })}
              </nav>
              <div className="hidden xl:block mt-7 rounded-xl border border-[#DCD4C4] bg-white p-3 text-[11px] text-[#5E806E] leading-relaxed"><HeartHandshake className="w-4 h-4 text-[#0F3A2D] mb-2" /> KurevaLife busca acompañar, no controlar: no hay puntos, rachas ni penalizaciones.</div>
            </aside>

            <div className="p-5 sm:p-7 bg-[#FFFDF8]">
              {activeTab === "dia" && <DailyView
                selectedDay={selectedDay} setSelectedDay={setSelectedDay} dayPosition={dayPosition} switchDay={switchDay}
                currentBlocks={currentBlocks} activeBlock={activeBlock} activeId={activeId} setActiveId={setActiveId}
                completed={completed} completedCount={completedCount} toggleComplete={toggleComplete}
                showComposer={showComposer} setShowComposer={setShowComposer} newBlock={newBlock} setNewBlock={setNewBlock}
                addBlock={addBlock} note={note} setNote={setNote}
              />}
              {activeTab === "salud" && <HealthView showComparison={showComparison} setShowComparison={setShowComparison} measurementCount={measurementCount} addDemoMeasurement={addDemoMeasurement} migraineNoted={migraineNoted} setMigraineNoted={setMigraineNoted} />}
              {activeTab === "alimentos" && <FoodView selectedFood={selectedFood} setSelectedFood={setSelectedFood} />}
              {activeTab === "kivi" && <KiviView activeFaq={activeFaq} setActiveFaq={setActiveFaq} activeFaqData={activeFaqData} />}
              {activeTab === "familia" && <FamilyView />}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-6">
          <div className="rounded-2xl border border-[#DCD4C4] bg-[#FFFDF8] p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-2 text-[#0F3A2D]"><Lightbulb className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Qué probar durante cinco minutos</span></div>
            <ol className="grid sm:grid-cols-3 gap-4 text-sm text-[#5E806E]">
              <li><strong className="block font-display text-[#0F3A2D] mb-1">01 · Recorre</strong> Cambia entre día, salud, alimentos y Kivi. Busca algo sin pedir ayuda.</li>
              <li><strong className="block font-display text-[#0F3A2D] mb-1">02 · Actúa</strong> Marca un bloque, abre una ficha y prueba los controles de lectura.</li>
              <li><strong className="block font-display text-[#0F3A2D] mb-1">03 · Cuéntanos</strong> Valora la experiencia y señala qué te resultó útil, confuso o ausente.</li>
            </ol>
          </div>
          <PilotFeedback defaultArea="kurevalife_simulator" compact />
        </div>
      </div>
    </section>
  );
}

type DailyViewProps = {
  selectedDay: DayKey;
  setSelectedDay: React.Dispatch<React.SetStateAction<DayKey>>;
  dayPosition: number;
  switchDay: (direction: -1 | 1) => void;
  currentBlocks: DayBlock[];
  activeBlock: DayBlock | undefined;
  activeId: string;
  setActiveId: React.Dispatch<React.SetStateAction<string>>;
  completed: string[];
  completedCount: number;
  toggleComplete: (id: string) => void;
  showComposer: boolean;
  setShowComposer: React.Dispatch<React.SetStateAction<boolean>>;
  newBlock: { title: string; time: string; detail: string };
  setNewBlock: React.Dispatch<React.SetStateAction<{ title: string; time: string; detail: string }>>;
  addBlock: (event: React.FormEvent) => void;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
};

function DailyView(props: DailyViewProps) {
  const { selectedDay, setSelectedDay, dayPosition, switchDay, currentBlocks, activeBlock, activeId, setActiveId, completed, completedCount, toggleComplete, showComposer, setShowComposer, newBlock, setNewBlock, addBlock, note, setNote } = props;
  return <div className="space-y-6">
    <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
      <div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Vista diaria · ejemplo</div><h3 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Un día que puedes ordenar a tu manera.</h3></div>
      <div className="flex items-center gap-3"><button onClick={() => switchDay(-1)} disabled={dayPosition === 0} className="w-9 h-9 rounded-lg border border-[#DCD4C4] flex items-center justify-center text-[#0F3A2D] disabled:opacity-30 hover:bg-[#F5F1E7]" aria-label="Ver día anterior"><ChevronLeft className="w-4 h-4" /></button><div className="text-center"><strong className="font-display text-[#0F3A2D]">{days[dayPosition].label}</strong><div className="text-[10px] text-[#5E806E]">{days[dayPosition].date}</div></div><button onClick={() => switchDay(1)} disabled={dayPosition === days.length - 1} className="w-9 h-9 rounded-lg border border-[#DCD4C4] flex items-center justify-center text-[#0F3A2D] disabled:opacity-30 hover:bg-[#F5F1E7]" aria-label="Ver día siguiente"><ChevronRight className="w-4 h-4" /></button></div>
    </div>
    <div className="grid xl:grid-cols-[minmax(0,1fr)_280px] gap-6">
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Días de la demo">{days.map((day) => { const selected = day.id === selectedDay; return <button key={day.id} onClick={() => { setSelectedDay(day.id); setActiveId(starterBlocks[day.id][0]?.id ?? ""); }} aria-pressed={selected} className={`rounded-xl px-3 py-2 text-left shrink-0 border transition-colors ${selected ? "bg-[#0F3A2D] text-white border-[#0F3A2D]" : "bg-white text-[#0F3A2D] border-[#DCD4C4]"}`}><div className={`text-[10px] ${selected ? "text-[#D9FF2B]" : "text-[#5E806E]"}`}>{day.date}</div><div className="font-display font-bold text-sm">{day.label}</div></button>; })}</div>
        <div className="relative pl-8 space-y-3"><div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#DCD4C4]" />{currentBlocks.map((block) => { const selected = activeId === block.id; const done = completed.includes(block.id); return <div key={block.id} className="relative"><span className={`absolute -left-[26px] top-5 w-3 h-3 rounded-full z-10 ${toneDot[block.tone]}`} /><button onClick={() => setActiveId(block.id)} className={`w-full text-left rounded-2xl border p-4 transition-all ${selected ? "ring-2 ring-[#D9FF2B] ring-offset-2 border-[#0F3A2D]" : "hover:border-[#0F3A2D]"} ${toneClass[block.tone]} ${done ? "opacity-60" : ""}`}><div className="flex gap-3 justify-between"><div><div className={`text-[10px] font-bold uppercase tracking-wider ${block.tone === "forest" ? "text-[#D9FF2B]" : "opacity-60"}`}>{block.time} · {block.tag}</div><h4 className={`font-display font-bold text-base mt-1 ${done ? "line-through" : ""}`}>{block.title}</h4><p className={`text-xs mt-1 leading-relaxed ${block.tone === "forest" ? "text-white/70" : "opacity-75"}`}>{block.detail}</p></div><span className={`shrink-0 mt-1 ${done ? "text-[#D9FF2B]" : block.tone === "forest" ? "text-white/50" : "text-[#5E806E]"}`}>{done ? <CheckCircle2 className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}</span></div></button></div>; })}</div>
        <button onClick={() => setShowComposer(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F3A2D] text-[#F5F1E7] text-xs font-semibold hover:bg-[#09241B]"><Plus className="w-3.5 h-3.5" /> Añadir bloque ficticio</button>
        {showComposer && <div className="rounded-2xl border border-[#0F3A2D] bg-[#F5F1E7] p-5"><div className="flex items-center justify-between mb-4"><div><div className="font-display font-bold text-base text-[#0F3A2D]">Nuevo bloque de demostración</div><div className="text-xs text-[#5E806E]">Solo existe mientras mantengas esta página abierta.</div></div><button onClick={() => setShowComposer(false)} aria-label="Cerrar creación de bloque" className="w-8 h-8 rounded-lg hover:bg-white text-[#0F3A2D] flex items-center justify-center"><X className="w-4 h-4" /></button></div><form onSubmit={addBlock} className="grid sm:grid-cols-[1fr_100px] gap-3"><input value={newBlock.title} onChange={(event) => setNewBlock((current) => ({ ...current, title: event.target.value }))} placeholder="Ej.: Llamar a la farmacia" required aria-label="Título del bloque" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><input type="time" value={newBlock.time} onChange={(event) => setNewBlock((current) => ({ ...current, time: event.target.value }))} aria-label="Hora" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><input value={newBlock.detail} onChange={(event) => setNewBlock((current) => ({ ...current, detail: event.target.value }))} placeholder="Una nota opcional" aria-label="Detalle opcional" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" /><button type="submit" className="kureva-btn-primary justify-center text-xs"><Plus className="w-3.5 h-3.5" /> Añadir</button></form></div>}
      </div>
      <aside className="space-y-4"><div className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4"><div className="flex items-center justify-between"><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Bloque seleccionado</div><span className={`w-2.5 h-2.5 rounded-full ${activeBlock ? toneDot[activeBlock.tone] : "bg-[#DCD4C4]"}`} /></div>{activeBlock && <><div><h4 className="font-display font-bold text-lg text-[#0F3A2D]">{activeBlock.title}</h4><p className="text-sm text-[#5E806E] mt-1 leading-relaxed">{activeBlock.detail}</p></div><div className="flex items-center justify-between py-3 border-y border-[#DCD4C4]"><span className="text-xs text-[#5E806E]">Hora sugerida</span><strong className="font-display text-[#0F3A2D]">{activeBlock.time}</strong></div><button onClick={() => toggleComplete(activeBlock.id)} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold ${completed.includes(activeBlock.id) ? "bg-[#DCE8DD] text-[#0F3A2D]" : "bg-[#0F3A2D] text-[#F5F1E7] hover:bg-[#09241B]"}`}>{completed.includes(activeBlock.id) ? <><Check className="w-4 h-4" /> Marcado como hecho</> : <><Circle className="w-4 h-4" /> Marcar como hecho</>}</button></>}</div><div className="rounded-2xl border border-[#DCD4C4] bg-white p-5 space-y-3"><div className="flex items-center gap-2"><ClipboardPenLine className="w-4 h-4 text-[#0F3A2D]" /><h4 className="font-display font-bold text-sm text-[#0F3A2D]">Nota para mí</h4></div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="w-full resize-none rounded-xl bg-[#F5F1E7] border border-transparent focus:border-[#0F3A2D] px-3 py-2.5 text-xs leading-relaxed text-[#173A2E] focus:outline-hidden" aria-label="Nota de demostración" /><p className="text-[10px] text-[#5E806E] flex items-center gap-1"><LockKeyhole className="w-3 h-3" /> Esta nota no se guarda en la demo.</p></div><div className="rounded-xl bg-[#DCE8DD] border border-[#B9D0BE] p-4 text-xs text-[#173A2E]"><strong>{completedCount}/{currentBlocks.length} bloques</strong><span className="block mt-1 text-[#5E806E]">No hay puntos ni penalizaciones: el ritmo lo eliges tú.</span></div></aside>
    </div>
  </div>;
}

function HealthView({ showComparison, setShowComparison, measurementCount, addDemoMeasurement, migraineNoted, setMigraineNoted }: { showComparison: boolean; setShowComparison: React.Dispatch<React.SetStateAction<boolean>>; measurementCount: number; addDemoMeasurement: (label: string) => void; migraineNoted: boolean; setMigraineNoted: React.Dispatch<React.SetStateAction<boolean>> }) {
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Ejemplo de organización personal</div><h3 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Lo que quieres tener a mano antes de una consulta.</h3></div><span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF7D8] text-xs text-[#5A4B13] border border-[#E8D592]"><Stethoscope className="w-4 h-4" /> No diagnostica ni interpreta</span></div>
    <div className="grid lg:grid-cols-2 gap-5"><div className="rounded-2xl bg-[#0F3A2D] text-white p-5 space-y-4"><div className="flex justify-between"><div><div className="text-[10px] uppercase tracking-wider text-[#D9FF2B]">Próxima cita · ejemplo</div><h4 className="font-display text-xl font-bold mt-1">Consulta de seguimiento</h4></div><CalendarDays className="w-5 h-5 text-[#D9FF2B]" /></div><div className="rounded-xl bg-white/10 p-3 text-sm text-white/75">Jueves · 18:00<br /><span className="text-xs text-white/60">Recordatorio de demo: prepara tus preguntas con tiempo.</span></div><div className="border-t border-white/15 pt-3"><div className="text-xs text-white/65 mb-2">Preguntas que quiero recordar</div><ul className="space-y-2 text-sm"><li className="flex gap-2"><Check className="w-4 h-4 text-[#D9FF2B] shrink-0" />¿Qué debo vigilar antes de la próxima cita?</li><li className="flex gap-2"><Check className="w-4 h-4 text-[#D9FF2B] shrink-0" />¿Puedo llevar una copia de mis anotaciones?</li></ul></div></div>
      <div className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4"><div className="flex justify-between"><div><div className="text-[10px] uppercase tracking-wider text-[#5E806E]">Documento de ejemplo</div><h4 className="font-display text-xl font-bold text-[#0F3A2D] mt-1">Analítica · septiembre</h4></div><FileText className="w-5 h-5 text-[#0F3A2D]" /></div><p className="text-sm text-[#5E806E]">Una futura versión podría reunir archivos y notas que tú elijas. No interpreta valores ni sustituye la explicación de tu médico.</p><div className="flex flex-wrap gap-2"><button onClick={() => setShowComparison((value) => !value)} className="kureva-btn-secondary text-xs"><FileText className="w-3.5 h-3.5" /> {showComparison ? "Ocultar comparación" : "Comparar ejemplos"}</button><button onClick={() => toast.success("Vista de impresión simulada. La app final deberá generar un resumen claro para la consulta.")} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[#0F3A2D] border border-[#DCD4C4] hover:bg-[#F5F1E7]"><Printer className="w-3.5 h-3.5" /> Preparar resumen</button></div></div></div>
    {showComparison && <div className="rounded-2xl border border-[#B9D0BE] bg-[#DCE8DD] p-5 motion-safe:animate-in motion-safe:fade-in duration-200"><div className="flex gap-3"><FileText className="w-5 h-5 text-[#0F3A2D] shrink-0" /><div><h4 className="font-display font-bold text-[#0F3A2D]">Comparación de ejemplo</h4><p className="text-sm text-[#5E806E] mt-1">La aplicación final debería mostrar documentos originales y sus fechas, sin sacar conclusiones clínicas. Los cambios relevantes se deben consultar con un profesional sanitario.</p><div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm"><div className="rounded-xl bg-white/65 p-3"><strong className="block text-[#0F3A2D]">Documento anterior</strong><span className="text-[#5E806E]">Mayo · archivo adjunto</span></div><div className="rounded-xl bg-white/65 p-3"><strong className="block text-[#0F3A2D]">Documento reciente</strong><span className="text-[#5E806E]">Septiembre · archivo adjunto</span></div></div></div></div></div>}
    <div className="grid sm:grid-cols-3 gap-4"><button onClick={() => addDemoMeasurement("Una medición de tensión")} className="rounded-2xl border border-[#DCD4C4] bg-[#F5F1E7] p-5 text-left hover:border-[#0F3A2D] transition-colors"><Droplets className="w-5 h-5 text-[#0F3A2D]" /><strong className="block font-display text-[#0F3A2D] mt-3">Tensión</strong><span className="block text-xs text-[#5E806E] mt-1">Añadir una medición de ejemplo.</span></button><button onClick={() => addDemoMeasurement("Una medición de glucosa")} className="rounded-2xl border border-[#DCD4C4] bg-[#F5F1E7] p-5 text-left hover:border-[#0F3A2D] transition-colors"><Droplets className="w-5 h-5 text-[#0F3A2D]" /><strong className="block font-display text-[#0F3A2D] mt-3">Glucosa</strong><span className="block text-xs text-[#5E806E] mt-1">Añadir una medición de ejemplo.</span></button><button onClick={() => { setMigraineNoted((value) => !value); toast.success(migraineNoted ? "Ejemplo de molestia eliminado." : "Ejemplo de molestia añadido a esta sesión."); }} className={`rounded-2xl border p-5 text-left transition-colors ${migraineNoted ? "bg-[#DCE8DD] border-[#B9D0BE]" : "bg-[#F5F1E7] border-[#DCD4C4] hover:border-[#0F3A2D]"}`}><BookHeart className="w-5 h-5 text-[#0F3A2D]" /><strong className="block font-display text-[#0F3A2D] mt-3">Molestias</strong><span className="block text-xs text-[#5E806E] mt-1">{migraineNoted ? "Ejemplo de migraña anotado." : "Registrar cómo me encuentro."}</span></button></div>
    <div className="rounded-xl border border-[#DCD4C4] bg-[#FFFDF8] p-4 text-xs text-[#5E806E]"><Pill className="w-4 h-4 inline-block align-text-bottom mr-1.5 text-[#0F3A2D]" /><strong className="text-[#173A2E]">Horario de medicación · ejemplo:</strong> una futura versión puede ayudarte a recordar un horario que tú configures. No debe cambiar dosis, interpretar tratamiento ni sustituir las indicaciones de tu médico o farmacéutico. {measurementCount > 0 && <span className="ml-1">Has añadido {measurementCount} registro{measurementCount === 1 ? "" : "s"} de demostración; no se guardarán.</span>}</div>
  </div>;
}

function FoodView({ selectedFood, setSelectedFood }: { selectedFood: typeof seasonalFoods[number]; setSelectedFood: React.Dispatch<React.SetStateAction<typeof seasonalFoods[number]>> }) {
  const FoodIcon = selectedFood.icon;
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Septiembre · referencia para España</div><h3 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Alimentos de temporada, ideas sencillas y sin recetas milagro.</h3><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">Pulsa una fruta o verdura para ver una idea. Es información general de alimentación; ante cualquier duda sobre tu salud, necesidades o medicación, consulta con tu médico o profesional sanitario.</p></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{seasonalFoods.map((food) => { const Icon = food.icon; const selected = food.id === selectedFood.id; return <button key={food.id} onClick={() => setSelectedFood(food)} className={`rounded-2xl p-5 text-left border transition-all ${selected ? "border-[#0F3A2D] ring-2 ring-[#D9FF2B] ring-offset-2" : "border-[#DCD4C4] hover:border-[#0F3A2D]"} bg-white`}><div className={`w-10 h-10 rounded-xl ${food.color} text-white flex items-center justify-center`}><Icon className="w-5 h-5" /></div><div className="text-[10px] text-[#5E806E] mt-4">{food.type}</div><strong className="font-display block text-[#0F3A2D] mt-1">{food.name}</strong></button>; })}</div><div className="rounded-3xl bg-[#0F3A2D] p-6 sm:p-8 text-white grid md:grid-cols-[auto_1fr] gap-5 items-start"><div className={`w-14 h-14 rounded-2xl ${selectedFood.color} text-white flex items-center justify-center`}><FoodIcon className="w-7 h-7" /></div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Ficha de ejemplo · {selectedFood.type}</div><h4 className="font-display text-2xl font-bold mt-1">{selectedFood.name}</h4><p className="text-white/75 mt-3 text-sm"><strong className="text-white">Aporte general:</strong> {selectedFood.vitamin}</p><p className="text-white/75 mt-2 text-sm"><strong className="text-white">Idea sencilla:</strong> {selectedFood.idea}</p><div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-white/70"><ShieldCheck className="w-4 h-4 inline-block align-text-bottom text-[#D9FF2B] mr-1.5" /> La app final no sustituirá consejos médicos ni pautas nutricionales personalizadas.</div></div></div><div className="rounded-xl bg-[#FFF7D8] border border-[#E8D592] p-4 text-xs text-[#5A4B13]">En una futura versión, la comunidad podrá compartir ideas y recetas con normas de respeto, moderación y privacidad. Esta demo no publica perfiles, fotos ni recetas reales.</div></div>;
}

function KiviView({ activeFaq, setActiveFaq, activeFaqData }: { activeFaq: string; setActiveFaq: React.Dispatch<React.SetStateAction<string>>; activeFaqData: typeof kiviFAQs[number] }) {
  return <div className="space-y-6"><div className="rounded-3xl bg-[#0F3A2D] p-6 sm:p-8 text-white relative overflow-hidden"><div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-[#D9FF2B]/10 blur-2xl" /><div className="relative flex gap-4"><div className="w-13 h-13 shrink-0 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display font-bold text-xl">K</div><div><div className="text-[#D9FF2B] text-xs font-bold uppercase tracking-wider">Hola, soy Kivi</div><h3 className="font-display text-2xl font-bold mt-1">Estoy aquí para ayudarte a encontrar tu camino dentro de KurevaLife.</h3><p className="text-white/75 text-sm mt-3 max-w-2xl">Puedo explicar cómo funciona la app y recordarte sus límites. No soy médico, no diagnostico y no sustituyo la atención de urgencias ni las indicaciones de un profesional.</p></div></div></div><div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-5"><div className="space-y-2"><div className="text-xs font-bold uppercase tracking-wider text-[#5E806E] mb-3">Preguntas frecuentes</div>{kiviFAQs.map((item) => <button key={item.id} onClick={() => setActiveFaq(item.id)} aria-pressed={activeFaq === item.id} className={`w-full rounded-xl border p-4 text-left text-sm transition-colors ${activeFaq === item.id ? "bg-[#DCE8DD] border-[#B9D0BE] text-[#0F3A2D]" : "bg-white border-[#DCD4C4] text-[#173A2E] hover:border-[#0F3A2D]"}`}>{item.question}</button>)}</div><div className="rounded-2xl bg-white border border-[#DCD4C4] p-6"><div className="flex items-center gap-2 text-[#0F3A2D]"><MessageCircleHeart className="w-5 h-5" /><span className="font-display font-bold">Respuesta de Kivi</span></div><p className="text-[#5E806E] text-sm leading-relaxed mt-4">{activeFaqData.answer}</p><div className="mt-6 pt-4 border-t border-[#DCD4C4]"><span className="text-xs text-[#5E806E]">¿No está tu pregunta?</span><button onClick={() => toast.info("Déjala en el buzón de sugerencias de abajo para que podamos incluirla.")} className="block mt-2 text-sm font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-4">Sugerir una pregunta para Kivi</button></div></div></div><div className="rounded-xl bg-[#FFF7D8] border border-[#E8D592] p-4 text-xs text-[#5A4B13]"><HeartHandshake className="w-4 h-4 inline-block align-text-bottom mr-1.5" /> El soporte técnico de KurevaLife debe ser claro y humano. Durante el piloto, Kivi es una demostración de la experiencia, no un chat conectado ni un asesor sanitario.</div></div>;
}

function FamilyView() {
  return <div className="space-y-6"><div><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Propuesta abierta para el futuro</div><h3 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Una forma de acompañar sin invadir.</h3><p className="text-sm text-[#5E806E] mt-2 max-w-3xl">El modo familiar es una idea en exploración. La persona titular debería decidir exactamente qué comparte, con quién y durante cuánto tiempo. No se activa ni se recopila información familiar en este simulacro.</p></div><div className="grid md:grid-cols-3 gap-4">{[{ icon: UsersRound, title: "Persona de apoyo", desc: "Invitar solo a quien tú elijas, con permisos comprensibles." }, { icon: FileText, title: "Resumen elegido", desc: "Compartir una vista preparada para una cita o una situación concreta." }, { icon: LockKeyhole, title: "Control revocable", desc: "Retirar accesos sin pedir permiso ni perder tu historial." }].map((item) => { const Icon = item.icon; return <div key={item.title} className="rounded-2xl bg-[#F5F1E7] border border-[#DCD4C4] p-5"><Icon className="w-5 h-5 text-[#0F3A2D]" /><h4 className="font-display font-bold text-[#0F3A2D] mt-3">{item.title}</h4><p className="text-sm text-[#5E806E] mt-2 leading-relaxed">{item.desc}</p></div>; })}</div><div className="rounded-3xl border border-dashed border-[#0F3A2D]/40 bg-white p-7 text-center"><UsersRound className="w-7 h-7 text-[#0F3A2D] mx-auto" /><h4 className="font-display text-xl font-bold text-[#0F3A2D] mt-3">¿Te serviría una gestión familiar?</h4><p className="text-sm text-[#5E806E] mt-2 max-w-xl mx-auto">Cuéntanos cómo debería funcionar antes de que se diseñe. Selecciona “Modo familiar” en el buzón de sugerencias y explica qué te haría sentir en control.</p></div></div>;
}

import React, { useState } from "react";
import { PilotFeedback } from "@/components/PilotFeedback";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardPenLine,
  HeartHandshake,
  Lightbulb,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

type DayKey = "hoy" | "manana" | "viernes";
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
    { id: "focus", time: "09:30", title: "Bloque para mí", detail: "Ordenar tres ideas antes de empezar.", tone: "forest", tag: "Enfoque" },
    { id: "consulta", time: "12:15", title: "Preparar una consulta", detail: "Preguntas, documentos y un recordatorio.", tone: "lime", tag: "Preparación" },
    { id: "pause", time: "16:00", title: "Pausa sin pantalla", detail: "Quince minutos sin avisos.", tone: "cream", tag: "Pausa" },
  ],
  manana: [
    { id: "walk", time: "10:00", title: "Paseo y nota breve", detail: "Registrar lo que quiero recordar.", tone: "moss", tag: "Bienestar" },
    { id: "followup", time: "18:00", title: "Responder un mensaje", detail: "Solo uno: el más importante.", tone: "forest", tag: "Pendiente" },
  ],
  viernes: [
    { id: "review", time: "11:00", title: "Revisar la semana", detail: "Conservar lo útil y eliminar lo demás.", tone: "lime", tag: "Revisión" },
    { id: "family", time: "17:30", title: "Llamar a una persona cercana", detail: "Un momento tranquilo, sin prisa.", tone: "moss", tag: "Conexión" },
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

export function KurevaLifeDemo() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("hoy");
  const [blocks, setBlocks] = useState(starterBlocks);
  const [activeId, setActiveId] = useState("focus");
  const [completed, setCompleted] = useState<string[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [newBlock, setNewBlock] = useState({ title: "", time: "18:30", detail: "" });
  const [note, setNote] = useState("Recordar preguntar por las opciones y escribir la respuesta con mis palabras.");

  const currentBlocks = blocks[selectedDay];
  const activeBlock = currentBlocks.find((block) => block.id === activeId) ?? currentBlocks[0];
  const completedCount = completed.filter((id) => currentBlocks.some((block) => block.id === id)).length;
  const dayPosition = days.findIndex((day) => day.id === selectedDay);

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
    toast.success("Bloque añadido a esta demostración. No se ha guardado en ningún servidor.");
  };

  const resetDemo = () => {
    setBlocks(starterBlocks);
    setSelectedDay("hoy");
    setActiveId("focus");
    setCompleted([]);
    setNote("Recordar preguntar por las opciones y escribir la respuesta con mis palabras.");
    setShowComposer(false);
    toast.success("Demostración restablecida.");
  };

  return (
    <section id="demo" className="py-18 md:py-24 bg-[#F5F1E7] border-y border-[#DCD4C4]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 md:mb-14">
          <span className="kureva-badge"><Sparkles className="w-3.5 h-3.5" /> Simulacro navegable</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D]">Prueba la vista diaria. Ayúdanos a hacerla más humana.</h2>
          <p className="text-[#5E806E] text-base sm:text-lg leading-relaxed">Nada de lo que escribas dentro del simulacro se convierte en una cuenta ni se guarda como dato de la app. Puedes recorrer días, marcar bloques y crear ejemplos ficticios. Al final eliges si deseas enviar una sugerencia anónima.</p>
        </div>

        <div className="rounded-3xl border border-[#DCD4C4] bg-[#FFFDF8] shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 sm:px-7 py-4 border-b border-[#DCD4C4] bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0F3A2D] flex items-center justify-center text-[#D9FF2B]"><Sparkles className="w-4 h-4" /></div>
              <div>
                <div className="font-display font-bold text-sm text-[#0F3A2D]">KurevaLife · vista diaria</div>
                <div className="text-[11px] text-[#5E806E]">Simulacro con contenido ficticio · no es una cuenta</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F5F1E7] text-[11px] font-semibold text-[#0F3A2D]"><LockKeyhole className="w-3.5 h-3.5" /> Tus bloques no se guardan</span>
              <button onClick={resetDemo} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-[#5E806E] hover:bg-[#F5F1E7] transition-colors"><RotateCcw className="w-3.5 h-3.5" /> Restablecer</button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[210px_minmax(0,1fr)_300px] min-h-[610px]">
            <aside className="border-b xl:border-b-0 xl:border-r border-[#DCD4C4] p-4 sm:p-5 bg-[#FAF7F0]">
              <div className="flex xl:block items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Tu semana</div>
                  <div className="font-display font-bold text-base text-[#0F3A2D] mt-1">Paso a paso</div>
                </div>
                <span className="text-xs text-[#5E806E]">{completedCount}/{currentBlocks.length} hoy</span>
              </div>
              <nav className="flex xl:flex-col gap-2 overflow-x-auto pb-1 xl:pb-0" aria-label="Días de la demo">
                {days.map((day) => {
                  const isSelected = day.id === selectedDay;
                  return (
                    <button
                      key={day.id}
                      onClick={() => { setSelectedDay(day.id); setActiveId(blocks[day.id][0]?.id ?? ""); }}
                      aria-pressed={isSelected}
                      className={`shrink-0 text-left rounded-xl p-3 min-w-30 transition-all ${isSelected ? "bg-[#0F3A2D] text-white shadow-md" : "hover:bg-white text-[#0F3A2D]"}`}
                    >
                      <div className={`text-[10px] uppercase tracking-wider ${isSelected ? "text-[#D9FF2B]" : "text-[#5E806E]"}`}>{day.date}</div>
                      <div className="font-display font-bold text-sm mt-1">{day.label}</div>
                      <div className={`text-[11px] mt-1 ${isSelected ? "text-white/70" : "text-[#5E806E]"}`}>{blocks[day.id].length} bloques</div>
                    </button>
                  );
                })}
              </nav>
              <div className="hidden xl:block mt-7 rounded-xl border border-[#DCD4C4] bg-white p-3 text-[11px] text-[#5E806E] leading-relaxed"><HeartHandshake className="w-4 h-4 text-[#0F3A2D] mb-2" /> La vista se adapta a tu ritmo: no hay puntos, rachas ni penalizaciones.</div>
            </aside>

            <div className="p-5 sm:p-7 bg-[#FFFDF8]">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => switchDay(-1)} disabled={dayPosition === 0} className="w-8 h-8 rounded-lg border border-[#DCD4C4] flex items-center justify-center text-[#0F3A2D] disabled:opacity-30 hover:bg-[#F5F1E7] transition-colors" aria-label="Ver día anterior"><ChevronLeft className="w-4 h-4" /></button>
                  <div><div className="font-display text-xl font-bold text-[#0F3A2D]">{days[dayPosition].label}</div><div className="text-xs text-[#5E806E]">{days[dayPosition].date} · Ejemplo de agenda</div></div>
                  <button onClick={() => switchDay(1)} disabled={dayPosition === days.length - 1} className="w-8 h-8 rounded-lg border border-[#DCD4C4] flex items-center justify-center text-[#0F3A2D] disabled:opacity-30 hover:bg-[#F5F1E7] transition-colors" aria-label="Ver día siguiente"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <button onClick={() => setShowComposer(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F3A2D] text-[#F5F1E7] text-xs font-semibold hover:bg-[#09241B] transition-colors"><Plus className="w-3.5 h-3.5" /> Añadir bloque</button>
              </div>

              <div className="relative pl-8 space-y-3">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-[#DCD4C4]" />
                {currentBlocks.map((block) => {
                  const isActive = activeBlock?.id === block.id;
                  const isDone = completed.includes(block.id);
                  return (
                    <div key={block.id} className="relative">
                      <span className={`absolute -left-[26px] top-5 w-3 h-3 rounded-full z-10 ${toneDot[block.tone]}`} />
                      <button
                        onClick={() => setActiveId(block.id)}
                        className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all ${isActive ? "ring-2 ring-[#D9FF2B] ring-offset-2 border-[#0F3A2D]" : "hover:border-[#0F3A2D]"} ${toneClass[block.tone]} ${isDone ? "opacity-60" : ""}`}
                      >
                        <div className="flex gap-3 justify-between">
                          <div className="min-w-0">
                            <div className={`text-[10px] font-bold uppercase tracking-wider ${block.tone === "forest" ? "text-[#D9FF2B]" : "opacity-60"}`}>{block.time} · {block.tag}</div>
                            <h3 className={`font-display font-bold text-base sm:text-lg mt-1 ${isDone ? "line-through" : ""}`}>{block.title}</h3>
                            <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${block.tone === "forest" ? "text-white/70" : "opacity-75"}`}>{block.detail}</p>
                          </div>
                          <span className={`shrink-0 mt-1 ${isDone ? "text-[#D9FF2B]" : block.tone === "forest" ? "text-white/50" : "text-[#5E806E]"}`}>{isDone ? <CheckCircle2 className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}</span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {showComposer && (
                <div className="mt-5 rounded-2xl border border-[#0F3A2D] bg-[#F5F1E7] p-5">
                  <div className="flex items-center justify-between mb-4"><div><div className="font-display font-bold text-base text-[#0F3A2D]">Nuevo bloque de demostración</div><div className="text-xs text-[#5E806E]">Solo existe mientras mantengas esta página abierta.</div></div><button onClick={() => setShowComposer(false)} aria-label="Cerrar creación de bloque" className="w-8 h-8 rounded-lg hover:bg-white text-[#0F3A2D] flex items-center justify-center"><X className="w-4 h-4" /></button></div>
                  <form onSubmit={addBlock} className="grid sm:grid-cols-[1fr_100px] gap-3">
                    <label className="sr-only" htmlFor="new-block-title">Título del bloque</label>
                    <input id="new-block-title" value={newBlock.title} onChange={(event) => setNewBlock((current) => ({ ...current, title: event.target.value }))} placeholder="Ej.: Llamar a Ana" required className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" />
                    <label className="sr-only" htmlFor="new-block-time">Hora</label>
                    <input id="new-block-time" type="time" value={newBlock.time} onChange={(event) => setNewBlock((current) => ({ ...current, time: event.target.value }))} className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" />
                    <label className="sr-only" htmlFor="new-block-detail">Detalle opcional</label>
                    <input id="new-block-detail" value={newBlock.detail} onChange={(event) => setNewBlock((current) => ({ ...current, detail: event.target.value }))} placeholder="Una nota opcional para este bloque" className="h-11 rounded-xl border border-[#DCD4C4] bg-white px-3 text-sm focus:outline-hidden focus:border-[#0F3A2D]" />
                    <button type="submit" className="kureva-btn-primary justify-center text-xs"><Plus className="w-3.5 h-3.5" /> Añadir</button>
                  </form>
                </div>
              )}
            </div>

            <aside className="border-t xl:border-t-0 xl:border-l border-[#DCD4C4] bg-[#FAF7F0] p-5 sm:p-6 space-y-5">
              {activeBlock ? (
                <div className="rounded-2xl bg-white border border-[#DCD4C4] p-5 space-y-4">
                  <div className="flex items-center justify-between"><div className="text-[10px] font-mono uppercase tracking-wider text-[#5E806E]">Bloque seleccionado</div><span className={`w-2.5 h-2.5 rounded-full ${toneDot[activeBlock.tone]}`} /></div>
                  <div><h3 className="font-display font-bold text-lg text-[#0F3A2D]">{activeBlock.title}</h3><p className="text-sm text-[#5E806E] mt-1 leading-relaxed">{activeBlock.detail}</p></div>
                  <div className="flex items-center justify-between py-3 border-y border-[#DCD4C4]"><span className="text-xs text-[#5E806E]">Hora sugerida</span><strong className="font-display text-[#0F3A2D]">{activeBlock.time}</strong></div>
                  <button onClick={() => toggleComplete(activeBlock.id)} className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-colors ${completed.includes(activeBlock.id) ? "bg-[#DCE8DD] text-[#0F3A2D]" : "bg-[#0F3A2D] text-[#F5F1E7] hover:bg-[#09241B]"}`}>
                    {completed.includes(activeBlock.id) ? <><Check className="w-4 h-4" /> Marcado como hecho</> : <><Circle className="w-4 h-4" /> Marcar como hecho</>}
                  </button>
                </div>
              ) : <div className="rounded-2xl bg-white border border-[#DCD4C4] p-5 text-sm text-[#5E806E]">Selecciona un bloque para ver su detalle.</div>}

              <div className="rounded-2xl border border-[#DCD4C4] bg-white p-5 space-y-3">
                <div className="flex items-center gap-2"><ClipboardPenLine className="w-4 h-4 text-[#0F3A2D]" /><h3 className="font-display font-bold text-sm text-[#0F3A2D]">Nota para mí</h3></div>
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="w-full resize-none rounded-xl bg-[#F5F1E7] border border-transparent focus:border-[#0F3A2D] px-3 py-2.5 text-xs leading-relaxed text-[#173A2E] focus:outline-hidden" aria-label="Nota de demostración" />
                <p className="text-[10px] text-[#5E806E] flex items-center gap-1"><LockKeyhole className="w-3 h-3" /> En la demo, esta nota no se guarda.</p>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-6">
          <div className="rounded-2xl border border-[#DCD4C4] bg-[#FFFDF8] p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-2 text-[#0F3A2D]"><Lightbulb className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Qué probar durante tres minutos</span></div>
            <ol className="grid sm:grid-cols-3 gap-4 text-sm text-[#5E806E]">
              <li><strong className="block font-display text-[#0F3A2D] mb-1">01 · Recorre</strong> Cambia de día y localiza una tarea sin explicación.</li>
              <li><strong className="block font-display text-[#0F3A2D] mb-1">02 · Actúa</strong> Marca un bloque o añade uno ficticio.</li>
              <li><strong className="block font-display text-[#0F3A2D] mb-1">03 · Cuéntanos</strong> Señala algo confuso, incómodo o que echarías de menos.</li>
            </ol>
          </div>
          <PilotFeedback defaultArea="kurevalife_simulator" compact />
        </div>
      </div>
    </section>
  );
}

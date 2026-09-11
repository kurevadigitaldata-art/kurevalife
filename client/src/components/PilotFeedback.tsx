import React, { useState } from "react";
import { Check, HeartHandshake, MessageSquareText, ShieldCheck, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import {
  type AccessibilityContext,
  type EntrySource,
  type ExperienceArea,
  type FeedbackCategory,
  type FeedbackType,
  getPilotTicket,
  submitPilotFeedback,
} from "@/lib/pilotFeedback";

type PilotFeedbackProps = {
  defaultArea?: ExperienceArea;
  compact?: boolean;
};

const feedbackKinds: { value: FeedbackType; label: string }[] = [
  { value: "observation", label: "Me resultó útil o agradable" },
  { value: "problem", label: "Me costó o no funcionó" },
  { value: "idea", label: "Echo de menos esta idea" },
  { value: "accessibility", label: "Encontré una barrera de acceso" },
  { value: "encouragement", label: "Quiero dejar un mensaje" },
];

const kurevaLifeCategories: { value: FeedbackCategory; label: string }[] = [
  { value: "clarity", label: "Claridad y lenguaje" },
  { value: "daily_blocks", label: "Vista diaria y bloques" },
  { value: "reminders", label: "Avisos y recordatorios" },
  { value: "medical_organization", label: "Organizar citas y documentos" },
  { value: "nutrition", label: "Alimentos y bienestar" },
  { value: "accessibility", label: "Accesibilidad" },
  { value: "privacy", label: "Privacidad y confianza" },
  { value: "kivi_support", label: "Kivi y soporte" },
  { value: "family_mode", label: "Modo familiar" },
  { value: "community", label: "Comunidad Kureva" },
  { value: "other", label: "Otra idea" },
];

const accessContexts: { value: AccessibilityContext; label: string }[] = [
  { value: "not_shared", label: "Prefiero no indicarlo" },
  { value: "screen_reader", label: "Uso lector de pantalla" },
  { value: "low_vision", label: "Tengo baja visión o necesito más contraste / letra" },
  { value: "deaf_or_hard_of_hearing", label: "Soy una persona sorda o con discapacidad auditiva" },
  { value: "motor_or_dexterity", label: "Uso teclado, conmutador u otro apoyo motor" },
  { value: "cognitive_or_attention", label: "Necesito una experiencia más clara o con menos carga" },
  { value: "other", label: "Otra necesidad de acceso" },
];

export function PilotFeedback({ defaultArea = "kurevalife_simulator", compact = false }: PilotFeedbackProps) {
  const [ticket, setTicket] = useState(() => getPilotTicket());
  const [kind, setKind] = useState<FeedbackType>("observation");
  const [category, setCategory] = useState<FeedbackCategory>("clarity");
  const [rating, setRating] = useState(0);
  const [accessibilityContext, setAccessibilityContext] = useState<AccessibilityContext>("not_shared");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [senderName, setSenderName] = useState("");
  const [entrySource, setEntrySource] = useState<EntrySource>("directo");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [deliveryFallback, setDeliveryFallback] = useState<string | null>(null);

  const preparePrivateFallback = () => {
    const content = [
      "KurevaLife · valoración privada de piloto",
      `Código de prueba: ${ticket}`,
      `Valoración: ${rating}/5`,
      `Categoría: ${kurevaLifeCategories.find((item) => item.value === category)?.label ?? category}`,
      `Tipo: ${feedbackKinds.find((item) => item.value === kind)?.label ?? kind}`,
      `Acceso: ${accessContexts.find((item) => item.value === accessibilityContext)?.label ?? accessibilityContext}`,
      `Origen: ${entrySource}`,
      `Identificación elegida: ${anonymous ? "sin nombre en el contenido" : senderName.trim()}`,
      "",
      "Sugerencia:",
      message.trim(),
      "",
      "Nota de privacidad: este correo se prepara como respaldo manual. La dirección desde la que se envía será visible para Kureva; no lo uses si necesitas anonimato frente a Kureva.",
    ].join("\n");
    const mailto = `mailto:kurevadigitaldata@gmail.com?subject=${encodeURIComponent(`KurevaLife · valoración ${rating}/5 · ${ticket}`)}&body=${encodeURIComponent(content)}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `KurevaLife_valoracion_${ticket}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    return mailto;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (rating === 0) {
      toast.error("Elige una valoración de una a cinco estrellas.");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Cuéntanos un poco más: escribe al menos 10 caracteres.");
      return;
    }
    if (!anonymous && senderName.trim().length < 2) {
      toast.error("Escribe tu nombre o activa de nuevo el envío anónimo.");
      return;
    }
    if (!privacyAccepted) {
      toast.error("Necesitamos tu consentimiento para guardar esta sugerencia.");
      return;
    }

    setIsSending(true);
    setDeliveryFallback(null);
    try {
      await submitPilotFeedback({
        ticket_code: ticket,
        experience_area: defaultArea,
        feedback_type: kind,
        feedback_category: category,
        rating,
        message: message.trim(),
        accessibility_context: accessibilityContext,
        is_anonymous: anonymous,
        sender_name: anonymous ? null : senderName.trim(),
        entry_source: entrySource,
        consent_privacy: true,
      });
      setSent(true);
      toast.success("Gracias. Tu valoración y sugerencia ya se han recibido.");
    } catch {
      const mailto = preparePrivateFallback();
      setDeliveryFallback(mailto);
      toast.message("Hemos preparado una copia privada para que puedas enviarla directamente a Kureva.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[#DCE8DD] border border-[#B9D0BE] p-6 sm:p-8 text-[#0F3A2D] space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-300" role="status" aria-live="polite">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#D9FF2B]/65 motion-safe:animate-pulse" />
        <div className="relative w-16 h-16"><div className="absolute inset-0 rounded-full border border-[#0F3A2D]/25 kureva-k-orbit" /><div className="absolute inset-2 rounded-2xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display text-2xl font-bold motion-safe:animate-[bounce_0.6s_ease-out_1]">K</div><div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center"><Check className="w-4 h-4" /></div></div>
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5E806E]">Confirmación de participación</div>
          <h3 className="font-display text-2xl font-bold mt-1">Gracias. Tu voz ya forma parte de KurevaLife.</h3>
          <p className="text-sm text-[#173A2E]/80 leading-relaxed mt-3">Hemos registrado tu valoración de <strong>{rating} de 5</strong> y tu sugerencia en la categoría <strong>{kurevaLifeCategories.find((item) => item.value === category)?.label.toLowerCase()}</strong>. {anonymous ? <>Se identifica solo con el código <strong>{ticket}</strong>, sin nombre ni correo.</> : <>Se ha guardado con el nombre que has elegido, en un registro privado de prueba.</>}</p>
          <p className="text-xs text-[#5E806E] mt-3">Tu comentario no aparecerá en una comunidad pública ni se vincula a las notas de la demo.</p>
        </div>
        <button onClick={() => { setSent(false); setMessage(""); setRating(0); setTicket(getPilotTicket()); }} className="relative kureva-btn-secondary text-xs">Dejar otra sugerencia</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={isSending} className={`relative overflow-hidden rounded-2xl border border-white/15 bg-[#0F3A2D] text-[#F5F1E7] ${compact ? "p-5" : "p-6 sm:p-8"} space-y-5`} aria-labelledby="pilot-feedback-title">
      {isSending && <div className="absolute inset-0 z-10 bg-[#09241B]/94 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 motion-safe:animate-in motion-safe:fade-in duration-200"><div className="relative w-17 h-17"><div className="absolute inset-0 rounded-full border-2 border-[#D9FF2B] kureva-k-orbit" /><div className="absolute inset-3 rounded-xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-2xl font-bold">K</div></div><strong className="font-display text-lg text-white mt-4">Guardando tu valoración…</strong><p className="text-sm text-white/65 mt-1">Tu voz ya está llegando a KurevaLife.</p></div>}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><MessageSquareText className="w-4 h-4" /> Buzón privado de prueba</div>
          <h3 id="pilot-feedback-title" className="font-display text-xl sm:text-2xl font-bold text-white">Tu experiencia ayuda a construir KurevaLife.</h3>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">Guarda este código si quieres referirte después a tu sugerencia: <span className="font-mono font-bold text-[#D9FF2B]">{ticket}</span>.</p>
        </div>
        <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 text-[10px] font-bold text-white/80"><ShieldCheck className="w-3.5 h-3.5 text-[#D9FF2B]" /> Privado por diseño</div>
      </div>

      <fieldset>
        <legend className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">¿Cómo valorarías este simulacro?</legend>
        <div className="flex items-center gap-1" aria-label="Valoración de una a cinco estrellas">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`} aria-pressed={rating === value} className="p-1 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
              <Star className={`w-7 h-7 transition-colors ${value <= rating ? "fill-[#D9FF2B] text-[#D9FF2B]" : "text-white/35"}`} />
            </button>
          ))}
          <span className="ml-2 text-xs text-white/65" aria-live="polite">{rating ? `${rating} de 5` : "Elige una valoración"}</span>
        </div>
      </fieldset>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-category">Sobre qué quieres opinar</label>
          <select id="pilot-category" value={category} onChange={(event) => setCategory(event.target.value as FeedbackCategory)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
            {kurevaLifeCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-kind">Qué quieres contarnos</label>
          <select id="pilot-kind" value={kind} onChange={(event) => setKind(event.target.value as FeedbackType)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
            {feedbackKinds.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-entry-source">Cómo llegaste a la prueba</label>
        <select id="pilot-entry-source" value={entrySource} onChange={(event) => setEntrySource(event.target.value as EntrySource)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
          <option value="invitacion_directa">Recibí una invitación directa</option>
          <option value="referido">Me lo compartió otra persona</option>
          <option value="directo">Entré por mi cuenta</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-message">Tu sugerencia <span className="normal-case font-normal">(sin información de salud personal)</span></label>
        <textarea id="pilot-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={compact ? 3 : 5} minLength={10} maxLength={700} required placeholder="Ej.: Me ayudaría que las citas fueran más visibles y que las preguntas se pudieran ordenar por prioridad." className="w-full resize-y rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder:text-white/45 focus:outline-hidden focus:border-[#D9FF2B] focus:ring-1 focus:ring-[#D9FF2B]" />
        <div className="mt-2 text-[11px] text-white/55 flex justify-between gap-3"><span>No incluyas diagnósticos, medicación, datos clínicos, contraseñas ni otra información sensible.</span><span aria-live="polite">{message.length}/700</span></div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-accessibility">Si quieres, cuéntanos desde qué necesidad de acceso pruebas</label>
        <select id="pilot-accessibility" value={accessibilityContext} onChange={(event) => setAccessibilityContext(event.target.value as AccessibilityContext)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
          {accessContexts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>

      <div className="rounded-xl bg-white/8 border border-white/10 p-4 space-y-3">
        <label className="flex items-start gap-3 text-xs text-white/80 leading-relaxed cursor-pointer">
          <input checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} type="checkbox" className="mt-0.5 size-4 accent-[#D9FF2B]" />
          <span><strong className="text-white">Quiero enviar esta sugerencia de forma anónima.</strong> Nadie verá mi nombre porque no se guardará.</span>
        </label>
        {!anonymous && (
          <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-name">Nombre y apellidos que deseas asociar a esta sugerencia</label>
            <input id="pilot-name" value={senderName} onChange={(event) => setSenderName(event.target.value)} maxLength={100} required={!anonymous} placeholder="Tu nombre y apellidos" className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]" />
            <p className="mt-2 text-[11px] text-white/55">El nombre solo queda en el registro privado del piloto. No se publica en la futura comunidad.</p>
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 text-xs text-white/70 leading-relaxed cursor-pointer">
        <input checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} type="checkbox" required className="mt-0.5 size-4 accent-[#D9FF2B]" />
        <span><strong className="text-white">Quiero que esta sugerencia quede en el registro privado del piloto.</strong> Kureva guardará la valoración, el comentario y el código de prueba para mejorar el simulacro. Si elijo identificarme, también guardará el nombre y apellidos escritos. Esta sugerencia no se publica ni se asocia a las notas creadas dentro de la demo.</span>
      </label>

      {deliveryFallback && <div role="status" aria-live="polite" className="rounded-xl border border-[#D9FF2B]/45 bg-[#D9FF2B]/10 p-4 text-sm text-white space-y-2 motion-safe:animate-in motion-safe:fade-in duration-200">
        <strong className="block text-[#D9FF2B]">Tu copia privada está lista.</strong>
        <p className="text-white/80 text-xs leading-relaxed">La descarga evita que se pierda tu valoración. Puedes abrir el correo preparado y enviarlo directamente a Kureva. Si lo haces, tu dirección de correo será visible para Kureva; para anonimato completo, conserva solo el código de prueba y no envíes el correo.</p>
        <a href={deliveryFallback} className="inline-flex items-center gap-2 rounded-lg bg-[#D9FF2B] px-3 py-2 text-xs font-bold text-[#0F3A2D] hover:bg-[#E6FF5A]">Abrir correo privado preparado</a>
      </div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] text-white/55"><HeartHandshake className="w-3.5 h-3.5 text-[#D9FF2B]" /> Kureva aprende de las experiencias reales.</p>
        <button type="submit" disabled={isSending} className="kureva-btn-accent justify-center disabled:opacity-60 disabled:cursor-not-allowed text-sm"><Sparkles className={`w-4 h-4 ${isSending ? "animate-spin" : ""}`} /> {isSending ? "Enviando…" : "Enviar valoración y sugerencia"}</button>
      </div>
    </form>
  );
}

import React, { useState } from "react";
import { Check, CircleAlert, HeartHandshake, LoaderCircle, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  type AccessibilityContext,
  type ExperienceArea,
  type FeedbackType,
  getPilotTicket,
  submitPilotFeedback,
} from "@/lib/pilotFeedback";

type PilotFeedbackProps = {
  defaultArea?: ExperienceArea;
  compact?: boolean;
};

const feedbackKinds: { value: FeedbackType; label: string }[] = [
  { value: "observation", label: "Algo que entendí o sentí" },
  { value: "problem", label: "Algo que no funcionó" },
  { value: "idea", label: "Una mejora o necesidad" },
  { value: "accessibility", label: "Una barrera de accesibilidad" },
  { value: "encouragement", label: "Un mensaje de ánimo" },
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
  const [area, setArea] = useState<ExperienceArea>(defaultArea);
  const [kind, setKind] = useState<FeedbackType>("observation");
  const [accessibilityContext, setAccessibilityContext] = useState<AccessibilityContext>("not_shared");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim().length < 10) {
      toast.error("Cuéntanos un poco más: escribe al menos 10 caracteres.");
      return;
    }
    if (!privacyAccepted) {
      toast.error("Necesitamos tu consentimiento para guardar solo este comentario anónimo.");
      return;
    }

    setIsSending(true);
    try {
      await submitPilotFeedback({
        ticket_code: ticket,
        experience_area: area,
        feedback_type: kind,
        message: message.trim(),
        accessibility_context: accessibilityContext,
        consent_privacy: true,
      });
      setSent(true);
      toast.success("Tu sugerencia se ha registrado. Gracias por construir Kureva con nosotros.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se ha podido registrar la sugerencia.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-[#DCE8DD] border border-[#B9D0BE] p-6 sm:p-7 text-[#0F3A2D] space-y-4" role="status">
        <div className="w-11 h-11 rounded-full bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center"><Check className="w-5 h-5" /></div>
        <div>
          <h3 className="font-display text-xl font-bold">Gracias por dejar tu huella.</h3>
          <p className="text-sm text-[#173A2E]/75 leading-relaxed mt-2">Tu aportación queda registrada como <strong>{ticket}</strong>, sin nombre ni correo vinculados. Leeremos los patrones del grupo, no solo las opiniones más ruidosas.</p>
        </div>
        <button onClick={() => { setSent(false); setMessage(""); setTicket(getPilotTicket()); }} className="kureva-btn-secondary text-xs">Dejar otra sugerencia</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl border border-white/15 bg-[#0F3A2D] text-[#F5F1E7] ${compact ? "p-5" : "p-6 sm:p-8"} space-y-5`} aria-labelledby="pilot-feedback-title">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><MessageSquareText className="w-4 h-4" /> Buzón de prueba anónimo</div>
          <h3 id="pilot-feedback-title" className="font-display text-xl sm:text-2xl font-bold text-white">Tu experiencia también es parte de Kureva.</h3>
          <p className="text-sm text-white/70 leading-relaxed max-w-2xl">No pedimos tu nombre. Guarda este código si quieres referirte después a tu sugerencia: <span className="font-mono font-bold text-[#D9FF2B]">{ticket}</span>.</p>
        </div>
        <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 text-[10px] font-bold text-white/80"><ShieldCheck className="w-3.5 h-3.5 text-[#D9FF2B]" /> Anónimo por diseño</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-area">Dónde estabas</label>
          <select id="pilot-area" value={area} onChange={(event) => setArea(event.target.value as ExperienceArea)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
            <option value="kurevalife_simulator">Simulacro de KurevaLife</option>
            <option value="calculator_report">Calculadora e informe PDF</option>
            <option value="accessibility">Accesibilidad de la web</option>
            <option value="general">Experiencia general de Kureva</option>
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
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-message">Tu sugerencia <span className="normal-case font-normal">(sin datos personales)</span></label>
        <textarea id="pilot-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={compact ? 3 : 5} minLength={10} maxLength={3000} required placeholder="Ej.: Entendí los botones, pero me costó ver el contraste de la tarjeta crema. Me ayudaría que…" className="w-full resize-y rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder:text-white/45 focus:outline-hidden focus:border-[#D9FF2B] focus:ring-1 focus:ring-[#D9FF2B]" />
        <div className="mt-2 text-[11px] text-white/55 flex justify-between gap-3"><span>No incluyas datos médicos, contraseñas ni información sensible.</span><span aria-live="polite">{message.length}/3000</span></div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2" htmlFor="pilot-accessibility">Si quieres, cuéntanos desde qué necesidad de acceso pruebas</label>
        <select id="pilot-accessibility" value={accessibilityContext} onChange={(event) => setAccessibilityContext(event.target.value as AccessibilityContext)} className="w-full h-11 px-3 rounded-xl bg-white text-[#173A2E] border border-white/10 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">
          {accessContexts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <p className="mt-2 text-[11px] text-white/55 leading-relaxed">Es voluntario. Nos ayuda a detectar barreras para personas ciegas, con baja visión, sordas o con discapacidad auditiva, y para distintos modos de interacción.</p>
      </div>

      <label className="flex items-start gap-3 text-xs text-white/70 leading-relaxed cursor-pointer">
        <input checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} type="checkbox" required className="mt-0.5 size-4 accent-[#D9FF2B]" />
        <span>Entiendo que Kureva guardará solo esta sugerencia y su código de prueba para mejorar el producto. No se asociará a mi nombre, correo ni a las notas que he usado en el simulacro.</span>
      </label>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] text-white/55"><HeartHandshake className="w-3.5 h-3.5 text-[#D9FF2B]" /> Kureva aprende de patrones, no exige perfección.</p>
        <button type="submit" disabled={isSending} className="kureva-btn-accent justify-center disabled:opacity-60 disabled:cursor-not-allowed text-sm"><Sparkles className={`w-4 h-4 ${isSending ? "animate-spin" : ""}`} /> {isSending ? "Guardando…" : "Enviar sugerencia anónima"}</button>
      </div>
    </form>
  );
}

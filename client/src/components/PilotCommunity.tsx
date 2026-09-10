import React, { useEffect, useState } from "react";
import { Check, Clock3, Eye, HeartHandshake, LoaderCircle, MessageCircleHeart, RefreshCw, Send, ShieldAlert, UsersRound } from "lucide-react";
import { toast } from "sonner";
import {
  type CommunityCategory,
  type CommunityMessage,
  loadCommunityMessages,
  loadPilotWindow,
  submitCommunityMessage,
} from "@/lib/pilotFeedback";

const categories: { value: CommunityCategory; label: string }[] = [
  { value: "daily_blocks", label: "Bloques y recordatorios" },
  { value: "medical_organization", label: "Citas y organización" },
  { value: "nutrition", label: "Alimentos y bienestar" },
  { value: "accessibility", label: "Accesibilidad" },
  { value: "privacy", label: "Privacidad" },
  { value: "kivi_support", label: "Kivi y soporte" },
  { value: "family_mode", label: "Modo familiar" },
  { value: "general", label: "Idea general" },
];

function formatRemaining(visibleUntil: string) {
  const remaining = Math.max(0, new Date(visibleUntil).getTime() - Date.now());
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

export function PilotCommunity() {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [category, setCategory] = useState<CommunityCategory>("general");
  const [message, setMessage] = useState("");
  const [publicConsent, setPublicConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [windowEndsAt, setWindowEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const refresh = async () => {
    setIsLoading(true);
    try {
      const [loaded, window] = await Promise.all([loadCommunityMessages(), loadPilotWindow()]);
      setMessages(loaded);
      setWindowEndsAt(window?.ends_at ?? null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se ha podido cargar la conversación.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const remaining = windowEndsAt ? formatRemaining(windowEndsAt) : "24 h";
  const isClosed = Boolean(windowEndsAt && new Date(windowEndsAt).getTime() <= now);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || message.trim().length < 10) {
      toast.error("Escribe al menos una frase de 10 caracteres para compartir tu idea.");
      return;
    }
    if (!anonymous && displayName.trim().length < 2) {
      toast.error("Escribe tu nombre o elige publicar de forma anónima.");
      return;
    }
    if (!publicConsent) {
      toast.error("Marca el consentimiento para confirmar que esta idea será visible a otras personas del piloto.");
      return;
    }

    setIsSending(true);
    try {
      const visibleUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await submitCommunityMessage({
        display_name: anonymous ? "Persona Kureva" : displayName.trim(),
        is_anonymous: anonymous,
        category,
        message: message.trim(),
        consent_public: true,
        visible_until: visibleUntil,
      });
      setMessage("");
      setPublicConsent(false);
      await refresh();
      toast.success("Tu idea ya es visible para el grupo de prueba durante 24 horas.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se ha podido compartir la idea.");
    } finally {
      setIsSending(false);
    }
  };

  const liveMessages = messages.filter((item) => new Date(item.visible_until).getTime() > now);

  return (
    <section id="comunidad-piloto" className="py-16 md:py-22 bg-[#FFFDF8] border-y border-[#DCD4C4]">
      <div className="container max-w-5xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-5 lg:sticky lg:top-28">
            <span className="kureva-badge"><UsersRound className="w-3.5 h-3.5" /> Conversación temporal del piloto</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0F3A2D] leading-tight">Las ideas pueden encontrarse, sin exponer la vida de nadie.</h2>
            <p className="text-[#5E806E] leading-relaxed">Esta conversación está visible para las personas que tienen el enlace de prueba. Sirve para compartir mejoras de producto, accesibilidad o formas de usar KurevaLife. No es una consulta médica ni un lugar para publicar información personal.</p>
            <div className="rounded-2xl bg-[#0F3A2D] text-white p-5"><div className="flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Clock3 className="w-4 h-4" /> Ventana de prueba</div><div className="font-display text-3xl font-bold mt-2">{isClosed ? "Cerrada" : remaining}</div><p className="text-xs text-white/65 mt-2">{windowEndsAt ? "Todas las publicaciones del grupo se ocultan cuando termine esta ventana compartida de 24 horas." : "La ventana compartida de 24 horas empieza con la primera publicación del grupo."}</p></div>
            <div className="rounded-xl bg-[#FFF7D8] border border-[#E8D592] p-4 text-xs text-[#5A4B13] leading-relaxed"><ShieldAlert className="w-4 h-4 inline-block align-text-bottom mr-1.5" /><strong>No publiques:</strong> diagnósticos, analíticas, medicación, fotografías de documentos, direcciones, teléfonos, correos, contraseñas ni situaciones urgentes. Para temas de salud, consulta con un profesional sanitario.</div>
          </div>

          <div className="space-y-5">
            <form onSubmit={submit} className="rounded-3xl bg-[#0F3A2D] text-white p-6 sm:p-8 space-y-5" aria-labelledby="community-title">
              <div><div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><MessageCircleHeart className="w-4 h-4" /> Compartir con el grupo</div><h3 id="community-title" className="font-display text-2xl font-bold mt-2">¿Qué debería mejorar KurevaLife?</h3><p className="text-sm text-white/70 mt-2">Tu comentario será visible para el grupo de prueba durante 24 horas. No se publica en una comunidad abierta.</p></div>
              <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="community-category" className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Tema</label><select id="community-category" value={category} onChange={(event) => setCategory(event.target.value as CommunityCategory)} className="w-full h-11 rounded-xl px-3 bg-white text-[#173A2E] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]">{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><div className="rounded-xl bg-white/8 border border-white/10 p-3"><label className="flex gap-2 text-xs leading-relaxed cursor-pointer"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="mt-0.5 size-4 accent-[#D9FF2B]" /><span><strong>Publicar de forma anónima</strong><br /><span className="text-white/60">Aparecerá como “Persona Kureva”.</span></span></label></div></div>
              {!anonymous && <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-200"><label htmlFor="community-name" className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Nombre visible durante la prueba</label><input id="community-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} required={!anonymous} placeholder="Tu nombre" className="w-full h-11 rounded-xl px-3 bg-white text-[#173A2E] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9FF2B]" /></div>}
              <div><label htmlFor="community-message" className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">Tu idea o experiencia de producto</label><textarea id="community-message" value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={500} rows={4} placeholder="Ej.: Me serviría que la sección de alimentos mostrara la información en la misma tarjeta que pulso." className="w-full resize-y rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 text-sm text-white placeholder:text-white/45 focus:outline-hidden focus:border-[#D9FF2B]" /><p className="mt-2 text-[11px] text-white/55 flex justify-between"><span>Comparte solo ideas generales, sin datos privados.</span><span>{message.length}/500</span></p></div>
              <label className="flex gap-3 text-xs text-white/75 leading-relaxed cursor-pointer"><input type="checkbox" checked={publicConsent} onChange={(event) => setPublicConsent(event.target.checked)} required className="mt-0.5 size-4 accent-[#D9FF2B]" /><span>Entiendo que esta publicación será visible para las personas con el enlace del piloto durante 24 horas y que no debo incluir información personal o de salud.</span></label>
              <button type="submit" disabled={isSending || isClosed} className="kureva-btn-accent w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"><Send className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`} /> {isClosed ? "La ventana de prueba ha cerrado" : isSending ? "Compartiendo…" : "Compartir con el grupo"}</button>
            </form>

            <div className="rounded-3xl border border-[#DCD4C4] bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 mb-5"><div><div className="text-xs font-bold uppercase tracking-wider text-[#5E806E]">Lo que está compartiendo el grupo</div><h3 className="font-display text-xl font-bold text-[#0F3A2D] mt-1">Ideas visibles durante la prueba</h3></div><button onClick={refresh} aria-label="Actualizar conversación" className="w-9 h-9 rounded-lg border border-[#DCD4C4] flex items-center justify-center text-[#0F3A2D] hover:bg-[#F5F1E7]"><RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /></button></div>
              {isLoading ? <div className="py-8 flex items-center justify-center text-sm text-[#5E806E]"><LoaderCircle className="w-4 h-4 animate-spin mr-2" /> Cargando ideas…</div> : liveMessages.length === 0 ? <div className="rounded-2xl bg-[#F5F1E7] p-6 text-center"><Eye className="w-5 h-5 text-[#0F3A2D] mx-auto" /><p className="font-display font-bold text-[#0F3A2D] mt-3">Aún no hay ideas compartidas.</p><p className="text-sm text-[#5E806E] mt-1">La primera publicación puede abrir una conversación útil para KurevaLife.</p></div> : <div className="space-y-3">{liveMessages.map((item) => <article key={item.id} className="rounded-2xl border border-[#DCD4C4] bg-[#FFFDF8] p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-display font-bold text-sm text-[#0F3A2D]">{item.display_name}</div><div className="text-[10px] uppercase tracking-wider text-[#5E806E] mt-0.5">{categories.find((categoryItem) => categoryItem.value === item.category)?.label ?? "Idea"}</div></div><span className="text-[10px] text-[#5E806E] whitespace-nowrap"><Clock3 className="w-3 h-3 inline-block mr-1" />{formatRemaining(item.visible_until)}</span></div><p className="text-sm text-[#5E806E] leading-relaxed mt-3">{item.message}</p></article>)}</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

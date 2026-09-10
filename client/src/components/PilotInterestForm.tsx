import React, { useState } from "react";
import { ArrowRight, Check, Gift, LoaderCircle, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { submitPilotInterest } from "@/lib/pilotFeedback";

export function PilotInterestForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"persona" | "apoyo" | "profesional" | "comunidad" | "otro">("persona");
  const [updates, setUpdates] = useState(false);
  const [kitUpdates, setKitUpdates] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!updates || !privacy) {
      toast.error("Marca los dos consentimientos necesarios para recibir novedades.");
      return;
    }
    setIsSending(true);
    try {
      await submitPilotInterest({
        email: email.trim(),
        participation_role: role,
        consent_updates: true,
        consent_kit_updates: kitUpdates,
        consent_privacy: true,
      });
      setSent(true);
      toast.success("Tu correo se ha añadido a las novedades de Kureva.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se ha podido registrar el correo.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-[#FFFDF8] p-7 sm:p-9 text-[#173A2E] shadow-2xl border border-[#B9D0BE] text-center space-y-5 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-300" role="status" aria-live="polite">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#D9FF2B]/45 motion-safe:animate-pulse" />
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border border-[#0F3A2D]/20 kureva-k-orbit" />
          <div className="absolute inset-3 rounded-2xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display text-3xl font-bold shadow-lg motion-safe:animate-[bounce_0.65s_cubic-bezier(.23,1,.32,1)_1]">K</div>
        </div>
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5E806E]">Gracias por sumarte</div>
          <h3 className="font-display text-2xl font-bold text-[#0F3A2D] mt-1">Bienvenida anticipada a Kureva.</h3>
          <p className="text-sm text-[#5E806E] max-w-md mx-auto leading-relaxed mt-3">Hemos guardado <strong>{email}</strong> en una lista privada, separada de las sugerencias. Recibirás las novedades relevantes de Kureva y, si lo elegiste, los futuros kits y materiales desde <strong>kurevadigitaldata@gmail.com</strong>.</p>
          <p className="text-xs text-[#5E806E] max-w-md mx-auto leading-relaxed mt-3">No buscamos llenar tu bandeja de entrada: compartiremos avances reales, aperturas y decisiones nacidas de esta comunidad de prueba.</p>
        </div>
        <div className="relative flex flex-col sm:flex-row justify-center gap-3">
          <a href="/#metodo" className="kureva-btn-primary text-xs">Conocer Kureva <ArrowRight className="w-3.5 h-3.5" /></a>
          <button onClick={() => { setSent(false); setEmail(""); }} className="kureva-btn-secondary text-xs">Registrar otro correo</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} aria-busy={isSending} className="relative overflow-hidden rounded-3xl bg-[#FFFDF8] p-7 sm:p-9 text-[#173A2E] shadow-2xl border border-white/20 space-y-5" aria-labelledby="updates-title">
      {isSending && <div className="absolute inset-0 z-10 bg-[#FFFDF8]/92 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 motion-safe:animate-in motion-safe:fade-in duration-200"><div className="relative w-18 h-18"><div className="absolute inset-0 rounded-full border-2 border-[#D9FF2B] kureva-k-orbit" /><div className="absolute inset-3 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center font-display text-2xl font-bold">K</div></div><strong className="font-display text-lg text-[#0F3A2D] mt-4">Guardando tu bienvenida…</strong><p className="text-sm text-[#5E806E] mt-1">Un momento, por favor.</p></div>}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#5E806E] mb-2"><Sparkles className="w-3.5 h-3.5 text-[#0F3A2D]" /> Acompaña el proceso</div>
        <h3 id="updates-title" className="font-display text-2xl font-bold text-[#0F3A2D]">Recibe la bienvenida anticipada a Kureva.</h3>
        <p className="mt-2 text-sm text-[#5E806E] leading-relaxed">Dejar tu correo es opcional. Es una lista privada, separada de tus sugerencias, para compartir avances reales de KurevaLife, aperturas y futuros kits cuando todo sea oficial.</p>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-2" htmlFor="pilot-interest-email">Tu correo</label>
        <input id="pilot-interest-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" placeholder="tu@correo.es" className="w-full h-12 px-4 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D] focus:ring-1 focus:ring-[#0F3A2D]" />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-2" htmlFor="pilot-interest-role">Cómo participas en esta prueba</label>
        <select id="pilot-interest-role" value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="w-full h-12 px-4 rounded-xl border border-[#DCD4C4] bg-white text-sm focus:outline-hidden focus:border-[#0F3A2D]">
          <option value="persona">Como persona usuaria</option>
          <option value="apoyo">Como familiar o persona de apoyo</option>
          <option value="profesional">Como profesional</option>
          <option value="comunidad">Como parte de una comunidad o asociación</option>
          <option value="otro">De otra manera</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="flex items-start gap-2.5 text-xs text-[#5E806E] leading-relaxed cursor-pointer"><input checked={updates} onChange={(event) => setUpdates(event.target.checked)} required type="checkbox" className="mt-0.5 size-4 accent-[#0F3A2D]" /><span>Quiero recibir noticias relevantes sobre los avances, la apertura de la beta y cómo han influido las sugerencias del grupo de prueba.</span></label>
        <label className="flex items-start gap-2.5 text-xs text-[#5E806E] leading-relaxed cursor-pointer"><input checked={kitUpdates} onChange={(event) => setKitUpdates(event.target.checked)} type="checkbox" className="mt-0.5 size-4 accent-[#0F3A2D]" /><span>También quiero que me avisen, cuando sea oficial, de los kits y materiales de Kureva.</span></label>
        <label className="flex items-start gap-2.5 text-xs text-[#5E806E] leading-relaxed cursor-pointer"><input checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} required type="checkbox" className="mt-0.5 size-4 accent-[#0F3A2D]" /><span>Entiendo que este correo se guarda solo para estas comunicaciones y que puedo pedir su eliminación cuando quiera.</span></label>
      </div>
      <button type="submit" disabled={isSending} className="kureva-btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"><Mail className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`} /> {isSending ? "Guardando…" : "Quiero acompañar el avance"}</button>
      <div className="flex items-center justify-between gap-3 text-[11px] text-[#5E806E]"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#0F3A2D]" /> Consentimiento explícito, sin suscripciones ocultas.</span><a href="/#metodo" className="font-bold text-[#0F3A2D] underline decoration-[#D9FF2B] decoration-2 underline-offset-3">Saber más de Kureva</a></div>
    </form>
  );
}

import React, { useState } from "react";
import { Check, Gift, Mail, ShieldCheck, Sparkles } from "lucide-react";
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
      toast.success("Tu correo se ha apuntado a los avances de Kureva.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se ha podido registrar el correo.");
    } finally {
      setIsSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-[#FFFDF8] p-7 sm:p-9 text-[#173A2E] shadow-2xl border border-white/20 text-center space-y-4" role="status">
        <div className="w-15 h-15 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center mx-auto"><Check className="w-8 h-8" /></div>
        <h3 className="font-display text-2xl font-bold text-[#0F3A2D]">Tu correo ya está en la lista privada.</h3>
        <p className="text-sm text-[#5E806E] max-w-sm mx-auto">Hemos registrado <strong>{email}</strong> de forma separada de las sugerencias anónimas. La confirmación automática por correo se activará desde la cuenta oficial de Kureva antes de abrir la beta.</p>
        <button onClick={() => { setSent(false); setEmail(""); }} className="kureva-btn-secondary text-xs">Registrar otro correo</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-[#FFFDF8] p-7 sm:p-9 text-[#173A2E] shadow-2xl border border-white/20 space-y-5" aria-labelledby="updates-title">
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-[#5E806E] mb-2">Acompaña el proceso</div>
        <h3 id="updates-title" className="font-display text-2xl font-bold text-[#0F3A2D]">Apúntate a los avances y futuros kits de Kureva.</h3>
        <p className="mt-2 text-sm text-[#5E806E] leading-relaxed">Dejar tu correo es opcional. No lo vinculamos a tu código ni a tus sugerencias anónimas. El envío automático de confirmación se activará desde la cuenta oficial antes de abrir la beta.</p>
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
      <p className="text-[11px] text-[#5E806E] text-center flex items-center justify-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#0F3A2D]" /> Consentimiento explícito, sin suscripciones ocultas.</p>
    </form>
  );
}

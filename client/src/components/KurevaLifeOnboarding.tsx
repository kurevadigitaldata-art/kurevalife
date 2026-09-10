import React, { useState } from "react";
import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

type KurevaLifeOnboardingProps = {
  onStart: () => void;
};

export function KurevaLifeOnboarding({ onStart }: KurevaLifeOnboardingProps) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      eyebrow: "Bienvenida a KurevaLife",
      title: "Un espacio para reunir lo importante sin cargarlo todo en la cabeza.",
      copy: "Aquí podrás explorar ejemplos de citas, recordatorios, preguntas, documentos y bienestar. KurevaLife quiere ayudarte a prepararte, no sustituir a tu médico ni tomar decisiones por ti.",
      note: "Ante cualquier duda sobre tu salud, tratamiento o una urgencia, consulta con tu médico o los servicios de emergencia.",
    },
    {
      eyebrow: "Una prueba guiada",
      title: "Esta versión todavía no registra tus datos de manera permanente.",
      copy: "Puedes tocar, añadir un bloque ficticio, ver una fruta de temporada o abrir una pregunta para Kivi. Lo que escribas dentro de las pantallas de prueba se queda en esta sesión y desaparece al salir.",
      note: "Solo se guarda algo si eliges enviar una valoración, una sugerencia privada o una publicación visible para el grupo de prueba.",
    },
    {
      eyebrow: "Tu opinión hace avanzar Kureva",
      title: "Al terminar podrás valorar la experiencia y decir qué necesitas.",
      copy: "Puedes dejar una sugerencia privada con tu nombre o de forma anónima. También hay una conversación temporal para compartir ideas no sensibles con las demás personas del piloto durante 24 horas.",
      note: "No compartas diagnósticos, analíticas, medicación, fotos de documentos ni datos personales en el espacio visible del grupo.",
    },
  ];
  const current = steps[step];

  return (
    <section id="inicio" className="py-12 md:py-16 bg-[#FFFDF8] border-b border-[#DCD4C4]">
      <div className="container max-w-5xl">
        <div className="rounded-3xl overflow-hidden bg-[#0F3A2D] text-white shadow-xl border border-[#164D3C]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-7 sm:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><Sparkles className="w-4 h-4" /> {current.eyebrow}</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{current.title}</h2>
              <p className="text-white/75 leading-relaxed">{current.copy}</p>
              <div className="rounded-xl bg-white/10 border border-white/10 p-4 text-xs leading-relaxed text-white/75"><ShieldCheck className="w-4 h-4 inline-block align-text-bottom mr-1.5 text-[#D9FF2B]" /> {current.note}</div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center pt-1">
                {step < steps.length - 1 ? <button onClick={() => setStep((value) => value + 1)} className="kureva-btn-accent">Siguiente <ArrowRight className="w-4 h-4" /></button> : <button onClick={onStart} className="kureva-btn-accent">Entrar a KurevaLife <ArrowRight className="w-4 h-4" /></button>}
                {step > 0 && <button onClick={() => setStep((value) => value - 1)} className="inline-flex justify-center px-4 py-3 text-sm font-semibold text-white/85 hover:text-white">Anterior</button>}
              </div>
            </div>
            <aside className="bg-[#09241B] p-7 sm:p-10 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <div className="w-13 h-13 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-xl font-bold">K</div>
                <div><h3 className="font-display text-2xl font-bold">Tu ritmo es válido.</h3><p className="text-sm text-white/65 mt-2">Puedes aumentar el texto, activar más contraste y avanzar con teclado. No hay puntos, rachas ni penalizaciones.</p></div>
              </div>
              <div className="space-y-2" aria-label="Progreso de la bienvenida">{steps.map((item, index) => <button key={item.eyebrow} onClick={() => setStep(index)} aria-label={`Ver paso ${index + 1}: ${item.eyebrow}`} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-3 w-full text-left rounded-lg p-2 transition-colors ${step === index ? "bg-white/10" : "hover:bg-white/5"}`}><span className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${index <= step ? "bg-[#D9FF2B] text-[#0F3A2D]" : "bg-white/10 text-white/65"}`}>{index < step ? <Check className="w-3.5 h-3.5" /> : index + 1}</span><span className={`text-xs ${step === index ? "text-white" : "text-white/60"}`}>{item.eyebrow}</span></button>)}</div>
              <div className="text-[11px] text-white/55 flex gap-2"><LockKeyhole className="w-3.5 h-3.5 shrink-0" /> La prueba guiada no te pide crear cuenta.</div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

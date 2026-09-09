import React from "react";
import { ArrowRight, BadgeCheck, FileCheck2, KeyRound, LockKeyhole, Route, ShieldCheck } from "lucide-react";

const caseFrameworks = [
  {
    icon: KeyRound,
    label: "TRASPASO 01 · ACCESOS",
    title: "Recuperar las llaves del negocio",
    context: "Dominio, hosting, facturación y cuentas de analítica estaban repartidos entre correos personales o bajo acceso exclusivo de un proveedor.",
    outcome: "El caso real publicaría el inventario de activos, los cambios de titularidad y el protocolo de recuperación, nunca contraseñas ni datos sensibles.",
    evidence: "Evidencia prevista: mapa de cuentas antes/después y acta de traspaso.",
  },
  {
    icon: Route,
    label: "TRASPASO 02 · CONTINUIDAD",
    title: "Salir de una cuota cautiva sin apagar la operación",
    context: "Una microempresa necesita cambiar de proveedor pero teme perder su web, formularios, contactos o posicionamiento al hacerlo.",
    outcome: "El caso real mostraría un plan de transición por fases: copia, pruebas, cambio controlado y acompañamiento tras el corte.",
    evidence: "Evidencia prevista: cronograma, checklist de validación y registro de incidencias.",
  },
  {
    icon: FileCheck2,
    label: "TRASPASO 03 · DOCUMENTACIÓN",
    title: "Entender una herramienta que ya funciona",
    context: "La aplicación continúa operativa, pero nadie del equipo sabe mantenerla, cambiar un texto importante o detectar una renovación crítica.",
    outcome: "El caso real documentaría el repositorio, las decisiones técnicas y una sesión de transferencia para que otra persona pueda continuar.",
    evidence: "Evidencia prevista: guía operativa, matriz de responsabilidades y revisión a 30 días.",
  },
];

export function TransitionCases() {
  return (
    <section id="casos" className="py-20 md:py-28 bg-[#0F3A2D] text-[#F5F1E7] border-b border-[#164D3C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "460px 460px", filter: "brightness(0) invert(1)" }} />
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr] gap-12 lg:gap-16 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#D9FF2B] text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4" /> Casos de traspaso, sin ficción</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">La credibilidad se documenta; no se inventa.</h2>
            <p className="text-white/75 leading-relaxed">Kureva todavía no publica testimonios atribuidos ni cifras de clientes: no vamos a fabricar prueba social. En su lugar, esta biblioteca define qué información publicaremos cuando existan traspasos reales, permiso expreso y evidencia suficiente.</p>
            <div className="rounded-2xl bg-white/7 border border-white/12 p-5 space-y-3">
              <div className="flex items-center gap-2 text-[#D9FF2B] text-sm font-bold"><BadgeCheck className="w-4 h-4" /> Requisito para publicar un caso</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex gap-2"><span className="text-[#D9FF2B]">•</span> Autorización informada o anonimización acordada.</li>
                <li className="flex gap-2"><span className="text-[#D9FF2B]">•</span> Situación inicial, intervención y límites explicados.</li>
                <li className="flex gap-2"><span className="text-[#D9FF2B]">•</span> Evidencia revisable, no promesas generales.</li>
              </ul>
            </div>
            <a href="#contacto" className="kureva-btn-accent text-sm">Quiero documentar mi traspaso <ArrowRight className="w-4 h-4" /></a>
          </div>

          <div className="grid gap-4">
            {caseFrameworks.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="rounded-2xl bg-[#FFFDF8] text-[#173A2E] border border-white/15 p-6 sm:p-7 transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-11 h-11 rounded-xl bg-[#0F3A2D] text-[#D9FF2B] flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2 justify-between"><span className="font-mono text-[10px] font-bold tracking-wider text-[#5E806E]">{item.label}</span><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#F5F1E7] text-[10px] font-bold text-[#0F3A2D]"><LockKeyhole className="w-3 h-3" /> PENDIENTE DE CASO REAL</span></div>
                      <h3 className="font-display text-xl font-bold text-[#0F3A2D]">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-[#5E806E]"><strong className="text-[#173A2E]">Situación frecuente:</strong> {item.context}</p>
                      <p className="text-sm leading-relaxed text-[#5E806E]"><strong className="text-[#173A2E]">Qué explicaríamos:</strong> {item.outcome}</p>
                      <div className="pt-3 border-t border-[#DCD4C4] text-xs font-semibold text-[#0F3A2D]">{item.evidence}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col md:flex-row gap-4 justify-between text-xs text-white/60">
          <span>Esta sección es una promesa editorial de transparencia, no un catálogo de resultados todavía.</span>
          <a href="/recursos" className="inline-flex items-center gap-2 text-[#D9FF2B] font-semibold hover:text-white transition-colors">Consultar recursos para un traspaso seguro <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
      </div>
    </section>
  );
}

import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import {
  ArrowRight,
  Calculator as CalculatorIcon,
  CircleDollarSign,
  Info,
  Landmark,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const CurrencyInput = ({
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 10,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel: string;
}) => {
  const changeBy = (amount: number) => onChange(Math.min(max, Math.max(min, value + amount)));

  return (
    <div className="flex items-center rounded-xl border border-[#DCD4C4] bg-[#FFFDF8] overflow-hidden shadow-xs">
      <button
        type="button"
        onClick={() => changeBy(-step)}
        className="h-11 w-11 flex items-center justify-center hover:bg-[#F5F1E7] text-[#0F3A2D] transition-colors"
        aria-label={`Reducir ${ariaLabel}`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="relative flex-1 border-x border-[#DCD4C4]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5E806E]">€</span>
        <input
          aria-label={ariaLabel}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-11 w-full bg-transparent pl-7 pr-3 text-right font-display font-bold text-[#0F3A2D] focus:outline-hidden"
        />
      </div>
      <button
        type="button"
        onClick={() => changeBy(step)}
        className="h-11 w-11 flex items-center justify-center hover:bg-[#F5F1E7] text-[#0F3A2D] transition-colors"
        aria-label={`Aumentar ${ariaLabel}`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Calculator() {
  const [agencyFee, setAgencyFee] = useState(550);
  const [toolsFee, setToolsFee] = useState(180);
  const [manualHours, setManualHours] = useState(7);
  const [hourValue, setHourValue] = useState(28);
  const [kurevaBuild, setKurevaBuild] = useState(2450);
  const [kurevaRecurring, setKurevaRecurring] = useState(85);

  const results = useMemo(() => {
    const currentMonthly = agencyFee + toolsFee + manualHours * hourValue;
    const currentYearOne = currentMonthly * 12;
    const kurevaYearOne = kurevaBuild + kurevaRecurring * 12;
    const continuingSavings = currentMonthly * 12 - kurevaRecurring * 12;
    const firstYearDifference = currentYearOne - kurevaYearOne;
    const twoYearDifference = currentYearOne * 2 - (kurevaYearOne + kurevaRecurring * 12);
    const paybackMonths = currentMonthly > kurevaRecurring
      ? Math.ceil(kurevaBuild / (currentMonthly - kurevaRecurring))
      : null;
    return {
      currentMonthly,
      currentYearOne,
      kurevaYearOne,
      continuingSavings,
      firstYearDifference,
      twoYearDifference,
      paybackMonths,
    };
  }, [agencyFee, toolsFee, manualHours, hourValue, kurevaBuild, kurevaRecurring]);

  const reset = () => {
    setAgencyFee(550);
    setToolsFee(180);
    setManualHours(7);
    setHourValue(28);
    setKurevaBuild(2450);
    setKurevaRecurring(85);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-[#F5F1E7] text-[#173A2E]">
      <Navbar />

      <main className="pt-30 md:pt-36 pb-20">
        <section className="relative overflow-hidden border-b border-[#DCD4C4] bg-[#FFFDF8]">
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: "url('/manus-storage/kureva-pattern_6aabb19d.svg')", backgroundSize: "430px 430px" }} />
          <div className="container relative py-16 md:py-22">
            <div className="max-w-3xl space-y-5">
              <span className="kureva-badge"><CalculatorIcon className="w-3.5 h-3.5" /> Calculadora de costes ocultos</span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-[#0F3A2D] leading-[1.04]">
                ¿Cuánto te cuesta realmente no tener el control?
              </h1>
              <p className="text-lg md:text-xl text-[#5E806E] max-w-2xl leading-relaxed">
                Compara tu modelo actual de agencia, herramientas y trabajo manual con una infraestructura propia, documentada y transferible. Ajusta las cifras a tu contexto.
              </p>
              <div className="flex items-start gap-2 text-xs text-[#5E806E] max-w-2xl">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Estimación orientativa, no presupuesto ni promesa de ahorro. El valor final depende del alcance, procesos, proveedores y decisiones de cada proyecto.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-2xl text-[#0F3A2D]">Introduce tu realidad actual</h2>
                <button onClick={reset} className="inline-flex items-center gap-2 text-xs font-semibold text-[#5E806E] hover:text-[#0F3A2D] transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar ejemplo
                </button>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl bg-[#FFFDF8] border border-[#DCD4C4] p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0F3A2D]/10 flex items-center justify-center text-[#0F3A2D]"><Landmark className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#0F3A2D]">Modelo actual</h3>
                      <p className="text-xs text-[#5E806E]">Cuotas a agencia y suscripciones que mantienes hoy.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#0F3A2D]">Cuota mensual de agencia</span>
                      <CurrencyInput value={agencyFee} onChange={setAgencyFee} ariaLabel="Cuota mensual de agencia" />
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#0F3A2D]">Herramientas y complementos</span>
                      <CurrencyInput value={toolsFee} onChange={setToolsFee} ariaLabel="Herramientas y complementos mensuales" />
                    </label>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#DCD4C4]/70">
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#0F3A2D]">Horas manuales / mes</span>
                      <input type="range" min="0" max="40" step="1" value={manualHours} onChange={(e) => setManualHours(Number(e.target.value))} className="w-full accent-[#0F3A2D] mt-2" />
                      <div className="flex justify-between text-xs"><span className="text-[#5E806E]">0 h</span><strong className="text-[#0F3A2D]">{manualHours} h</strong><span className="text-[#5E806E]">40 h</span></div>
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-[#0F3A2D]">Coste de esa hora interna</span>
                      <CurrencyInput value={hourValue} onChange={setHourValue} step={1} max={200} ariaLabel="Coste de hora interna" />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0F3A2D] text-[#F5F1E7] border border-[#164D3C] p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#D9FF2B] flex items-center justify-center text-[#0F3A2D]"><ShieldCheck className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Escenario de autonomía Kureva</h3>
                      <p className="text-xs text-[#8CA999]">Construcción, traspaso y una infraestructura sin cuota de agencia cautiva.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-white/80">Inversión de construcción</span>
                      <CurrencyInput value={kurevaBuild} onChange={setKurevaBuild} step={100} max={30000} ariaLabel="Inversión de construcción" />
                    </label>
                    <label className="space-y-2">
                      <span className="block text-xs font-bold uppercase tracking-wide text-white/80">Infraestructura mensual propia</span>
                      <CurrencyInput value={kurevaRecurring} onChange={setKurevaRecurring} step={5} max={2000} ariaLabel="Infraestructura mensual propia" />
                    </label>
                  </div>
                  <p className="mt-4 pt-4 border-t border-white/10 text-xs leading-relaxed text-[#8CA999]">
                    Incluye hosting, dominios, software necesario y el soporte que decidas mantener. Configúralo según tu caso: la autonomía no implica hacerlo sin especialistas, sino elegirlos con una salida clara.
                  </p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-26 rounded-3xl bg-[#FFFDF8] border border-[#DCD4C4] p-6 sm:p-8 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-42 h-42 bg-[#D9FF2B]/12 blur-2xl rounded-full pointer-events-none" />
              <div className="relative space-y-6">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#5E806E] mb-2">Resultado estimado</div>
                  <h2 className="font-display font-bold text-2xl text-[#0F3A2D]">La diferencia que puedes recuperar</h2>
                </div>

                <div className="rounded-2xl bg-[#F5F1E7] p-5 border border-[#DCD4C4] space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-[#5E806E]">Coste actual cada mes</span>
                    <strong className="font-display text-2xl text-[#0F3A2D]">{formatCurrency(results.currentMonthly)}</strong>
                  </div>
                  <div className="h-px bg-[#DCD4C4]" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-[#5E806E]">Infraestructura propia / mes</span>
                    <strong className="font-display text-2xl text-[#0F3A2D]">{formatCurrency(kurevaRecurring)}</strong>
                  </div>
                  <div className="h-px bg-[#DCD4C4]" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-semibold text-[#0F3A2D]">Margen anual tras construir</span>
                    <strong className={`font-display text-2xl ${results.continuingSavings >= 0 ? "text-[#0F3A2D]" : "text-[#B43A2B]"}`}>{formatCurrency(results.continuingSavings)}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#0F3A2D] p-4 text-[#F5F1E7]">
                    <div className="text-[10px] uppercase tracking-wider text-[#8CA999]">Diferencia primer año</div>
                    <div className="font-display text-xl font-bold mt-1">{formatCurrency(results.firstYearDifference)}</div>
                    <div className="text-[10px] mt-1 text-white/70">incluyendo construcción</div>
                  </div>
                  <div className="rounded-xl bg-[#D9FF2B] p-4 text-[#0F3A2D]">
                    <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Diferencia a 2 años</div>
                    <div className="font-display text-xl font-bold mt-1">{formatCurrency(results.twoYearDifference)}</div>
                    <div className="text-[10px] mt-1 opacity-70">modelo propio</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl border border-[#DCD4C4] text-sm">
                  <WalletCards className="w-5 h-5 text-[#0F3A2D] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#0F3A2D]">{results.paybackMonths ? `Punto de retorno estimado: mes ${results.paybackMonths}` : "Evalúa el alcance antes de comparar"}</strong>
                    <span className="text-xs text-[#5E806E]">A partir de ahí, mantienes la diferencia económica y la propiedad de los activos.</span>
                  </div>
                </div>

                <a href="/#contacto" className="kureva-btn-primary w-full justify-center">
                  Convertir esta estimación en un plan real
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

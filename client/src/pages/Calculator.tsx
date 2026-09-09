import React, { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { jsPDF } from "jspdf";
import {
  ArrowRight,
  Calculator as CalculatorIcon,
  CircleDollarSign,
  FileDown,
  Info,
  Landmark,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

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

  const exportReport = () => {
    const reportDate = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());
    const reportDateForFile = new Intl.DateTimeFormat("sv-SE").format(new Date());
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const forest: [number, number, number] = [15, 58, 45];
    const cream: [number, number, number] = [245, 241, 231];
    const ink: [number, number, number] = [23, 58, 46];
    const moss: [number, number, number] = [94, 128, 110];
    const lime: [number, number, number] = [217, 255, 43];
    const line: [number, number, number] = [220, 212, 196];

    const currency = (value: number) => formatCurrency(value).replace(" ", " ");
    const text = (copy: string, x: number, y: number, size = 10, color: [number, number, number] = ink, style: "normal" | "bold" = "normal") => {
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(copy, x, y);
    };
    const wrapped = (copy: string, x: number, y: number, width: number, size = 9, color: [number, number, number] = moss) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(copy, width) as string[];
      doc.text(lines, x, y, { lineHeightFactor: 1.45 });
      return y + lines.length * size * 0.51;
    };
    const divider = (y: number) => {
      doc.setDrawColor(...line);
      doc.setLineWidth(0.35);
      doc.line(18, y, pageWidth - 18, y);
    };
    const metric = (label: string, value: string, x: number, y: number, width: number, fill: [number, number, number], valueColor: [number, number, number]) => {
      doc.setFillColor(...fill);
      doc.roundedRect(x, y, width, 31, 3, 3, "F");
      text(label.toUpperCase(), x + 4.5, y + 8, 6.7, fill === forest ? cream : moss, "bold");
      text(value, x + 4.5, y + 19, 16, valueColor, "bold");
    };

    doc.setFillColor(...cream);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    doc.setFillColor(...forest);
    doc.rect(0, 0, pageWidth, 43, "F");
    doc.setFillColor(...lime);
    doc.circle(pageWidth - 19, 16, 8, "F");
    text("K", pageWidth - 21.6, 20.5, 11, forest, "bold");
    text("KUREVA", 18, 15, 10, cream, "bold");
    text("AUTONOMÍA DIGITAL · SAN MIGUEL DE SALINAS, ALICANTE", 18, 22, 7, [191, 213, 202], "bold");
    text("INFORME DE COSTES", 18, 36, 7.5, lime, "bold");

    text("Estimación para decidir", 18, 61, 22, forest, "bold");
    text("con más contexto.", 18, 70, 22, forest, "bold");
    wrapped("Resumen generado desde la calculadora de costes ocultos de Kureva. Es una estimación de trabajo: no constituye una oferta, un presupuesto ni una garantía de ahorro.", 18, 81, 143, 9.5);
    text(`Generado el ${reportDate}`, 18, 104, 8, moss, "bold");
    divider(112);

    text("La comparación", 18, 127, 13, forest, "bold");
    metric("Coste actual cada mes", currency(results.currentMonthly), 18, 135, 84, cream, forest);
    metric("Infraestructura propia / mes", currency(kurevaRecurring), 108, 135, 84, forest, cream);
    metric("Diferencia estimada a 1 año", currency(results.firstYearDifference), 18, 174, 84, forest, cream);
    metric("Diferencia estimada a 2 años", currency(results.twoYearDifference), 108, 174, 84, lime, forest);

    text("Punto de retorno", 18, 224, 12, forest, "bold");
    wrapped(
      results.paybackMonths
        ? `Con estas cifras, la inversión inicial podría compensarse alrededor del mes ${results.paybackMonths}. A partir de ese punto, la diferencia anual estimada entre ambos modelos es de ${currency(results.continuingSavings)}.`
        : "Con estas cifras, la inversión inicial no se compensa dentro del modelo comparado. Conviene revisar el alcance, los costes recurrentes y los beneficios no económicos antes de tomar una decisión.",
      18,
      233,
      174,
      9.5,
      ink,
    );

    doc.addPage();
    doc.setFillColor(...cream);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    text("KUREVA", 18, 16, 9, forest, "bold");
    text("INFORME DE COSTES · DETALLE DE SUPUESTOS", pageWidth - 18, 16, 7, moss, "bold");
    divider(22);
    text("Supuestos introducidos", 18, 39, 16, forest, "bold");
    wrapped("Las cifras siguientes se han introducido manualmente en la calculadora. Llévalas a una conversación con socios, dirección o un proveedor para contrastarlas con facturas, procesos y necesidades reales.", 18, 49, 171, 9.5);

    const rows = [
      ["Cuota mensual de agencia", currency(agencyFee), "Modelo actual"],
      ["Herramientas y complementos", currency(toolsFee), "Modelo actual"],
      ["Horas manuales al mes", `${manualHours} h`, "Modelo actual"],
      ["Coste estimado de la hora interna", currency(hourValue), "Modelo actual"],
      ["Inversión de construcción", currency(kurevaBuild), "Modelo propio"],
      ["Infraestructura mensual propia", currency(kurevaRecurring), "Modelo propio"],
    ];
    let rowY = 75;
    rows.forEach((row, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(255, 253, 248);
        doc.roundedRect(18, rowY - 6, 174, 12, 1.5, 1.5, "F");
      }
      text(row[0], 22, rowY, 9, ink, "bold");
      text(row[2], 123, rowY, 7.2, moss, "normal");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...forest);
      doc.text(row[1], 187, rowY, { align: "right" });
      rowY += 14;
    });

    text("Lectura responsable", 18, 172, 14, forest, "bold");
    const responsibleEnd = wrapped("Esta simulación compara euros y tiempo visible. No incluye impuestos, migraciones complejas, cambios de alcance, costes de formación, riesgos operativos ni el valor cualitativo de tener acceso a tus activos. La conveniencia de un modelo propio depende de tu caso, no solo del resultado mostrado.", 18, 182, 174, 9.2, ink);

    doc.setFillColor(...forest);
    doc.roundedRect(18, responsibleEnd + 9, 174, 34, 3, 3, "F");
    text("Siguiente conversación útil", 24, responsibleEnd + 19, 8, lime, "bold");
    wrapped("Contrasta este informe con tus facturas actuales y pregunta por propiedad de cuentas, exportación de datos, documentación, soporte y condiciones de salida. La autonomía no consiste en asumir cada tarea internamente: consiste en poder elegir con claridad.", 24, responsibleEnd + 27, 157, 8.7, cream);

    text("kureva.es · Lo digital, en tus manos.", 18, pageHeight - 15, 7.5, moss, "bold");
    text("Página 2 de 2", pageWidth - 18, pageHeight - 15, 7.5, moss, "normal");
    doc.setProperties({ title: "Informe de costes · Kureva", subject: "Estimación de autonomía digital", author: "Kureva" });
    doc.save(`Kureva_informe_costes_${reportDateForFile}.pdf`);
    toast.success("Informe PDF descargado. Compártelo como estimación, no como presupuesto.");
  };

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

                <button onClick={exportReport} className="kureva-btn-secondary w-full justify-center text-sm">
                  Descargar informe PDF
                  <FileDown className="w-4 h-4" />
                </button>
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

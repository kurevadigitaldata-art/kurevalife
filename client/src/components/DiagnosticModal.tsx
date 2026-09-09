import React, { useState } from "react";
import { X, CheckCircle2, ArrowRight, ShieldCheck, Cpu, Code2, Users } from "lucide-react";
import { toast } from "sonner";

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: "service",
    currentPain: "dependencies",
    digitalLevel: "medium",
    email: "",
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success("Diagnóstico preliminar generado con éxito");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#FFFDF8] border border-[#DCD4C4] rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden text-[#173A2E]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 transition-colors text-[#5E806E]"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="kureva-badge text-xs">Test de Autonomía Digital</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-[#0F3A2D] mb-2">
              Calcula tu nivel de dependencia técnica
            </h3>
            <p className="text-sm text-[#5E806E] mb-6">
              Descubre en 2 minutos qué partes de tu negocio dependen de terceros y cómo tomar el control de tu infraestructura.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-2">
                  1. ¿Cuál es tu mayor obstáculo digital hoy?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {[
                    { id: "dependencies", label: "Dependo de un programador para cada cambio" },
                    { id: "tools", label: "Pago demasiadas herramientas y no se comunican" },
                    { id: "understanding", label: "No entiendo qué me están cobrando" },
                    { id: "scale", label: "Quiero lanzar un producto y no sé cómo empezar" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        formData.currentPain === item.id
                          ? "bg-[#0F3A2D]/5 border-[#0F3A2D] font-semibold text-[#0F3A2D]"
                          : "border-[#DCD4C4] hover:border-[#5E806E] bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="currentPain"
                        checked={formData.currentPain === item.id}
                        onChange={() => setFormData({ ...formData, currentPain: item.id })}
                        className="mt-1 accent-[#0F3A2D]"
                      />
                      <span className="text-xs leading-snug">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Gómez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCD4C4] bg-white focus:outline-hidden focus:border-[#0F3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F3A2D] mb-1.5">
                    Email para el informe
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="elena@tuempresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCD4C4] bg-white focus:outline-hidden focus:border-[#0F3A2D]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#DCD4C4]">
                <span className="text-xs text-[#5E806E]">
                  🔒 Sin spam. Informe con recomendaciones accionables.
                </span>
                <button type="submit" className="kureva-btn-primary text-xs py-2.5 px-5">
                  <span>Obtener plan de autonomía</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-2xl text-[#0F3A2D] mb-2">
              ¡Diagnóstico listo, {formData.name || "amigo"}!
            </h4>
            <p className="text-sm text-[#5E806E] max-w-md mx-auto mb-6">
              Hemos preparado tu hoja de ruta básica hacia la soberanía digital. Hemos enviado una copia resumen a <strong>{formData.email}</strong>.
            </p>

            <div className="bg-[#FAF7F0] border border-[#DCD4C4] rounded-xl p-4 text-left mb-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F3A2D] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0F3A2D]" />
                <span>Primeras 3 acciones inmediatas recomendadas:</span>
              </div>
              <ul className="text-xs space-y-2 text-[#173A2E]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3A2D] mt-1.5 shrink-0" />
                  <span><strong>Auditoría de propiedad:</strong> Asegurar que dominios, cuentas de Git y hosting estén a nombre de tu sociedad, no de intermediarios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3A2D] mt-1.5 shrink-0" />
                  <span><strong>Desacoplamiento de plataforma:</strong> Pasar de cajas negras a arquitecturas abiertas con exportación de datos garantizada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F3A2D] mt-1.5 shrink-0" />
                  <span><strong>Protocolo de mentoría:</strong> Sesión de 90 min para documentar el stack y entrenar a tu equipo interno.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="kureva-btn-primary text-xs py-2.5 px-6"
            >
              Cerrar y continuar navegando
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

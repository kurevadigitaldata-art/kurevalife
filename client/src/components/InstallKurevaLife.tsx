import React, { useEffect, useState } from "react";
import { CheckCircle2, Download, Home, Share2, Smartphone } from "lucide-react";
import { toast } from "sonner";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: InstallPromptEvent;
  }
}

export function InstallKurevaLife() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches || ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

  useEffect(() => {
    const capture = (event: InstallPromptEvent) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    const completed = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", completed);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", completed);
    };
  }, []);

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        toast.success("KurevaLife se ha añadido a tu pantalla de inicio.");
      }
      setPromptEvent(null);
      return;
    }
    toast.info(isIos ? "Abre Compartir y elige “Añadir a pantalla de inicio”." : "Usa el menú del navegador y pulsa “Instalar aplicación” o “Añadir a pantalla de inicio”.");
  };

  if (installed || isStandalone) {
    return <div className="rounded-2xl bg-[#DCE8DD] border border-[#B9D0BE] p-5 text-[#0F3A2D]"><CheckCircle2 className="w-5 h-5 inline mr-2" /><strong>KurevaLife está lista en tu pantalla de inicio.</strong><p className="mt-2 text-sm text-[#5E806E]">Gracias por acompañar esta prueba. Cuando exista la app online, recibirás la experiencia completa si autorizaste las novedades.</p></div>;
  }

  return (
    <section className="rounded-3xl overflow-hidden bg-[#0F3A2D] text-white p-6 sm:p-8" aria-labelledby="install-kurevalife-title">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="relative w-14 h-14 shrink-0"><div className="absolute inset-0 rounded-full border border-[#D9FF2B]/50 kureva-k-orbit" /><div className="absolute inset-2 rounded-2xl bg-[#D9FF2B] text-[#0F3A2D] flex items-center justify-center font-display text-xl font-bold kureva-k-pulse">K</div></div>
          <div>
            <div className="text-xs text-[#D9FF2B] font-bold uppercase tracking-wider">Al terminar tu simulacro</div>
            <h2 id="install-kurevalife-title" className="font-display text-xl sm:text-2xl font-bold mt-1">Ten KurevaLife a un toque de distancia.</h2>
            <p className="text-sm text-white/75 leading-relaxed mt-2">Puedes añadir esta prueba a la pantalla de inicio de tu móvil. Se abrirá como una app, sin buscar el enlace cada vez.</p>
          </div>
        </div>
        <button onClick={install} className="kureva-btn-accent shrink-0" aria-label="Instalar o añadir KurevaLife a la pantalla de inicio"><Download className="w-4 h-4" />Añadir KurevaLife</button>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 gap-3 text-xs text-white/70">
        <p className="rounded-xl bg-white/10 p-3"><Share2 className="w-4 h-4 inline mr-1.5 text-[#D9FF2B]" /><strong className="text-white">iPhone / iPad:</strong> abre Compartir y elige “Añadir a pantalla de inicio”.</p>
        <p className="rounded-xl bg-white/10 p-3"><Smartphone className="w-4 h-4 inline mr-1.5 text-[#D9FF2B]" /><strong className="text-white">Android:</strong> usa este botón o el menú ⋮ y elige “Instalar aplicación”.</p>
      </div>
    </section>
  );
}

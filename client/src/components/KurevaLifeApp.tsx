import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Moon,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/kurevalife/AppShell";
import type { KurevaTab } from "@/components/kurevalife/types";
import { useKurevaLifeState } from "@/components/kurevalife/types";
import {
  BrandSignature,
  KurevaButton,
  KurevaCard,
  LocalStatus,
  SectionHeading,
} from "@/components/kurevalife/ui";

const VIEW_COPY: Record<
  KurevaTab,
  { eyebrow: string; title: string; text: string }
> = {
  hoy: {
    eyebrow: "HOY",
    title: "Tu día en orden.",
    text: "Aquí verás tu progreso, la siguiente acción y tus rutinas de hoy.",
  },
  registrar: {
    eyebrow: "REGISTRAR",
    title: "Guarda lo que quieres tener presente.",
    text: "Datos, notas y archivos se organizarán localmente en tu dispositivo.",
  },
  informes: {
    eyebrow: "INFORMES",
    title: "Tu información, más clara.",
    text: "Aquí reunirás tus registros para preparar una conversación o una consulta.",
  },
  perfil: {
    eyebrow: "PERFIL",
    title: "Tu app, a tu manera.",
    text: "Desde aquí ajustarás apariencia, accesibilidad y preferencias locales.",
  },
};

function EntryScreen({ onContinue }: { onContinue: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <section
      className="kl-entry-screen"
      aria-labelledby="bienvenida-kurevalife"
    >
      <div className="kl-entry-screen__panel">
        <BrandSignature />
        <p className="kl-eyebrow">SIMULACRO PARA TESTERS</p>
        <h1 id="bienvenida-kurevalife">
          Tu día en orden.
          <br />
          Tu consulta más clara.
        </h1>
        <p>
          Bienvenida a la prueba de KurevaLife. Puedes explorarla sin cuenta:
          tus datos de prueba se guardan localmente en este dispositivo.
        </p>
        <label className="kl-field" htmlFor="kl-alias">
          <span>¿Cómo quieres que te llamemos?</span>
          <input
            id="kl-alias"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Nombre o alias (opcional)"
            autoComplete="nickname"
          />
        </label>
        <KurevaButton
          type="button"
          variant="accent"
          onClick={() => onContinue(name.trim())}
        >
          Continuar sin cuenta <ArrowRight size={18} aria-hidden="true" />
        </KurevaButton>
        <p className="kl-entry-screen__note">
          <CheckCircle2 size={16} aria-hidden="true" /> No se crea una cuenta ni
          se envían tus registros durante esta prueba.
        </p>
      </div>
      <aside
        className="kl-entry-screen__aside"
        aria-label="Información de la prueba"
      >
        <div className="kl-entry-screen__k">
          <BrandSignature />
        </div>
        <div>
          <h2>Una experiencia que acompaña.</h2>
          <p>
            Organiza rutinas, registros y preguntas con una estructura clara y
            accesible.
          </p>
        </div>
        <div className="kl-entry-screen__features">
          <span>Texto escalable</span>
          <span>Modo nocturno</span>
          <span>Guardado local</span>
        </div>
      </aside>
    </section>
  );
}

function StructurePanel({
  tab,
  onOpenProfile,
}: {
  tab: KurevaTab;
  onOpenProfile: () => void;
}) {
  const copy = VIEW_COPY[tab];
  return (
    <div className="kl-phase-panel">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.text}
      />
      <KurevaCard className="kl-phase-panel__card">
        <span className="kl-phase-panel__icon" aria-hidden="true">
          <Sparkles size={22} />
        </span>
        <h2>Estructura preparada</h2>
        <p>
          Esta sección ya utiliza la jerarquía, los tokens, las superficies y la
          navegación aprobadas. Su contenido funcional se integra en la fase
          específica del Prompt Maestro.
        </p>
        {tab === "perfil" ? (
          <KurevaButton
            type="button"
            variant="secondary"
            onClick={onOpenProfile}
          >
            Abrir preferencias
          </KurevaButton>
        ) : null}
      </KurevaCard>
    </div>
  );
}

export function KurevaLifeApp() {
  const [state, setState] = useKurevaLifeState();
  const [entered, setEntered] = useState(
    Boolean(state.preferences.displayName)
  );
  const [activeTab, setActiveTab] = useState<KurevaTab>("hoy");

  const continueWithoutAccount = (name: string) => {
    setState(current => ({
      ...current,
      preferences: { ...current.preferences, displayName: name },
    }));
    setEntered(true);
  };

  if (!entered) return <EntryScreen onContinue={continueWithoutAccount} />;

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userName={state.preferences.displayName}
      nightMode={state.preferences.nightMode}
      largeText={state.preferences.largeText}
      highContrast={state.preferences.highContrast}
    >
      <div className="kl-simulator-strip" role="status">
        <span>
          <CircleHelp size={16} aria-hidden="true" /> Simulacro para entorno de
          pruebas
        </span>
        <LocalStatus />
      </div>
      <StructurePanel
        tab={activeTab}
        onOpenProfile={() => setActiveTab("perfil")}
      />
      <div className="kl-app-footer-note">
        <Moon size={17} aria-hidden="true" /> El modo nocturno y los controles
        de accesibilidad se activarán desde Perfil conforme al recorrido
        aprobado.
      </div>
    </AppShell>
  );
}

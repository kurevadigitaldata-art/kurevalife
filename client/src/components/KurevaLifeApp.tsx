import React, { useState } from "react";
import { ArrowRight, CheckCircle2, CircleHelp, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/kurevalife/AppShell";
import { FeedbackScreen } from "@/components/kurevalife/FeedbackScreen";
import {
  KiviPanel,
  ProfileScreen,
  RegisterScreen,
  ReportsScreen,
  TodayScreen,
} from "@/components/kurevalife/Screens";
import {
  createLocalId,
  DEFAULT_KUREVALIFE_STATE,
  type KurevaTab,
  useKurevaLifeState,
} from "@/components/kurevalife/types";
import {
  BrandSignature,
  KurevaButton,
  KurevaCard,
  LocalStatus,
} from "@/components/kurevalife/ui";
import { getPilotTicket } from "@/lib/pilotFeedback";

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
          Bienvenida a KurevaLife. Esta prueba te permite recorrer una app
          local-first: puedes registrar, organizar y generar un resumen sin
          crear una cuenta ni enviar tus notas personales.
        </p>
        <label className="kl-field" htmlFor="kl-alias">
          <span>¿Cómo quieres que te llamemos?</span>
          <input
            id="kl-alias"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Nombre o alias (opcional)"
            autoComplete="nickname"
            maxLength={80}
          />
        </label>
        <KurevaButton
          type="button"
          variant="accent"
          onClick={() => onContinue(name.trim())}
        >
          Empezar simulacro <ArrowRight size={18} aria-hidden="true" />
        </KurevaButton>
        <p className="kl-entry-screen__note">
          <CheckCircle2 size={16} aria-hidden="true" /> Tus registros de prueba
          se guardarán solo en este dispositivo. KurevaLife no diagnostica ni
          sustituye a profesionales sanitarios.
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
            Organiza rutinas, registros, avisos y preguntas con una estructura
            clara, accesible y sin juicios.
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

export function KurevaLifeApp() {
  const [state, setState] = useKurevaLifeState();
  const [entered, setEntered] = useState(state.hasStarted);
  const [activeTab, setActiveTab] = useState<KurevaTab>("hoy");
  const [kiviOpen, setKiviOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [ticket] = useState(() => getPilotTicket());

  const continueWithoutAccount = (name: string) => {
    setState(current => ({
      ...current,
      hasStarted: true,
      preferences: { ...current.preferences, displayName: name },
    }));
    setEntered(true);
  };

  const updatePreferences = (patch: Partial<typeof state.preferences>) => {
    setState(current => ({
      ...current,
      preferences: { ...current.preferences, ...patch },
    }));
  };

  const resetSimulation = () => {
    const confirmation = window.confirm(
      "¿Quieres reiniciar los datos locales de esta simulación? Esta acción solo afecta a este dispositivo."
    );
    if (!confirmation) return;
    setState(JSON.parse(JSON.stringify(DEFAULT_KUREVALIFE_STATE)));
    setEntered(false);
    setActiveTab("hoy");
    setFeedbackOpen(false);
    setKiviOpen(false);
  };

  if (!entered) return <EntryScreen onContinue={continueWithoutAccount} />;

  const page = () => {
    if (feedbackOpen) return <FeedbackScreen ticket={ticket} />;
    if (activeTab === "hoy")
      return (
        <TodayScreen
          name={state.preferences.displayName}
          state={state}
          onToggleRoutine={id =>
            setState(current => ({
              ...current,
              routines: current.routines.map(routine =>
                routine.id === id
                  ? { ...routine, completed: !routine.completed }
                  : routine
              ),
            }))
          }
          onOpenRegister={() => setActiveTab("registrar")}
        />
      );
    if (activeTab === "registrar")
      return (
        <RegisterScreen
          records={state.records}
          reminders={state.reminders}
          hydration={state.hydration}
          onAddRecord={record =>
            setState(current => ({
              ...current,
              records: [record, ...current.records],
            }))
          }
          onAddReminder={reminder =>
            setState(current => ({
              ...current,
              reminders: [reminder, ...current.reminders],
            }))
          }
          onUpdateHydration={hydration =>
            setState(current => ({ ...current, hydration }))
          }
        />
      );
    if (activeTab === "informes")
      return (
        <ReportsScreen
          state={state}
          onOpenRegister={() => setActiveTab("registrar")}
        />
      );
    return (
      <ProfileScreen
        preferences={state.preferences}
        questions={state.consultationQuestions}
        onUpdatePreferences={updatePreferences}
        onToggleQuestion={id =>
          setState(current => ({
            ...current,
            consultationQuestions: current.consultationQuestions.map(
              question =>
                question.id === id
                  ? { ...question, selected: !question.selected }
                  : question
            ),
          }))
        }
        onOpenFeedback={() => setFeedbackOpen(true)}
      />
    );
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={tab => {
        setActiveTab(tab);
        setFeedbackOpen(false);
        setKiviOpen(false);
      }}
      userName={state.preferences.displayName}
      nightMode={state.preferences.nightMode}
      largeText={state.preferences.largeText}
      highContrast={state.preferences.highContrast}
      onOpenKivi={() => setKiviOpen(true)}
    >
      <div className="kl-simulator-strip" role="status">
        <span>
          <CircleHelp size={16} aria-hidden="true" /> Simulacro para entorno de
          pruebas
        </span>
        <LocalStatus />
      </div>
      {feedbackOpen ? (
        <button
          type="button"
          className="kl-back-link"
          onClick={() => setFeedbackOpen(false)}
        >
          ← Volver a Perfil
        </button>
      ) : null}
      {page()}
      <KurevaCard className="kl-simulator-footer" labelledBy="simulacro-local">
        <div>
          <p className="kl-card-label">SIMULACRO LOCAL</p>
          <h2 id="simulacro-local">Puedes explorar con tranquilidad.</h2>
          <p>
            Lo que anotas se conserva en este dispositivo durante la prueba. No
            se sincroniza ni se interpreta clínicamente.
          </p>
        </div>
        <KurevaButton type="button" variant="quiet" onClick={resetSimulation}>
          <RotateCcw size={17} aria-hidden="true" /> Reiniciar prueba
        </KurevaButton>
      </KurevaCard>
      {kiviOpen ? (
        <KiviPanel
          onClose={() => setKiviOpen(false)}
          state={state}
          onOpenTab={tab => {
            setActiveTab(tab);
            setKiviOpen(false);
          }}
        />
      ) : null}
    </AppShell>
  );
}

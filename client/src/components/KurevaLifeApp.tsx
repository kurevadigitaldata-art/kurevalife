import React, { useState } from "react";
import { CircleHelp, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/kurevalife/AppShell";
import { KurevaLifeOnboarding } from "@/components/kurevalife/Onboarding";
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
  KurevaButton,
  KurevaCard,
  LocalStatus,
} from "@/components/kurevalife/ui";

export function KurevaLifeApp() {
  const [state, setState] = useKurevaLifeState();
  const [entered, setEntered] = useState(state.hasStarted);
  const [activeTab, setActiveTab] = useState<KurevaTab>("hoy");
  const [kiviOpen, setKiviOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const announce = (message: string, useVoice = false) => {
    setLiveMessage(message);
    if (
      !useVoice ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "es-ES";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const continueWithoutAccount = (
    patch: Pick<
      typeof state.preferences,
      | "displayName"
      | "familyName"
      | "textScale"
      | "soundEnabled"
      | "translationEnabled"
      | "subtitlesEnabled"
      | "screenReaderSupport"
      | "easyReadMode"
    >
  ) => {
    setState(current => ({
      ...current,
      hasStarted: true,
      preferences: {
        ...current.preferences,
        ...patch,
        largeText: patch.textScale !== "normal",
      },
    }));
    setEntered(true);
  };

  const updatePreferences = (patch: Partial<typeof state.preferences>) => {
    setState(current => {
      const preferences = { ...current.preferences, ...patch };
      if (patch.textScale) {
        preferences.largeText = patch.textScale !== "normal";
      }
      return { ...current, preferences };
    });
  };

  const resetSimulation = () => {
    const confirmation = window.confirm(
      "¿Quieres reiniciar los datos de ejemplo de esta sesión? Esta acción no afecta a ninguna cuenta."
    );
    if (!confirmation) return;
    setState(JSON.parse(JSON.stringify(DEFAULT_KUREVALIFE_STATE)));
    setEntered(false);
    setActiveTab("hoy");
    setFeedbackOpen(false);
    setKiviOpen(false);
  };

  const finishSimulation = () => {
    setState(JSON.parse(JSON.stringify(DEFAULT_KUREVALIFE_STATE)));
    setEntered(false);
    setActiveTab("hoy");
    setFeedbackOpen(false);
    setKiviOpen(false);
  };

  if (!entered) {
    return (
      <KurevaLifeOnboarding
        onComplete={continueWithoutAccount}
        onAnnounce={announce}
      />
    );
  }

  const page = () => {
    if (feedbackOpen) return <FeedbackScreen onFinish={finishSimulation} />;
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
          onAddRecord={record =>
            setState(current => ({
              ...current,
              records: [record, ...current.records],
            }))
          }
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
        const tabLabel = {
          hoy: "Hoy",
          registrar: "Registrar",
          informes: "Informes",
          perfil: "Perfil",
        }[tab];
        announce(
          `Abriendo ${tabLabel}.`,
          state.preferences.soundEnabled ||
            state.preferences.screenReaderSupport
        );
      }}
      userName={state.preferences.displayName}
      nightMode={state.preferences.nightMode}
      textScale={state.preferences.textScale}
      highContrast={state.preferences.highContrast}
      easyReadMode={state.preferences.easyReadMode}
      screenReaderSupport={state.preferences.screenReaderSupport}
      onOpenKivi={() => {
        setKiviOpen(true);
        announce(
          "Kivi está abierto. Puedes elegir una opción o escribir una consulta.",
          state.preferences.soundEnabled ||
            state.preferences.screenReaderSupport
        );
      }}
    >
      <p className="kl-visually-hidden" role="status" aria-live="polite">
        {liveMessage}
      </p>
      <div className="kl-simulator-strip" role="status">
        <span>
          <CircleHelp size={16} aria-hidden="true" /> Simulacro para entorno de
          pruebas
        </span>
        <LocalStatus state="Solo esta sesión" />
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
            Lo que anotas solo existe mientras esta prueba está abierta. No se
            sincroniza, no se conserva al recargar ni se interpreta
            clínicamente.
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
          subtitlesEnabled={state.preferences.subtitlesEnabled}
          onAnnounce={message =>
            announce(
              message,
              state.preferences.soundEnabled ||
                state.preferences.screenReaderSupport
            )
          }
        />
      ) : null}
    </AppShell>
  );
}

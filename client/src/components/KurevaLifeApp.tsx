import React, { useState } from "react";
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
  type KurevaTab,
  useKurevaLifeState,
} from "@/components/kurevalife/types";

export function KurevaLifeApp() {
  const [state, setState] = useKurevaLifeState();
  const [entered, setEntered] = useState(state.hasStarted);
  const [activeTab, setActiveTab] = useState<KurevaTab>("hoy");
  const [kiviOpen, setKiviOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const announce = (message: string, useVoice = false) => {
    setLiveMessage(message);
    if (!useVoice || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "es-ES";
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const completeOnboarding = (patch: Pick<typeof state.preferences, "displayName" | "familyName" | "textScale" | "soundEnabled" | "translationEnabled" | "subtitlesEnabled" | "screenReaderSupport" | "easyReadMode">) => {
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
      if (patch.textScale) preferences.largeText = patch.textScale !== "normal";
      return { ...current, preferences };
    });
  };

  if (!entered) {
    return <KurevaLifeOnboarding onComplete={completeOnboarding} onAnnounce={announce} />;
  }

  const page = () => {
    if (feedbackOpen) {
      return <FeedbackScreen displayName={state.preferences.displayName} onFinish={() => setFeedbackOpen(false)} />;
    }
    if (activeTab === "hoy") {
      return <TodayScreen name={state.preferences.displayName} state={state}
        onToggleRoutine={id => setState(current => ({ ...current, routines: current.routines.map(item => item.id === id ? { ...item, completed: !item.completed } : item) }))}
        onOpenRegister={() => setActiveTab("registrar")}
        onAddRecord={record => setState(current => ({ ...current, records: [record, ...current.records] }))}
        onAddReminder={reminder => setState(current => ({ ...current, reminders: [reminder, ...current.reminders] }))}
        onUpdateHydration={hydration => setState(current => ({ ...current, hydration }))}
      />;
    }
    if (activeTab === "registrar") {
      return <RegisterScreen records={state.records} reminders={state.reminders} hydration={state.hydration}
        onAddRecord={record => setState(current => ({ ...current, records: [record, ...current.records] }))}
        onAddReminder={reminder => setState(current => ({ ...current, reminders: [reminder, ...current.reminders] }))}
        onUpdateHydration={hydration => setState(current => ({ ...current, hydration }))}
      />;
    }
    if (activeTab === "informes") {
      return <ReportsScreen state={state} onOpenRegister={() => setActiveTab("registrar")} onAddRecord={record => setState(current => ({ ...current, records: [record, ...current.records] }))} />;
    }
    return <ProfileScreen preferences={state.preferences} questions={state.consultationQuestions}
      onUpdatePreferences={updatePreferences}
      onToggleQuestion={id => setState(current => ({ ...current, consultationQuestions: current.consultationQuestions.map(question => question.id === id ? { ...question, selected: !question.selected } : question) }))}
      onOpenFeedback={() => setFeedbackOpen(true)}
    />;
  };

  return <AppShell
    activeTab={activeTab}
    onTabChange={tab => {
      setActiveTab(tab);
      setFeedbackOpen(false);
      setKiviOpen(false);
      announce(`Abriendo ${({ hoy: "Hoy", registrar: "Registrar", informes: "Informes", perfil: "Perfil" } as Record<KurevaTab, string>)[tab]}.`, state.preferences.soundEnabled || state.preferences.screenReaderSupport);
    }}
    userName={feedbackOpen ? "" : state.preferences.displayName}
    nightMode={state.preferences.nightMode}
    textScale={state.preferences.textScale}
    highContrast={state.preferences.highContrast}
    easyReadMode={state.preferences.easyReadMode}
    screenReaderSupport={state.preferences.screenReaderSupport}
    onOpenKivi={() => {
      setKiviOpen(true);
      announce("Kivi está abierto. Puedes elegir una opción o escribir una consulta.", state.preferences.soundEnabled || state.preferences.screenReaderSupport);
    }}
  >
    <p className="kl-visually-hidden" role="status" aria-live="polite">{liveMessage}</p>
    {feedbackOpen ? <button type="button" className="kl-back-link" onClick={() => setFeedbackOpen(false)}>← Volver a Perfil</button> : null}
    {page()}
    {kiviOpen ? <KiviPanel onClose={() => setKiviOpen(false)} state={state} subtitlesEnabled={state.preferences.subtitlesEnabled} onAnnounce={message => announce(message, state.preferences.soundEnabled || state.preferences.screenReaderSupport)} /> : null}
  </AppShell>;
}

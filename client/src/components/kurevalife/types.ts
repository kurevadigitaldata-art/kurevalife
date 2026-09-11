import { useEffect, useState } from "react";

export type KurevaTab = "hoy" | "registrar" | "informes" | "perfil";
export type RegisterSection = "datos" | "notas" | "avisos" | "agua";

export type Routine = {
  id: string;
  title: string;
  detail: string;
  period: "Mañana" | "Tarde" | "Noche";
  completed: boolean;
};

export type RecordKind =
  | "tension"
  | "colesterol"
  | "hba1c"
  | "observacion"
  | "peso"
  | "otro";

export type AttachmentMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
};

export type RecordEntry = {
  id: string;
  kind: RecordKind;
  value: string;
  note: string;
  createdAt: string;
  source: "manual" | "dictado" | "archivo";
  attachments: AttachmentMeta[];
};

export type Reminder = {
  id: string;
  title: string;
  time: string;
  frequency: "Cada día" | "Días laborables" | "Una vez";
  visual: true;
  completed: boolean;
  createdAt: string;
};

export type HydrationGoal = {
  glasses: number;
  season: "Invierno" | "Primavera" | "Verano" | "Otoño";
  activity: "Baja" | "Media" | "Alta";
  completed: number;
  reminderEnabled: boolean;
};

export type ConsultationQuestion = {
  id: string;
  text: string;
  selected: boolean;
};

export type KurevaLifePreferences = {
  displayName: string;
  nightMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  subtitlesEnabled: boolean;
};

export type KurevaLifeState = {
  routines: Routine[];
  records: RecordEntry[];
  reminders: Reminder[];
  hydration: HydrationGoal;
  consultationQuestions: ConsultationQuestion[];
  preferences: KurevaLifePreferences;
};

export const KUREVALIFE_STORAGE_KEY = "kurevalife-simulator-v3";

export const DEFAULT_QUESTIONS: ConsultationQuestion[] = [
  {
    id: "q-evolucion",
    text: "¿Qué cambios conviene que tenga presentes?",
    selected: false,
  },
  {
    id: "q-registros",
    text: "¿Qué registro sería útil llevar hasta la próxima cita?",
    selected: false,
  },
  {
    id: "q-rutina",
    text: "¿Qué aspecto de mi rutina debo comentar?",
    selected: false,
  },
  {
    id: "q-documentos",
    text: "¿Hay algún documento que convenga traer o revisar?",
    selected: false,
  },
];

export const DEFAULT_KUREVALIFE_STATE: KurevaLifeState = {
  routines: [
    {
      id: "rutina-preparar-dia",
      title: "Preparar mi día",
      detail: "Elige una rutina o registra un paso para empezar.",
      period: "Mañana",
      completed: false,
    },
    {
      id: "rutina-pregunta",
      title: "Anotar una pregunta",
      detail: "Guarda algo que quieras recordar para tu próxima consulta.",
      period: "Tarde",
      completed: false,
    },
  ],
  records: [],
  reminders: [],
  hydration: {
    glasses: 8,
    season: "Verano",
    activity: "Media",
    completed: 0,
    reminderEnabled: false,
  },
  consultationQuestions: DEFAULT_QUESTIONS,
  preferences: {
    displayName: "",
    nightMode: false,
    largeText: false,
    highContrast: false,
    soundEnabled: false,
    subtitlesEnabled: true,
  },
};

function isStoredState(value: unknown): value is Partial<KurevaLifeState> {
  return Boolean(value && typeof value === "object");
}

function cloneDefaultState(): KurevaLifeState {
  return JSON.parse(
    JSON.stringify(DEFAULT_KUREVALIFE_STATE)
  ) as KurevaLifeState;
}

export function loadKurevaLifeState(): KurevaLifeState {
  if (typeof window === "undefined") return cloneDefaultState();
  try {
    const raw = window.localStorage.getItem(KUREVALIFE_STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const stored = JSON.parse(raw) as unknown;
    if (!isStoredState(stored)) return cloneDefaultState();
    return {
      routines: Array.isArray(stored.routines)
        ? stored.routines
        : cloneDefaultState().routines,
      records: Array.isArray(stored.records) ? stored.records : [],
      reminders: Array.isArray(stored.reminders) ? stored.reminders : [],
      hydration: {
        ...cloneDefaultState().hydration,
        ...(stored.hydration ?? {}),
      },
      consultationQuestions: Array.isArray(stored.consultationQuestions)
        ? stored.consultationQuestions
        : cloneDefaultState().consultationQuestions,
      preferences: {
        ...cloneDefaultState().preferences,
        ...(stored.preferences ?? {}),
      },
    };
  } catch {
    return cloneDefaultState();
  }
}

export function createLocalId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function useKurevaLifeState() {
  const [state, setState] = useState<KurevaLifeState>(loadKurevaLifeState);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        KUREVALIFE_STORAGE_KEY,
        JSON.stringify(state)
      );
    } catch {
      // The app remains usable for the current session if storage is unavailable.
    }
  }, [state]);

  return [state, setState] as const;
}

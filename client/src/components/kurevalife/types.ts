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
  /** Keeps an anonymous local-first session open after a reload. */
  hasStarted: boolean;
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
  hasStarted: false,
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

type StoredObject = Record<string, unknown>;

const RECORD_KINDS: RecordKind[] = [
  "tension",
  "colesterol",
  "hba1c",
  "observacion",
  "peso",
  "otro",
];
const ROUTINE_PERIODS: Routine["period"][] = ["Mañana", "Tarde", "Noche"];
const REMINDER_FREQUENCIES: Reminder["frequency"][] = [
  "Cada día",
  "Días laborables",
  "Una vez",
];
const HYDRATION_SEASONS: HydrationGoal["season"][] = [
  "Invierno",
  "Primavera",
  "Verano",
  "Otoño",
];
const HYDRATION_ACTIVITIES: HydrationGoal["activity"][] = [
  "Baja",
  "Media",
  "Alta",
];

function isStoredObject(value: unknown): value is StoredObject {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function cloneDefaultState(): KurevaLifeState {
  return JSON.parse(
    JSON.stringify(DEFAULT_KUREVALIFE_STATE)
  ) as KurevaLifeState;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asEnum<T extends string>(
  value: unknown,
  choices: readonly T[],
  fallback: T
): T {
  return typeof value === "string" && choices.includes(value as T)
    ? (value as T)
    : fallback;
}

function isDateString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

function sanitizeAttachment(value: unknown): AttachmentMeta | null {
  if (!isStoredObject(value)) return null;
  const id = asString(value.id);
  const name = asString(value.name);
  if (!id || !name) return null;
  const size =
    typeof value.size === "number" &&
    Number.isFinite(value.size) &&
    value.size >= 0
      ? value.size
      : 0;
  return {
    id,
    name,
    type: asString(value.type, "archivo"),
    size,
  };
}

function sanitizeRecord(value: unknown): RecordEntry | null {
  if (!isStoredObject(value)) return null;
  const id = asString(value.id);
  if (!id || !isDateString(value.createdAt)) return null;
  const kind = asEnum(value.kind, RECORD_KINDS, "otro");
  const source = asEnum(
    value.source,
    ["manual", "dictado", "archivo"] as const,
    "manual"
  );
  return {
    id,
    kind,
    value: asString(value.value),
    note: asString(value.note),
    createdAt: value.createdAt,
    source,
    attachments: Array.isArray(value.attachments)
      ? value.attachments
          .map(sanitizeAttachment)
          .filter(
            (attachment): attachment is AttachmentMeta => attachment !== null
          )
      : [],
  };
}

function sanitizeReminder(value: unknown): Reminder | null {
  if (!isStoredObject(value)) return null;
  const id = asString(value.id);
  const title = asString(value.title);
  if (!id || !title || !isDateString(value.createdAt)) {
    return null;
  }
  return {
    id,
    title,
    time: asString(value.time, "09:00"),
    frequency: asEnum(value.frequency, REMINDER_FREQUENCIES, "Cada día"),
    visual: true,
    completed: asBoolean(value.completed, false),
    createdAt: value.createdAt,
  };
}

function sanitizeRoutine(value: unknown): Routine | null {
  if (!isStoredObject(value)) return null;
  const id = asString(value.id);
  const title = asString(value.title);
  if (!id || !title) {
    return null;
  }
  return {
    id,
    title,
    detail: asString(value.detail),
    period: asEnum(value.period, ROUTINE_PERIODS, "Mañana"),
    completed: asBoolean(value.completed, false),
  };
}

function sanitizeQuestion(value: unknown): ConsultationQuestion | null {
  if (!isStoredObject(value)) return null;
  const id = asString(value.id);
  const text = asString(value.text);
  if (!id || !text) {
    return null;
  }
  return {
    id,
    text,
    selected: asBoolean(value.selected, false),
  };
}

function sanitizeArray<T>(
  value: unknown,
  sanitize: (item: unknown) => T | null,
  fallback: T[]
): T[] {
  if (!Array.isArray(value)) return fallback;
  return value.map(sanitize).filter((item): item is T => item !== null);
}

function sanitizeHydration(
  value: unknown,
  fallback: HydrationGoal
): HydrationGoal {
  if (!isStoredObject(value)) return fallback;
  const glasses =
    typeof value.glasses === "number" &&
    Number.isInteger(value.glasses) &&
    value.glasses >= 1 &&
    value.glasses <= 20
      ? value.glasses
      : fallback.glasses;
  const completed =
    typeof value.completed === "number" &&
    Number.isInteger(value.completed) &&
    value.completed >= 0
      ? Math.min(value.completed, glasses)
      : fallback.completed;
  return {
    glasses,
    season: asEnum(value.season, HYDRATION_SEASONS, fallback.season),
    activity: asEnum(value.activity, HYDRATION_ACTIVITIES, fallback.activity),
    completed,
    reminderEnabled: asBoolean(value.reminderEnabled, fallback.reminderEnabled),
  };
}

function sanitizePreferences(
  value: unknown,
  fallback: KurevaLifePreferences
): KurevaLifePreferences {
  if (!isStoredObject(value)) return fallback;
  return {
    displayName: asString(value.displayName, fallback.displayName),
    nightMode: asBoolean(value.nightMode, fallback.nightMode),
    largeText: asBoolean(value.largeText, fallback.largeText),
    highContrast: asBoolean(value.highContrast, fallback.highContrast),
    soundEnabled: asBoolean(value.soundEnabled, fallback.soundEnabled),
    subtitlesEnabled: asBoolean(
      value.subtitlesEnabled,
      fallback.subtitlesEnabled
    ),
  };
}

function hasSavedActivity(state: Omit<KurevaLifeState, "hasStarted">) {
  const defaults = DEFAULT_KUREVALIFE_STATE;
  return Boolean(
    state.preferences.displayName ||
      state.records.length ||
      state.reminders.length ||
      state.routines.some(routine => routine.completed) ||
      state.consultationQuestions.some(question => question.selected) ||
      state.hydration.completed ||
      state.hydration.reminderEnabled ||
      state.hydration.glasses !== defaults.hydration.glasses ||
      state.hydration.season !== defaults.hydration.season ||
      state.hydration.activity !== defaults.hydration.activity ||
      state.preferences.nightMode ||
      state.preferences.largeText ||
      state.preferences.highContrast ||
      state.preferences.soundEnabled ||
      state.preferences.subtitlesEnabled !==
        defaults.preferences.subtitlesEnabled
  );
}

/**
 * Restores a safe local-first state without allowing one malformed entry to
 * discard otherwise valid records saved by a tester.
 */
export function hydrateKurevaLifeState(value: unknown): KurevaLifeState {
  const defaults = cloneDefaultState();
  if (!isStoredObject(value)) return defaults;

  const stateWithoutStart = {
    routines: sanitizeArray(value.routines, sanitizeRoutine, defaults.routines),
    records: sanitizeArray(value.records, sanitizeRecord, defaults.records),
    reminders: sanitizeArray(
      value.reminders,
      sanitizeReminder,
      defaults.reminders
    ),
    hydration: sanitizeHydration(value.hydration, defaults.hydration),
    consultationQuestions: sanitizeArray(
      value.consultationQuestions,
      sanitizeQuestion,
      defaults.consultationQuestions
    ),
    preferences: sanitizePreferences(value.preferences, defaults.preferences),
  };

  return {
    ...stateWithoutStart,
    hasStarted:
      typeof value.hasStarted === "boolean"
        ? value.hasStarted
        : hasSavedActivity(stateWithoutStart),
  };
}

export function loadKurevaLifeState(): KurevaLifeState {
  if (typeof window === "undefined") return cloneDefaultState();
  try {
    const raw = window.localStorage.getItem(KUREVALIFE_STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const stored = JSON.parse(raw) as unknown;
    if (!isStoredObject(stored)) {
      window.localStorage.removeItem(KUREVALIFE_STORAGE_KEY);
      return cloneDefaultState();
    }
    return hydrateKurevaLifeState(stored);
  } catch {
    try {
      window.localStorage.removeItem(KUREVALIFE_STORAGE_KEY);
    } catch {
      // Storage is unavailable; the session remains usable with default data.
    }
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

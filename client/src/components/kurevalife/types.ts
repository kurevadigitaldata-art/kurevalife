import { useEffect, useState } from "react";

export type KurevaTab = "hoy" | "registrar" | "informes" | "perfil";

export type Routine = {
  id: string;
  title: string;
  detail: string;
  period: "Mañana" | "Tarde" | "Noche";
  completed: boolean;
};

export type KurevaLifePreferences = {
  displayName: string;
  nightMode: boolean;
  largeText: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
};

export type KurevaLifeState = {
  routines: Routine[];
  preferences: KurevaLifePreferences;
};

export const KUREVALIFE_STORAGE_KEY = "kurevalife-simulator-v2";

export const DEFAULT_KUREVALIFE_STATE: KurevaLifeState = {
  routines: [
    {
      id: "rutina-agua",
      title: "Preparar mi día",
      detail: "Elige una rutina o un registro para empezar.",
      period: "Mañana",
      completed: false,
    },
    {
      id: "rutina-consulta",
      title: "Anotar una pregunta",
      detail: "Guarda algo que quieras recordar para tu próxima consulta.",
      period: "Tarde",
      completed: false,
    },
  ],
  preferences: {
    displayName: "",
    nightMode: false,
    largeText: false,
    highContrast: false,
    soundEnabled: false,
  },
};

function isStoredState(value: unknown): value is KurevaLifeState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<KurevaLifeState>;
  return Array.isArray(candidate.routines) && Boolean(candidate.preferences);
}

export function loadKurevaLifeState(): KurevaLifeState {
  if (typeof window === "undefined") return DEFAULT_KUREVALIFE_STATE;
  try {
    const raw = window.localStorage.getItem(KUREVALIFE_STORAGE_KEY);
    if (!raw) return DEFAULT_KUREVALIFE_STATE;
    const stored = JSON.parse(raw) as unknown;
    if (!isStoredState(stored)) return DEFAULT_KUREVALIFE_STATE;
    return {
      routines: stored.routines,
      preferences: {
        ...DEFAULT_KUREVALIFE_STATE.preferences,
        ...stored.preferences,
      },
    };
  } catch {
    return DEFAULT_KUREVALIFE_STATE;
  }
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
      // The simulator remains usable if browser storage is unavailable.
    }
  }, [state]);

  return [state, setState] as const;
}

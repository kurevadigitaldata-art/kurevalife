import { describe, expect, it } from "vitest";
import { DEFAULT_KUREVALIFE_STATE, hydrateKurevaLifeState } from "./types";

describe("hydrateKurevaLifeState", () => {
  it("keeps valid tester data while dropping only malformed entries", () => {
    const hydrated = hydrateKurevaLifeState({
      hasStarted: true,
      routines: [
        {
          id: "routine-1",
          title: "Preparar el día",
          detail: "Una rutina local",
          period: "Mañana",
          completed: true,
        },
        { id: 42, title: "Entrada dañada" },
      ],
      records: [
        {
          id: "record-1",
          kind: "tension",
          value: "120 / 80 mmHg",
          note: "Dato de prueba",
          createdAt: "2026-09-12T09:00:00.000Z",
          source: "manual",
          attachments: [
            {
              id: "file-1",
              name: "nota.pdf",
              type: "application/pdf",
              size: 24,
            },
            { id: "file-2", size: -1 },
          ],
        },
        { id: "record-2", kind: "tension", createdAt: "fecha inválida" },
      ],
      reminders: [
        {
          id: "reminder-1",
          title: "Preparar una pregunta",
          time: "18:30",
          frequency: "Cada día",
          visual: true,
          completed: false,
          createdAt: "2026-09-12T09:00:00.000Z",
        },
        { id: "reminder-2", title: "Inválido" },
      ],
      hydration: {
        glasses: 8,
        season: "Valor desconocido",
        activity: "Media",
        completed: 30,
        reminderEnabled: true,
      },
      consultationQuestions: [
        { id: "question-1", text: "¿Qué debo recordar?", selected: true },
        { id: "question-2", selected: true },
      ],
      preferences: {
        displayName: "Nathalia",
        nightMode: true,
        largeText: "sí",
        highContrast: false,
        soundEnabled: false,
        subtitlesEnabled: true,
      },
    });

    expect(hydrated.hasStarted).toBe(true);
    expect(hydrated.routines).toHaveLength(1);
    expect(hydrated.records).toHaveLength(1);
    expect(hydrated.records[0]?.attachments).toEqual([
      { id: "file-1", name: "nota.pdf", type: "application/pdf", size: 24 },
    ]);
    expect(hydrated.reminders).toHaveLength(1);
    expect(hydrated.hydration).toMatchObject({
      glasses: 8,
      season: "Verano",
      completed: 8,
      reminderEnabled: true,
    });
    expect(hydrated.consultationQuestions).toHaveLength(1);
    expect(hydrated.preferences).toMatchObject({
      displayName: "Nathalia",
      nightMode: true,
      largeText: false,
    });
  });

  it("restores an anonymous session that explicitly started", () => {
    const hydrated = hydrateKurevaLifeState({
      hasStarted: true,
      preferences: { displayName: "" },
    });

    expect(hydrated.hasStarted).toBe(true);
    expect(hydrated.preferences.displayName).toBe("");
  });

  it("preserves active legacy sessions that predate hasStarted", () => {
    const hydrated = hydrateKurevaLifeState({
      records: [
        {
          id: "record-legacy",
          kind: "otro",
          value: "Nota de prueba",
          note: "",
          createdAt: "2026-09-12T09:00:00.000Z",
          source: "manual",
          attachments: [],
        },
      ],
    });

    expect(hydrated.hasStarted).toBe(true);
    expect(hydrated.records[0]?.value).toBe("Nota de prueba");
  });

  it("falls back to a fresh, independent state for malformed roots", () => {
    const hydrated = hydrateKurevaLifeState(["not", "an", "object"]);

    expect(hydrated).toEqual(DEFAULT_KUREVALIFE_STATE);
    expect(hydrated).not.toBe(DEFAULT_KUREVALIFE_STATE);
    expect(hydrated.routines).not.toBe(DEFAULT_KUREVALIFE_STATE.routines);
  });
});

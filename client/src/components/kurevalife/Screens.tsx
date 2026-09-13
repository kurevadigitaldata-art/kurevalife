import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Apple,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  FolderUp,
  GlassWater,
  ImageUp,
  HeartPulse,
  Mic,
  PencilLine,
  Plus,
  Send,
  Share2,
  Sparkles,
  Thermometer,
  Volume2,
} from "lucide-react";
import type {
  AttachmentMeta,
  HydrationGoal,
  KurevaLifePreferences,
  KurevaLifeState,
  RecordEntry,
  RecordKind,
  Reminder,
  Routine,
} from "./types";
import { createLocalId } from "./types";
import {
  EmptyState,
  KurevaButton,
  KurevaCard,
  LocalStatus,
  ProgressRing,
  RoutineRow,
  SectionHeading,
} from "./ui";

const RECORD_OPTIONS: { value: RecordKind; label: string; hint: string }[] = [
  { value: "tension", label: "Tensión arterial", hint: "Ej. 120 / 80 mmHg" },
  { value: "glucosa", label: "Glucosa", hint: "Ej. 92 mg/dL" },
  {
    value: "ritmo-cardiaco",
    label: "Ritmo cardíaco",
    hint: "Ej. 72 lpm",
  },
  {
    value: "colesterol",
    label: "Colesterol",
    hint: "Escribe el dato que quieres conservar",
  },
  {
    value: "hba1c",
    label: "HbA1c",
    hint: "Escribe el dato que quieres conservar",
  },
  { value: "peso", label: "Peso", hint: "Ej. 64 kg" },
  { value: "temperatura", label: "Temperatura", hint: "Ej. 36,6 °C" },
  { value: "sueno", label: "Sueño", hint: "Ej. 7 horas" },
  { value: "animo", label: "Estado de ánimo", hint: "Ej. Con energía" },
  {
    value: "diagnostico",
    label: "Antecedente de prueba",
    hint: "Ej. Tratamiento crónico",
  },
  {
    value: "alimentacion",
    label: "Alimentación",
    hint: "Ej. Desayuno: fruta y tostada",
  },
  {
    value: "analitica",
    label: "Analítica de prueba",
    hint: "Ej. Analítica mensual",
  },
  {
    value: "observacion",
    label: "Observación",
    hint: "Algo que quieras recordar",
  },
  { value: "otro", label: "Otro dato", hint: "Escribe tu registro" },
];

function todayLabel() {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

const DAILY_CONSTANTS: {
  kind: RecordKind;
  label: string;
  hint: string;
  action: string;
}[] = [
  {
    kind: "tension",
    label: "Presión arterial",
    hint: "Ej. 120/80 mmHg",
    action: "Añadir",
  },
  { kind: "glucosa", label: "Glucosa", hint: "Ej. 92 mg/dL", action: "Añadir" },
  {
    kind: "ritmo-cardiaco",
    label: "Ritmo cardíaco",
    hint: "Ej. 72 lpm",
    action: "Añadir",
  },
  { kind: "peso", label: "Peso", hint: "Ej. 68 kg", action: "Añadir" },
  {
    kind: "temperatura",
    label: "Temperatura",
    hint: "Ej. 36,6 °C",
    action: "Añadir",
  },
  {
    kind: "sueno",
    label: "Sueño",
    hint: "Ej. 7 horas",
    action: "Registrar horas",
  },
  {
    kind: "animo",
    label: "Estado de ánimo",
    hint: "¿Cómo te sientes?",
    action: "Añadir",
  },
];

const HISTORY_OPTIONS = [
  "Diagnóstico clínico",
  "Cirugía previa",
  "Tratamiento crónico",
  "Otros",
];

export function TodayScreen({
  name,
  state,
  onToggleRoutine,
  onOpenRegister,
  onAddRecord,
  onAddReminder,
  onUpdateHydration,
}: {
  name: string;
  state: KurevaLifeState;
  onToggleRoutine: (id: string) => void;
  onOpenRegister: () => void;
  onAddRecord: (record: RecordEntry) => void;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateHydration: (hydration: HydrationGoal) => void;
}) {
  const [activeConstant, setActiveConstant] = useState<RecordKind | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [historyOption, setHistoryOption] = useState("");
  const [meal, setMeal] = useState("");
  const [notice, setNotice] = useState("");
  const completed = state.routines.filter(routine => routine.completed).length;
  const constantKinds = new Set(DAILY_CONSTANTS.map(item => item.kind));
  const capturedConstants = new Set(
    state.records
      .filter(record => constantKinds.has(record.kind))
      .map(record => record.kind)
  ).size;
  const impactSteps = Math.min(
    5,
    capturedConstants +
      Number(state.hydration.completed > 0) +
      Number(state.records.some(record => record.kind === "alimentacion")) +
      Number(state.reminders.length > 0)
  );
  const greeting = name ? `Hola, ${name} 👋` : "Hola 👋";
  const activeDefinition = DAILY_CONSTANTS.find(
    item => item.kind === activeConstant
  );

  const addQuickRecord = (kind: RecordKind, value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue) {
      setNotice("Escribe un dato para añadirlo a esta prueba. No hay prisa.");
      return;
    }
    onAddRecord({
      id: createLocalId("registro"),
      kind,
      value: cleanValue,
      note: "",
      createdAt: new Date().toISOString(),
      source: "manual",
      attachments: [],
    });
    setDraftValue("");
    setActiveConstant(null);
    setNotice("Registro añadido solo durante esta sesión.");
  };

  const addHistory = () => {
    if (!historyOption) {
      setNotice("Elige una opción para añadirla como ejemplo en esta prueba.");
      return;
    }
    addQuickRecord("diagnostico", historyOption);
    setHistoryOption("");
  };

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow={todayLabel()}
        title={greeting}
        description="Registra tus datos de hoy para organizar tu bienestar."
      />

      <KurevaCard className="kl-day-overview" labelledBy="progreso-hoy">
        <div>
          <p className="kl-card-label">RESUMEN DE IMPACTO</p>
          <h2 id="progreso-hoy">Tu bienestar general de hoy</h2>
          <p>
            {impactSteps
              ? `${Math.round((impactSteps / 5) * 100)}% de esta prueba completado.`
              : "Calculando conforme anotas tus datos de ejemplo."}
          </p>
        </div>
        <ProgressRing completed={impactSteps} total={5} />
      </KurevaCard>

      <section aria-labelledby="constantes-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">MIS CONSTANTES VITALES</p>
            <h2 id="constantes-title">Registro de hoy</h2>
          </div>
          <span>
            {capturedConstants} de {DAILY_CONSTANTS.length}
          </span>
        </div>
        <div className="kl-vitals-list">
          {DAILY_CONSTANTS.map(item => {
            const latest = state.records.find(
              record => record.kind === item.kind
            );
            return (
              <div key={item.kind} className="kl-vital-row">
                <span className="kl-vital-row__icon" aria-hidden="true">
                  {item.kind === "tension" || item.kind === "ritmo-cardiaco" ? (
                    <HeartPulse size={18} />
                  ) : item.kind === "temperatura" ? (
                    <Thermometer size={18} />
                  ) : (
                    <Activity size={18} />
                  )}
                </span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{latest?.value || item.hint}</small>
                </div>
                <button
                  type="button"
                  className="kl-vital-row__action"
                  onClick={() => {
                    setActiveConstant(item.kind);
                    setDraftValue(latest?.value || "");
                  }}
                >
                  <Plus size={15} aria-hidden="true" />{" "}
                  {latest ? "Editar" : item.action}
                </button>
              </div>
            );
          })}
        </div>
        {activeDefinition ? (
          <KurevaCard className="kl-quick-entry" labelledBy="dato-rapido-title">
            <h3 id="dato-rapido-title">{activeDefinition.label}</h3>
            <label className="kl-field">
              <span>Dato de prueba</span>
              <input
                value={draftValue}
                onChange={event => setDraftValue(event.target.value)}
                placeholder={activeDefinition.hint}
                autoFocus
              />
            </label>
            <div className="kl-action-row">
              <KurevaButton
                type="button"
                variant="quiet"
                onClick={() => setActiveConstant(null)}
              >
                Cancelar
              </KurevaButton>
              <KurevaButton
                type="button"
                variant="accent"
                onClick={() =>
                  addQuickRecord(activeDefinition.kind, draftValue)
                }
              >
                Guardar en la prueba
              </KurevaButton>
            </div>
          </KurevaCard>
        ) : null}
      </section>

      <section aria-labelledby="antecedentes-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">DIAGNÓSTICOS Y ANTECEDENTES</p>
            <h2 id="antecedentes-title">
              ¿Tienes algún diagnóstico o cirugía previa?
            </h2>
          </div>
        </div>
        <KurevaCard className="kl-history-card">
          <div className="kl-history-options">
            {HISTORY_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                className={historyOption === option ? "is-active" : ""}
                onClick={() => setHistoryOption(option)}
                aria-pressed={historyOption === option}
              >
                {option}
              </button>
            ))}
          </div>
          <KurevaButton type="button" variant="secondary" onClick={addHistory}>
            <Plus size={18} aria-hidden="true" /> Añadir diagnóstico
          </KurevaButton>
          <p className="kl-notice">
            Recuerda que esto es un simulacro interactivo para comprobar cómo
            Kureva estructuraría tu historial médico.
          </p>
        </KurevaCard>
      </section>

      <section aria-labelledby="bienestar-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">NUTRICIÓN Y BIENESTAR DIARIO</p>
            <h2 id="bienestar-title">Agua y alimentación</h2>
          </div>
        </div>
        <KurevaCard className="kl-wellbeing-card">
          <div className="kl-water-quick">
            <span className="kl-mini-icon" aria-hidden="true">
              <GlassWater size={18} />
            </span>
            <div>
              <strong>Vasos de agua</strong>
              <small>
                {state.hydration.completed} / {state.hydration.glasses}
              </small>
            </div>
            <div className="kl-water-quick__controls">
              <button
                type="button"
                aria-label="Quitar vaso"
                onClick={() =>
                  onUpdateHydration({
                    ...state.hydration,
                    completed: Math.max(0, state.hydration.completed - 1),
                  })
                }
              >
                −
              </button>
              <button
                type="button"
                aria-label="Añadir vaso"
                onClick={() =>
                  onUpdateHydration({
                    ...state.hydration,
                    completed: Math.min(
                      state.hydration.glasses,
                      state.hydration.completed + 1
                    ),
                  })
                }
              >
                +
              </button>
            </div>
          </div>
          <label className="kl-field">
            <span>Registro de comidas</span>
            <input
              value={meal}
              onChange={event => setMeal(event.target.value)}
              placeholder="Desde tu desayuno hasta la cena"
            />
          </label>
          <KurevaButton
            type="button"
            variant="secondary"
            onClick={() => addQuickRecord("alimentacion", meal)}
          >
            <Apple size={18} aria-hidden="true" /> Registrar alimento
          </KurevaButton>
          <p className="kl-notice">
            Este registro solo se incluye en tu PDF local si decides anotarlo.
            Kureva no interpreta tu alimentación.
          </p>
        </KurevaCard>
      </section>

      <section aria-labelledby="agenda-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">PLANIFICACIÓN Y AGENDA MÉDICA</p>
            <h2 id="agenda-title">Organiza recordatorios</h2>
          </div>
        </div>
        <KurevaCard className="kl-agenda-card">
          <div>
            <strong>Alertas de medicación</strong>
            <p>Activa una toma visual de prueba por hora y día.</p>
          </div>
          <KurevaButton
            type="button"
            variant="accent"
            onClick={() => {
              onAddReminder({
                id: createLocalId("aviso"),
                title: "Toma de medicación de prueba",
                time: "09:00",
                frequency: "Cada día",
                visual: true,
                completed: false,
                createdAt: new Date().toISOString(),
              });
              setNotice(
                "Alerta visual de prueba añadida. No envía notificaciones reales."
              );
            }}
          >
            <Bell size={18} aria-hidden="true" /> Activar tomas del día
          </KurevaButton>
          <div className="kl-appointment-preview">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              <strong>Próxima cita médica</strong>
              <small>Especialidad · Fecha · Hora · Lugar</small>
            </span>
          </div>
        </KurevaCard>
      </section>

      <section aria-labelledby="rutinas-de-hoy">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">HÁBITOS</p>
            <h2 id="rutinas-de-hoy">Pequeños pasos</h2>
          </div>
          <span>
            {completed} de {state.routines.length}
          </span>
        </div>
        <div className="kl-routine-list">
          {state.routines.map(routine => (
            <RoutineRow
              key={routine.id}
              title={routine.title}
              detail={routine.detail}
              completed={routine.completed}
              onToggle={() => onToggleRoutine(routine.id)}
            />
          ))}
        </div>
      </section>

      {notice ? (
        <p className="kl-inline-status" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}
      <KurevaButton
        type="button"
        variant="primary"
        className="kl-full-action"
        onClick={onOpenRegister}
      >
        <Plus size={19} aria-hidden="true" /> Abrir registro detallado
      </KurevaButton>
    </div>
  );
}

type RegisterScreenProps = {
  records: RecordEntry[];
  reminders: Reminder[];
  hydration: HydrationGoal;
  onAddRecord: (record: RecordEntry) => void;
  onAddReminder: (reminder: Reminder) => void;
  onUpdateHydration: (hydration: HydrationGoal) => void;
};

export function RegisterScreen({
  records,
  reminders,
  hydration,
  onAddRecord,
  onAddReminder,
  onUpdateHydration,
}: RegisterScreenProps) {
  const [section, setSection] = useState<"datos" | "notas" | "avisos" | "agua">(
    "datos"
  );
  const [kind, setKind] = useState<RecordKind>("tension");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const [usedDictation, setUsedDictation] = useState(false);
  const [recordMessage, setRecordMessage] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderFrequency, setReminderFrequency] =
    useState<Reminder["frequency"]>("Cada día");
  const [reminderMessage, setReminderMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedOption =
    RECORD_OPTIONS.find(option => option.value === kind) ?? RECORD_OPTIONS[0];

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).map(file => ({
      id: createLocalId("archivo"),
      name: file.name,
      type: file.type || "archivo",
      size: file.size,
    }));
    setAttachments(current => [...current, ...selected]);
  };

  const useDictation = () => {
    const recognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionConstructor) {
      setRecordMessage(
        "No se pudo usar el micrófono. Puedes escribir o adjuntar una foto o archivo."
      );
      return;
    }
    const recognition = new recognitionConstructor();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setNote(current =>
        [current, transcript].filter(Boolean).join(current ? " " : "")
      );
      setUsedDictation(true);
      setRecordMessage("Dictado añadido al texto del registro.");
    };
    recognition.onerror = () =>
      setRecordMessage(
        "No se pudo usar el micrófono. Puedes escribir o adjuntar una foto o archivo."
      );
    recognition.start();
    setRecordMessage("Escuchando… Cuando termines, el texto aparecerá aquí.");
  };

  const saveRecord = () => {
    if (!value.trim() && !note.trim() && attachments.length === 0) {
      setRecordMessage(
        "Escribe un dato, una nota o adjunta una foto, captura, PDF o archivo."
      );
      return;
    }
    if (kind === "tension" && value.trim()) {
      const numbers = value.match(/\d{2,3}/g)?.map(Number) ?? [];
      const validPressure =
        /^\s*\d{2,3}\s*\/\s*\d{2,3}\s*(mmhg)?\s*$/i.test(value) &&
        numbers.length === 2 &&
        numbers[0] >= 50 &&
        numbers[0] <= 250 &&
        numbers[1] >= 30 &&
        numbers[1] <= 160;
      if (!validPressure) {
        setRecordMessage(
          "¡Uy! Se nos escapó un número por ahí. Revisa bien el dato que ingresaste para que tu historial quede perfecto. No hay prisa, tómate tu tiempo."
        );
        return;
      }
    }
    onAddRecord({
      id: createLocalId("registro"),
      kind,
      value: value.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
      source: attachments.length
        ? "archivo"
        : usedDictation
          ? "dictado"
          : "manual",
      attachments,
    });
    setValue("");
    setNote("");
    setAttachments([]);
    setUsedDictation(false);
    setRecordMessage(
      "Registro añadido a esta prueba. Lo verás en Informes mientras la sesión siga abierta."
    );
  };

  const saveReminder = () => {
    if (!reminderTitle.trim()) {
      setReminderMessage(
        "Escribe qué quieres recordar para crear el aviso visual."
      );
      return;
    }
    onAddReminder({
      id: createLocalId("aviso"),
      title: reminderTitle.trim(),
      time: reminderTime,
      frequency: reminderFrequency,
      visual: true,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setReminderTitle("");
    setReminderMessage(
      "Aviso visual creado. Aparece en esta app durante tu prueba."
    );
  };

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow="REGISTRAR"
        title="Guarda lo que quieres tener presente."
        description="Escribe, dicta o adjunta una foto, una captura, un PDF o un archivo."
      />

      <div
        className="kl-segmented"
        role="tablist"
        aria-label="Secciones para registrar"
      >
        {[
          ["datos", "Datos"],
          ["notas", "Notas y archivos"],
          ["avisos", "Avisos"],
          ["agua", "Agua"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className={section === id ? "is-active" : ""}
            onClick={() => setSection(id as typeof section)}
          >
            {label}
          </button>
        ))}
      </div>

      {section === "datos" || section === "notas" ? (
        <KurevaCard className="kl-form-card" labelledBy="registro-titulo">
          <div className="kl-card-heading">
            <div className="kl-mini-icon" aria-hidden="true">
              <PencilLine size={18} />
            </div>
            <div>
              <h2 id="registro-titulo">
                {section === "datos" ? "Nuevo registro" : "Nota y archivos"}
              </h2>
              <p>Solo estará disponible mientras esta prueba esté abierta.</p>
            </div>
          </div>

          <div className="kl-form-grid">
            <label className="kl-field" htmlFor="record-kind">
              <span>Tipo de registro</span>
              <select
                id="record-kind"
                value={kind}
                onChange={event => setKind(event.target.value as RecordKind)}
              >
                {RECORD_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="kl-field" htmlFor="record-value">
              <span>Dato principal</span>
              <input
                id="record-value"
                value={value}
                onChange={event => setValue(event.target.value)}
                placeholder={selectedOption.hint}
                maxLength={120}
              />
            </label>
          </div>

          <label className="kl-field" htmlFor="record-note">
            <span>Nota</span>
            <textarea
              id="record-note"
              rows={4}
              value={note}
              onChange={event => setNote(event.target.value)}
              placeholder="Escribe lo que quieres recordar. KurevaLife no interpreta este contenido."
              maxLength={1000}
            />
          </label>

          <div className="kl-attachment-box">
            <div>
              <strong>Foto, captura, PDF o archivo</strong>
              <p>
                La prueba solo muestra el nombre del archivo durante esta
                sesión. No lo sube ni lo conserva en ningún servidor.
              </p>
            </div>
            <input
              ref={fileRef}
              id="record-file"
              type="file"
              className="kl-visually-hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
              multiple
              onChange={event => addFiles(event.target.files)}
            />
            <div className="kl-action-row">
              <KurevaButton
                type="button"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
              >
                <FolderUp size={18} aria-hidden="true" /> Adjuntar
              </KurevaButton>
              <KurevaButton
                type="button"
                variant="quiet"
                onClick={useDictation}
              >
                <Mic size={18} aria-hidden="true" /> Dictar
              </KurevaButton>
            </div>
          </div>

          {attachments.length ? (
            <ul className="kl-file-list" aria-label="Archivos seleccionados">
              {attachments.map(file => (
                <li key={file.id}>
                  <ImageUp size={16} aria-hidden="true" />
                  <span>{file.name}</span>
                  <button
                    type="button"
                    aria-label={`Quitar ${file.name}`}
                    onClick={() =>
                      setAttachments(current =>
                        current.filter(item => item.id !== file.id)
                      )
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {recordMessage ? (
            <p className="kl-inline-status" role="status" aria-live="polite">
              {recordMessage}
            </p>
          ) : null}
          <KurevaButton
            type="button"
            variant="primary"
            className="kl-full-action"
            onClick={saveRecord}
          >
            <Check size={18} aria-hidden="true" /> Añadir registro a la prueba
          </KurevaButton>
        </KurevaCard>
      ) : null}

      {section === "avisos" ? (
        <KurevaCard className="kl-form-card" labelledBy="aviso-titulo">
          <div className="kl-card-heading">
            <div className="kl-mini-icon" aria-hidden="true">
              <Bell size={18} />
            </div>
            <div>
              <h2 id="aviso-titulo">Aviso visual</h2>
              <p>Una señal clara dentro de la app de prueba.</p>
            </div>
          </div>
          <label className="kl-field" htmlFor="reminder-title">
            <span>¿Qué quieres que te recuerde?</span>
            <input
              id="reminder-title"
              value={reminderTitle}
              onChange={event => setReminderTitle(event.target.value)}
              placeholder="Ej. Preparar mi consulta"
              maxLength={120}
            />
          </label>
          <div className="kl-form-grid">
            <label className="kl-field" htmlFor="reminder-time">
              <span>Hora</span>
              <input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={event => setReminderTime(event.target.value)}
              />
            </label>
            <label className="kl-field" htmlFor="reminder-frequency">
              <span>Frecuencia</span>
              <select
                id="reminder-frequency"
                value={reminderFrequency}
                onChange={event =>
                  setReminderFrequency(
                    event.target.value as Reminder["frequency"]
                  )
                }
              >
                <option>Cada día</option>
                <option>Días laborables</option>
                <option>Una vez</option>
              </select>
            </label>
          </div>
          <p className="kl-notice">
            Este navegador puede no admitir notificaciones. Los avisos visuales
            de la app siguen disponibles.
          </p>
          {reminderMessage ? (
            <p className="kl-inline-status" role="status" aria-live="polite">
              {reminderMessage}
            </p>
          ) : null}
          <KurevaButton
            type="button"
            variant="accent"
            className="kl-full-action"
            onClick={saveReminder}
          >
            <Bell size={18} aria-hidden="true" /> Crear aviso visual
          </KurevaButton>
          {reminders.length ? (
            <div className="kl-created-list">
              {reminders.map(reminder => (
                <div key={reminder.id}>
                  <span>
                    <Bell size={16} aria-hidden="true" /> {reminder.title}
                  </span>
                  <small>
                    {reminder.time} · {reminder.frequency}
                  </small>
                </div>
              ))}
            </div>
          ) : null}
        </KurevaCard>
      ) : null}

      {section === "agua" ? (
        <HydrationPanel hydration={hydration} onUpdate={onUpdateHydration} />
      ) : null}

      <KurevaCard className="kl-local-card" labelledBy="registro-local-status">
        <LocalStatus state="Solo esta sesión" />
        <div>
          <h2 id="registro-local-status">Disponible durante esta sesión</h2>
          <p>
            Podrás revisar estos datos y preparar un resumen desde Informes.
          </p>
        </div>
      </KurevaCard>

      {records.length ? (
        <p className="kl-muted-summary">
          <ClipboardList size={16} aria-hidden="true" /> {records.length}{" "}
          {records.length === 1 ? "registro de prueba" : "registros de prueba"}{" "}
          disponibles durante esta sesión.
        </p>
      ) : null}
    </div>
  );
}

export function HydrationPanel({
  hydration,
  onUpdate,
}: {
  hydration: HydrationGoal;
  onUpdate: (hydration: HydrationGoal) => void;
}) {
  const [notice, setNotice] = useState("");
  const update = (patch: Partial<HydrationGoal>) =>
    onUpdate({ ...hydration, ...patch });
  return (
    <KurevaCard className="kl-form-card" labelledBy="agua-titulo">
      <div className="kl-card-heading">
        <div className="kl-mini-icon" aria-hidden="true">
          <GlassWater size={18} />
        </div>
        <div>
          <h2 id="agua-titulo">Mi objetivo de agua</h2>
          <p>
            Es un objetivo personal: KurevaLife no calcula necesidades médicas
            de hidratación.
          </p>
        </div>
      </div>
      <div className="kl-form-grid">
        <label className="kl-field" htmlFor="water-glasses">
          <span>Mi objetivo</span>
          <select
            id="water-glasses"
            value={hydration.glasses}
            onChange={event => update({ glasses: Number(event.target.value) })}
          >
            {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(glasses => (
              <option key={glasses} value={glasses}>
                {glasses} vasos
              </option>
            ))}
          </select>
        </label>
        <label className="kl-field" htmlFor="water-season">
          <span>Estación del año</span>
          <select
            id="water-season"
            value={hydration.season}
            onChange={event =>
              update({ season: event.target.value as HydrationGoal["season"] })
            }
          >
            {["Invierno", "Primavera", "Verano", "Otoño"].map(season => (
              <option key={season}>{season}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="kl-field" htmlFor="water-activity">
        <span>Nivel de actividad</span>
        <select
          id="water-activity"
          value={hydration.activity}
          onChange={event =>
            update({
              activity: event.target.value as HydrationGoal["activity"],
            })
          }
        >
          {["Baja", "Media", "Alta"].map(activity => (
            <option key={activity}>{activity}</option>
          ))}
        </select>
      </label>
      <div
        className="kl-water-progress"
        aria-label={`${hydration.completed} de ${hydration.glasses} vasos registrados`}
      >
        <div>
          <span
            style={{
              width: `${Math.min(100, (hydration.completed / hydration.glasses) * 100)}%`,
            }}
          />
        </div>
        <strong>
          {hydration.completed} de {hydration.glasses} vasos
        </strong>
      </div>
      <div className="kl-action-row">
        <KurevaButton
          type="button"
          variant="secondary"
          onClick={() =>
            update({ completed: Math.max(0, hydration.completed - 1) })
          }
          disabled={hydration.completed === 0}
        >
          Quitar vaso
        </KurevaButton>
        <KurevaButton
          type="button"
          variant="accent"
          onClick={() =>
            update({
              completed: Math.min(hydration.glasses, hydration.completed + 1),
            })
          }
        >
          <Plus size={18} aria-hidden="true" /> Añadir vaso
        </KurevaButton>
      </div>
      <KurevaButton
        type="button"
        variant="primary"
        className="kl-full-action"
        onClick={() => {
          update({ reminderEnabled: !hydration.reminderEnabled });
          setNotice(
            hydration.reminderEnabled
              ? "El recordatorio visual de agua se ha desactivado."
              : "Recordatorio visual de agua activado dentro de la app."
          );
        }}
      >
        <Bell size={18} aria-hidden="true" />{" "}
        {hydration.reminderEnabled
          ? "Quitar recordatorio visual"
          : "Recordarme beber agua"}
      </KurevaButton>
      {notice ? (
        <p className="kl-inline-status" role="status">
          {notice}
        </p>
      ) : null}
    </KurevaCard>
  );
}

export function ReportsScreen({
  state,
  onOpenRegister,
  onAddRecord,
}: {
  state: KurevaLifeState;
  onOpenRegister: () => void;
  onAddRecord: (record: RecordEntry) => void;
}) {
  const [status, setStatus] = useState("");
  const [analysisMode, setAnalysisMode] = useState<
    "imagen" | "analisis" | "revision"
  >("imagen");
  const analysisFileRef = useRef<HTMLInputElement>(null);
  const analysisCount = state.records.filter(
    record => record.kind === "analitica"
  ).length;
  const recordGroups = useMemo(() => {
    return RECORD_OPTIONS.map(option => ({
      ...option,
      items: state.records.filter(record => record.kind === option.value),
    })).filter(group => group.items.length);
  }, [state.records]);

  const makeSummary = () =>
    [
      "KUREVALIFE · RESUMEN LOCAL",
      "Tu día en orden. Tu consulta más clara.",
      "",
      "Este resumen organiza información anotada por la persona usuaria. KurevaLife no diagnostica, no prescribe ni sustituye a un profesional sanitario.",
      "",
      `Rutinas completadas: ${state.routines.filter(routine => routine.completed).length} de ${state.routines.length}`,
      `Objetivo de agua: ${state.hydration.completed} de ${state.hydration.glasses} vasos`,
      `Avisos visuales: ${state.reminders.length}`,
      "",
      "REGISTROS",
      ...state.records.flatMap(record => [
        `${RECORD_OPTIONS.find(option => option.value === record.kind)?.label ?? "Registro"} · ${new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(new Date(record.createdAt))}`,
        [record.value, record.note].filter(Boolean).join(" · ") ||
          "Archivo adjunto localmente",
        record.attachments.length
          ? `Archivos: ${record.attachments.map(file => file.name).join(", ")}`
          : "",
        "",
      ]),
      "PREGUNTAS PARA LA CONSULTA",
      ...state.consultationQuestions
        .filter(question => question.selected)
        .map(question => `• ${question.text}`),
    ].filter(line => line !== undefined);

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const lines = makeSummary();
      let y = 62;
      pdf.setFillColor(15, 58, 45);
      pdf.rect(0, 0, 595, 38, "F");
      pdf.setTextColor(15, 58, 45);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(21);
      pdf.text("KurevaLife", 40, y);
      pdf.setTextColor(94, 128, 110);
      pdf.setFontSize(9);
      pdf.text("BY KUREVA · RESUMEN LOCAL", 40, y + 16);
      y += 48;
      for (const rawLine of lines) {
        const wrapped = pdf.splitTextToSize(rawLine || " ", 515) as string[];
        if (y + wrapped.length * 14 > 790) {
          pdf.addPage();
          y = 52;
        }
        if (/^(REGISTROS|PREGUNTAS PARA LA CONSULTA)$/.test(rawLine)) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(15, 58, 45);
          pdf.setFontSize(11);
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(23, 58, 46);
          pdf.setFontSize(10);
        }
        pdf.text(wrapped, 40, y);
        y += Math.max(14, wrapped.length * 14);
      }
      pdf.setTextColor(94, 128, 110);
      pdf.setFontSize(8);
      pdf.text(
        "Este archivo se ha creado localmente desde el simulacro de prueba.",
        40,
        812
      );
      pdf.save(
        `KurevaLife_resumen_local_${new Date().toISOString().slice(0, 10)}.pdf`
      );
      setStatus("PDF preparado y descargado localmente.");
    } catch {
      setStatus(
        "No se ha podido preparar el PDF ahora. Tus registros locales siguen disponibles."
      );
    }
  };

  const shareSummary = async () => {
    const summary = makeSummary().join("\n");
    try {
      const nativeShare = (
        navigator as Navigator & {
          share?: (payload: ShareData) => Promise<void>;
        }
      ).share;
      if (typeof nativeShare === "function")
        await nativeShare({
          title: "KurevaLife · resumen local",
          text: summary,
        });
      else await navigator.clipboard.writeText(summary);
      setStatus(
        typeof nativeShare === "function"
          ? "Resumen listo para compartir."
          : "Resumen copiado para compartir."
      );
    } catch {
      setStatus(
        "No se ha compartido el resumen. Puedes descargar el PDF cuando quieras."
      );
    }
  };

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow="INFORMES"
        title="Analíticas e informes"
        description="Una vista de prueba para organizar documentos y preparar conversaciones."
      />
      <section aria-labelledby="analiticas-title">
        <div
          className="kl-segmented"
          role="tablist"
          aria-label="Analíticas e informes"
        >
          {[
            ["imagen", "Imagen"],
            ["analisis", "Análisis"],
            ["revision", "Revisión"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={analysisMode === id}
              className={analysisMode === id ? "is-active" : ""}
              onClick={() => setAnalysisMode(id as typeof analysisMode)}
            >
              {label}
            </button>
          ))}
        </div>
        <KurevaCard className="kl-analysis-card" labelledBy="analiticas-title">
          {analysisMode === "imagen" ? (
            <>
              <div className="kl-card-heading">
                <div className="kl-mini-icon" aria-hidden="true">
                  <ImageUp size={18} />
                </div>
                <div>
                  <h2 id="analiticas-title">Subir foto o analítica</h2>
                  <p>
                    Selecciona una imagen o archivo solo para simular el
                    recorrido.
                  </p>
                </div>
              </div>
              <input
                ref={analysisFileRef}
                type="file"
                className="kl-visually-hidden"
                accept="image/*,.pdf"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  onAddRecord({
                    id: createLocalId("analitica"),
                    kind: "analitica",
                    value: file.name,
                    note: "Analítica adjunta solo en esta sesión; no se procesa ni se sube.",
                    createdAt: new Date().toISOString(),
                    source: "archivo",
                    attachments: [
                      {
                        id: createLocalId("archivo"),
                        name: file.name,
                        type: file.type || "archivo",
                        size: file.size,
                      },
                    ],
                  });
                  setStatus(
                    "Archivo añadido a la demostración local. No se ha analizado ni enviado."
                  );
                  event.currentTarget.value = "";
                }}
              />
              <KurevaButton
                type="button"
                variant="primary"
                className="kl-full-action"
                onClick={() => analysisFileRef.current?.click()}
              >
                <ImageUp size={18} aria-hidden="true" /> Seleccionar imagen /
                subir analítica
              </KurevaButton>
            </>
          ) : null}
          {analysisMode === "analisis" ? (
            <>
              <div className="kl-card-heading">
                <div className="kl-mini-icon" aria-hidden="true">
                  <Activity size={18} />
                </div>
                <div>
                  <h2 id="analiticas-title">
                    ¿Qué haría Kivi con tus analíticas?
                  </h2>
                  <p>
                    La versión online podrá organizar valores que decidas
                    aportar, como glucosa, colesterol y triglicéridos.
                  </p>
                </div>
              </div>
              <ul className="kl-analysis-list">
                <li>Valores que la persona usuaria decida registrar.</li>
                <li>
                  Rangos de referencia presentados con fuentes y contexto.
                </li>
                <li>
                  Comparación visual solo cuando haya suficientes registros.
                </li>
              </ul>
              <p className="kl-notice">
                Este simulacro no lee imágenes, no extrae resultados ni
                interpreta analíticas reales.
              </p>
            </>
          ) : null}
          {analysisMode === "revision" ? (
            <>
              <div className="kl-card-heading">
                <div className="kl-mini-icon" aria-hidden="true">
                  <ClipboardList size={18} />
                </div>
                <div>
                  <h2 id="analiticas-title">Análisis evolutivo de prueba</h2>
                  <p>
                    {analysisCount > 2
                      ? "La demostración tiene tres o más documentos locales; la versión conectada podría mostrar una comparación visual."
                      : "Añade más de dos documentos de prueba para ver cómo se habilitaría una comparación visual en la versión conectada."}
                  </p>
                </div>
              </div>
              <div
                className="kl-analysis-progress"
                aria-label={`${analysisCount} de 3 analíticas de prueba`}
              >
                <span
                  style={{
                    width: `${Math.min(100, (analysisCount / 3) * 100)}%`,
                  }}
                />
                <strong>{analysisCount} de 3 documentos de prueba</strong>
              </div>
            </>
          ) : null}
        </KurevaCard>
      </section>
      <KurevaCard className="kl-report-summary" labelledBy="resumen-local">
        <div>
          <p className="kl-card-label">RESUMEN</p>
          <h2 id="resumen-local">Todo lo que has decidido guardar.</h2>
          <p>Sin interpretaciones clínicas: solo organización personal.</p>
        </div>
        <div className="kl-report-stats">
          <span>
            <strong>{state.records.length}</strong> registros
          </span>
          <span>
            <strong>{state.reminders.length}</strong> avisos
          </span>
          <span>
            <strong>
              {state.hydration.completed}/{state.hydration.glasses}
            </strong>{" "}
            agua
          </span>
        </div>
      </KurevaCard>
      <section aria-labelledby="tendencias-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">TENDENCIAS</p>
            <h2 id="tendencias-title">Vista simple</h2>
          </div>
        </div>
        <KurevaCard className="kl-trend-card">
          <div>
            <span>Tensión arterial</span>
            <strong>
              {state.records.filter(record => record.kind === "tension").length
                ? "Registros disponibles"
                : "Aún sin datos"}
            </strong>
          </div>
          <div>
            <span>Colesterol</span>
            <strong>
              {state.records.filter(record => record.kind === "colesterol")
                .length
                ? "Registros disponibles"
                : "Aún sin datos"}
            </strong>
          </div>
          <div>
            <span>HbA1c</span>
            <strong>
              {state.records.filter(record => record.kind === "hba1c").length
                ? "Registros disponibles"
                : "Aún sin datos"}
            </strong>
          </div>
        </KurevaCard>
      </section>
      <section aria-labelledby="registros-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">REGISTROS</p>
            <h2 id="registros-title">Lo que has guardado</h2>
          </div>
          <LocalStatus />
        </div>
        {recordGroups.length ? (
          <div className="kl-record-groups">
            {recordGroups.map(group => (
              <KurevaCard key={group.value} className="kl-record-group">
                <h3>{group.label}</h3>
                {group.items.map(record => (
                  <div key={record.id} className="kl-record-row">
                    <div>
                      <strong>{record.value || "Archivo / nota"}</strong>
                      <p>{record.note || "Sin nota adicional"}</p>
                      {record.attachments.length ? (
                        <small>
                          {record.attachments.length} archivo(s) local(es)
                        </small>
                      ) : null}
                    </div>
                    <time dateTime={record.createdAt}>
                      {new Intl.DateTimeFormat("es-ES", {
                        day: "numeric",
                        month: "short",
                      }).format(new Date(record.createdAt))}
                    </time>
                  </div>
                ))}
              </KurevaCard>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aún no tienes registros."
            text="Registra un dato, una nota o un archivo para verlo organizado aquí."
            action={
              <KurevaButton
                type="button"
                variant="secondary"
                onClick={onOpenRegister}
              >
                Ir a Registrar
              </KurevaButton>
            }
          />
        )}
      </section>
      <section aria-labelledby="consulta-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">CONSULTA</p>
            <h2 id="consulta-title">Preguntas seleccionadas</h2>
          </div>
        </div>
        <KurevaCard className="kl-question-summary">
          {state.consultationQuestions.some(question => question.selected) ? (
            <ul>
              {state.consultationQuestions
                .filter(question => question.selected)
                .map(question => (
                  <li key={question.id}>{question.text}</li>
                ))}
            </ul>
          ) : (
            <p>
              Aún no has marcado preguntas. Puedes hacerlo desde Perfil antes de
              generar el resumen.
            </p>
          )}
        </KurevaCard>
      </section>
      {status ? (
        <p className="kl-inline-status" role="status" aria-live="polite">
          {status}
        </p>
      ) : null}
      <div className="kl-two-actions">
        <KurevaButton type="button" variant="primary" onClick={downloadPdf}>
          <Download size={18} aria-hidden="true" /> Descargar PDF
        </KurevaButton>
        <KurevaButton type="button" variant="secondary" onClick={shareSummary}>
          <Share2 size={18} aria-hidden="true" /> Compartir resumen
        </KurevaButton>
      </div>
    </div>
  );
}

export function ProfileScreen({
  preferences,
  questions,
  onUpdatePreferences,
  onToggleQuestion,
  onOpenFeedback,
}: {
  preferences: KurevaLifePreferences;
  questions: KurevaLifeState["consultationQuestions"];
  onUpdatePreferences: (patch: Partial<KurevaLifePreferences>) => void;
  onToggleQuestion: (id: string) => void;
  onOpenFeedback: () => void;
}) {
  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow="PERFIL"
        title="Tu app, a tu manera."
        description="Los cambios se aplican ahora mismo durante esta prueba."
      />
      <KurevaCard className="kl-profile-card" labelledBy="cuenta-titulo">
        <div className="kl-card-heading">
          <div className="kl-mini-icon" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 id="cuenta-titulo">Tu cuenta de prueba</h2>
            <p>
              {preferences.displayName
                ? `Estás explorando como ${preferences.displayName}.`
                : "Estás explorando sin cuenta."}
            </p>
          </div>
        </div>
        <LocalStatus />
      </KurevaCard>
      <section aria-labelledby="apariencia-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">APARIENCIA</p>
            <h2 id="apariencia-title">Visualización</h2>
          </div>
        </div>
        <KurevaCard className="kl-settings-card">
          <SettingSwitch
            label="Modo nocturno"
            detail="Misma estructura, con tonos bosque profundos."
            checked={preferences.nightMode}
            onChange={checked => onUpdatePreferences({ nightMode: checked })}
          />
          <fieldset className="kl-text-scale">
            <legend>Tamaño de texto</legend>
            <p>La interfaz se reorganiza para mantener el texto visible.</p>
            <div>
              {(["normal", "grande", "muy-grande"] as const).map(scale => (
                <button
                  key={scale}
                  type="button"
                  className={preferences.textScale === scale ? "is-active" : ""}
                  onClick={() => onUpdatePreferences({ textScale: scale })}
                  aria-pressed={preferences.textScale === scale}
                >
                  {scale === "muy-grande"
                    ? "Muy grande"
                    : scale[0].toUpperCase() + scale.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>
          <SettingSwitch
            label="Alto contraste"
            detail="Refuerza bordes y legibilidad de los controles."
            checked={preferences.highContrast}
            onChange={checked => onUpdatePreferences({ highContrast: checked })}
          />
        </KurevaCard>
      </section>
      <section aria-labelledby="access-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">ACCESIBILIDAD</p>
            <h2 id="access-title">Controles disponibles</h2>
          </div>
        </div>
        <KurevaCard className="kl-settings-card">
          <SettingSwitch
            label="Subtítulos y mensajes visuales"
            detail="Las confirmaciones siempre aparecen también por escrito."
            checked={preferences.subtitlesEnabled}
            onChange={checked =>
              onUpdatePreferences({ subtitlesEnabled: checked })
            }
          />
          <SettingSwitch
            label="Sonidos de confirmación"
            detail="Opcional; ninguna acción importante depende del sonido."
            checked={preferences.soundEnabled}
            onChange={checked => onUpdatePreferences({ soundEnabled: checked })}
          />
          <SettingSwitch
            label="Apoyo para lector de pantalla"
            detail="Anuncia los cambios de pantalla y las respuestas de Kivi de forma breve."
            checked={preferences.screenReaderSupport}
            onChange={checked =>
              onUpdatePreferences({ screenReaderSupport: checked })
            }
          />
          <div className="kl-access-list">
            <span>Compatibilidad con lector de pantalla</span>
            <span>Navegación por teclado</span>
            <span>Objetivos táctiles grandes</span>
            <span>Dictado con alternativa escrita</span>
          </div>
        </KurevaCard>
      </section>
      <section aria-labelledby="preguntas-title">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">PREPARAR CONSULTA</p>
            <h2 id="preguntas-title">Preguntas habituales</h2>
          </div>
        </div>
        <KurevaCard className="kl-question-picker">
          <p>
            Selecciona con un toque las preguntas que quieres incluir antes de
            generar el PDF.
          </p>
          {questions.map(question => (
            <label key={question.id} className="kl-check-row">
              <input
                type="checkbox"
                checked={question.selected}
                onChange={() => onToggleQuestion(question.id)}
              />
              <span>{question.text}</span>
            </label>
          ))}
        </KurevaCard>
      </section>
      <KurevaCard
        className="kl-feedback-entry"
        labelledBy="feedback-entry-title"
      >
        <div>
          <p className="kl-card-label">PRUEBA</p>
          <h2 id="feedback-entry-title">Comparte tu experiencia</h2>
          <p>
            Tu valoración ayuda a decidir qué mantener, mejorar o simplificar
            antes de la siguiente fase.
          </p>
        </div>
        <KurevaButton type="button" variant="accent" onClick={onOpenFeedback}>
          Dejar valoración
        </KurevaButton>
      </KurevaCard>
    </div>
  );
}

function SettingSwitch({
  label,
  detail,
  checked,
  onChange,
}: {
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="kl-setting-row">
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        role="switch"
        aria-label={label}
      />
    </label>
  );
}

export function KiviPanel({
  onClose,
  state,
  subtitlesEnabled,
  onAnnounce,
}: {
  onClose: () => void;
  state: KurevaLifeState;
  subtitlesEnabled: boolean;
  onAnnounce: (message: string) => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(
    "Hola, soy Kivi. Puedo ayudarte a organizar tus datos, entender cómo funciona este simulacro y explicar términos médicos de forma general. Recuerda: no puedo diagnosticarte."
  );
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      panelRef.current.focus({ preventScroll: true });
    }
  }, []);
  const respond = (prompt: string) => {
    setMessage(prompt);
    const normalized = prompt.toLowerCase();
    const nextReply =
      normalized.includes("alimentación") || normalized.includes("como")
        ? "Este registro te permite construir una bitácora limpia de tu alimentación mensual. Su fin es que puedas incluir lo que decidas anotar en tu informe PDF local y comentarlo con tu especialista en la próxima cita. Kureva no evalúa ni interpreta tu dieta."
        : normalized.includes("analítica") || normalized.includes("foto")
          ? "En la versión online, el sistema podrá ayudarte a organizar valores que decidas aportar, como glucosa, colesterol o triglicéridos, junto con sus rangos de referencia. Este simulacro no lee imágenes ni analiza resultados reales."
          : normalized.includes("medicación") || normalized.includes("hora")
            ? "Las alertas visuales de prueba te ayudan a organizar una pauta que ya te haya indicado un profesional. En la app online, cualquier recordatorio por hora y día requerirá tu permiso explícito. Kureva no cambia tratamientos ni confirma adherencia clínica."
            : normalized.includes("médico") ||
                normalized.includes("diagnosticar")
              ? "Kureva es una herramienta de organización y registro personal, no de diagnóstico. Su objetivo es ayudarte a preparar información para que la revises con tu especialista; no sustituye una consulta ni interpreta tus datos clínicamente."
              : normalized.includes("comunidad")
                ? "La Comunidad es una propuesta futura para compartir experiencias de bienestar con empatía y respeto. No está activa en este simulacro ni se publican mensajes, fotos o datos de salud reales."
                : normalized.includes("estacional") ||
                    normalized.includes("temporada")
                  ? "El bloque de alimentación estacional es una propuesta informativa futura. Podrá orientar hacia alimentos de temporada con fuentes públicas, pero no sustituirá recomendaciones nutricionales personalizadas."
                  : normalized.includes("consejo")
                    ? `El mejor consejo de bienestar es el que se adapta a tu realidad hoy, ${state.preferences.displayName || "amiga"}. No necesitas rutinas imposibles de internet. Si hoy lograste tomarte tu medicación a tiempo o registrar tu tensión, ya es una victoria. Vamos un día a la vez.`
                    : normalized.includes("registro")
                      ? state.records.length
                        ? `Tienes ${state.records.length} registro(s) en esta sesión. Puedes verlos en Informes.`
                        : "Aún no has añadido registros en esta sesión. Puedes crear el primero desde Hoy o Registrar."
                      : "No interpreto datos ni sustituyo a un profesional sanitario. Puedo ayudarte a encontrar una sección de KurevaLife o a ordenar la información de este simulacro.";
    setReply(nextReply);
    onAnnounce(`Kivi responde: ${nextReply}`);
  };
  return (
    <section
      ref={panelRef}
      className="kl-kivi-panel"
      aria-labelledby="kivi-title"
      tabIndex={-1}
    >
      <div className="kl-kivi-panel__header">
        <div>
          <p className="kl-eyebrow">KIVI</p>
          <h2 id="kivi-title">Chat con Kivi</h2>
        </div>
        <button type="button" aria-label="Cerrar Kivi" onClick={onClose}>
          ×
        </button>
      </div>
      <p className="kl-kivi-note">
        Kivi no diagnostica ni sustituye a un profesional sanitario.
      </p>
      <div className="kl-kivi-options">
        {[
          "¿Para qué sirve registrar lo que como desde el desayuno hasta la cena?",
          "¿Qué detecta Kureva si subo la foto de una analítica?",
          "¿Cómo me ayudan las alertas de medicación por hora y día?",
          "¿Por qué Kureva insiste en que no es mi médico?",
          "¿Qué puedo hacer en la sección de Comunidad?",
          "¿Cómo funciona el bloque de alimentación estacional?",
        ].map(option => (
          <button
            key={option}
            type="button"
            onClick={() => {
              respond(option);
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="kl-kivi-reply" role="status" aria-live="polite">
        <span aria-hidden="true">
          <Sparkles size={17} />
        </span>
        {reply}
      </div>
      {subtitlesEnabled ? (
        <div className="kl-kivi-transcript" aria-label="Transcripción de Kivi">
          <strong>Transcripción de Kivi</strong>
          <span>{reply}</span>
        </div>
      ) : null}
      <label className="kl-field" htmlFor="kivi-message">
        <span>Escribe tu consulta</span>
        <textarea
          id="kivi-message"
          rows={3}
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder="Ej. ¿Dónde encuentro mis registros?"
          maxLength={500}
        />
      </label>
      <div className="kl-action-row">
        <KurevaButton
          type="button"
          variant="quiet"
          onClick={() => respond("dictado")}
        >
          {" "}
          <Volume2 size={18} aria-hidden="true" /> Dictar
        </KurevaButton>
        <KurevaButton
          type="button"
          variant="primary"
          onClick={() => respond(message || "Resolver una duda")}
        >
          <Send size={18} aria-hidden="true" /> Enviar
        </KurevaButton>
      </div>
    </section>
  );
}

declare global {
  interface Window {
    SpeechRecognition?: new () => {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      start: () => void;
      onresult:
        | ((event: {
            results: {
              [index: number]: { [index: number]: { transcript: string } };
            };
          }) => void)
        | null;
      onerror: (() => void) | null;
    };
    webkitSpeechRecognition?: Window["SpeechRecognition"];
  }
}

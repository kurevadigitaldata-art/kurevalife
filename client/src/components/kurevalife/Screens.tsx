import { useEffect, useMemo, useRef, useState } from "react";
import {
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
  Mic,
  Moon,
  PencilLine,
  Plus,
  Send,
  Share2,
  Sparkles,
  Volume2,
} from "lucide-react";
import { jsPDF } from "jspdf";
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

export function TodayScreen({
  name,
  state,
  onToggleRoutine,
  onOpenRegister,
}: {
  name: string;
  state: KurevaLifeState;
  onToggleRoutine: (id: string) => void;
  onOpenRegister: () => void;
}) {
  const completed = state.routines.filter(routine => routine.completed).length;
  const next = state.routines.find(routine => !routine.completed);
  const greeting = name ? `Hola, ${name}` : "Hola";

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow={todayLabel()}
        title={greeting}
        description="Todo lo que decides guardar se queda en este dispositivo durante la prueba."
      />

      <KurevaCard className="kl-day-overview" labelledBy="progreso-hoy">
        <div>
          <p className="kl-card-label">MI DÍA</p>
          <h2 id="progreso-hoy">Pequeños pasos, en orden.</h2>
          <p>Marca lo que ya hayas hecho y vuelve cuando lo necesites.</p>
        </div>
        <ProgressRing completed={completed} total={state.routines.length} />
      </KurevaCard>

      <KurevaCard className="kl-next-card" labelledBy="siguiente-accion">
        <div className="kl-next-card__icon" aria-hidden="true">
          <ChevronRight size={22} />
        </div>
        <div>
          <p className="kl-card-label">SIGUIENTE ACCIÓN</p>
          <h2 id="siguiente-accion">
            {next?.title ?? "Has terminado tus rutinas de hoy"}
          </h2>
          <p>
            {next?.detail ??
              "Puedes revisar tus registros o crear una nueva rutina cuando quieras."}
          </p>
        </div>
        {next ? (
          <KurevaButton
            type="button"
            variant="accent"
            onClick={() => onToggleRoutine(next.id)}
          >
            Hecho <Check size={18} aria-hidden="true" />
          </KurevaButton>
        ) : null}
      </KurevaCard>

      <section aria-labelledby="rutinas-de-hoy">
        <div className="kl-inline-heading">
          <div>
            <p className="kl-eyebrow">RUTINAS</p>
            <h2 id="rutinas-de-hoy">Hoy</h2>
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

      <KurevaCard className="kl-local-card" labelledBy="estado-local">
        <LocalStatus />
        <div>
          <h2 id="estado-local">
            Tus registros de prueba están guardados localmente.
          </h2>
          <p>No se crea una cuenta ni se envían datos de esta simulación.</p>
        </div>
      </KurevaCard>

      <KurevaButton
        type="button"
        variant="primary"
        className="kl-full-action"
        onClick={onOpenRegister}
      >
        <Plus size={19} aria-hidden="true" /> Registrar un paso
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
    setRecordMessage("Registro guardado localmente. Lo verás en Informes.");
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
              <p>Se guardará solamente en este dispositivo.</p>
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
            />
          </label>

          <div className="kl-attachment-box">
            <div>
              <strong>Foto, captura, PDF o archivo</strong>
              <p>
                La prueba registra el nombre del archivo localmente. No lo sube
                a ningún servidor.
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
            <Check size={18} aria-hidden="true" /> Guardar registro local
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
        <LocalStatus />
        <div>
          <h2 id="registro-local-status">Guardado localmente</h2>
          <p>
            Podrás revisar estos datos y preparar un resumen desde Informes.
          </p>
        </div>
      </KurevaCard>

      {records.length ? (
        <p className="kl-muted-summary">
          <ClipboardList size={16} aria-hidden="true" /> {records.length}{" "}
          {records.length === 1 ? "registro guardado" : "registros guardados"}{" "}
          en este dispositivo.
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

export function ReportsScreen({ state }: { state: KurevaLifeState }) {
  const [status, setStatus] = useState("");
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

  const downloadPdf = () => {
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
        title="Tu información, más clara."
        description="Un resumen local para revisar con calma o preparar una conversación."
      />
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
              <KurevaButton type="button" variant="secondary">
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
        description="Los cambios se aplican ahora mismo y se guardan localmente."
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
          <SettingSwitch
            label="Texto ampliado"
            detail="Aumenta el tamaño de lectura sin cambiar el orden."
            checked={preferences.largeText}
            onChange={checked => onUpdatePreferences({ largeText: checked })}
          />
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
  onOpenTab,
}: {
  onClose: () => void;
  state: KurevaLifeState;
  onOpenTab: (tab: "registrar" | "informes") => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(
    "Elige una opción o escribe una pregunta. Puedo ayudarte a ordenar, no a diagnosticar."
  );
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  const respond = (prompt: string) => {
    setMessage(prompt);
    if (prompt.toLowerCase().includes("consulta"))
      setReply(
        "Puedes seleccionar preguntas habituales desde Perfil y generar un resumen local desde Informes."
      );
    else if (prompt.toLowerCase().includes("registro"))
      setReply(
        state.records.length
          ? `Tienes ${state.records.length} registro(s) local(es). Puedes verlos en Informes.`
          : "Aún no has guardado registros. Puedes crear el primero desde Registrar."
      );
    else if (prompt.toLowerCase().includes("rutina"))
      setReply(
        "En Hoy puedes marcar las rutinas una a una. El progreso se guarda localmente."
      );
    else
      setReply(
        "No interpreto datos ni sustituyo a un profesional sanitario. Puedo ayudarte a encontrar una sección de KurevaLife o a ordenar tu información."
      );
  };
  return (
    <section
      ref={panelRef}
      className="kl-kivi-panel"
      aria-labelledby="kivi-title"
    >
      <div className="kl-kivi-panel__header">
        <div>
          <p className="kl-eyebrow">KIVI</p>
          <h2 id="kivi-title">Asistente de organización</h2>
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
          "Preparar mi consulta",
          "Revisar un registro",
          "Organizar mis rutinas",
          "Resolver una duda",
        ].map(option => (
          <button
            key={option}
            type="button"
            onClick={() => {
              respond(option);
              if (option.includes("registro")) onOpenTab("informes");
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
      <label className="kl-field" htmlFor="kivi-message">
        <span>Escribe tu consulta</span>
        <textarea
          id="kivi-message"
          rows={3}
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder="Ej. ¿Dónde encuentro mis registros?"
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

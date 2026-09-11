import { useState } from "react";
import { Check, Mail, MessageSquareText, Send, Star } from "lucide-react";
import {
  type EntrySource,
  submitPilotFeedback,
  submitPilotInterest,
} from "@/lib/pilotFeedback";
import { KurevaButton, KurevaCard, SectionHeading } from "./ui";

const areas = [
  ["clarity", "Claridad y lenguaje"],
  ["daily_blocks", "Vista Hoy y rutinas"],
  ["reminders", "Avisos e hidratación"],
  ["medical_organization", "Registros e informes"],
  ["accessibility", "Accesibilidad"],
  ["kivi_support", "Kivi"],
  ["privacy", "Privacidad"],
  ["other", "Otro"],
] as const;

export function FeedbackScreen({ ticket }: { ticket: string }) {
  const [rating, setRating] = useState(0);
  const [area, setArea] = useState<(typeof areas)[number][0]>("clarity");
  const [publicComment, setPublicComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  const [remove, setRemove] = useState("");
  const [add, setAdd] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [launch, setLaunch] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [gifts, setGifts] = useState(false);
  const [emailConsent, setEmailConsent] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");

  const buildMessage = () =>
    [
      publicComment.trim()
        ? `Comentario compartible: ${publicComment.trim()}`
        : "",
      privateComment.trim()
        ? `Comentario privado: ${privateComment.trim()}`
        : "",
      remove.trim() ? `Quitaría: ${remove.trim()}` : "",
      add.trim() ? `Añadiría: ${add.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

  const submitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = buildMessage();
    if (
      !rating ||
      !message ||
      !consent ||
      (!anonymous && name.trim().length < 2)
    ) {
      setStatus(
        "Elige una valoración, deja al menos un comentario y confirma la privacidad antes de enviar."
      );
      return;
    }
    setSending(true);
    try {
      await submitPilotFeedback({
        ticket_code: ticket,
        experience_area: "kurevalife_simulator",
        feedback_type: add.trim()
          ? "idea"
          : privateComment.trim()
            ? "observation"
            : "problem",
        feedback_category: area,
        rating,
        message,
        accessibility_context: "not_shared",
        is_anonymous: anonymous,
        sender_name: anonymous ? null : name.trim(),
        entry_source: "directo" as EntrySource,
        consent_privacy: true,
      });
      setStatus(
        "Gracias. Tu valoración y sugerencia se han guardado en el registro privado del piloto."
      );
    } catch {
      try {
        localStorage.setItem(
          `kurevalife-feedback-${ticket}`,
          JSON.stringify({
            rating,
            area,
            message,
            anonymous,
            name: anonymous ? null : name,
          })
        );
      } catch {
        // The human-readable status below remains available if storage is unavailable.
      }
      setStatus(
        "No hemos podido enviar la sugerencia ahora. La hemos conservado localmente en este dispositivo para que no se pierda."
      );
    } finally {
      setSending(false);
    }
  };

  const submitUpdates = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !emailConsent || (!launch && !updates && !gifts)) {
      setEmailStatus(
        "Escribe tu correo, marca al menos una opción y confirma la privacidad."
      );
      return;
    }
    try {
      await submitPilotInterest({
        email: email.trim(),
        participation_role: "persona",
        consent_updates: true,
        consent_kit_updates: gifts,
        consent_launch_notifications: launch,
        consent_project_updates: updates,
        consent_gift_updates: gifts,
        entry_source: "directo",
        consent_privacy: true,
      });
      setEmailStatus(
        "Tus preferencias se han guardado. Las comunicaciones oficiales saldrán desde kurevadigitaldata@gmail.com cuando se habilite el envío."
      );
    } catch {
      setEmailStatus(
        "No hemos podido guardar el correo ahora. Puedes volver a intentarlo más tarde sin perder tu valoración local."
      );
    }
  };

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow="FEEDBACK DE PRUEBA"
        title="Tu experiencia ayuda a construir KurevaLife."
        description="No escribas información de salud, contraseñas ni datos personales sensibles en este formulario."
      />
      <KurevaCard className="kl-feedback-card" labelledBy="feedback-title">
        <div className="kl-card-heading">
          <div className="kl-mini-icon" aria-hidden="true">
            <MessageSquareText size={18} />
          </div>
          <div>
            <h2 id="feedback-title">Valoración y sugerencias</h2>
            <p>
              Tu código de prueba es <strong>{ticket}</strong>.
            </p>
          </div>
        </div>
        <form
          onSubmit={submitFeedback}
          className="kl-form-stack"
          aria-busy={sending}
        >
          <fieldset className="kl-star-field">
            <legend>¿Cómo valorarías este simulacro?</legend>
            <div
              role="radiogroup"
              aria-label="Valoración de una a cinco estrellas"
            >
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
                  onClick={() => setRating(value)}
                  className={value <= rating ? "is-selected" : ""}
                >
                  <Star size={28} fill="currentColor" />
                </button>
              ))}
            </div>
            <small>{rating ? `${rating} de 5` : "Elige una valoración"}</small>
          </fieldset>
          <label className="kl-field" htmlFor="feedback-area">
            <span>Sobre qué quieres opinar</span>
            <select
              id="feedback-area"
              value={area}
              onChange={event => setArea(event.target.value as typeof area)}
            >
              {areas.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="kl-field" htmlFor="feedback-public">
            <span>Comentario público</span>
            <textarea
              id="feedback-public"
              rows={3}
              value={publicComment}
              onChange={event => setPublicComment(event.target.value)}
              placeholder="Algo que podría compartir la comunidad de testers, sin datos personales."
            />
          </label>
          <label className="kl-field" htmlFor="feedback-private">
            <span>Comentario privado</span>
            <textarea
              id="feedback-private"
              rows={4}
              value={privateComment}
              onChange={event => setPrivateComment(event.target.value)}
              placeholder="Cuéntanos dónde te has atascado, qué ha sido confuso o qué no ha funcionado."
            />
          </label>
          <div className="kl-form-grid">
            <label className="kl-field" htmlFor="feedback-remove">
              <span>¿Qué quitarías?</span>
              <textarea
                id="feedback-remove"
                rows={3}
                value={remove}
                onChange={event => setRemove(event.target.value)}
                placeholder="Una función, texto o paso que no usarías."
              />
            </label>
            <label className="kl-field" htmlFor="feedback-add">
              <span>¿Qué añadirías?</span>
              <textarea
                id="feedback-add"
                rows={3}
                value={add}
                onChange={event => setAdd(event.target.value)}
                placeholder="Algo que sería esencial para ti."
              />
            </label>
          </div>
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={event => setAnonymous(event.target.checked)}
            />
            <span>
              <strong>Enviar de forma anónima</strong>
              <small>No se guardará un nombre junto a tu sugerencia.</small>
            </span>
          </label>
          {!anonymous ? (
            <label className="kl-field" htmlFor="feedback-name">
              <span>Nombre que quieres asociar</span>
              <input
                id="feedback-name"
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Nombre y apellidos"
              />
            </label>
          ) : null}
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={event => setConsent(event.target.checked)}
            />
            <span>
              <strong>
                Quiero que esta sugerencia quede en el registro privado del
                piloto.
              </strong>
              <small>
                Se guarda separada de las notas y registros creados dentro de la
                demo.
              </small>
            </span>
          </label>
          {status ? (
            <p className="kl-inline-status" role="status" aria-live="polite">
              {status}
            </p>
          ) : null}
          <KurevaButton
            type="submit"
            variant="accent"
            className="kl-full-action"
            disabled={sending}
          >
            <Send size={18} aria-hidden="true" />{" "}
            {sending ? "Guardando…" : "Enviar valoración y sugerencia"}
          </KurevaButton>
        </form>
      </KurevaCard>
      <KurevaCard className="kl-updates-card" labelledBy="updates-title">
        <div className="kl-card-heading">
          <div className="kl-mini-icon" aria-hidden="true">
            <Mail size={18} />
          </div>
          <div>
            <h2 id="updates-title">
              Quiero enterarme cuando llegue el momento
            </h2>
            <p>El correo es opcional y está separado de la valoración.</p>
          </div>
        </div>
        <form onSubmit={submitUpdates} className="kl-form-stack">
          <label className="kl-field" htmlFor="feedback-email">
            <span>Tu correo</span>
            <input
              id="feedback-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="tu@correo.es"
            />
          </label>
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={launch}
              onChange={event => setLaunch(event.target.checked)}
            />
            <span>
              <strong>Fecha de lanzamiento de KurevaLife</strong>
              <small>
                Quiero saber cuándo la app esté lista para empezar a usarla.
              </small>
            </span>
          </label>
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={updates}
              onChange={event => setUpdates(event.target.checked)}
            />
            <span>
              <strong>Avances y futuros proyectos de Kureva</strong>
              <small>Solo novedades relevantes y aperturas.</small>
            </span>
          </label>
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={gifts}
              onChange={event => setGifts(event.target.checked)}
            />
            <span>
              <strong>Regalos Kureva</strong>
              <small>
                Información sobre regalos de participación y primeras 30
                personas.
              </small>
            </span>
          </label>
          <label className="kl-check-row">
            <input
              type="checkbox"
              checked={emailConsent}
              onChange={event => setEmailConsent(event.target.checked)}
            />
            <span>
              <strong>Confirmo la privacidad de esta elección.</strong>
              <small>
                Las comunicaciones oficiales se enviarán desde
                kurevadigitaldata@gmail.com cuando se habilite el envío.
              </small>
            </span>
          </label>
          {emailStatus ? (
            <p className="kl-inline-status" role="status" aria-live="polite">
              {emailStatus}
            </p>
          ) : null}
          <KurevaButton
            type="submit"
            variant="primary"
            className="kl-full-action"
          >
            <Check size={18} aria-hidden="true" /> Guardar mis elecciones
          </KurevaButton>
        </form>
      </KurevaCard>
    </div>
  );
}

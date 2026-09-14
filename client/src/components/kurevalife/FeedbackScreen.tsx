import { useState } from "react";
import { Check, ExternalLink, MessageSquareText, Star } from "lucide-react";
import { KurevaButton, KurevaCard, SectionHeading } from "./ui";

type Attribution = "name" | "anonymous";

function makeParticipantCode() {
  const uniquePart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `KLV-${uniquePart.toUpperCase()}`;
}

export function FeedbackScreen({
  displayName,
  onFinish,
}: {
  displayName: string;
  onFinish: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [attribution, setAttribution] = useState<Attribution>(
    displayName.trim() ? "name" : "anonymous"
  );
  const [participantCode] = useState(makeParticipantCode);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState("");

  const publishWithName = attribution === "name" && Boolean(displayName.trim());
  const participantLabel = publishWithName
    ? displayName.trim()
    : `Participante anónimo · ${participantCode}`;

  const submitFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating || !comment.trim()) {
      setStatus(
        "Elige una valoración y escribe una sugerencia para completar la prueba."
      );
      return;
    }
    setStatus("");
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="kl-screen-stack">
        <SectionHeading
          eyebrow="RECORRIDO COMPLETADO"
          title="Gracias por ser parte de este simulacro."
          description="La valoración fue una demostración local: no se publicó ni se envió a ningún servicio."
        />
        <KurevaCard className="kl-closing-card" labelledBy="closing-title">
          <div className="kl-closing-mark" aria-hidden="true">
            <Check size={28} />
          </div>
          <div>
            <h2 id="closing-title">
              Tu experiencia ayuda a mejorar KurevaLife.
            </h2>
            <p>
              Así quedaría tu aportación en el entorno de prueba. No se ha
              almacenado, publicado ni transmitido ningún dato.
            </p>
          </div>
          <div
            className="kl-notice"
            aria-label="Resumen de tu valoración de prueba"
          >
            <strong>{participantLabel}</strong>
            <span>Valoración: {rating} de 5 estrellas.</span>
            <span>Tu sugerencia: “{comment.trim()}”</span>
          </div>
          <p className="kl-notice">
            {publishWithName
              ? "El nombre o alias procede únicamente de esta sesión. En una versión online, la publicación requerirá consentimiento explícito."
              : `La aportación se muestra de forma anónima con el código temporal ${participantCode}.`}
          </p>
          <a
            className="kl-closing-link"
            href="https://kurevadigitaldata-art.github.io/kurevalife/"
          >
            Conocer Kureva <ExternalLink size={16} aria-hidden="true" />
          </a>
          <KurevaButton type="button" variant="primary" onClick={onFinish}>
            Volver a la bienvenida
          </KurevaButton>
        </KurevaCard>
      </div>
    );
  }

  return (
    <div className="kl-screen-stack">
      <SectionHeading
        eyebrow="CIERRE DEL SIMULACRO"
        title="¡Has completado el recorrido por el simulacro!"
        description="Ahora que has explorado las herramientas en un entorno seguro, tu opinión es importante para el proyecto en desarrollo."
      />
      <KurevaCard
        className="kl-closing-card"
        labelledBy="closing-feedback-title"
      >
        <div className="kl-closing-placeholder" aria-hidden="true">
          <MessageSquareText size={28} />
          <span>KurevaLife</span>
        </div>
        <div>
          <p className="kl-card-label">VALORACIÓN DE PRUEBA</p>
          <h2 id="closing-feedback-title">¿Cómo ha sido tu experiencia?</h2>
          <p>
            La valoración se muestra al final de esta demostración y desaparece
            al cerrar o recargar la sesión.
          </p>
        </div>
        <form onSubmit={submitFeedback} className="kl-form-stack">
          <fieldset className="kl-star-field">
            <legend>Calificación</legend>
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
                  <Star size={30} fill="currentColor" />
                </button>
              ))}
            </div>
            <small>{rating ? `${rating} de 5` : "Elige una valoración"}</small>
          </fieldset>
          <label className="kl-field" htmlFor="closing-comment">
            <span>Comentarios o sugerencias</span>
            <textarea
              id="closing-comment"
              rows={5}
              value={comment}
              onChange={event => setComment(event.target.value)}
              placeholder="Escribe una sugerencia para esta demostración, sin datos personales ni de salud."
              maxLength={500}
            />
          </label>
          <fieldset className="kl-form-stack">
            <legend>¿Cómo deseas identificar tu aportación?</legend>
            <label className="kl-check-row">
              <input
                type="radio"
                name="feedback-attribution"
                value="name"
                checked={attribution === "name"}
                disabled={!displayName.trim()}
                onChange={() => setAttribution("name")}
              />
              <span>
                <strong>Publicar con mi nombre o alias</strong>
                <small>
                  {displayName.trim()
                    ? `Se asociará a ${displayName.trim()} solo en la vista final de esta prueba.`
                    : "Esta opción está disponible si indicaste un nombre o alias al inicio."}
                </small>
              </span>
            </label>
            <label className="kl-check-row">
              <input
                type="radio"
                name="feedback-attribution"
                value="anonymous"
                checked={attribution === "anonymous"}
                onChange={() => setAttribution("anonymous")}
              />
              <span>
                <strong>Publicar de forma anónima</strong>
                <small>
                  Se ocultará tu nombre o alias y se generará un código único de
                  participante para esta demostración.
                </small>
              </span>
            </label>
          </fieldset>
          <p className="kl-notice">
            La comunidad real no está activa. El botón final solo muestra tu
            aportación dentro de esta sesión; no publica ni envía información.
          </p>
          {status ? (
            <p className="kl-inline-status" role="status" aria-live="polite">
              {status}
            </p>
          ) : null}
          <KurevaButton
            type="submit"
            variant="accent"
            className="kl-full-action"
          >
            <Check size={18} aria-hidden="true" /> Publicar valoración y
            finalizar simulacro
          </KurevaButton>
        </form>
      </KurevaCard>
      <p className="kl-closing-credits">
        KurevaLife · propiedad y autoría de Kureva. Este simulacro no recopila
        datos reales.
      </p>
    </div>
  );
}

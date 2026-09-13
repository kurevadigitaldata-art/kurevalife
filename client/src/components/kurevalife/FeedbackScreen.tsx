import { useState } from "react";
import { Check, ExternalLink, MessageSquareText, Star } from "lucide-react";
import { KurevaButton, KurevaCard, SectionHeading } from "./ui";

export function FeedbackScreen({ onFinish }: { onFinish: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState("");

  const submitFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      setStatus(
        "Elige una valoración de una a cinco estrellas para completar la prueba."
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
              El recorrido ha terminado. La versión online requerirá opciones de
              consentimiento claras antes de recibir cualquier opinión, dato o
              solicitud de contacto.
            </p>
          </div>
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
            Esta valoración no se publica ni se envía. Sirve para completar el
            recorrido de forma segura dentro de esta sesión.
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
          <p className="kl-notice">
            La comunidad real no está activa. Este texto es temporal y se
            elimina al recargar o cerrar la prueba.
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

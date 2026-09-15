import { useState } from "react";
import { Check, ExternalLink, MessageSquareText, Star } from "lucide-react";
import { KurevaButton, KurevaCard, SectionHeading } from "./ui";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

type Attribution = "name" | "anonymous";

function makeParticipantCode() {
  const uniquePart = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().slice(0, 8)
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `KLV-${uniquePart.toUpperCase()}`;
}

export function FeedbackScreen({ displayName, onFinish }: { displayName: string; onFinish: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [attribution, setAttribution] = useState<Attribution>(displayName.trim() ? "name" : "anonymous");
  const [participantCode] = useState(makeParticipantCode);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState("");
  const publishWithName = attribution === "name" && Boolean(displayName.trim());
  const participantLabel = publishWithName ? displayName.trim() : `Participante anónimo · ${participantCode}`;

  const submitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating || !comment.trim()) {
      setStatus("Elige una valoración y escribe una sugerencia para continuar.");
      return;
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setStatus("La conexión con la base de datos aún no está configurada.");
      return;
    }
    setStatus("Guardando tu valoración...");
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/pilot_feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          rating,
          message: comment.trim(),
          public_display_name: publishWithName ? displayName.trim() : null,
          participant_code: publishWithName ? null : participantCode,
          is_anonymous: !publishWithName,
          session_id: participantCode,
          consent_privacy: true,
        }),
      });
      if (!response.ok) throw new Error("No se pudo guardar la valoración.");
      setStatus("");
      setFinished(true);
    } catch {
      setStatus("No se ha podido guardar la valoración. Inténtalo de nuevo.");
    }
  };

  if (finished) {
    return <div className="kl-screen-stack"><SectionHeading eyebrow="RECORRIDO COMPLETADO" title="Gracias por compartir tu experiencia." description="Tu valoración se ha guardado correctamente y ayudará a mejorar KurevaLife." /><KurevaCard className="kl-closing-card" labelledBy="closing-title"><div className="kl-closing-mark" aria-hidden="true"><Check size={28} /></div><div><h2 id="closing-title">Tu experiencia ayuda a mejorar KurevaLife.</h2><p>Tu aportación se ha guardado en la base de datos de KurevaLife.</p></div><div className="kl-notice" aria-label="Resumen de tu valoración"><strong>{participantLabel}</strong><span>Valoración: {rating} de 5 estrellas.</span><span>Tu sugerencia: “{comment.trim()}”</span></div><p className="kl-notice">{publishWithName ? "El nombre o alias procede únicamente de esta sesión." : `La aportación se muestra de forma anónima con el código temporal ${participantCode}.`}</p><a className="kl-closing-link" href="https://kurevadigitaldata-art.github.io/kurevalife/">Conocer Kureva <ExternalLink size={16} aria-hidden="true" /></a><KurevaButton type="button" variant="primary" onClick={onFinish}>Volver a la bienvenida</KurevaButton></KurevaCard></div>;
  }

  return <div className="kl-screen-stack"><SectionHeading eyebrow="VALORACIÓN" title="¿Cómo ha sido tu experiencia?" description="Tu opinión es importante para seguir mejorando KurevaLife." /><KurevaCard className="kl-closing-card" labelledBy="closing-feedback-title"><div className="kl-closing-placeholder" aria-hidden="true"><MessageSquareText size={28} /><span>KurevaLife</span></div><div><p className="kl-card-label">VALORACIÓN</p><h2 id="closing-feedback-title">Comparte tu opinión</h2><p>Tu valoración se guardará de forma segura en la base de datos.</p></div><form onSubmit={submitFeedback} className="kl-form-stack"><fieldset className="kl-star-field"><legend>Calificación</legend><div role="radiogroup" aria-label="Valoración de una a cinco estrellas">{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`} onClick={() => setRating(value)} className={value <= rating ? "is-selected" : ""}><Star size={30} fill="currentColor" /></button>)}</div><small>{rating ? `${rating} de 5` : "Elige una valoración"}</small></fieldset><label className="kl-field" htmlFor="closing-comment"><span>Comentarios y sugerencias</span><textarea id="closing-comment" rows={5} value={comment} onChange={event => setComment(event.target.value)} placeholder="Escribe aquí tu opinión" maxLength={500} /></label><fieldset className="kl-form-stack"><legend>¿Cómo deseas identificar tu aportación?</legend><label className="kl-check-row"><input type="radio" name="feedback-attribution" value="name" checked={attribution === "name"} disabled={!displayName.trim()} onChange={() => setAttribution("name")} /><span><strong>Publicar con mi nombre o alias</strong><small>{displayName.trim() ? `Se asociará a ${displayName.trim()}.` : "Indica un nombre o alias al inicio para activar esta opción."}</small></span></label><label className="kl-check-row"><input type="radio" name="feedback-attribution" value="anonymous" checked={attribution === "anonymous"} onChange={() => setAttribution("anonymous")} /><span><strong>Publicar de forma anónima</strong><small>Se ocultará tu nombre o alias y se generará un código temporal.</small></span></label></fieldset>{status ? <p className="kl-inline-status" role="status" aria-live="polite">{status}</p> : null}<KurevaButton type="submit" variant="accent" className="kl-full-action"><Check size={18} aria-hidden="true" /> Guardar valoración</KurevaButton></form></KurevaCard><p className="kl-closing-credits">KurevaLife · propiedad y autoría de Kureva.</p></div>;
}

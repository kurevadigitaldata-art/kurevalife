import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Info,
  LockKeyhole,
  Volume2,
  VolumeX,
} from "lucide-react";
import type {
  KurevaLifePreferences,
  PreferredAddress,
  TextScale,
} from "./types";
import { BrandSignature, KurevaButton, KurevaCard } from "./ui";

type OnboardingPatch = Pick<
  KurevaLifePreferences,
  | "displayName"
  | "familyName"
  | "preferredAddress"
  | "textScale"
  | "nightMode"
  | "soundEnabled"
  | "subtitlesEnabled"
  | "screenReaderSupport"
  | "easyReadMode"
>;

const steps = [
  "Bienvenida",
  "Introducción",
  "Inclusión",
  "Registro",
  "Configuración",
] as const;

function introductionCopy(name: string, address: PreferredAddress) {
  const visibleName = name.trim() || "Nathalia";
  if (address === "femenino") {
    return {
      title: `Bienvenida a KurevaLife, ${visibleName}`,
      first: "Has sido seleccionada porque confiamos en tu criterio, curiosidad y ganas de mejorar.",
      second:
        "Hoy solo harás un simulacro. Queremos que lo explores tranquila, sin prisas, y que pruebes todo lo que te apetezca.",
    };
  }
  if (address === "masculino") {
    return {
      title: `Bienvenido a KurevaLife, ${visibleName}`,
      first: "Has sido seleccionado porque confiamos en tu criterio, curiosidad y ganas de mejorar.",
      second:
        "Hoy solo harás un simulacro. Queremos que lo explores tranquilo, sin prisas, y que pruebes todo lo que te apetezca.",
    };
  }
  return {
    title: `Te damos la bienvenida a KurevaLife, ${visibleName}`,
    first:
      "Agradecemos tu participación porque confiamos en tu criterio, curiosidad y ganas de mejorar.",
    second:
      "Hoy solo harás un simulacro. Queremos que explores el recorrido sin prisas y pruebes lo que te apetezca.",
  };
}

export function KurevaLifeOnboarding({
  onComplete,
  onAnnounce,
}: {
  onComplete: (patch: OnboardingPatch) => void;
  onAnnounce: (message: string, enabled?: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Nathalia");
  const [familyName, setFamilyName] = useState("Ejemplo");
  const [address, setAddress] = useState<PreferredAddress>("femenino");
  const [textScale, setTextScale] = useState<TextScale>("normal");
  const [nightMode, setNightMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [screenReaderSupport, setScreenReaderSupport] = useState(false);
  const [easyReadMode, setEasyReadMode] = useState(false);

  const intro = useMemo(
    () => introductionCopy(name, address),
    [address, name]
  );
  const move = (next: number) => {
    setStep(next);
    onAnnounce(`${steps[next]}.`, soundEnabled || screenReaderSupport);
  };
  const finish = () => {
    const cleanName = name.trim() || "Nathalia";
    onComplete({
      displayName: cleanName,
      familyName: familyName.trim(),
      preferredAddress: address,
      textScale,
      nightMode,
      soundEnabled,
      subtitlesEnabled,
      screenReaderSupport,
      easyReadMode,
    });
    onAnnounce(`Hola, ${cleanName}. Tu simulacro está listo.`, soundEnabled || screenReaderSupport);
  };

  return (
    <section
      className={`kl-onboarding ${nightMode ? "kl-theme-night" : ""} kl-text-${textScale} ${easyReadMode ? "kl-easy-read" : ""}`}
      aria-labelledby="onboarding-title"
    >
      <div className="kl-onboarding__topbar">
        <BrandSignature compact />
        <span>{step + 1} de {steps.length}</span>
      </div>
      <div className="kl-onboarding__progress" aria-label={`Paso ${step + 1} de ${steps.length}`}>
        {steps.map((label, index) => (
          <span key={label} className={index <= step ? "is-active" : ""} aria-hidden="true" />
        ))}
      </div>

      <main className="kl-onboarding__content">
        {step === 0 ? (
          <div className="kl-onboarding__welcome">
            <BrandSignature />
            <h1 id="onboarding-title">Tu día en orden.<br />Tu bienestar más claro.</h1>
            <p>
              KurevaLife es un espacio para registrar, organizar y comprender mejor tu bienestar, con privacidad y autonomía.
            </p>
            <KurevaButton type="button" variant="primary" onClick={() => move(1)}>
              Comenzar simulacro <ArrowRight size={18} aria-hidden="true" />
            </KurevaButton>
            <p className="kl-onboarding__notice"><Info size={16} aria-hidden="true" /> Este es un simulacro interactivo. Los datos son de ejemplo y desaparecen al cerrar o recargar esta sesión.</p>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">INTRODUCCIÓN AL SIMULACRO</p>
            <h1 id="onboarding-title">{intro.title}</h1>
            <p>Hola, {name.trim() || "Nathalia"}. {intro.first}</p>
            <p>{intro.second}</p>
            <p>KurevaLife no es una simple app de “para” o “porque”. Es una herramienta humanizada, que entiende tus necesidades y se adapta a ti.</p>
            <p>Este proyecto nace de la experiencia real y del deseo de compartir lo aprendido para ayudar a muchas personas.</p>
            <KurevaCard className="kl-onboarding__alert" labelledBy="tiempo-simulacro">
              <Info size={20} aria-hidden="true" />
              <p id="tiempo-simulacro"><strong>Tienes 10 minutos para completar el recorrido.</strong> Luego podrás dejar tu valoración y sugerencias.</p>
            </KurevaCard>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">INCLUSIÓN Y ACCESIBILIDAD</p>
            <h1 id="onboarding-title">Somos completamente inclusivos</h1>
            <p>KurevaLife está diseñada para que la puedas usar de la forma que mejor se adapte a ti.</p>
            <div className="kl-onboarding__inclusion-grid">
              <button type="button" className={screenReaderSupport ? "is-selected" : ""} onClick={() => setScreenReaderSupport(value => !value)} aria-pressed={screenReaderSupport}>
                <Eye size={21} aria-hidden="true" /><strong>No videntes</strong><span>Compatibilidad con lector de pantalla y navegación por voz.</span>
              </button>
              <button type="button" className={subtitlesEnabled ? "is-selected" : ""} onClick={() => setSubtitlesEnabled(value => !value)} aria-pressed={subtitlesEnabled}>
                <Volume2 size={21} aria-hidden="true" /><strong>Personas sordas</strong><span>Texto limpio, transcripciones y subtítulos visuales.</span>
              </button>
              <div><strong>Mayores de 18 años</strong><span>Contenidos y funciones adaptados a un uso responsable.</span></div>
              <div><strong>Modo familiar</strong><span>Próximamente: organización con consentimiento para personas cercanas.</span></div>
            </div>
            <p className="kl-onboarding__closing">Tu comodidad y accesibilidad son nuestra prioridad.</p>
          </div>
        ) : null}

        {step === 3 ? (
          <form className="kl-onboarding__story" onSubmit={event => { event.preventDefault(); move(4); }}>
            <p className="kl-eyebrow">REGISTRO</p>
            <h1 id="onboarding-title">Cuéntanos un poco sobre ti</h1>
            <p className="kl-onboarding__form-note"><LockKeyhole size={16} aria-hidden="true" /> Estos datos son solo para el simulacro. No se guardarán al cerrar o recargar.</p>
            <label className="kl-field"><span>Nombre</span><input value={name} onChange={event => setName(event.target.value)} maxLength={80} autoComplete="given-name" /></label>
            <label className="kl-field"><span>Apellidos</span><input value={familyName} onChange={event => setFamilyName(event.target.value)} maxLength={80} autoComplete="family-name" /></label>
            <label className="kl-field"><span>Correo electrónico <small>(no se utilizará)</small></span><input type="email" placeholder="ejemplo@kurevalife.demo" autoComplete="email" /></label>
            <label className="kl-field"><span>Teléfono <small>(opcional, no se utilizará)</small></span><input type="tel" placeholder="Tu número" autoComplete="tel" /></label>
            <fieldset className="kl-onboarding__choice"><legend>¿Cómo quieres que adaptemos el trato?</legend><div>{(["femenino", "masculino", "neutro"] as PreferredAddress[]).map(option => <button key={option} type="button" className={address === option ? "is-selected" : ""} onClick={() => setAddress(option)} aria-pressed={address === option}>{option === "femenino" ? "Femenino" : option === "masculino" ? "Masculino" : "Neutro / no binario"}</button>)}</div></fieldset>
            <fieldset className="kl-onboarding__choice"><legend>Tamaño de texto</legend><div>{(["normal", "grande", "muy-grande"] as TextScale[]).map(option => <button key={option} type="button" className={textScale === option ? "is-selected" : ""} onClick={() => setTextScale(option)} aria-pressed={textScale === option}>{option === "muy-grande" ? "Muy grande" : option[0].toUpperCase() + option.slice(1)}</button>)}</div></fieldset>
            <KurevaButton type="submit" variant="accent">Siguiente <ArrowRight size={18} aria-hidden="true" /></KurevaButton>
          </form>
        ) : null}

        {step === 4 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">CONFIGURACIÓN</p>
            <h1 id="onboarding-title">Preferencias y permisos</h1>
            <div className="kl-onboarding__settings">
              <label><span><strong>Sonido y voz opcional</strong><small>Una alerta breve puede describir cambios de pantalla.</small></span><input type="checkbox" checked={soundEnabled} onChange={event => setSoundEnabled(event.target.checked)} role="switch" aria-label="Sonido y voz opcional" /></label>
              <label><span><strong>Subtítulos y transcripción</strong><small>Kivi siempre prioriza texto claro y visible.</small></span><input type="checkbox" checked={subtitlesEnabled} onChange={event => setSubtitlesEnabled(event.target.checked)} role="switch" aria-label="Subtítulos y transcripción" /></label>
              <label><span><strong>Modo de lectura fácil</strong><small>Reduce bloques de texto y refuerza mensajes clave.</small></span><input type="checkbox" checked={easyReadMode} onChange={event => setEasyReadMode(event.target.checked)} role="switch" aria-label="Modo de lectura fácil" /></label>
              <label><span><strong>Modo nocturno</strong><small>Activa fondos bosque y texto de alto contraste.</small></span><input type="checkbox" checked={nightMode} onChange={event => setNightMode(event.target.checked)} role="switch" aria-label="Modo nocturno" /></label>
            </div>
            <p className="kl-onboarding__form-note"><Info size={16} aria-hidden="true" /> No enviamos spam ni recogemos estos datos. Esta configuración vive solo durante esta prueba.</p>
          </div>
        ) : null}
      </main>

      {step > 0 ? <footer className="kl-onboarding__actions">
        <KurevaButton type="button" variant="quiet" onClick={() => move(step - 1)}><ArrowLeft size={18} aria-hidden="true" /> Volver</KurevaButton>
        {step === 1 || step === 2 ? <KurevaButton type="button" variant="accent" onClick={() => move(step + 1)}>{step === 1 ? "Comenzar" : "Continuar"} <ArrowRight size={18} aria-hidden="true" /></KurevaButton> : null}
        {step === 4 ? <KurevaButton type="button" variant="accent" onClick={finish}>Finalizar <Check size={18} aria-hidden="true" /></KurevaButton> : null}
      </footer> : null}
    </section>
  );
}

export { introductionCopy };

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Info,
  LockKeyhole,
  Volume2,
} from "lucide-react";
import type { KurevaLifePreferences, TextScale } from "./types";
import { BrandSignature, KurevaButton } from "./ui";
import { publicPath } from "@/lib/publicPath";

type OnboardingPatch = Pick<
  KurevaLifePreferences,
  | "displayName"
  | "familyName"
  | "textScale"
  | "soundEnabled"
  | "translationEnabled"
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

export function introductionCopy() {
  return {
    title: "Bienvenida a KurevaLife",
    greeting:
      "Hola, muchas gracias por formar parte de este simulacro. Tu perfil califica perfectamente porque confiamos en tu criterio, curiosidad y ganas de mejorar.",
    exploration:
      "Hoy queremos que explores la herramienta con total tranquilidad, sin prisas, y que pruebes todo lo que te apetezca. ¡Tómate el tiempo que necesites!",
    humanized:
      "KurevaLife no es una simple app de “para” o “porque”. Es una herramienta humanizada, que entiende tus necesidades y se adapta a ti.",
    origin:
      "Este proyecto nace de la experiencia real y del deseo de compartir lo aprendido para ayudar a muchas personas.",
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
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [textScale, setTextScale] = useState<TextScale>("normal");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [screenReaderSupport, setScreenReaderSupport] = useState(false);
  const [easyReadMode, setEasyReadMode] = useState(false);
  const [updatesRequested, setUpdatesRequested] = useState(false);
  const [kitRequested, setKitRequested] = useState(false);
  const [consent, setConsent] = useState(false);
  const intro = introductionCopy();

  const move = (next: number) => {
    setStep(next);
    onAnnounce(`${steps[next]}.`, soundEnabled || screenReaderSupport);
  };
  const selectLocale = (nextLocale: "es" | "en") => {
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
  };
  const finish = () => {
    if (!consent) return;
    onComplete({
      displayName: name.trim(),
      familyName: familyName.trim(),
      textScale,
      soundEnabled,
      translationEnabled,
      subtitlesEnabled,
      screenReaderSupport,
      easyReadMode,
    });
    onAnnounce(
      name.trim()
        ? `Hola, ${name.trim()}. Tu simulacro está listo.`
        : "Tu simulacro está listo.",
      soundEnabled || screenReaderSupport
    );
  };

  return (
    <section
      className={`kl-onboarding kl-text-${textScale} ${easyReadMode ? "kl-easy-read" : ""}`}
      aria-labelledby="onboarding-title"
    >
      <div className="kl-onboarding__topbar">
        <BrandSignature compact />
        <span>
          {step + 1} de {steps.length}
        </span>
      </div>
      <div
        className="kl-onboarding__progress"
        aria-label={`Paso ${step + 1} de ${steps.length}`}
      >
        {steps.map((label, index) => (
          <span
            key={label}
            className={index <= step ? "is-active" : ""}
            aria-hidden="true"
          />
        ))}
      </div>

      <main className="kl-onboarding__content">
        {step === 0 ? (
          <div className="kl-onboarding__welcome">
            <BrandSignature />
            <h1 id="onboarding-title">
              Tu día en orden.
              <br />
              Tu bienestar más claro.
            </h1>
            <p>
              KurevaLife es más que una app. Es un espacio para registrar,
              organizar y comprender mejor tu bienestar, con total privacidad y
              autonomía.
            </p>
            <KurevaButton
              type="button"
              variant="primary"
              onClick={() => move(1)}
            >
              Comenzar simulacro <ArrowRight size={18} aria-hidden="true" />
            </KurevaButton>
            <a className="kl-button kl-button--secondary" href={publicPath()}>
              Conocer Kureva <ArrowRight size={18} aria-hidden="true" />
            </a>
            <p className="kl-onboarding__notice">
              <Info size={16} aria-hidden="true" /> Nota: Este es un simulacro
              interactivo. No se guardarán datos reales.
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">INTRODUCCIÓN AL SIMULACRO</p>
            <h1 id="onboarding-title">{intro.title}</h1>
            <p>{intro.greeting}</p>
            <p>{intro.exploration}</p>
            <p>{intro.humanized}</p>
            <p>{intro.origin}</p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">INCLUSIÓN Y ACCESIBILIDAD</p>
            <h1 id="onboarding-title">Somos completamente inclusivos</h1>
            <p>
              KurevaLife está diseñada para que la puedas usar de la forma que
              mejor se adapte a ti.
            </p>
            <div className="kl-onboarding__inclusion-grid">
              <button
                type="button"
                className={screenReaderSupport ? "is-selected" : ""}
                onClick={() => setScreenReaderSupport(value => !value)}
                aria-pressed={screenReaderSupport}
              >
                <Eye size={21} aria-hidden="true" />
                <strong>Personas con discapacidad visual</strong>
                <span>
                  Pantallas optimizadas de lectura, alto contraste y narración
                  por voz.
                </span>
              </button>
              <button
                type="button"
                className={subtitlesEnabled ? "is-selected" : ""}
                onClick={() => setSubtitlesEnabled(value => !value)}
                aria-pressed={subtitlesEnabled}
              >
                <Volume2 size={21} aria-hidden="true" />
                <strong>Personas con discapacidad auditiva</strong>
                <span>
                  Apoyo visual con subtítulos, gráficos claros y videos
                  explicativos.
                </span>
              </button>
              <div>
                <strong>Mayores de 18 años</strong>
                <span>
                  Contenido y funciones adaptados a tus necesidades de salud.
                </span>
              </div>
              <div>
                <strong>Modo familiar</strong>
                <span>
                  Ideal para la gestión y acompañamiento de la salud de las
                  personas cercanas.
                </span>
              </div>
            </div>
            <p className="kl-onboarding__closing">
              Tu comodidad y accesibilidad son nuestra prioridad.
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <form
            className="kl-onboarding__story"
            onSubmit={event => {
              event.preventDefault();
              move(4);
            }}
          >
            <p className="kl-eyebrow">REGISTRO</p>
            <h1 id="onboarding-title">Cuéntanos un poco sobre ti</h1>
            <p className="kl-onboarding__form-note">
              <LockKeyhole size={16} aria-hidden="true" /> Estos datos son solo
              para personalizar tu experiencia en el simulacro.
            </p>
            <fieldset className="kl-onboarding__choice">
              <legend>Idioma</legend>
              <div>
                <button
                  type="button"
                  className={locale === "es" ? "is-selected" : ""}
                  onClick={() => selectLocale("es")}
                  aria-pressed={locale === "es"}
                >
                  Español
                </button>
                <button
                  type="button"
                  className={locale === "en" ? "is-selected" : ""}
                  onClick={() => selectLocale("en")}
                  aria-pressed={locale === "en"}
                >
                  English
                </button>
              </div>
            </fieldset>
            <label className="kl-field">
              <span>Nombre</span>
              <input
                value={name}
                onChange={event => setName(event.target.value)}
                maxLength={80}
                autoComplete="given-name"
              />
            </label>
            <label className="kl-field">
              <span>Apellidos</span>
              <input
                value={familyName}
                onChange={event => setFamilyName(event.target.value)}
                maxLength={80}
                autoComplete="family-name"
              />
            </label>
            <label className="kl-field">
              <span>Correo electrónico</span>
              <input type="email" autoComplete="email" />
            </label>
            <label className="kl-field">
              <span>Teléfono (opcional)</span>
              <span className="kl-phone-field">
                <b>+34</b>
                <input type="tel" autoComplete="tel" aria-label="Teléfono" />
              </span>
            </label>
            <fieldset className="kl-onboarding__choice">
              <legend>Tamaño de texto</legend>
              <div>
                {(["normal", "grande", "muy-grande"] as TextScale[]).map(
                  option => (
                    <button
                      key={option}
                      type="button"
                      className={textScale === option ? "is-selected" : ""}
                      onClick={() => setTextScale(option)}
                      aria-pressed={textScale === option}
                    >
                      {option === "muy-grande"
                        ? "Muy grande"
                        : option[0].toUpperCase() + option.slice(1)}
                    </button>
                  )
                )}
              </div>
            </fieldset>
            <KurevaButton type="submit" variant="accent">
              Siguiente <ArrowRight size={18} aria-hidden="true" />
            </KurevaButton>
          </form>
        ) : null}

        {step === 4 ? (
          <div className="kl-onboarding__story">
            <p className="kl-eyebrow">CONFIGURACIÓN</p>
            <h1 id="onboarding-title">Preferencias y permisos</h1>
            <div className="kl-onboarding__settings">
              <label>
                <strong>Sonido</strong>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={event => setSoundEnabled(event.target.checked)}
                  role="switch"
                  aria-label="Sonido"
                />
              </label>
              <label>
                <strong>Traducción en línea</strong>
                <input
                  type="checkbox"
                  checked={translationEnabled}
                  onChange={event =>
                    setTranslationEnabled(event.target.checked)
                  }
                  role="switch"
                  aria-label="Traducción en línea"
                />
              </label>
              <label>
                <strong>Modo de lectura fácil</strong>
                <input
                  type="checkbox"
                  checked={easyReadMode}
                  onChange={event => setEasyReadMode(event.target.checked)}
                  role="switch"
                  aria-label="Modo de lectura fácil"
                />
              </label>
            </div>
            <fieldset className="kl-onboarding__permission-list">
              <legend>¿Qué te gustaría recibir de Kureva?</legend>
              <p>Selecciona las que quieras.</p>
              <label>
                <input
                  type="checkbox"
                  checked={updatesRequested}
                  onChange={event => setUpdatesRequested(event.target.checked)}
                />
                Recibir novedades y lanzamientos.
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={kitRequested}
                  onChange={event => setKitRequested(event.target.checked)}
                />
                Recibir kit de lanzamiento.
              </label>
            </fieldset>
            <p className="kl-onboarding__reassurance">
              <strong>Tranquilidad Kureva:</strong> No te preocupes, Kureva no
              será la tóxica que te escriba todo el tiempo. Solo te enviaremos
              lo estrictamente relevante. 😉
            </p>
            <label className="kl-onboarding__consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={event => setConsent(event.target.checked)}
              />
              <span>
                Acepto los términos y condiciones y la política de privacidad.
              </span>
            </label>
          </div>
        ) : null}
      </main>

      {step > 0 ? (
        <footer className="kl-onboarding__actions">
          <KurevaButton
            type="button"
            variant="quiet"
            onClick={() => move(step - 1)}
          >
            <ArrowLeft size={18} aria-hidden="true" /> Volver
          </KurevaButton>
          {step === 1 || step === 2 ? (
            <KurevaButton
              type="button"
              variant="accent"
              onClick={() => move(step + 1)}
            >
              {step === 1 ? "Comenzar" : "Continuar"}{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </KurevaButton>
          ) : null}
          {step === 4 ? (
            <KurevaButton
              type="button"
              variant="accent"
              onClick={finish}
              disabled={!consent}
            >
              Finalizar <Check size={18} aria-hidden="true" />
            </KurevaButton>
          ) : null}
        </footer>
      ) : null}
    </section>
  );
}

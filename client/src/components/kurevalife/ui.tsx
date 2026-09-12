import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Check, ChevronRight, Sparkles } from "lucide-react";

export function KurevaMark({
  size = "md",
  label = "KurevaLife",
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  return (
    <span className={`kl-mark kl-mark--${size}`} aria-label={label} role="img">
      <span className="kl-mark__orbit" aria-hidden="true" />
      <img
        className="kl-mark__image"
        src={`${import.meta.env.BASE_URL}kureva-app-icon.svg`}
        alt=""
      />
    </span>
  );
}

export function BrandSignature({ compact = false }: { compact?: boolean }) {
  return (
    <div className="kl-brand-signature">
      <KurevaMark size={compact ? "sm" : "md"} />
      <span>
        <strong>KurevaLife</strong>
        <small>BY KUREVA</small>
      </span>
    </div>
  );
}

type ButtonVariant = "primary" | "accent" | "secondary" | "quiet";

export function KurevaButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={`kl-button kl-button--${variant} ${className}`}
    >
      {children}
    </button>
  );
}

export function KurevaCard({
  children,
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section className={`kl-card ${className}`} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="kl-section-heading">
      <div>
        {eyebrow ? <p className="kl-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LocalStatus({
  state = "Guardado localmente",
}: {
  state?: "Guardado localmente" | "Sincronización futura" | "Offline";
}) {
  return (
    <span className="kl-local-status">
      <span aria-hidden="true" />
      {state}
    </span>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="kl-empty-state">
      <span className="kl-empty-state__icon" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ProgressRing({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div
      className="kl-progress-ring"
      style={{ "--kl-progress": `${percentage * 3.6}deg` } as CSSProperties}
      aria-label={`${percentage}% del día completado`}
      role="img"
    >
      <div>
        <strong>{percentage}%</strong>
        <span>
          {completed} de {total || 0}
        </span>
      </div>
    </div>
  );
}

export function RoutineRow({
  title,
  detail,
  completed,
  onToggle,
}: {
  title: string;
  detail: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className={`kl-routine-row ${completed ? "is-completed" : ""}`}
      type="button"
      onClick={onToggle}
      aria-pressed={completed}
    >
      <span className="kl-routine-row__check" aria-hidden="true">
        {completed ? <Check size={16} strokeWidth={3} /> : null}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ChevronRight aria-hidden="true" size={18} />
    </button>
  );
}

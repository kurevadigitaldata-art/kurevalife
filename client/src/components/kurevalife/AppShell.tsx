import type { ReactNode } from "react";
import { BarChart3, ClipboardPlus, Home, UserRound } from "lucide-react";
import type { KurevaTab } from "./types";
import { BrandSignature, KurevaMark, LocalStatus } from "./ui";

const navItems: { id: KurevaTab; label: string; Icon: typeof Home }[] = [
  { id: "hoy", label: "Hoy", Icon: Home },
  { id: "registrar", label: "Registrar", Icon: ClipboardPlus },
  { id: "informes", label: "Informes", Icon: BarChart3 },
  { id: "perfil", label: "Perfil", Icon: UserRound },
];

export function AppShell({
  activeTab,
  onTabChange,
  userName,
  children,
  nightMode,
  largeText,
  highContrast,
}: {
  activeTab: KurevaTab;
  onTabChange: (tab: KurevaTab) => void;
  userName: string;
  children: ReactNode;
  nightMode: boolean;
  largeText: boolean;
  highContrast: boolean;
}) {
  return (
    <div
      id="kurevalife-app"
      className={`kl-app-shell ${nightMode ? "kl-theme-night" : ""} ${largeText ? "kl-text-large" : ""} ${highContrast ? "kl-high-contrast" : ""}`}
    >
      <a className="kl-skip-link" href="#contenido-kurevalife">
        Saltar al contenido
      </a>
      <header className="kl-app-header">
        <div className="kl-app-header__brand">
          <BrandSignature compact />
          <span className="kl-app-header__tester">Simulacro para testers</span>
        </div>
        <div className="kl-app-header__status">
          <LocalStatus />
          <span className="kl-app-header__hello">
            Hola, {userName || "amiga"}
          </span>
        </div>
      </header>

      <main id="contenido-kurevalife" className="kl-app-content" tabIndex={-1}>
        {children}
      </main>

      <nav className="kl-bottom-nav" aria-label="Navegación principal">
        {navItems.map(({ id, label, Icon }) => {
          const selected = activeTab === id;
          return (
            <button
              type="button"
              key={id}
              className={`kl-bottom-nav__item ${selected ? "is-active" : ""}`}
              onClick={() => onTabChange(id)}
              aria-current={selected ? "page" : undefined}
            >
              <Icon
                aria-hidden="true"
                size={21}
                strokeWidth={selected ? 2.6 : 2}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="kl-kivi-launcher"
        aria-label="Abrir Kivi, asistente de organización"
        disabled
      >
        <KurevaMark
          size="sm"
          label="Kivi estará disponible en la siguiente fase"
        />
        <span>Kivi</span>
      </button>
    </div>
  );
}

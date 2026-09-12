import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));
const Calculator = lazy(() => import("./pages/Calculator"));
const Resources = lazy(() => import("./pages/Resources"));
const KurevaLife = lazy(() => import("./pages/KurevaLife"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routerBase =
  import.meta.env.BASE_URL === ""
    ? ""
    : import.meta.env.BASE_URL.replace(/\/$/, "");

function RouteLoadingState() {
  return (
    <main className="min-h-screen bg-[#F5F1E7] px-5 py-8 text-[#173A2E]">
      <p role="status" aria-live="polite" aria-busy="true">
        Cargando KurevaLife…
      </p>
    </main>
  );
}

function AppRouter() {
  return (
    <Router base={routerBase}>
      <Suspense fallback={<RouteLoadingState />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/calculadora"} component={Calculator} />
          <Route path={"/recursos"} component={Resources} />
          <Route path={"/kurevalife"} component={KurevaLife} />
          <Route path={"/vida"} component={KurevaLife} />
          <Route
            path={"/functions/v1/kurevalife-piloto"}
            component={KurevaLife}
          />
          <Route
            path={"/functions/v1/kurevalife-piloto/vida"}
            component={KurevaLife}
          />
          <Route path={"/404"} component={NotFound} />
          {/* A static CDN URL can include the GitHub folder path before /vida. */}
          <Route
            component={() =>
              window.location.pathname.includes("/vida") ? (
                <KurevaLife />
              ) : (
                <NotFound />
              )
            }
          />
        </Switch>
      </Suspense>
    </Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

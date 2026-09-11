import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Resources from "./pages/Resources";
import KurevaLife from "./pages/KurevaLife";


const routerBase = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRouter() {
  return (
    <Router base={routerBase}>
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/calculadora"} component={Calculator} />
      <Route path={"/recursos"} component={Resources} />
      <Route path={"/kurevalife"} component={KurevaLife} />
      <Route path={"/vida"} component={KurevaLife} />
      <Route path={"/functions/v1/kurevalife-piloto"} component={KurevaLife} />
      <Route path={"/functions/v1/kurevalife-piloto/vida"} component={KurevaLife} />
      <Route path={"/404"} component={NotFound} />
      {/* A static CDN URL can include the GitHub folder path before /vida. */}
      <Route component={() => window.location.pathname.includes("/vida") ? <KurevaLife /> : <NotFound />} />
    </Switch>
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

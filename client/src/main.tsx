import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function loadConfiguredAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim().replace(
    /\/$/,
    ""
  );
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();
  if (!endpoint || !websiteId) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${endpoint}/umami`;
  script.dataset.websiteId = websiteId;
  document.head.append(script);
}

loadConfiguredAnalytics();
createRoot(document.getElementById("root")!).render(<App />);

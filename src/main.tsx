import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/space-grotesk/wght.css";
import "@fontsource-variable/public-sans/wght.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/planner.css";
import "./styles/extensions.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

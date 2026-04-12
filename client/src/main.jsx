import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AccessibilityProvider } from "./context/AccessibilityContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AccessibilityProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AccessibilityProvider>
  </ThemeProvider>,
);

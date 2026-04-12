import { createContext, useState, useEffect, useRef } from "react";

export const AccessibilityContext = createContext();

const MIN = 14;
const MAX = 24;
const DEFAULT = 17;

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("abilitymap-fontsize");
    return saved ? parseInt(saved, 10) : DEFAULT;
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("abilitymap-highcontrast") === "true";
  });

  // ── READ PAGE STATE ──────────────────────────────────────
  // utteranceRef: Stores the "speech" object so we can track it
  // isSpeaking: Boolean to toggle button icons/text in the UI
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  /**
   * readPage (WCAG 1.1.1 / 4.1.2)
   * Uses Web Speech API to read the content of #main-content.
   * Includes a toggle to stop speech if called while active.
   */
  const readPage = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Targets the main content area specifically to avoid reading the nav/footer
    const main = document.getElementById("main-content");
    const text = main?.innerText || "";

    if (!text) return; // Safety check

    const utterance = new SpeechSynthesisUtterance(text);

    // Listeners to reset state when the voice finishes or hits an error
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Cleanup: Stop speaking if the user closes the site or navigates away
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);
  // ──────────────────────────────────────────────────────────────

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("abilitymap-fontsize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("abilitymap-highcontrast", highContrast);
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        isDefault: fontSize === DEFAULT,
        sliderPct: Math.round(((fontSize - MIN) / (MAX - MIN)) * 100),
        increase: () => setFontSize((p) => Math.min(MAX, p + 1)),
        decrease: () => setFontSize((p) => Math.max(MIN, p - 1)),
        reset: () => setFontSize(DEFAULT),
        highContrast,
        toggleHighContrast: () => setHighContrast((p) => !p),
        // Exporting the new speech tools
        isSpeaking,
        readPage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

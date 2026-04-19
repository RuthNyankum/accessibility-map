import { createContext, useState, useEffect, useRef } from "react";

export const AccessibilityContext = createContext();

const MIN = 14;
const MAX = 24;
const DEFAULT = 17;

export function AccessibilityProvider({ children }) {
  // ── Font size ────────────────────────────────────────────────────────────
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("abilitymap-fontsize");
    return saved ? parseInt(saved, 10) : DEFAULT;
  });

  // ── High contrast ────────────────────────────────────────────────────────
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("abilitymap-highcontrast") === "true";
  });

  // ── Speech ───────────────────────────────────────────────────────────────
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Tracks exactly who is speaking:
  // "page"         — the Read Page button in AccessibilityBar
  // "card-{id}"    — a specific card, e.g. "card-1", "card-2"
  // null           — nothing is speaking
  const [speakingId, setSpeakingId] = useState(null);

  const utteranceRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("abilitymap-fontsize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("abilitymap-highcontrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // ── Core speak engine ────────────────────────────────────────────────────
  // id: "page" | "card-{serviceId}" — unique identifier of the caller
  const speak = (text, id) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingId(null);

    if (!text?.trim()) return;

    // Split at sentence boundaries — fixes Chrome 250-word cutoff bug
    const chunks = text
      .replace(/([.!?])\s+/g, "$1|")
      .split("|")
      .filter(Boolean);

    let index = 0;

    const speakNext = () => {
      if (index >= chunks.length) {
        setIsSpeaking(false);
        setSpeakingId(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[index]);
      u.lang = "en-GH";
      u.rate = 0.95;
      u.onend = () => {
        index++;
        speakNext();
      };
      u.onerror = () => {
        setIsSpeaking(false);
        setSpeakingId(null);
      };
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
      if (index === 0) {
        setIsSpeaking(true);
        setSpeakingId(id);
      }
    };

    speakNext();
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSpeakingId(null);
  };

  // ── readPage — AccessibilityBar ──────────────────────────────────────────
  const readPage = () => {
    if (isSpeaking && speakingId === "page") {
      stopSpeaking();
      return;
    }
    const text =
      document.getElementById("main-content")?.innerText?.trim() || "";
    speak(text, "page");
  };

  // ── readText — CardReadButton ────────────────────────────────────────────
  // cardId must be unique per card — use service.id
  const readText = (text, cardId) => {
    const id = `card-${cardId}`;
    if (isSpeaking && speakingId === id) {
      stopSpeaking();
      return;
    }
    speak(text, id);
  };

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

        isSpeaking,
        speakingId, // exposed so each CardReadButton can check its own id
        readPage,
        readText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

import { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

// Font size scale — maps to actual px values applied on <html>
const FONT_SIZES = {
  normal: "17px",
  large: "20px",
  xlarge: "23px",
};

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("fontSize") || "normal";
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem("highContrast") === "true";
  });

  // Apply font size — your CSS inherits from html root
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    document.documentElement.style.fontSize = FONT_SIZES[fontSize];
    document.documentElement.setAttribute("data-font-size", fontSize);
  }, [fontSize]);

  // Apply high contrast — adds class to <html> for CSS targeting
  useEffect(() => {
    localStorage.setItem("highContrast", highContrast);
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 1. Honour saved user preference
    const saved = localStorage.getItem("abilitymap-theme");
    if (saved) return saved === "dark";
    // 2. Fall back to OS preference (WCAG 1.4.3 support)
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Tailwind darkMode: 'class' — toggle "dark" on <html>
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("abilitymap-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Also listen for OS theme changes at runtime
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      // Only auto-follow OS if the user hasn't saved a manual preference
      if (!localStorage.getItem("abilitymap-theme")) {
        setIsDark(e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);
  console.log("Current theme state:", isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

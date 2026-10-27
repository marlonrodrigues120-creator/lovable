import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ThemeContext = createContext<{ dark: boolean; toggleTheme: () => void } | undefined>(undefined);
const storageKey = "salesflow-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem(storageKey) === "dark");
    } catch { /* Keep light mode when storage is unavailable. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem(storageKey, dark ? "dark" : "light");
    } catch { /* Theme still works without browser storage. */ }
  }, [dark, ready]);

  return <ThemeContext.Provider value={{ dark, toggleTheme: () => setDark((value) => !value) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("useTheme requires ThemeProvider");
  return theme;
}
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

type ThemeStore = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const actual = theme === "system" ? getSystemTheme() : theme;
  root.classList.remove("light", "dark");
  root.classList.add(actual);
};

export const useThemeStore = create<ThemeStore>()(
  subscribeWithSelector((set, get) => {
    // Always start with identical values on server and client
    const initialState = {
      theme: "system" as Theme,
      resolvedTheme: "light" as "light" | "dark",
      setTheme: (theme: Theme) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("theme", theme);
          applyTheme(theme);
        }
        set({
          theme,
          resolvedTheme: theme === "system" ? getSystemTheme() : theme,
        });
      },
    };

    // Client-side hydration logic
    if (typeof window !== "undefined") {
      // Use requestAnimationFrame to ensure this runs after React hydration
      requestAnimationFrame(() => {
        const savedTheme = (localStorage.getItem("theme") as Theme) || "system";
        const actualResolved =
          savedTheme === "system" ? getSystemTheme() : savedTheme;

        applyTheme(savedTheme);

        set({
          theme: savedTheme,
          resolvedTheme: actualResolved,
        });

        // System change listener
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = (e: MediaQueryListEvent) => {
          const currentTheme = get().theme;
          if (currentTheme === "system") {
            const newResolved = e.matches ? "dark" : "light";
            document.documentElement.classList.remove("light", "dark");
            document.documentElement.classList.add(newResolved);
            set({ resolvedTheme: newResolved });
          }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
      });
    }

    return initialState;
  })
);

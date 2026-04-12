const root = document.documentElement;
const KEY = "theme";

function applyTheme(theme: string) {
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  document.getElementById("sun-desktop")?.classList.toggle("hidden", !isDark);
  document.getElementById("moon-desktop")?.classList.toggle("hidden", isDark);
  document.getElementById("sun-mobile")?.classList.toggle("hidden", !isDark);
  document.getElementById("moon-mobile")?.classList.toggle("hidden", isDark);
}

const saved = localStorage.getItem(KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved ?? (prefersDark ? "dark" : "light"));

["theme-toggle-desktop", "theme-toggle-mobile"].forEach(id => {
  document.getElementById(id)?.addEventListener("click", () => {
    const isDark = root.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem(KEY, next);
    applyTheme(next);
  });
});
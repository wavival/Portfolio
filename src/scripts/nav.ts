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

const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("icon-open");
const iconClose = document.getElementById("icon-close");

function openMenu() {
  menu?.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  iconOpen?.classList.add("hidden");
  iconClose?.classList.remove("hidden");
}

function closeMenu() {
  menu?.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
  iconOpen?.classList.remove("hidden");
  iconClose?.classList.add("hidden");
}

btn?.addEventListener("click", () => {
  const isOpen = menu?.classList.contains("opacity-100");
  isOpen ? closeMenu() : openMenu();
});

menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});
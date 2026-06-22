const root = document.documentElement;
const KEY = "theme";

function syncIcons(isDark: boolean) {
  document.getElementById("sun-desktop")?.classList.toggle("hidden", !isDark);
  document.getElementById("moon-desktop")?.classList.toggle("hidden", isDark);
  document.getElementById("sun-mobile")?.classList.toggle("hidden", !isDark);
  document.getElementById("moon-mobile")?.classList.toggle("hidden", isDark);

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isDark ? "#0f1117" : "#f0f4ff");

  const isEn = root.lang === "en";
  const label = isDark
    ? isEn
      ? "Switch to light theme"
      : "Cambiar a tema claro"
    : isEn
      ? "Switch to dark theme"
      : "Cambiar a tema oscuro";
  ["theme-toggle-desktop", "theme-toggle-mobile"].forEach((id) =>
    document.getElementById(id)?.setAttribute("aria-label", label)
  );
}

function toggleTheme() {
  const next = root.classList.contains("dark") ? "light" : "dark";
  const isDark = next === "dark";
  root.classList.toggle("dark", isDark);
  localStorage.setItem(KEY, next);
  syncIcons(isDark);
}

// Re-bind on every View Transitions navigation: the toggle buttons are new DOM nodes each page.
function initTheme() {
  syncIcons(root.classList.contains("dark"));
  ["theme-toggle-desktop", "theme-toggle-mobile"].forEach((id) =>
    document.getElementById(id)?.addEventListener("click", toggleTheme)
  );
}

document.addEventListener("astro:page-load", initTheme);

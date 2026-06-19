const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("icon-open");
const iconClose = document.getElementById("icon-close");

const labelOpen = btn?.dataset.labelOpen ?? "Abrir menú de navegación";
const labelClose = btn?.dataset.labelClose ?? "Cerrar menú de navegación";

function getFocusable(): HTMLElement[] {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
}

function openMenu() {
  menu?.removeAttribute("inert");
  menu?.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  iconOpen?.classList.add("hidden");
  iconClose?.classList.remove("hidden");
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", labelClose);
  getFocusable()[0]?.focus();
}

function closeMenu(restoreFocus = true) {
  menu?.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
  menu?.setAttribute("inert", "");
  iconOpen?.classList.remove("hidden");
  iconClose?.classList.add("hidden");
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", labelOpen);
  if (restoreFocus) btn?.focus();
}

function isOpen() {
  return menu?.classList.contains("opacity-100") ?? false;
}

// Start closed and non-focusable for keyboard users.
menu?.setAttribute("inert", "");

btn?.addEventListener("click", () => {
  if (isOpen()) closeMenu();
  else openMenu();
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu(false));
});

document.addEventListener("keydown", (e) => {
  if (!isOpen()) return;
  if (e.key === "Escape") {
    closeMenu();
    return;
  }
  if (e.key === "Tab") {
    const focusable = getFocusable();
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

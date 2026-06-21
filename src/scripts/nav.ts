// Elements are queried at call time, not captured once: with View Transitions the
// NavBar is replaced on each navigation, so cached references would go stale.
function el(id: string) {
  return document.getElementById(id);
}

function getFocusable(): HTMLElement[] {
  const menu = el("mobile-menu");
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
}

function labels() {
  const btn = el("menu-btn");
  return {
    open: btn?.dataset.labelOpen ?? "Abrir menú de navegación",
    close: btn?.dataset.labelClose ?? "Cerrar menú de navegación",
  };
}

function openMenu() {
  const menu = el("mobile-menu");
  const btn = el("menu-btn");
  menu?.removeAttribute("inert");
  menu?.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  el("icon-open")?.classList.add("hidden");
  el("icon-close")?.classList.remove("hidden");
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", labels().close);
  getFocusable()[0]?.focus();
}

function closeMenu(restoreFocus = true) {
  const menu = el("mobile-menu");
  const btn = el("menu-btn");
  menu?.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
  menu?.setAttribute("inert", "");
  el("icon-open")?.classList.remove("hidden");
  el("icon-close")?.classList.add("hidden");
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", labels().open);
  if (restoreFocus) btn?.focus();
}

function isOpen() {
  return el("mobile-menu")?.classList.contains("opacity-100") ?? false;
}

// Per-page wiring: start closed and bind the toggle + link handlers to the new nodes.
function initNav() {
  el("mobile-menu")?.setAttribute("inert", "");
  el("menu-btn")?.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });
  el("mobile-menu")
    ?.querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => closeMenu(false)));
}

// Document-level key handler is bound once (module runs once); it re-queries the DOM.
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

document.addEventListener("astro:page-load", initNav);

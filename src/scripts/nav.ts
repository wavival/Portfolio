const btn = document.getElementById("menu-btn");
const menu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("icon-open");
const iconClose = document.getElementById("icon-close");

function openMenu() {
  menu?.classList.remove("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
  iconOpen?.classList.add("hidden");
  iconClose?.classList.remove("hidden");
  btn?.setAttribute("aria-expanded", "true");
  btn?.setAttribute("aria-label", "Cerrar menú de navegación");
}

function closeMenu() {
  menu?.classList.add("opacity-0", "pointer-events-none", "translate-y-2");
  menu?.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
  iconOpen?.classList.remove("hidden");
  iconClose?.classList.add("hidden");
  btn?.setAttribute("aria-expanded", "false");
  btn?.setAttribute("aria-label", "Abrir menú de navegación");
}

btn?.addEventListener("click", () => {
  const isOpen = menu?.classList.contains("opacity-100");
  isOpen ? closeMenu() : openMenu();
});

menu?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

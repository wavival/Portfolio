import { ui, defaultLang, type Lang } from "./ui";

export type { Lang } from "./ui";

/** Detect the active language from the URL path (/en/... → en, otherwise es). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split("/");
  if (seg === "en") return "en";
  return defaultLang as Lang;
}

/** Translator bound to a language, with safe fallback to the default language. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Target URL for the language toggle.
 * EN pages always strip the /en prefix back to their existing ES origin.
 * ES pages map to the EN home (only the home has an EN counterpart for now;
 * extend this when more /en/* content pages exist).
 */
export function getAltLangUrl(url: URL): { href: string; lang: Lang } {
  const path = url.pathname;
  if (getLangFromUrl(url) === "en") {
    const stripped = path.replace(/^\/en(\/|$)/, "/");
    return { href: stripped, lang: "es" };
  }
  return { href: "/en", lang: "en" };
}

/** Per-locale CV filename. */
export function cvHref(lang: Lang, base: string): string {
  const file = lang === "en" ? "cv_valentina_ramirez_en.pdf" : "cv_valentina_ramirez.pdf";
  return `${base}${file}`;
}

/** Home path for a language. */
export function homeHref(lang: Lang): string {
  return lang === "en" ? "/en" : "/";
}

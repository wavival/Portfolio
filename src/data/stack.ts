export interface StackCategory {
  category: string;
  description: string;
  tools: string[];
  /** Longer rationale shown on the /uses page. */
  why?: string;
}

export const stack: StackCategory[] = [
  {
    category: "Backend",
    description: "La columna vertebral de cada producto.",
    tools: ["Python", "Django", "Django REST Framework", "PostgreSQL", "JWT"],
    why: "Django + DRF me dan velocidad sin sacrificar estructura: ORM maduro, admin de fábrica y un ecosistema que cubre auth, permisos y migraciones. PostgreSQL para modelado relacional serio; JWT para autenticación desacoplada entre API y frontend.",
  },
  {
    category: "Frontend",
    description: "Interfaces que completan el producto.",
    tools: ["React", "TypeScript", "Astro", "Tailwind CSS", "JavaScript"],
    why: "React + TypeScript para apps con estado y lógica de cliente; Astro cuando lo que manda es rendimiento y HTML estático. Tailwind para mantener consistencia visual sin pelear con CSS global.",
  },
  {
    category: "Design & UX",
    description: "Productos que se ven bien y cualquiera puede usar.",
    tools: ["UX/UI", "Figma", "Accesibilidad (a11y)", "SEO técnico", "Web Performance"],
    why: "Diseño en Figma antes de escribir código. Accesibilidad y SEO técnico no son extras: son parte de que el producto funcione para personas y para buscadores. El rendimiento es una feature.",
  },
  {
    category: "Product Engineering",
    description: "Arquitectura que escala desde el primer commit.",
    tools: [
      "Arquitectura de software",
      "PWAs",
      "Offline-first",
      "APIs REST",
      "Multitenancy",
      "Modelado relacional",
    ],
    why: "Decido la arquitectura pensando en el segundo año, no solo en el MVP. Multitenancy, offline-first y APIs limpias son decisiones que se pagan caras si se dejan para después.",
  },
  {
    category: "Security",
    description: "Mentalidad ofensiva para escribir código defensivo.",
    tools: ["OWASP", "MITRE ATT&CK", "PTES", "Linux", "AppSec"],
    why: "Hago pentesting para entender cómo se rompe un sistema y escribir código que no se rompa así. OWASP Top 10 como checklist mínimo; seguridad desde el diseño, no parcheada al final.",
  },
  {
    category: "AI Integrations",
    description: "IA como copiloto real, no como atajo.",
    tools: ["Claude API", "LLM Workflows", "Prompt Engineering", "n8n"],
    why: "Integro Claude API donde aporta valor real — análisis, asistencia con contexto — no como decoración. n8n para automatizar flujos. La IA acelera; no reemplaza el criterio de ingeniería.",
  },
];

export interface ProjectLink {
  href: string;
  text: string;
  ariaLabel: string;
}

export interface Project {
  title: string;
  slug: string;
  tag: string;
  tagColor: "green" | "blue" | "orange" | "gray";
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  stack: string[];
  problem: string;
  solution: string;
  architecture?: string[];
  links: ProjectLink[];
  /** When true, this project gets its own /projects/<slug> case-study page. */
  caseStudy?: boolean;
  /** Meta description for the case-study page (150–160 chars). */
  metaDescription?: string;
  /** Outcomes. Placeholder entries marked [Completar] are for Valentina to fill — never fabricate metrics. */
  results?: string[];
  /** What the build taught. Placeholder entries marked [Completar] are for Valentina to fill. */
  learnings?: string[];
}

export const projects: Project[] = [
  {
    title: "TerraCore",
    slug: "terracore",
    tag: "Live",
    tagColor: "green",
    image: "images/og-terracore.webp",
    imageAlt:
      "Dashboard de TerraCore: métricas en tiempo real, gráficas de producción y distribución de ganado",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "JWT", "React", "TypeScript", "Tailwind CSS"],
    problem:
      "El agro colombiano toma decisiones por experiencia, no por datos. Las operaciones en Excel generan sobreprecio del 15–30% en compras de urgencia, pérdida de insumos por falta de rotación y cero visibilidad sobre qué lote es rentable.",
    solution:
      "TerraCore digitaliza la operación agropecuaria completa en una sola plataforma multitenancy.",
    architecture: [
      "Arquitectura multitenancy: cada organización opera en su propio espacio de datos aislado sobre una sola instancia del backend.",
      "API REST con Django REST Framework, autenticación JWT y control de acceso por rol (admin, operador, colaborador).",
      "Módulos MVP: inventario de insumos con rotación automática, registro de producción por lote, salud animal, control básico de costos y dashboard en tiempo real.",
      "Modelado relacional complejo en PostgreSQL: organizaciones, usuarios, animales, lotes, insumos y registros de producción.",
      "Frontend en React + TypeScript consumiendo la API propia; diseño responsivo con Tailwind CSS.",
    ],
    links: [
      { href: "https://terracoreapp.co", text: "Ver sitio", ariaLabel: "Ver sitio de TerraCore" },
      {
        href: "https://app.terracoreapp.co/login",
        text: "Ver demo",
        ariaLabel: "Ver demo de TerraCore",
      },
    ],
    caseStudy: true,
    metaDescription:
      "Caso de estudio de TerraCore: plataforma multitenancy para el agro construida con Django, DRF, PostgreSQL y React. Arquitectura, decisiones técnicas y resultados.",
    results: [
      "Operación agropecuaria completa centralizada en una plataforma, reemplazando el flujo en Excel.",
      "[Completar: métrica de adopción — nº de organizaciones / lotes gestionados en producción].",
      "[Completar: impacto medible — reducción real de sobreprecio o pérdida de insumos tras el despliegue].",
    ],
    learnings: [
      "El aislamiento de datos multitenant condiciona cada decisión de modelado: definir el límite de tenant temprano evita reescrituras.",
      "[Completar: una decisión técnica que cambiarías o validarías con lo aprendido].",
    ],
  },
  {
    title: "Root",
    slug: "root",
    tag: "En desarrollo",
    tagColor: "orange",
    image: "images/og-root.webp",
    imageAlt:
      "Root: PWA con scanner de etiquetas por IA y perfil de restricciones alimentarias",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "React", "TypeScript", "Claude API", "PWA"],
    problem:
      "Comer con celiaquía, diabetes o intolerancia a la lactosa implica leer cada etiqueta, descifrar ingredientes escondidos bajo otros nombres y buscar recetas que cumplan varias restricciones a la vez.",
    solution:
      "Root consolida eso en una PWA con scanner de etiquetas por IA, recetas curadas bajo reglas estrictas y diario offline.",
    architecture: [
      "PWA offline-first con Service Workers: el diario de consumo funciona sin conexión y sincroniza al recuperarla.",
      "Scanner de etiquetas por IA: el usuario fotografía un producto y Claude API analiza los ingredientes contra su perfil de restricciones activo.",
      "Perfil de salud persistente que condiciona todas las respuestas del modelo (celiaquía, diabetes tipo 2, intolerancia a la lactosa — combinables).",
      "Sistema de recetas curadas con filtrado estricto por múltiples condiciones simultáneas.",
      "Backend en Django REST Framework + PostgreSQL; frontend en React + TypeScript.",
    ],
    links: [
      {
        href: "https://wavival.dev/root/",
        text: "Ver demo",
        ariaLabel: "Ver demo de Root",
      },
    ],
    caseStudy: true,
    metaDescription:
      "Caso de estudio de Root: PWA offline-first con scanner de etiquetas por IA (Claude API) para celíacos, diabéticos e intolerantes a la lactosa. Arquitectura y decisiones.",
    results: [
      "Scanner de etiquetas funcional: el usuario fotografía un producto y Claude API analiza los ingredientes contra su perfil de restricciones activo, incluso cuando varias condiciones aplican a la vez.",
      "Diario de consumo operativo sin conexión gracias al diseño offline-first; los registros se persisten en local y sincronizan al recuperar la red.",
      "En desarrollo: el núcleo —perfil de salud persistente, scanner por IA y recetas con filtrado estricto— ya está construido sobre Django REST Framework, PostgreSQL y React; el trabajo en curso es endurecer la sincronización y ampliar el catálogo curado.",
    ],
    learnings: [
      "Offline-first no es una capa que se añade al final: condiciona el modelo de sincronización desde el primer endpoint y obliga a resolver conflictos de datos en vez de asumir una única fuente de verdad.",
      "Para que las respuestas del modelo sean fiables, el perfil de salud no puede ir solo en el prompt: tratar las restricciones como estado persistente y verificable —y no como contexto que se pierde entre peticiones— es lo que evita falsos seguros al combinar celiaquía, diabetes e intolerancia a la lactosa.",
    ],
  },
  {
    title: "NullBreach",
    slug: "nullbreach",
    tag: "Live",
    tagColor: "green",
    image: "images/og-nullbreach.webp",
    imageAlt:
      "NullBreach: análisis estático de código contra OWASP Top 10 y chat de seguridad con IA",
    imageWidth: 1200,
    imageHeight: 630,
    stack: ["Django", "DRF", "PostgreSQL", "JWT", "Claude API", "React", "TypeScript", "Astro"],
    problem:
      "Revisar código con criterio OWASP o resolver una duda puntual de ciberseguridad implica saltar entre scanners pesados, documentación dispersa y foros desactualizados.",
    solution:
      "NullBreach consolida eso en una app fullstack con análisis de código contra OWASP Top 10 y chat de IA con contexto persistente.",
    architecture: [
      "Motor de análisis estático de fragmentos de código: detecta SQL injection, XSS, hardcoded secrets, manejo inseguro de errores y otras vulnerabilidades del OWASP Top 10.",
      "Chat de IA integrado via Claude API con contexto persistente de conversación e historial por usuario almacenado en base de datos.",
      "Autenticación JWT con endpoints protegidos; respuestas paginadas.",
      "Arquitectura desacoplada: backend en Django REST Framework + PostgreSQL, frontend en Astro + React + TypeScript.",
    ],
    links: [
      {
        href: "https://wavival.dev/nullbreach/",
        text: "Ver demo",
        ariaLabel: "Ver demo de NullBreach",
      },
      {
        href: "https://github.com/wavival/nullbreach-api",
        text: "Ver repositorio",
        ariaLabel: "Ver repositorio de NullBreach",
      },
    ],
    caseStudy: true,
    metaDescription:
      "Caso de estudio de NullBreach: app fullstack con análisis estático OWASP Top 10 y chat de IA (Claude API) con contexto persistente. Django, DRF, React y Astro.",
    results: [
      "Análisis estático en producción que detecta vulnerabilidades del OWASP Top 10 —SQL injection, XSS, hardcoded secrets y manejo inseguro de errores, entre otras— sobre fragmentos de código pegados por el usuario.",
      "Chat de seguridad con contexto e historial persistente por usuario: la conversación retiene el hilo entre mensajes en lugar de empezar de cero en cada consulta.",
      "Acceso protegido con autenticación JWT y respuestas paginadas, sobre un backend Django REST Framework + PostgreSQL desacoplado de un frontend en Astro + React.",
    ],
    learnings: [
      "Combinar análisis estático determinista con un LLM exige separar lo que el motor afirma con certeza de lo que el modelo sugiere: presentarlos como una sola respuesta erosiona la confianza en un producto de seguridad.",
      "Desacoplar el backend de Django del frontend en Astro impuso un contrato de API explícito desde el inicio; esa frontera obligó a pensar paginación, autenticación JWT y persistencia del historial como parte del diseño, no como añadidos posteriores.",
    ],
  },
  {
    title: "Lúmina W",
    slug: "lumina-w",
    tag: "Live",
    tagColor: "green",
    image: "images/lumina-w.webp",
    imageAlt: "Landing de Lúmina W: hero con tagline de marca y llamado a la acción",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Astro", "Tailwind CSS", "Formspree"],
    problem:
      "Toda empresa necesita una presencia digital que comunique con claridad quién es y qué hace.",
    solution:
      "Diseñé e implementé la landing completa de Lúmina W: arquitectura con Astro, estilos con Tailwind CSS, formulario de contacto integrado con Formspree, SEO técnico completo y deploy continuo.",
    architecture: [
      "Sitio estático con Astro: estructura de componentes reutilizables, rutas y build optimizado.",
      "SEO técnico: title, meta-description, og:*, twitter:*, canonical y schema markup.",
      "Formulario de contacto sin backend propio usando Formspree.",
      "Diseño responsivo con Tailwind CSS y modo claro/oscuro.",
    ],
    links: [{ href: "https://luminaw.co", text: "Ver sitio", ariaLabel: "Ver sitio de Lúmina W" }],
  },
  {
    title: "Forgotten Portal",
    slug: "forgotten-portal",
    tag: "Laboratorio",
    tagColor: "gray",
    image: "images/forgotten-portal.webp",
    imageAlt: "Forgotten Portal — laboratorio de pentesting (DockerLabs)",
    imageWidth: 1280,
    imageHeight: 853,
    stack: ["Nmap", "Gobuster", "Netcat", "Python", "MITRE ATT&CK", "PTES", "Linux", "DockerLabs"],
    problem:
      "¿Qué tan vulnerable es un sistema mal configurado ante un atacante con acceso inicial mínimo?",
    solution:
      "Ejercicio completo de pentesting ofensivo sobre máquina virtual en DockerLabs, documentado con metodología PTES y TTPs mapeados a MITRE ATT&CK.",
    architecture: [
      "Reconocimiento con Nmap (puertos, servicios, versiones) y Gobuster (directorios expuestos).",
      "Explotación de upload PHP sin validación (CWE-434) para ejecutar código remoto.",
      "Reverse shell con Netcat y escalada de privilegios a root.",
      "Vulnerabilidades clasificadas: CWE-615, CWE-434, CWE-312, CWE-321, CWE-269.",
      "Writeup completo publicado con metodología PTES y TTPs de MITRE ATT&CK.",
    ],
    links: [
      {
        href: "https://blog.luminaw.co/forgotten-portal-pentesting-dockerlabs/",
        text: "Ver writeup",
        ariaLabel: "Ver writeup de Forgotten Portal",
      },
      {
        href: "https://github.com/wavival/forgotten-portal-writeup",
        text: "Ver repositorio",
        ariaLabel: "Ver repositorio de Forgotten Portal",
      },
    ],
  },
];

export const caseStudies = projects.filter((p) => p.caseStudy);

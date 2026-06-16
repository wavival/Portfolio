export interface Writeup {
  title: string;
  lab: string;
  difficulty: string;
  summary: string;
  methodology: string;
  vulns: string[];
  tools: string[];
  href: string;
  hrefLabel: string;
  repo?: string;
}

export const writeups: Writeup[] = [
  {
    title: "Forgotten Portal",
    lab: "DockerLabs",
    difficulty: "Iniciación",
    summary:
      "Pentest completo sobre una máquina vulnerable: del reconocimiento inicial a root, documentado con metodología PTES y TTPs mapeados a MITRE ATT&CK.",
    methodology:
      "Reconocimiento → enumeración → explotación de upload PHP sin validación → reverse shell → escalada de privilegios a root.",
    vulns: ["CWE-615", "CWE-434", "CWE-312", "CWE-321", "CWE-269"],
    tools: ["Nmap", "Gobuster", "Netcat", "Python", "Linux", "PTES", "MITRE ATT&CK"],
    href: "https://blog.luminaw.co/forgotten-portal-pentesting-dockerlabs/",
    hrefLabel: "Leer el writeup completo",
    repo: "https://github.com/wavival/forgotten-portal-writeup",
  },
];

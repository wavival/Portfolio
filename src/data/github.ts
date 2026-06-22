export interface GithubUser {
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

const GH_HEADERS = { Accept: "application/vnd.github.v3+json" };

/**
 * Build-time fetch of a public GitHub profile plus its most recent non-fork repos.
 * Unauthenticated (GitHub allows ~60 req/h per IP), so it fails soft: any network
 * error or rate-limit returns nulls, the build never breaks, and the widget simply
 * does not render that build. No client-side JS and no token required.
 */
export async function fetchGithubProfile(
  username: string,
  count = 6
): Promise<{ user: GithubUser | null; repos: GithubRepo[] }> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers: GH_HEADERS }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12&type=public`, {
        headers: GH_HEADERS,
      }),
    ]);

    const user = userRes.ok ? ((await userRes.json()) as GithubUser) : null;

    let repos: GithubRepo[] = [];
    if (reposRes.ok) {
      const all = (await reposRes.json()) as GithubRepo[];
      repos = Array.isArray(all) ? all.filter((r) => !r.fork).slice(0, count) : [];
    }

    return { user, repos };
  } catch {
    return { user: null, repos: [] };
  }
}

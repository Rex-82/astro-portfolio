import { GITHUB_USERNAME } from 'astro:env/server';
import type { Repository } from '../interfaces/github';
import fallbackSnapshot from '../data/github-projects.snapshot.json';

const CACHE_TTL_MS = 60 * 60 * 1000; // 1h

interface CacheEntry {
	data: Repository[];
	fetchedAt: number;
}

let cache: CacheEntry | null = null;

function isFresh(entry: CacheEntry): boolean {
	return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

function filterAndSort(repos: Repository[]): Repository[] {
	return repos
		.filter((r) => !r.fork && r.description !== null && r.topics.length > 0)
		.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getProjects(): Promise<Repository[]> {
	if (cache && isFresh(cache)) {
		return cache.data;
	}

	try {
		const res = await fetch(
			`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
			{ headers: { Accept: 'application/vnd.github+json' } },
		);
		if (!res.ok) throw new Error(`GitHub API ${res.status}`);
		const raw = (await res.json()) as Repository[];
		const data = filterAndSort(raw);
		cache = { data, fetchedAt: Date.now() };
		return data;
	} catch (err) {
		console.error('[github] fetch failed, using snapshot fallback:', err);
		return filterAndSort(fallbackSnapshot as unknown as Repository[]);
	}
}

export async function getFeaturedProjects(slugs: string[]): Promise<Repository[]> {
	const all = await getProjects();
	const bySlug = new Map(all.map((r) => [r.name, r]));
	return slugs.map((s) => bySlug.get(s)).filter((r): r is Repository => r !== undefined);
}

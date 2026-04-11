#!/usr/bin/env tsx
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const user = process.env.GITHUB_USERNAME ?? 'Rex-82';

console.log(`Fetching repos for user: ${user}`);

const res = await fetch(
	`https://api.github.com/users/${user}/repos?per_page=100`,
	{ headers: { Accept: 'application/vnd.github+json' } },
);

if (!res.ok) {
	console.error(`GitHub API returned ${res.status}: ${res.statusText}`);
	process.exit(1);
}

const data = await res.json();
const out = resolve(__dirname, '../src/data/github-projects.snapshot.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
console.log(`Wrote ${out} (${data.length} repos)`);

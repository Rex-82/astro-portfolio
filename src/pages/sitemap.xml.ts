import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/blog';

const STATIC_ROUTES = ['/', '/blog/', '/contacts/', '/hub/'] as const;

const toIsoDate = (date?: Date) => date?.toISOString().split('T')[0];

const buildUrlEntry = (loc: string, lastmod?: string) => {
	const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
	return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
};

export const GET: APIRoute = async ({ site }) => {
	const siteOrigin = site?.origin ?? 'https://simoneferretti.dev';
	const posts = (await getPublishedPosts()).filter(
		(post) => !post.data.noindex,
	);
	const latestPostDate = posts[0]?.data.pubDate;

	const staticEntries = STATIC_ROUTES.map((path) =>
		buildUrlEntry(
			`${siteOrigin}${path}`,
			path === '/' || path === '/blog/' ? toIsoDate(latestPostDate) : undefined,
		),
	);
	const postEntries = posts.map((post) =>
		buildUrlEntry(
			`${siteOrigin}/blog/${post.id}/`,
			toIsoDate(post.data.updatedDate ?? post.data.pubDate),
		),
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

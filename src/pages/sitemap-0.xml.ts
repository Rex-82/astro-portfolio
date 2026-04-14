import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const FALLBACK_ORIGIN = 'https://simoneferretti.dev';

const STATIC_ROUTES = ['/', '/blog/', '/contacts/', '/projects/'] as const;

const toIsoDate = (date?: Date): string | undefined =>
	date ? date.toISOString().split('T')[0] : undefined;

const buildUrlEntry = (loc: string, lastmod?: string): string => {
	const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
	return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
};

export const GET: APIRoute = async ({ site }) => {
	const siteOrigin = site?.origin ?? FALLBACK_ORIGIN;

	const posts = (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	const latestPostDate = posts[0]?.data.pubDate;

	const staticEntries = STATIC_ROUTES.map((path) => {
		const isHomeOrBlog = path === '/' || path === '/blog/';
		return buildUrlEntry(
			`${siteOrigin}${path}`,
			isHomeOrBlog ? toIsoDate(latestPostDate) : undefined,
		);
	});

	const postEntries = posts.map((post) =>
		buildUrlEntry(
			`${siteOrigin}/blog/${post.id}/`,
			toIsoDate(post.data.updatedDate ?? post.data.pubDate),
		),
	);

	const urlset = [...staticEntries, ...postEntries].join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

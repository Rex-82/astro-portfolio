import type { APIRoute } from 'astro';
import { getPublishedPosts, publicSlug, translationFor } from '../lib/blog';
import { pathFor, postPath, type Locale } from '../i18n';

const staticPaths = ['', 'blog', 'contacts', 'hub'];
const locales: Locale[] = ['en', 'it'];
const isoDate = (date?: Date) => date?.toISOString().split('T')[0];
const escapeXml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
	const origin = site?.origin ?? 'https://simoneferretti.dev';
	const posts = (await getPublishedPosts()).filter(
		(post) => !post.data.noindex,
	);
	const latest = posts[0]?.data.pubDate;
	const entries: {
		path: string;
		lastmod?: string;
		alternatives: Partial<Record<Locale, string>>;
	}[] = [];
	for (const path of staticPaths)
		for (const locale of locales)
			entries.push({
				path: pathFor(locale, path),
				lastmod: !path || path === 'blog' ? isoDate(latest) : undefined,
				alternatives: { en: pathFor('en', path), it: pathFor('it', path) },
			});
	for (const post of posts) {
		const en = translationFor(posts, post, 'en');
		const it = translationFor(posts, post, 'it');
		entries.push({
			path: postPath(post.data.lang, publicSlug(post)),
			lastmod: isoDate(post.data.updatedDate ?? post.data.pubDate),
			alternatives: {
				...(en && { en: postPath('en', publicSlug(en)) }),
				...(it && { it: postPath('it', publicSlug(it)) }),
			},
		});
	}
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
	.map(
		({ path, lastmod, alternatives }) =>
			`  <url><loc>${escapeXml(origin + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${Object.entries(
				alternatives,
			)
				.map(
					([lang, url]) =>
						`<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(origin + url)}"/>`,
				)
				.join('')}</url>`,
	)
	.join('\n')}
</urlset>`;
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

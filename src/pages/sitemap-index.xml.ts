import type { APIRoute } from 'astro';

const FALLBACK_ORIGIN = 'https://simoneferretti.dev';

export const GET: APIRoute = async ({ site }) => {
	const siteOrigin = site?.origin ?? FALLBACK_ORIGIN;

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteOrigin}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};

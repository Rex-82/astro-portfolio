import type { APIRoute } from 'astro';

const body = `User-agent: *
Allow: /

Sitemap: https://simoneferretti.dev/sitemap-index.xml
`;

export const GET: APIRoute = () => {
	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600',
		},
	});
};

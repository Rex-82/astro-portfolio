import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	const method = context.request.method;

	// Trailing-slash 301 redirect
	// Exclude: root, paths with file extension, Astro internals, API routes
	if (
		(method === 'GET' || method === 'HEAD') &&
		pathname !== '/' &&
		!pathname.endsWith('/') &&
		!/\.[^/]+$/.test(pathname.split('/').pop() ?? '') &&
		!pathname.startsWith('/_astro/') &&
		!pathname.startsWith('/_server-islands/') &&
		!pathname.startsWith('/_actions/') &&
		!pathname.startsWith('/api/')
	) {
		return Response.redirect(pathname + '/' + context.url.search, 301);
	}

	const response = await next();

	// Security headers on all responses
	const h = response.headers;
	h.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
	h.set('x-content-type-options', 'nosniff');
	h.set('x-frame-options', 'SAMEORIGIN');
	h.set('referrer-policy', 'strict-origin-when-cross-origin');
	h.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
	h.set(
		'content-security-policy-report-only',
		"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://rybbit.rilae.com; connect-src 'self' https://rybbit.rilae.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
	);

	return response;
});

import type { APIRoute } from 'astro';
import { generateCover } from '../../lib/generate-cover';

export const GET: APIRoute = ({ params }) => {
	const id = params.id ?? '';

	if (!/^[a-z0-9-]+$/.test(id)) {
		return new Response('Invalid cover id', { status: 400 });
	}

	return new Response(generateCover(id), {
		headers: {
			'content-type': 'image/svg+xml; charset=utf-8',
			'cache-control': 'public, max-age=31536000, immutable',
			vary: 'accept-encoding',
		},
	});
};

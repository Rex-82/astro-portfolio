import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/blog';

export async function GET(context: APIContext) {
	const posts = (await getPublishedPosts()).filter(
		(post) => !post.data.noindex,
	);

	return rss({
		title: "Simone Ferretti's Blog",
		description:
			'Notes on web development, tooling, side projects, and things I am learning.',
		site: context.site!,
		customData: '<language>en-us</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/blog/${post.id}/`,
			author: 'Simone Ferretti',
			categories: post.data.tags,
		})),
	});
}

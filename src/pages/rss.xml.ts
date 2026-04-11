import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const posts = (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: "Simone Ferretti's Blog",
		description:
			'Thoughts on web development, tools, and side projects.',
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

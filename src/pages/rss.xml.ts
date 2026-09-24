import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, publicSlug } from '../lib/blog';
import { copy, postPath, type Locale } from '../i18n';

export async function feed(context: APIContext, locale: Locale) {
	const posts = (await getPublishedPosts()).filter(
		(post) => post.data.lang === locale && !post.data.noindex,
	);

	return rss({
		title: copy[locale].blog.name,
		description: copy[locale].blog.description,
		site: context.site!,
		customData: `<language>${locale === 'it' ? 'it-IT' : 'en-US'}</language>`,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: postPath(locale, publicSlug(post)),
			author: 'Simone Ferretti',
			categories: post.data.tags,
		})),
	});
}

export const GET = (context: APIContext) => feed(context, 'en');

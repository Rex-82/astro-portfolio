import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

export type Post = CollectionEntry<'blog'>;
export const publishedPosts = (posts: Post[]) =>
	posts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
export const publicSlug = (post: Post) =>
	post.id.replace(/^it\//, '').replace(/\/index$/, '');

export function validatePosts(posts: Post[]) {
	const keys = new Set<string>();
	const slugs = new Set<string>();
	const englishKeys = new Set(
		posts
			.filter((post) => post.data.lang === 'en')
			.map((post) => post.data.translationKey),
	);
	for (const post of posts) {
		if (post.data.lang === 'it' && !englishKeys.has(post.data.translationKey))
			throw new Error(
				`Italian translation has no English original: ${post.id}`,
			);
		const key = `${post.data.lang}:${post.data.translationKey}`;
		const slug = `${post.data.lang}:${publicSlug(post)}`;
		if (keys.has(key) || slugs.has(slug))
			throw new Error(`Duplicate blog translation or slug: ${post.id}`);
		keys.add(key);
		slugs.add(slug);
	}
}

export function postsForLocale(posts: Post[], locale: Locale): Post[] {
	posts = publishedPosts(posts);
	const byKey = new Map<string, Post>();
	for (const post of posts.filter((p) => p.data.lang === 'en'))
		byKey.set(post.data.translationKey, post);
	if (locale === 'it')
		for (const post of posts.filter((p) => p.data.lang === 'it'))
			byKey.set(post.data.translationKey, post);
	return [...byKey.values()].sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export const translationFor = (posts: Post[], post: Post, locale: Locale) =>
	posts.find(
		(p) =>
			p.data.translationKey === post.data.translationKey &&
			p.data.lang === locale,
	);

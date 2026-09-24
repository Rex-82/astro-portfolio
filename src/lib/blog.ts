import { getCollection } from 'astro:content';

import { publishedPosts, validatePosts } from './blog-model';
const WORDS_PER_MINUTE = 200;
export {
	publicSlug,
	postsForLocale,
	translationFor,
	validatePosts,
} from './blog-model';
export type { Post } from './blog-model';

export async function getPublishedPosts() {
	const posts = publishedPosts(await getCollection('blog'));
	validatePosts(posts);
	return posts;
}

export function getReadingStats(markdown: string) {
	const wordCount = markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;

	return {
		wordCount,
		readingTime: Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE)),
	};
}

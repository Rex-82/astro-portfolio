import { getCollection } from 'astro:content';

const WORDS_PER_MINUTE = 200;

export async function getPublishedPosts() {
	return (await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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

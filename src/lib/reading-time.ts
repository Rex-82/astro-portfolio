const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(markdown: string): number {
	const words = markdown
		.replace(/```[\s\S]*?```/g, ' ') // strip fenced code blocks
		.replace(/`[^`]*`/g, ' ') // strip inline code
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // strip images
		.split(/\s+/)
		.filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

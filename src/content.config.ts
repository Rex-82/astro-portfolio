import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			lang: z.enum(['en', 'it']),
			translationKey: z.string().min(1),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			noindex: z.boolean().default(false),
			tldr: z.string().min(20).max(280).optional(),
			coverImage: image().optional(),
		}),
});

export const collections = { blog };

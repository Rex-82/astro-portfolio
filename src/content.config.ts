import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			coverImage: image().optional(),
		}),
});

const caseStudies = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			project: z.string(),
			date: z.coerce.date(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			coverImage: image().optional(),
		}),
});

export const collections = { blog, caseStudies };

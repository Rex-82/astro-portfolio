import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/blog';

const HEADER = `# Simone Ferretti

> Product Engineer building agentic systems and the infrastructure they need to not fall over. Personal portfolio and blog at simoneferretti.dev.

Simone Ferretti is a Product Engineer building digital products, agentic systems, and the infrastructure behind them. This site hosts his portfolio, contact links, and a blog with notes on web development, tooling, side projects, and things he is currently learning.

## Site

- [Home](https://simoneferretti.dev/): Simone's profile and latest writing.
- [Blog](https://simoneferretti.dev/blog/): Articles on web development, tools, side projects, and language learning notes.
- [Contacts](https://simoneferretti.dev/contacts/): Professional contact links (GitHub, LinkedIn, email).
- [Hub](https://simoneferretti.dev/hub/): Personal index with bio, links, projects, and interests.

The main pages are also available in Italian at [/it/](https://simoneferretti.dev/it/), including the [blog index](https://simoneferretti.dev/it/blog/), [contacts](https://simoneferretti.dev/it/contacts/), and [personal index](https://simoneferretti.dev/it/hub/). Blog articles have Italian URLs only when translated.

## Feeds

- [RSS feed](https://simoneferretti.dev/rss.xml): Full blog feed in RSS 2.0.
- [Italian RSS feed](https://simoneferretti.dev/it/rss.xml): Published Italian translations only.
- [Sitemap](https://simoneferretti.dev/sitemap.xml): XML sitemap for all indexable pages.

## Social

- [GitHub](https://github.com/Rex-82)
- [LinkedIn](https://www.linkedin.com/in/simoneferretti)`;

export const GET: APIRoute = async () => {
	const posts = await getPublishedPosts();

	const postsSection =
		posts.length > 0
			? `\n\n## Posts\n\n` +
				posts
					.map(
						(p) =>
							`- [${p.data.title}](https://simoneferretti.dev/blog/${p.id}/) | ${p.data.description}`,
					)
					.join('\n')
			: '';

	const body = HEADER + postsSection + '\n';

	return new Response(body, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=3600',
		},
	});
};

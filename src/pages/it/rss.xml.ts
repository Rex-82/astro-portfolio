import type { APIContext } from 'astro';
import { feed } from '../rss.xml';

export const GET = (context: APIContext) => feed(context, 'it');

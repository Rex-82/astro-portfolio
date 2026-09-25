import { getRelativeLocaleUrl } from 'astro:i18n';

export type Locale = 'en' | 'it';

const en = {
	nav: {
		home: 'Home',
		blog: 'Blog',
		contacts: 'Contacts',
		main: 'Main navigation',
		language: 'Language',
		limited: 'This article is available in English only.',
		otherIndex: 'Browse the Italian blog',
	},
	common: {
		skip: 'Skip to content',
		role: 'Product Engineer',
		rss: "Simone Ferretti's Blog",
		inEnglish: 'In English',
	},
	home: {
		title: 'Simone Ferretti | Product Engineer',
		description:
			'Product Engineer building agentic systems and the infrastructure they need to not fall over. TypeScript, Next.js, NestJS, PostgreSQL.',
		intro: 'I build systems and the infrastructure they need to not fall over.',
		now: 'Now & elsewhere',
		building: 'Building',
		buildingText: 'Homelab and music app.',
		learning: 'Learning',
		learningText: 'Russian, past the awkward phase.',
		outside: 'Outside',
		outsideText: 'Weight lifting and vie ferrate in the Dolomites.',
		writing: 'Selected writing',
		allWriting: 'All writing',
		find: 'Find me elsewhere',
		note: 'SF — Field notes & ongoing work',
	},
	blog: {
		title: 'Blog | Simone Ferretti',
		description:
			'Thoughts on web development, tools, and side projects by Simone Ferretti.',
		intro: 'Thoughts on web development, tools, and side projects.',
		empty: 'No posts yet. Check back soon.',
		name: "Simone Ferretti's Blog",
		back: 'Blog',
		summary: 'Summary',
		footerLabel: 'Article footer',
		footer:
			'Enjoyed this post? Subscribe to the RSS feed to get future notes from Simone Ferretti.',
		more: 'More posts',
		cover: (title: string) => `Cover image for ${title}`,
		reading: (minutes: number) => `${minutes} min read`,
		updated: (date: string) => `(updated ${date})`,
	},
	contacts: {
		title: 'Contact | Simone Ferretti',
		description:
			'Get in touch with Simone Ferretti, Product Engineer. Find me on GitHub, LinkedIn, or by email. Open to interesting product and tooling projects.',
		eyebrow: '03 / Get in touch',
		heading: "Let's build something real.",
		intro: 'Open to interesting product and tooling projects.',
		section: 'Contact information',
		name: 'Contact Simone Ferretti',
	},
	hub: {
		title: 'Simone Ferretti | Hub',
		description:
			'Personal hub for Simone Ferretti, product engineer building systems and the infrastructure they need. Bio, links, projects, and interests.',
		shortDescription:
			'Personal hub for Simone Ferretti: bio, links, projects, and interests.',
		blocks: 'Hub blocks',
		intro: 'I build systems and the infrastructure they need to not fall over.',
		connect: 'Connect',
		code: 'Code',
		write: 'Write',
		read: 'Read',
		desk: 'Day to day',
		elsewhere: 'Elsewhere',
		deskItems: [
			'<strong>Internal tools</strong> and product flows.',
			'<strong>Homelab</strong> and <strong>music app</strong>.',
			'<strong>450m² / 4,843ft² garden</strong>.',
			'<strong>Drip coffee</strong>.',
		],
		elsewhereItems: [
			'<strong>Russian</strong>, past the awkward phase.',
			'<strong>Weight lifting</strong> and <strong>vie ferrate</strong> in the <strong>Dolomites</strong>.',
			'<strong>Cockatiel</strong> with strong opinions.',
		],
	},
	footer: { built: 'Built with intent.', hub: 'Personal index' },
};

const it: typeof en = {
	nav: {
		home: 'Home',
		blog: 'Blog',
		contacts: 'Contatti',
		main: 'Navigazione principale',
		language: 'Lingua',
		limited: 'Per ora questo articolo è solo in inglese.',
		otherIndex: 'Vai al blog in italiano',
	},
	common: {
		skip: 'Vai al contenuto',
		role: 'Product Engineer',
		rss: 'Blog di Simone Ferretti',
		inEnglish: 'Articolo in inglese',
	},
	home: {
		title: 'Simone Ferretti | Product Engineer',
		description:
			'Sono Simone Ferretti, Product Engineer. Lavoro su prodotti digitali, sistemi agentici e l’infrastruttura che li sostiene.',
		intro: 'Costruisco prodotti e i sistemi che li tengono in piedi.',
		now: 'In questo periodo',
		building: 'Costruendo',
		buildingText: 'Homelab e app musicale.',
		learning: 'Imparando',
		learningText: 'Russo, oltre la fase imbarazzante',
		outside: 'Fuori dal lavoro',
		outsideText: 'Weight lifting e vie ferrate nelle Dolomiti.',
		writing: 'Dal blog',
		allWriting: 'Tutti gli articoli',
		find: 'Contatti',
		note: 'SF — Appunti e progetti',
	},
	blog: {
		title: 'Blog | Simone Ferretti',
		description:
			'Appunti su software, progetti personali e cose che sto imparando.',
		intro:
			'Qui raccolgo appunti su software, progetti personali e cose che sto imparando.',
		empty: 'Non ho ancora pubblicato articoli.',
		name: 'Blog di Simone Ferretti',
		back: 'Blog',
		summary: 'In breve',
		footerLabel: 'Fine articolo',
		footer: 'Se vuoi leggere i prossimi articoli, trovi tutto nel feed RSS.',
		more: 'Altri articoli',
		cover: (title: string) => `Copertina di ${title}`,
		reading: (minutes: number) => `${minutes} min di lettura`,
		updated: (date: string) => `(aggiornato il ${date})`,
	},
	contacts: {
		title: 'Contatti | Simone Ferretti',
		description:
			'Se stai lavorando a un prodotto o a uno strumento, scrivimi. Mi trovi anche su GitHub e LinkedIn.',
		eyebrow: '03 / Contatti',
		heading: 'Parliamo di quello che stai costruendo.',
		intro: 'Se pensi che possa dare una mano al tuo progetto, scrivimi.',
		section: 'Dove trovarmi',
		name: 'Scrivi a Simone Ferretti',
	},
	hub: {
		title: 'Simone Ferretti | Su di me',
		description:
			'Qualche nota sul mio lavoro, i progetti personali e quello che mi interessa.',
		shortDescription: 'Lavoro, progetti personali e interessi.',
		blocks: 'Su di me e link',
		intro: 'Costruisco prodotti e i sistemi che li tengono in piedi.',
		connect: 'Dove trovarmi',
		code: 'Codice',
		write: 'Scrivimi',
		read: 'Da leggere',
		desk: 'Nel quotidiano',
		elsewhere: 'Fuori dal lavoro',
		deskItems: [
			'<strong>Strumenti interni</strong> e flussi di prodotto.',
			'<strong>Homelab</strong> e <strong>app musicale</strong>.',
			'<strong>Orto di 450 m²</strong>.',
			'<strong>Caffè filtrato</strong>.',
		],
		elsewhereItems: [
			'<strong>Russo</strong>, oltre la fase imbarazzante.',
			'<strong>Weight lifting</strong> e <strong>vie ferrate</strong> nelle <strong>Dolomiti</strong>.',
			'Una <strong>calopsitta</strong> dalle idee molto chiare.',
		],
	},
	footer: { built: 'Fatto con cura.', hub: 'Su di me' },
};

export const copy = { en, it };
export const pathFor = (locale: Locale, path = '') =>
	getRelativeLocaleUrl(locale, path.replace(/^\/+|\/+$/g, ''));
export const postPath = (locale: Locale, slug: string) =>
	pathFor(locale, `blog/${slug}`);
export const rssPath = (locale: Locale) =>
	locale === 'it' ? '/it/rss.xml' : '/rss.xml';
export const formatDate = (
	date: Date,
	locale: Locale,
	style: 'short' | 'long' = 'short',
) =>
	new Intl.DateTimeFormat(
		locale === 'it' ? 'it-IT' : style === 'short' ? 'en-GB' : 'en-US',
		style === 'short'
			? { day: '2-digit', month: 'short', year: 'numeric' }
			: { day: 'numeric', month: 'long', year: 'numeric' },
	).format(date);

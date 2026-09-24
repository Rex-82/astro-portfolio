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
		eyebrow: 'Independent practice / Personal index',
		intro: 'I build systems and the infrastructure they need to not fall over.',
		now: 'Now & elsewhere',
		building: 'Building',
		buildingText:
			'A homelab quietly running my life, and a music player built for how I listen.',
		learning: 'Learning',
		learningText: 'Russian, past the awkward phase. Chinese, still in it.',
		outside: 'Outside',
		outsideText: 'Lifting and via ferrata in the Dolomites.',
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
			'Personal hub for Simone Ferretti, product engineer building systems and the infrastructure they need. Bio, social links, stack, and highlights.',
		shortDescription:
			'Personal hub for Simone Ferretti: bio, social links, stack, and highlights.',
		blocks: 'Hub blocks',
		intro: 'I build systems and the infrastructure they need to not fall over.',
		connect: 'Connect',
		code: 'Code',
		write: 'Write',
		read: 'Read',
		desk: 'On my desk',
		elsewhere: 'Elsewhere',
		stack: 'Tech Stack',
		deskItems: [
			'<strong>Payment infra</strong> between <strong>Italy</strong> and <strong>the US</strong>.',
			'<strong>Music player</strong> built for how I listen.',
			'<strong>Homelab</strong> quietly running my life.',
			'<strong>450m² / 4,843ft² garden</strong>.',
			'<strong>Drip coffee</strong>.',
		],
		elsewhereItems: [
			'<strong>Russian</strong>, past the awkward phase.',
			'<strong>Lifting</strong> and <strong>vie ferrate</strong> in the <strong>Dolomites</strong>.',
			'<strong>Chinese</strong>, in the awkward phase.',
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
		limited: 'Questo articolo è disponibile solo in inglese.',
		otherIndex: 'Vai al blog in italiano',
	},
	common: {
		skip: 'Vai al contenuto',
		role: 'Product Engineer',
		rss: 'Blog di Simone Ferretti',
		inEnglish: 'In inglese',
	},
	home: {
		title: 'Simone Ferretti | Product Engineer',
		description:
			'Product Engineer: costruisco sistemi agentici e le infrastrutture che li sostengono. TypeScript, Next.js, NestJS, PostgreSQL.',
		eyebrow: 'Lavoro indipendente / Indice personale',
		intro:
			'Costruisco sistemi e le infrastrutture necessarie per farli funzionare.',
		now: 'Ora e altrove',
		building: 'Progetti',
		buildingText:
			'Un homelab che gestisce la mia vita in silenzio e un lettore musicale costruito intorno al mio modo di ascoltare.',
		learning: 'Studio',
		learningText:
			'Russo, oltre le prime difficoltà. Cinese, ancora alle prime difficoltà.',
		outside: 'Fuori',
		outsideText: 'Pesi e vie ferrate nelle Dolomiti.',
		writing: 'Articoli scelti',
		allWriting: 'Tutti gli articoli',
		find: 'Dove trovarmi',
		note: 'SF — Appunti e lavori in corso',
	},
	blog: {
		title: 'Blog | Simone Ferretti',
		description:
			'Riflessioni di Simone Ferretti su sviluppo web, strumenti e progetti personali.',
		intro: 'Riflessioni su sviluppo web, strumenti e progetti personali.',
		empty: 'Nessun articolo per ora. Torna presto.',
		name: 'Blog di Simone Ferretti',
		back: 'Blog',
		summary: 'In breve',
		footerLabel: 'Fine articolo',
		footer:
			'Ti è piaciuto questo articolo? Iscriviti al feed RSS per leggere i prossimi appunti di Simone Ferretti.',
		more: 'Altri articoli',
		cover: (title: string) => `Copertina di ${title}`,
		reading: (minutes: number) => `${minutes} min di lettura`,
		updated: (date: string) => `(aggiornato il ${date})`,
	},
	contacts: {
		title: 'Contatti | Simone Ferretti',
		description:
			'Contatta Simone Ferretti, Product Engineer. Mi trovi su GitHub, LinkedIn o via email. Sono aperto a progetti interessanti di prodotto e strumenti.',
		eyebrow: '03 / Contatti',
		heading: 'Costruiamo qualcosa di concreto.',
		intro: 'Sono aperto a progetti interessanti di prodotto e strumenti.',
		section: 'Informazioni di contatto',
		name: 'Contatta Simone Ferretti',
	},
	hub: {
		title: 'Simone Ferretti | Indice personale',
		description:
			'Indice personale di Simone Ferretti: biografia, contatti, tecnologie e interessi.',
		shortDescription:
			'Biografia, contatti, tecnologie e interessi di Simone Ferretti.',
		blocks: 'Sezioni dell’indice personale',
		intro:
			'Costruisco sistemi e le infrastrutture necessarie per farli funzionare.',
		connect: 'Connettiti',
		code: 'Codice',
		write: 'Scrivimi',
		read: 'Leggi',
		desk: 'Sulla mia scrivania',
		elsewhere: 'Altrove',
		stack: 'Tecnologie',
		deskItems: [
			'<strong>Infrastruttura dei pagamenti</strong> tra <strong>Italia</strong> e <strong>Stati Uniti</strong>.',
			'<strong>Lettore musicale</strong> costruito intorno al mio modo di ascoltare.',
			'<strong>Homelab</strong> che gestisce la mia vita in silenzio.',
			'<strong>Giardino di 450 m²</strong>.',
			'<strong>Caffè filtro</strong>.',
		],
		elsewhereItems: [
			'<strong>Russo</strong>, oltre le prime difficoltà.',
			'<strong>Pesi</strong> e <strong>vie ferrate</strong> nelle <strong>Dolomiti</strong>.',
			'<strong>Cinese</strong>, ancora alle prime difficoltà.',
			'<strong>Calopsitta</strong> dal carattere deciso.',
		],
	},
	footer: { built: 'Costruito con cura.', hub: 'Indice personale' },
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

# Piano: Sezione Blog con ottimizzazione SEO

## Context

Il portfolio (simoneferretti.dev) è un sito Astro 4 SSR con 3 pagine (home, projects, contacts). Non ha content collections né supporto Markdown. L'utente vuole una sezione blog per condividere i propri pensieri, con SEO ottimizzata (meta tag dinamici, OG image per post, JSON-LD, RSS, URL canoniche).

## Approccio

Usare le **Content Collections** di Astro 4 con file `.md` (no MDX — serve solo Markdown puro per scrivere pensieri). Estendere `Layout.astro` con props SEO opzionali per evitare meta tag duplicati. Generare OG image dinamiche per ogni post via query param nell'endpoint esistente.

---

## Step 1: Dipendenze e configurazione

**Installa:**
```
pnpm add @astrojs/rss
```
> Solo RSS. Astro 4 supporta content collections e Markdown nativamente senza integrazioni aggiuntive.

**Modifica `astro.config.mjs`:**
- Aggiungere configurazione Shiki per syntax highlighting nei code block:
```js
markdown: { shikiConfig: { theme: 'github-dark' } }
```

## Step 2: Content Collection

**Crea `src/content/config.ts`:**
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

**Crea `src/content/blog/hello-world.md`** — post di esempio.

## Step 3: Estendere `Layout.astro` per SEO

**File: `src/layouts/Layout.astro`**

Aggiungere props opzionali (con default che preservano il comportamento attuale):
- `ogType?: string` → default `'website'`
- `ogDescription?: string` → default alla descrizione hardcoded esistente
- `ogImage?: string` → default a `/api/og`
- `canonicalUrl?: string` → render `<link rel="canonical">` se presente
- `jsonLd?: Record<string, unknown>` → render `<script type="application/ld+json">` se presente
- `articleMeta?: { publishedTime, modifiedTime?, tags?, author? }` → render `article:*` meta se presente

Aggiungere anche:
- `<link rel="alternate" type="application/rss+xml" ...>` per autodiscovery RSS

Le pagine esistenti non passano questi props → usano i default → nessun breaking change.

## Step 4: Layout BlogPost

**Crea `src/layouts/BlogPost.astro`:**
- Wrappa `Layout.astro` passando tutti i props SEO calcolati
- Genera JSON-LD `BlogPosting` con: headline, description, datePublished, dateModified, author, image, url, keywords
- Calcola `ogImage` con `?title=` per OG dinamica
- Calcola `canonicalUrl`
- Passa `ogType="article"`, `articleMeta` con published_time/tags
- Render: `<article>` con header (h1, date, tags) + `.prose` container per il contenuto
- Stili prose per il Markdown renderizzato: h2/h3, p, a, code, pre, blockquote, ul/ol, hr — coerenti con il dark theme del sito

## Step 5: Pagine blog

**Crea `src/pages/blog/index.astro`:**
- Segue il pattern di `projects.astro`
- `getCollection('blog')` filtrato per `!draft`, ordinato per `pubDate` desc
- Card list con titolo, descrizione, data, tags
- Stile coerente con le card di projects (box-shadow inset, border-radius, hover)

**Crea `src/pages/blog/[...slug].astro`:**
- In SSR mode: usa `getEntry('blog', Astro.params.slug)` per risolvere il post
- Render con `BlogPost` layout

## Step 6: OG Image dinamica

**Modifica `src/pages/api/og.js`:**
- Accettare parametro `?title=` dalla URL
- Se `title` presente → render immagine con titolo del post + "simoneferretti.dev"
- Se assente → comportamento attuale (nome + "full-stack developer")
- Escape HTML del titolo per sicurezza
- Troncare titoli > 100 caratteri

## Step 7: RSS Feed

**Crea `src/pages/rss.xml.ts`:**
- Usa `@astrojs/rss` con `getCollection('blog')`
- Title, description, items con link a `/blog/[slug]/`

## Step 8: Navigazione

**Modifica `src/components/Navbar.astro`:**
- Aggiungere `{ path: '/blog/', label: 'Blog' }` all'array links (tra Home e Projects)
- Cambiare il matching da `===` a `startsWith` per evidenziare "Blog" anche sulle sottopagine `/blog/[slug]/` (con eccezione per `/` che resta exact match)

## Step 9: CLAUDE.md

Aggiornare la documentazione per riflettere content collections, blog, RSS.

---

## File da creare (6)
| File | Scopo |
|------|-------|
| `src/content/config.ts` | Schema content collection |
| `src/content/blog/hello-world.md` | Post di esempio |
| `src/pages/blog/index.astro` | Lista post |
| `src/pages/blog/[...slug].astro` | Pagina singolo post |
| `src/layouts/BlogPost.astro` | Layout post con SEO |
| `src/pages/rss.xml.ts` | Feed RSS |

## File da modificare (4)
| File | Modifica |
|------|----------|
| `astro.config.mjs` | Shiki theme config |
| `src/layouts/Layout.astro` | Props SEO opzionali, RSS link |
| `src/components/Navbar.astro` | Link Blog, startsWith matching |
| `src/pages/api/og.js` | Parametro `?title=` per OG dinamiche |

## Ordine implementazione
1. `pnpm add @astrojs/rss` + `astro.config.mjs`
2. `src/content/config.ts` + post di esempio
3. `Layout.astro` (props SEO)
4. `BlogPost.astro` (layout + prose styles)
5. `blog/index.astro` (listing)
6. `blog/[...slug].astro` (post page)
7. `api/og.js` (OG dinamica)
8. `rss.xml.ts` (RSS)
9. `Navbar.astro` (navigazione)
10. Verifica + CLAUDE.md

## Verifica
1. `pnpm dev` → verificare che `/blog/` mostri il post di esempio
2. Navigare a `/blog/hello-world/` → verificare rendering, meta tag, JSON-LD
3. Ispezionare `<head>` per: og:type="article", og:image con ?title=, canonical, JSON-LD BlogPosting
4. `/api/og?title=Hello%20World` → verificare OG image con titolo del post
5. `/rss.xml` → verificare feed RSS valido
6. `/sitemap-index.xml` → verificare che le pagine blog siano incluse
7. Testare navbar su mobile (4 pills < 380px)

## Rischi noti
- **4 pill nella navbar su schermi < 380px**: potrebbe servire ridurre font-size/padding
- **Font path in og.js**: il codice usa `public/static/` ma i font sono in `public/assets/` — da verificare e correggere
- **SSR + getStaticPaths**: in SSR mode usare `getEntry()` direttamente invece di `getStaticPaths`

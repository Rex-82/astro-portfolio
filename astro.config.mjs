import { defineConfig } from 'astro/config';

import compress from 'astro-compress';

import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://simoneferretti.dev',
  integrations: [compress(), sitemap()],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
  },
});

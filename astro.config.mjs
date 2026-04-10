import { defineConfig } from 'astro/config';

import compress from 'astro-compress';

import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://simoneferretti.dev',
  integrations: [react(), compress(), sitemap()],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});

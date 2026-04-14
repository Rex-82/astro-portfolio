import { defineConfig, envField } from 'astro/config';

import compress from 'astro-compress';

import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://simoneferretti.dev',
  trailingSlash: 'always',
  integrations: [react(), compress()],
  output: 'server',

  adapter: node({
    mode: 'standalone',
  }),

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  env: {
    schema: {
      GITHUB_USERNAME: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'Rex-82',
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['lucide-react'],
    },
    build: {
      rollupOptions: {
        external: ['sharp'],
      },
    },
  },
});

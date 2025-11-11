import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: '200.html' // utile pour le SPA sur Apache
    }),
    alias: {
      $components: path.resolve('./src/components')
    },
    prerender: {
      crawl: true,
      entries: ['*'] // prérend toutes les routes
    }
  }
};

export default config;

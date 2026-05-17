// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://note.seonbiz.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
});

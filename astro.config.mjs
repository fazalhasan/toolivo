import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://toolivo.com',
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    })
  ],
  compressHTML: true,
  build: {
    format: 'directory' // Generates /image-compressor/index.html clean URLs for Google
  }
});

import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server',
  adapter: vercel(),

  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
    react(),
  ],

  server: {
    host: '::',
  },

  prefetch: true,

  // 如果你构建时报 sitemap 需要 site，就加上这一行：
  // site: 'https://anime-2nzz.vercel.app',
});

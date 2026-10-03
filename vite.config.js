import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { PUBLISHED_ARTICLES } from './src/data/insights.js'
import { PUBLISHED_PROJECTS } from './src/data/projects.js'

// Every indexable route. Case studies and articles come from src/data, so a
// new published entry is in the sitemap on the next build.
const STATIC_ROUTES = ['/', '/work', '/services', '/about', '/insights', '/gap-score', '/free-audit', '/contact', '/faq', '/privacy', '/terms']

/**
 * Writes robots.txt and sitemap.xml at build time from VITE_SITE_URL (.env),
 * so the live domain only has to be set in one place.
 */
function seoFiles(siteUrl) {
  return {
    name: 'brandgap-seo-files',
    apply: 'build',
    generateBundle() {
      const url = siteUrl.replace(/\/$/, '')
      const today = new Date().toISOString().slice(0, 10)
      const routes = [
        ...STATIC_ROUTES,
        ...PUBLISHED_PROJECTS.map((p) => `/work/${p.slug}`),
        ...PUBLISHED_ARTICLES.map((a) => `/insights/${a.slug}`),
      ]
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *
Allow: /

Sitemap: ${url}/sitemap.xml
`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url>\n    <loc>${url}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}
</urlset>
`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL || '')],
    build: {
      target: 'es2022',
      cssMinify: true,
      // The lazily loaded 3D chunk is three.js itself; it only loads on tablet/desktop.
      chunkSizeWarningLimit: 1000,
    },
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>
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

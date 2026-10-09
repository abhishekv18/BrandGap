import { useEffect } from 'react'
import { SITE } from '../data/site'

// Content Brief §15 — the homepage title, also the fallback for any page without its own.
const DEFAULT_TITLE = SITE.homeTitle

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export const absoluteUrl = (path = '/') => `${SITE.url}${path}`

/**
 * Per-page SEO: title, description, canonical, Open Graph / Twitter tags,
 * robots and page-level JSON-LD. index.html carries the homepage defaults for
 * crawlers that don't run JavaScript; this keeps them correct on every route.
 */
export function useSeo({ title, description = SITE.description, path = '/', image = SITE.ogImage, type = 'website', jsonLd, noindex = false }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE.name}` : DEFAULT_TITLE
    const url = absoluteUrl(path)
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    setCanonical(url)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', absoluteUrl(image))
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', absoluteUrl(image))

    const id = 'page-jsonld'
    document.getElementById(id)?.remove()
    if (ld) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = id
      script.textContent = ld
      document.head.appendChild(script)
    }
  }, [title, description, path, image, type, ld, noindex])
}

/** BreadcrumbList for inner pages: [{ name, path }]. */
export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

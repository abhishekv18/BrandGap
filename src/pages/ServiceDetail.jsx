import { useParams } from 'react-router'
import { EditorialBlocks } from '../components/EditorialBlocks'
import { MagneticButton } from '../components/MagneticButton'
import { PageHero } from '../components/PageHero'
import { findServicePage } from '../data/servicePages'
import { absoluteUrl, breadcrumbLd, useSeo } from '../hooks/useSeo'
import { FinalCta } from '../sections/FinalCta'
import NotFound from './NotFound'

/** /services/[slug] — a service with detailed content (Performance Marketing, Social Media). */
export default function ServiceDetail() {
  const { slug } = useParams()
  const page = findServicePage(slug)
  return page ? <Service key={page.slug} page={page} /> : <NotFound />
}

function Service({ page }) {
  const path = `/services/${page.slug}`

  useSeo({
    title: page.seo.title,
    description: page.seo.description,
    path,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: page.name,
        serviceType: page.name,
        description: page.seo.description,
        url: absoluteUrl(path),
        provider: { '@type': 'Organization', name: 'BrandGap', url: absoluteUrl('/') },
      },
      breadcrumbLd([
        { name: 'Services', path: '/services' },
        { name: page.name, path },
      ]),
    ],
  })

  const { hero } = page
  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Services', path: '/services' },
          { name: page.name, path },
        ]}
        lead={hero.lead}
        emphasis={hero.emphasis}
        intro={hero.intro}
        deep
      >
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8 md:justify-start">
          <MagneticButton href={hero.primary.href} cursor="start" trackAs={`service_${page.slug}_primary`}>
            {hero.primary.label}
          </MagneticButton>
          <MagneticButton href={hero.secondary.href} variant="text" trackAs={`service_${page.slug}_secondary`}>
            {hero.secondary.label}
          </MagneticButton>
        </div>
      </PageHero>

      {/* The header's deeper padding carries the space, so the paper texture has no seam */}
      <EditorialBlocks blocks={page.story} />

      <FinalCta numeral={null} headline={page.closing.headline} body={page.closing.body} />
    </>
  )
}

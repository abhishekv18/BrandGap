import { m } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CASE_FLOW } from '../data/projects'
import { track } from '../utils/analytics'
import { Copy } from './Copy'
import { MagneticButton } from './MagneticButton'
import { useSmoothScroll } from './SmoothScroll'

const EASE = [0.16, 1, 0.3, 1]

/** Keeps Tab inside an open dialog. */
export function trapTab(e, container) {
  if (e.key !== 'Tab' || !container) return
  const items = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]')
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

/**
 * "Expand to detail" (brief §4): the case study's flow in a side drawer,
 * with the way through to the full /work/[slug] page. Render inside
 * <AnimatePresence>. Modal: scroll locked, focus trapped, Escape closes,
 * focus returns to the button that opened it.
 */
export function CaseDrawer({ project, onClose }) {
  const panel = useRef(null)
  const { stop, start } = useSmoothScroll()

  useEffect(() => {
    const opener = document.activeElement
    stop()
    document.documentElement.style.overflow = 'hidden'
    panel.current?.focus()
    track('case_preview_open', { case_study: project.slug })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      trapTab(e, panel.current)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      start()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true })
    }
  }, [project.slug, onClose, start, stop])

  const titleId = `drawer-${project.slug}`

  return createPortal(
    <m.div className="fixed inset-0 z-[70]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <m.div
        aria-hidden
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full max-w-[40rem] flex-col overflow-y-auto overscroll-contain bg-cream outline-none"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-cream px-5 py-3 md:px-10">
          <p className="label text-ink-muted">
            <span className="text-terracotta">{project.index}</span> — Case preview
          </p>
          <button
            type="button"
            onClick={onClose}
            className="label inline-flex min-h-11 items-center gap-2 transition-colors hover:text-terracotta"
          >
            Close <X aria-hidden strokeWidth={1.5} className="size-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 pt-7 pb-8 md:px-10 md:pt-10">
          <span className="label self-start rounded-full border border-line px-3 py-1 text-[0.6875rem] text-ink-soft">
            <Copy value={project.category} tone="inherit" />
          </span>
          <h2 id={titleId} className="mt-5 text-h2">
            <Copy value={project.client} />
          </h2>
          <p className="mt-3 font-display text-h3 italic text-ink-soft">
            <Copy value={project.title} />
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5">
            {project.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col-reverse justify-end gap-1">
                <dt className="label text-[0.6875rem] text-ink-muted">
                  <Copy value={metric.label} tone="inherit" />
                </dt>
                <dd className="font-display text-xl md:text-2xl">
                  <Copy value={metric.value} />
                </dd>
              </div>
            ))}
          </dl>

          {/* The flow: a line draws down through the five steps */}
          <ol className="relative mt-8 flex flex-col gap-6 pl-8">
            <m.span
              aria-hidden
              className="absolute top-1.5 bottom-1.5 left-[3px] w-px origin-top bg-terracotta/60"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
            />
            {CASE_FLOW.map((step, i) => (
              <m.li
                key={step.id}
                className="relative"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.4 + i * 0.08 }}
              >
                <span
                  aria-hidden
                  className={`absolute top-1.5 -left-8 size-[7px] rounded-full ${i === CASE_FLOW.length - 1 ? 'bg-terracotta' : 'bg-ink'}`}
                />
                <p className="label text-terracotta">
                  0{i + 1} <span className="text-ink-muted">— {step.label}</span>
                </p>
                <p className="mt-2 text-ink-soft">
                  <Copy value={project.flow[step.id]} />
                </p>
              </m.li>
            ))}
          </ol>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
            <MagneticButton href={`/work/${project.slug}`} onClick={onClose} cursor="view" trackAs="drawer_full_case">
              Full case study
            </MagneticButton>
          </div>
        </div>
      </m.div>
    </m.div>,
    document.body,
  )
}

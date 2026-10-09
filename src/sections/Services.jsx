import { AnimatePresence, animate, m, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Copy } from '../components/Copy'
import { HoverPreview } from '../components/HoverPreview'
import { MagneticButton } from '../components/MagneticButton'
import { MaskReveal, Reveal } from '../components/Reveal'
import { SectionLabel } from '../components/SectionLabel'
import { SERVICES, SERVICES_CENTER, SERVICES_HEADING, SERVICES_INTRO } from '../data/services'
import { useCapabilities } from '../hooks/useCapabilities'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { numeralOf } from '../data/navigation'

const EASE = [0.16, 1, 0.3, 1]
const STEP = 360 / SERVICES.length

/**
 * Chapter III — What we do.
 * An editorial index of services beside a live diagram of the system:
 * Brand at the centre, each service a node on the ring. Choosing a service
 * turns the ring to bring it to the top and draws its line to the centre.
 */
export function Services() {
  const [active, setActive] = useState(0)
  const [rotation, setRotation] = useState(0)
  const [hovering, setHovering] = useState(false)
  const preview = useRef(null)
  const { tier, finePointer, reducedMotion } = useCapabilities()
  const withPreview = tier === 'desktop' && finePointer && !reducedMotion

  const select = (i) => {
    if (i === active) return
    // Turn the shortest way round.
    const target = -i * STEP
    let delta = (target - rotation) % 360
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    setRotation(rotation + delta)
    setActive(i)
  }

  return (
    <section id="services" aria-labelledby="services-title" className="container-page section-y text-center md:text-left">
      <div className="grid gap-heading-row md:grid-cols-12">
        <div className="md:col-span-8">
          <SectionLabel numeral={numeralOf('services')} name="What we do" />
          <h2 id="services-title" className="mt-5 text-h2 md:mt-7">
            <MaskReveal>{SERVICES_HEADING.lead}</MaskReveal>
            <MaskReveal delay={0.08} className="italic text-terracotta">
              {SERVICES_HEADING.emphasis}
            </MaskReveal>
          </h2>
        </div>
        <Reveal as="p" delay={0.15} className="self-end text-lead text-ink-soft md:col-span-4">
          {SERVICES_INTRO}
        </Reveal>
      </div>

      <div className="space-heading-content grid gap-columns md:grid-cols-12">
        <div className="md:sticky md:top-[18vh] md:col-span-5 md:self-start">
          <SystemDiagram active={active} rotation={rotation} />
          <ServiceDetail service={SERVICES[active]} index={active} />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ol
            className="border-t border-line"
            aria-label="Services"
            {...(withPreview && {
              onMouseEnter: () => setHovering(true),
              onMouseLeave: () => setHovering(false),
              onMouseMove: (e) => preview.current?.move(e),
            })}
          >
            {SERVICES.map((service, i) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={i}
                active={i === active}
                onSelect={() => select(i)}
              />
            ))}
          </ol>
          <div className="mt-8 flex justify-center md:justify-start">
            <MagneticButton href="/services" variant="text" trackAs="home_all_services">
              All services in detail
            </MagneticButton>
          </div>
        </div>
      </div>

      {withPreview && <HoverPreview ref={preview} items={SERVICES} active={active} visible={hovering} />}
    </section>
  )
}

function ServiceRow({ service, index, active, onSelect }) {
  const panelId = `service-${service.id}`
  return (
    <li className="border-b border-line">
      <h3 className="font-sans">
        <button
          type="button"
          aria-expanded={active}
          aria-controls={panelId}
          onClick={onSelect}
          onMouseEnter={onSelect}
          onFocus={onSelect}
          className="group flex min-h-11 w-full items-baseline justify-center gap-4 py-4 text-center md:justify-start md:gap-8 md:py-5 md:text-left"
        >
          <span className={`label tabular-nums transition-colors duration-500 ${active ? 'text-terracotta' : 'text-ink-muted'}`}>
            0{index + 1}
          </span>
          <span
            className={`font-display text-h3 tracking-[-0.02em] transition-[color,transform,font-style] duration-700 ease-(--ease-out-expo) ${
              active ? 'text-terracotta italic md:translate-x-2' : 'text-ink md:group-hover:translate-x-1'
            }`}
          >
            {service.name}
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {active && (
          <m.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden md:hidden"
          >
            <div className="grid gap-4 pb-6 md:grid-cols-2 md:gap-8 md:pl-16">
              <p className="font-display text-xl italic text-ink-soft">
                <Copy value={service.description} />
              </p>
              <ul className="flex flex-wrap justify-center gap-2">
                {service.includes.map((item, i) => (
                  <li key={i} className="label rounded-full border border-line px-3 py-1.5 text-[0.625rem]">
                    <Copy value={item} tone="inherit" />
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** Desktop: the chosen service's detail sits under the diagram, so the list never shifts under the pointer. */
function ServiceDetail({ service, index }) {
  return (
    <div className="mt-8 hidden min-h-60 border-t border-line pt-5 md:block" aria-live="polite">
      <AnimatePresence mode="wait">
        <m.div
          key={service.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="grid gap-4"
        >
          <p className="text-ink-soft">
            <span className="label mb-3 block text-terracotta">
              0{index + 1} — {service.name}
            </span>
            <span className="font-display text-xl italic text-ink">
              <Copy value={service.description} />
            </span>
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {service.includes.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span aria-hidden className="h-px w-3 bg-terracotta" />
                <Copy value={item} />
              </li>
            ))}
          </ul>
        </m.div>
      </AnimatePresence>
    </div>
  )
}

const R = 150 // ring radius in the 400×400 viewBox
const C = 200

/** The system: Brand at the centre, services on the ring. Leans toward the pointer. */
function SystemDiagram({ active, rotation }) {
  const reduced = useReducedMotion()
  const wrap = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const tiltX = useSpring(rx, { stiffness: 120, damping: 20 })
  const tiltY = useSpring(ry, { stiffness: 120, damping: 20 })

  // The ring's turn, applied as SVG transform attributes rather than CSS transforms:
  // iOS Safari misplaces CSS-rotated SVG text, which flung the labels off the ring.
  const angle = useMotionValue(rotation)
  const [turn, setTurn] = useState(rotation)
  useMotionValueEvent(angle, 'change', setTurn)
  useEffect(() => {
    const anim = animate(angle, rotation, reduced ? { duration: 0 } : { duration: 1.1, ease: EASE })
    return () => anim.stop()
  }, [angle, rotation, reduced])

  const onMove = (e) => {
    if (reduced || !wrap.current) return
    const r = wrap.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  // const activeName = SERVICES[active].name
const activeName = SERVICES[active].short
  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="mx-auto w-full max-w-[19rem] [perspective:900px] sm:max-w-[21rem] md:max-w-[26rem] xl:max-w-[28rem]"
      aria-hidden
    >
      <m.div style={{ rotateX: tiltX, rotateY: tiltY }} className="[transform-style:preserve-3d]">
        {/* <svg viewBox="0 0 400 400" className="w-full overflow-visible"> */}
        <svg viewBox="-30 0 460 400" className="w-full overflow-visible">
          {/* Ring */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line)" />
          <circle cx={C} cy={C} r={R - 36} fill="none" stroke="var(--color-line)" strokeDasharray="2 6" />

          {/* The active line always points straight up, where the ring brings the chosen node */}
          <m.line
            x1={C}
            y1={C - 58}
            x2={C}
            y2={C - R + 8}
            stroke="var(--color-terracotta)"
            strokeWidth={1.25}
            key={active}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          />

          <g transform={`rotate(${turn} ${C} ${C})`}>
            {SERVICES.map((s, i) => {
              const a = ((i * STEP - 90) * Math.PI) / 180
              const x = C + R * Math.cos(a)
              const y = C + R * Math.sin(a)
              const lx = C + (R + 34) * Math.cos(a)
              const ly = C + (R + 34) * Math.sin(a)
              const on = i === active
              return (
                <g key={s.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={on ? 7 : 4}
                    fill={on ? 'var(--color-terracotta)' : 'var(--color-cream)'}
                    stroke={on ? 'var(--color-terracotta)' : 'var(--color-ink)'}
                    strokeWidth={1}
                    style={{ transition: 'r 500ms, fill 500ms' }}
                  />
                  {/* Counter-rotated about its own anchor, so the label stays upright */}
                  <text
                    x={lx}
                    y={ly}
                    transform={`rotate(${-turn} ${lx} ${ly})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-sans text-[14px] tracking-[0.14em] uppercase ${on ? 'fill-terracotta' : 'fill-ink-muted'}`}
                  >
                    {s.short}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Centre */}
          <circle cx={C} cy={C} r={58} fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth={1} />
          <text x={C} y={C - 4} textAnchor="middle" className="fill-ink font-display text-[30px]">
            {SERVICES_CENTER}
          </text>
          <AnimatePresence mode="wait">
            <m.text
              key={activeName}
              x={C}
              y={C + 22}
              textAnchor="middle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="fill-terracotta font-display text-[15px] italic"
            >
              + {activeName}
            </m.text>
          </AnimatePresence>
        </svg>
      </m.div>
    </div>
  )
}

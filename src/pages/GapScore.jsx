import { AnimatePresence, m } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { ComingSoon } from '../components/ComingSoon'
import { Copy } from '../components/Copy'
import { Field, FormStatus } from '../components/Form'
import { MagneticButton } from '../components/MagneticButton'
import { Breadcrumb } from '../components/PageHero'
import { MaskReveal, Reveal } from '../components/Reveal'
import { COMING_SOON, GAP_SCORE } from '../data/tools'
import { breadcrumbLd, useSeo } from '../hooks/useSeo'
import { track } from '../utils/analytics'
import { scoreGap } from '../utils/gapScore'
import { submitLead } from '../utils/leads'

const EASE = [0.16, 1, 0.3, 1]
const Q = GAP_SCORE.questions

/**
 * /gap-score — the signature lead magnet (brief §6). A few questions, one at
 * a time; the b and the g close in as they're answered. An email or WhatsApp
 * number unlocks the result. Questions and scoring are BrandGap's to supply
 * (data/tools.js, utils/gapScore.js) — until then the result is a labelled
 * placeholder, never an invented score.
 */
/*
 * LAUNCH SWITCH — the Gap Score is built but hidden until launch.
 * While LAUNCHED is false the route shows a "Coming soon" page; the full
 * tool below (GapScoreLive) is kept exactly as it was. Set to true to go live,
 * and restore '/gap-score' in the sitemap list in vite.config.js.
 */
const LAUNCHED = false

export default function GapScore() {
  return LAUNCHED ? (
    <GapScoreLive />
  ) : (
    <ComingSoon page={COMING_SOON.gapScore} />
  )
}

// eslint-disable-next-line no-unused-vars -- kept for launch, see LAUNCHED above
function GapScoreLive() {
  const [stage, setStage] = useState('intro') // intro | quiz | gate | result
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [lead, setLead] = useState({ status: 'idle', errors: {} })
  const top = useRef(null)

  useSeo({
    title: 'Gap Score',
    description: `${GAP_SCORE.intro}`,
    path: '/gap-score',
    jsonLd: breadcrumbLd([{ name: 'Gap Score', path: '/gap-score' }]),
  })

  const go = (next) => {
    setStage(next)
    requestAnimationFrame(() => top.current?.focus({ preventScroll: true }))
  }

  const start = () => {
    track('quiz_start', { quiz: 'gap_score' })
    setStep(0)
    go('quiz')
  }

  const answered = Object.keys(answers).length
  // The gap closes as the questions are answered: 1 → 0.
  const gap = stage === 'intro' ? 1 : stage === 'quiz' ? 1 - answered / Q.length : 0

  const onGate = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    const errors = {}
    if (!data.email?.trim() && !data.whatsapp?.trim()) errors.email = 'Add an email or a WhatsApp number'
    else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'Enter a valid email address'
    if (Object.keys(errors).length) {
      setLead({ status: 'idle', errors })
      e.currentTarget.elements.namedItem('email')?.focus()
      return
    }
    setLead({ status: 'sending', errors: {} })
    const result = scoreGap(answers)
    const res = await submitLead('gap-score', { ...data, answers: JSON.stringify(answers), score: result?.score ?? '' })
    setLead({ status: res.ok ? 'sent' : res.pending ? 'pending' : 'error', errors: {} })
    track('quiz_complete', { quiz: 'gap_score', score: result?.score ?? null })
    go('result')
  }

  const result = stage === 'result' ? scoreGap(answers) : null

  return (
    <>
      <section aria-labelledby="gap-score-title" className="container-page pt-24 pb-14 md:pt-36 md:pb-20">
        <h1 id="gap-score-title" className="sr-only">
          Gap Score
        </h1>
        <div className="text-center md:text-left">
          <Breadcrumb items={[{ name: 'Gap Score', path: '/gap-score' }]} />
        </div>

        <div className="mt-5 grid gap-8 md:mt-7 md:grid-cols-12 md:gap-6">
          {/* The closing gap — progress, in the brand's own terms */}
          <aside aria-hidden className="md:sticky md:top-36 md:col-span-4 md:self-start">
            <GapMeter gap={gap} />
            {stage === 'quiz' && (
              <p className="label mt-4 text-center text-ink-muted md:text-left">
                <span className="text-terracotta tabular-nums">{String(step + 1).padStart(2, '0')}</span> / {String(Q.length).padStart(2, '0')}
                <span className="mx-2">·</span>
                {Q[step].theme}
              </p>
            )}
          </aside>

          <div ref={top} tabIndex={-1} className="outline-none md:col-span-7 md:col-start-6">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={stage === 'quiz' ? `q-${step}` : stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {stage === 'intro' && (
                  <div className="text-center md:text-left">
                    <h2 className="text-h2">
                      <MaskReveal>What is your</MaskReveal>
                      <MaskReveal delay={0.08} className="italic text-terracotta">
                        Gap Score?
                      </MaskReveal>
                    </h2>
                    <Reveal as="p" delay={0.15} className="mx-auto mt-8 max-w-md text-lead text-ink-soft md:mx-0">
                      {GAP_SCORE.intro}
                    </Reveal>
                    <ul className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start">
                      {GAP_SCORE.themes.map((t) => (
                        <li key={t} className="label rounded-full border border-line px-4 py-2 text-[0.6875rem]">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10">
                      <MagneticButton onClick={start} cursor="start">
                        Find my gap
                      </MagneticButton>
                    </div>
                  </div>
                )}

                {stage === 'quiz' && (
                  <Question
                    q={Q[step]}
                    value={answers[Q[step].id]}
                    onChange={(v) => setAnswers((a) => ({ ...a, [Q[step].id]: v }))}
                    onBack={() => (step === 0 ? go('intro') : setStep(step - 1))}
                    onNext={() => (step === Q.length - 1 ? go('gate') : setStep(step + 1))}
                    last={step === Q.length - 1}
                  />
                )}

                {stage === 'gate' && (
                  <form noValidate onSubmit={onGate} className="text-center md:text-left">
                    <h2 className="text-h2">{GAP_SCORE.gate}</h2>
                    <p className="mx-auto mt-4 max-w-md text-lead text-ink-soft md:mx-0">Your score and short gap report appear as soon as you send it.</p>
                    <div className="mt-10 grid gap-8 sm:grid-cols-2">
                      <Field name="email" label="Email" type="email" autoComplete="email" error={lead.errors.email} />
                      <Field name="whatsapp" label="or WhatsApp number" type="tel" autoComplete="tel" inputMode="tel" />
                      <Field name="name" label="Name" autoComplete="name" className="sm:col-span-2" />
                    </div>
                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
                      <MagneticButton type="submit" disabled={lead.status === 'sending'} cursor="start">
                        See my Gap Score
                      </MagneticButton>
                      <button type="button" onClick={() => go('quiz')} className="label inline-flex min-h-11 items-center gap-2 text-ink-muted hover:text-ink">
                        <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" /> Back
                      </button>
                    </div>
                  </form>
                )}

                {stage === 'result' && (
                  <div className="text-center md:text-left">
                    <p className="label text-ink-muted">Your Gap Score</p>
                    <h2 className="mt-4 font-display text-numeral text-terracotta">
                      {result ? result.score : <Copy value={GAP_SCORE.result.scorePlaceholder} tone="inherit" />}
                    </h2>
                    <div className="mx-auto mt-8 max-w-xl space-y-4 text-lead text-ink-soft md:mx-0">
                      {result ? result.report.map((p, i) => <p key={i}>{p}</p>) : <Copy value={GAP_SCORE.result.reportPlaceholder} />}
                    </div>
                    <FormStatus status={lead.status} sentText="We've sent a copy of your report." className="mt-6" />
                    <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:gap-8 md:justify-start">
                      <MagneticButton href="/contact" cursor="start" trackAs="gap_score_start_project">
                        Close the gap
                      </MagneticButton>
                      <MagneticButton href="/contact#booking" variant="text" trackAs="gap_score_book_call">
                        Book a 30-min call
                      </MagneticButton>
                    </div>
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}

function Question({ q, value, onChange, onBack, onNext, last }) {
  return (
    <fieldset className="text-center md:text-left">
      <legend className="w-full font-display text-h3 tracking-[-0.02em]">
        <Copy value={q.text} tone="inherit" />
      </legend>
      <div className="mt-10 flex flex-col gap-2">
        {q.options.map((o) => {
          const id = `${q.id}-${o.value}`
          const on = value === o.value
          return (
            <label
              key={id}
              htmlFor={id}
              className={`flex min-h-12 cursor-pointer items-center gap-4 border px-4 py-2.5 text-left transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-terracotta ${
                on ? 'border-ink bg-ink text-cream' : 'border-line hover:border-terracotta'
              }`}
            >
              <input id={id} type="radio" name={q.id} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              <span aria-hidden className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${on ? 'border-cream' : 'border-ink/40'}`}>
                {on && <span className="size-2 rounded-full bg-terracotta" />}
              </span>
              <Copy value={o.label} tone={on ? 'light' : 'dark'} />
            </label>
          )
        })}
      </div>
      <div className="mt-8 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="label inline-flex min-h-11 items-center gap-2 text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4" /> Back
        </button>
        <MagneticButton onClick={onNext} disabled={value === undefined} variant="ink" arrow={false}>
          <span className="inline-flex items-center gap-3">
            {last ? 'Almost there' : 'Next'} <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
          </span>
        </MagneticButton>
      </div>
    </fieldset>
  )
}

/** The b and the g, a measured distance apart — 100 at the start, 00 when the gap is closed. */
function GapMeter({ gap }) {
  return (
    <div className="mx-auto max-w-xs md:mx-0">
      <div className="relative h-4">
        <span
          className="absolute top-1/2 h-px -translate-y-1/2 bg-ink/25 transition-[left,right] duration-700 ease-(--ease-out-expo)"
          style={{ left: `calc(${(1 - gap) * 50}% + 8px)`, right: `calc(${(1 - gap) * 50}% + 8px)` }}
        />
        <span
          className="absolute top-0 size-4 rounded-full bg-terracotta transition-[left] duration-700 ease-(--ease-out-expo)"
          style={{ left: `calc(${(1 - gap) * 50}% - ${(1 - gap) * 16}px)` }}
        />
        <span
          className="absolute top-0 size-4 rounded-full bg-ink transition-[right] duration-700 ease-(--ease-out-expo)"
          style={{ right: `calc(${(1 - gap) * 50}% - ${(1 - gap) * 16}px)` }}
        />
      </div>
      <p className="label mt-4 flex justify-between text-ink-muted">
        <span>Brand</span>
        <span className="tabular-nums text-terracotta">{String(Math.round(gap * 100)).padStart(2, '0')}</span>
        <span>Growth</span>
      </p>
    </div>
  )
}

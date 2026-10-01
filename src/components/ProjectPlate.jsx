import { MARK_B_D, MARK_G_D, MARK_VIEWBOX } from '../data/mark'

const TONES = {
  terracotta: { bg: 'bg-terracotta', shape: '#93392C', text: 'text-cream/80' },
  blush: { bg: 'bg-blush', shape: '#E4C3B6', text: 'text-ink-soft' },
  ink: { bg: 'bg-ink', shape: '#2A2524', text: 'text-cream/70' },
}

/**
 * A project image. With `image` it renders a responsive, lazy <img>;
 * without, an art-directed placeholder plate: a tonal field with one
 * letter of the mark cropped large, like a stamp on packaging.
 *
 * The [data-inner] layer is oversized so it can parallax inside the frame.
 */
export function ProjectPlate({ project, tone: toneKey, ratio = '16 / 9', letter = 'b', crop = 'right', className = '', label = '[Project image]', cursor = 'view' }) {
  const tone = TONES[toneKey ?? project.tone] ?? TONES.blush
  const { x, y, w, h } = MARK_VIEWBOX

  return (
    <div
      className={`group/plate relative overflow-hidden ${tone.bg} ${className}`}
      style={{ aspectRatio: ratio }}
      data-cursor={cursor}
      {...(project.image ? {} : { role: 'img', 'aria-label': `${label} (placeholder)` })}
    >
      <div data-inner className="absolute -inset-[8%] will-change-transform">
        {/* Hover zoom lives on its own layer so it never fights the scroll parallax above */}
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover/plate:scale-[1.045] motion-reduce:group-hover/plate:scale-100">
        {project.image ? (
          <img
            src={project.image.src}
            srcSet={project.image.srcSet}
            sizes={project.image.sizes ?? '100vw'}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <svg
            aria-hidden
            viewBox={`${x} ${y} ${w} ${h}`}
            preserveAspectRatio="xMidYMid meet"
            className={`absolute top-1/2 h-[135%] -translate-y-1/2 ${crop === 'right' ? '-right-[6%]' : '-left-[6%]'}`}
          >
            <path d={letter === 'b' ? MARK_B_D : MARK_G_D} fill={tone.shape} />
          </svg>
        )}
        </div>
      </div>

      {!project.image && (
        <div aria-hidden className={`absolute inset-0 flex flex-col justify-between p-5 md:p-8 ${tone.text}`}>
          <span className="label text-[0.6875rem]">{label}</span>
          <span className="label self-end text-[0.6875rem]">Placeholder</span>
        </div>
      )}
    </div>
  )
}

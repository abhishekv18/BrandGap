/**
 * Chapter IV — Selected work.
 * No projects are published in the brand guidelines, so every project field is
 * a placeholder. Only the category is supported by the guidelines (p.3).
 *
 * image: null renders an art-directed placeholder plate. To use real work, set
 *   image: { src, srcSet, sizes, alt, width, height }
 * layout: 'full' | 'split' | 'strip' — each project gets a different spread.
 * tone: plate colour for the placeholder — 'terracotta' | 'blush' | 'ink'.
 */
export const WORK_INTRO = {
  title: 'Selected work.',
  // Brand guidelines p.9 — tone of voice.
  line: 'Proof over adjectives.',
}

export const PROJECTS = [
  {
    id: 'project-01',
    index: '01',
    client: '[Client Name]',
    title: '[Project Title]',
    category: 'Beauty & personal care',
    disciplines: ['[Discipline]', '[Discipline]', '[Discipline]'],
    summary: '[Project Description]',
    result: '[Result / Metric]',
    href: null,
    image: null,
    layout: 'full',
    tone: 'terracotta',
  },
  {
    id: 'project-02',
    index: '02',
    client: '[Client Name]',
    title: '[Project Title]',
    category: 'Beauty & personal care',
    disciplines: ['[Discipline]', '[Discipline]'],
    summary: '[Project Description]',
    result: '[Result / Metric]',
    href: null,
    image: null,
    layout: 'split',
    tone: 'blush',
  },
  {
    id: 'project-03',
    index: '03',
    client: '[Client Name]',
    title: '[Project Title]',
    category: 'Beauty & personal care',
    disciplines: ['[Discipline]', '[Discipline]', '[Discipline]'],
    summary: '[Project Description]',
    result: '[Result / Metric]',
    href: null,
    image: null,
    layout: 'strip',
    tone: 'ink',
  },
]

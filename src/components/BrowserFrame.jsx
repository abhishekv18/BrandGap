/**
 * A website screenshot set in a quiet browser window: three dots, the site's
 * address (or name) in a pill, and the page beneath at a fixed 16:9, cropped
 * from the top so every frame lines up. Images fade up from a mask as they
 * scroll in (data-frame, animated by the page).
 */
export function BrowserFrame({ image, address, sizes = '100vw', priority = false, className = '' }) {
  return (
    <figure data-frame className={`overflow-hidden rounded-[0.625rem] border border-line bg-cream shadow-[0_30px_60px_-40px_rgba(28,18,22,0.45)] ${className}`}>
      <div aria-hidden className="flex items-center gap-3 border-b border-line bg-[#F7EFE9] px-3 py-2 md:px-4 md:py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-terracotta/70" />
          <span className="size-2 rounded-full bg-ink/20" />
          <span className="size-2 rounded-full bg-ink/20" />
        </span>
        <span className="mx-auto max-w-[60%] truncate rounded-full bg-cream px-4 py-0.5 text-center text-[0.625rem] tracking-wide text-ink-muted md:text-[0.6875rem]">
          {address}
        </span>
        <span className="w-[2.625rem]" />
      </div>
      <div className="relative aspect-video overflow-hidden bg-blush">
        {image ? (
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            alt={image.alt ?? ''}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            data-inner
            className="h-full w-full object-cover"
            style={{ objectPosition: image.position ?? 'center' }}
          />
        ) : (
          <span className="label absolute inset-0 flex items-center justify-center text-ink-muted">[Project image]</span>
        )}
      </div>
    </figure>
  )
}

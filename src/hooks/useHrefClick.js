import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSmoothScroll } from '../components/SmoothScroll'

const isInternal = (href) => typeof href === 'string' && (href.startsWith('/') || href.startsWith('#'))

/**
 * One click handler for every link-like element (magnetic buttons, cards):
 *   '#id'        smooth-scrolls on the current page
 *   '/path'      client-side route change (with the page transition)
 *   '/path#id'   same page → scroll; other page → navigate, then scroll
 * Modified clicks (new tab, etc.) and external URLs fall through to the browser.
 */
export function useHrefClick() {
  const navigate = useNavigate()
  const location = useLocation()
  const { scrollTo } = useSmoothScroll()

  return useCallback(
    (e, href) => {
      if (!isInternal(href) || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      e.preventDefault()
      if (href.startsWith('#')) {
        if (href.length > 1) scrollTo(href)
        return
      }
      const [path, hash] = href.split('#')
      if ((path || '/') === location.pathname) {
        if (hash) scrollTo(`#${hash}`)
        else scrollTo(0)
        return
      }
      navigate(href)
    },
    [navigate, location.pathname, scrollTo],
  )
}

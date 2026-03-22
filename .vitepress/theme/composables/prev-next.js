import { computed } from 'vue'
import { useData } from 'vitepress'

import { getFlatSideBarLinks, getSidebar } from '../support/sidebar'
import { isActive } from '../support/shared'

export function usePrevNext() {
  const { page, theme, frontmatter } = useData()

  return computed(() => {
    const sidebar = getSidebar(theme.value.sidebar, page.value.relativePath)
    const links = getFlatSideBarLinks(sidebar)
    const candidates = uniqBy(links, (link) => link.link.replace(/[?#].*$/, ''))
    const index = candidates.findIndex((link) => isActive(page.value.relativePath, link.link))

    const hidePrev =
      (theme.value.docFooter?.prev === false && !frontmatter.value.prev) ||
      frontmatter.value.prev === false
    const hideNext =
      (theme.value.docFooter?.next === false && !frontmatter.value.next) ||
      frontmatter.value.next === false

    return {
      prev: hidePrev
        ? undefined
        : {
            text:
              (typeof frontmatter.value.prev === 'string'
                ? frontmatter.value.prev
                : typeof frontmatter.value.prev === 'object'
                  ? frontmatter.value.prev.text
                  : undefined) ??
              candidates[index - 1]?.docFooterText ??
              candidates[index - 1]?.text,
            link:
              (typeof frontmatter.value.prev === 'object'
                ? frontmatter.value.prev.link
                : undefined) ?? candidates[index - 1]?.link
          },
      next: hideNext
        ? undefined
        : {
            text:
              (typeof frontmatter.value.next === 'string'
                ? frontmatter.value.next
                : typeof frontmatter.value.next === 'object'
                  ? frontmatter.value.next.text
                  : undefined) ??
              candidates[index + 1]?.docFooterText ??
              candidates[index + 1]?.text,
            link:
              (typeof frontmatter.value.next === 'object'
                ? frontmatter.value.next.link
                : undefined) ?? candidates[index + 1]?.link
          }
    }
  })
}

function uniqBy(array, keyFn) {
  const seen = new Set()

  return array.filter((item) => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

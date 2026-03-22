import { useData } from 'vitepress'
import { computed } from 'vue'

import { getPageHeaders } from '../data/headers'
import { resolveHeaders } from './outline'

export function useDocumentHeaders() {
  const { frontmatter, page, theme } = useData()
  const headers = computed(() =>
    resolveHeaders(
      getPageHeaders(page.value.relativePath),
      frontmatter.value.outline ?? theme.value.outline
    )
  )

  return {
    headers,
    hasLocalNav: computed(() => headers.value.length > 0)
  }
}

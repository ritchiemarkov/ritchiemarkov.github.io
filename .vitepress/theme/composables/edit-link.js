import { computed } from 'vue'
import { useData } from 'vitepress'

export function useEditLink() {
  const { theme, page } = useData()

  return computed(() => {
    const { text = 'Edit this page', pattern = '' } = theme.value.editLink || {}

    const url =
      typeof pattern === 'function'
        ? pattern(page.value)
        : pattern.replace(/:path/g, page.value.filePath)

    return { url, text }
  })
}

import { inBrowser, onContentUpdated, useData, useRoute } from 'vitepress'
import { computed, nextTick, onMounted, shallowReadonly, shallowRef, watch } from 'vue'

import { getSidebar, getSidebarGroups } from '../support/sidebar'
import { getHeaders } from './outline'
import { useCloseSidebarOnEscape } from './sidebar'

const headers = shallowRef([])
const sidebar = shallowRef([])
const is960 = shallowRef(false)
let hasBoundResizeListener = false
let headerSyncTimer = null

export const layoutInfoInjectionKey = Symbol('layout-info')

export function useLayout() {
  const { frontmatter, theme } = useData()

  const isHome = computed(() => {
    return !!(frontmatter.value.isHome ?? frontmatter.value.layout === 'home')
  })

  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && !isHome.value
  })

  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value)
  const sidebarGroups = computed(() => (hasSidebar.value ? getSidebarGroups(sidebar.value) : []))

  const hasAside = computed(() => {
    if (isHome.value) return false
    if (frontmatter.value.aside != null) return !!frontmatter.value.aside
    return theme.value.aside !== false
  })

  const leftAside = computed(() => {
    if (!hasAside.value) return false

    return frontmatter.value.aside == null
      ? theme.value.aside === 'left'
      : frontmatter.value.aside === 'left'
  })

  const hasLocalNav = computed(() => headers.value.length > 0)

  return {
    isHome,
    sidebar: shallowReadonly(sidebar),
    sidebarGroups,
    hasSidebar,
    isSidebarEnabled,
    hasAside,
    leftAside,
    headers: shallowReadonly(headers),
    hasLocalNav
  }
}

export function registerWatchers({ closeSidebar }) {
  const { frontmatter, page, theme } = useData()
  const route = useRoute()

  const syncHeaders = () => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme.value.outline)
    return headers.value.length
  }

  const scheduleHeaderSync = async (attempt = 0) => {
    if (!inBrowser) return

    await nextTick()

    if (headerSyncTimer) {
      window.clearTimeout(headerSyncTimer)
      headerSyncTimer = null
    }

    if (syncHeaders() > 0 || attempt >= 8) return

    headerSyncTimer = window.setTimeout(() => {
      void scheduleHeaderSync(attempt + 1)
    }, 120)
  }

  watch(
    () => [page.value.relativePath, theme.value.sidebar],
    ([relativePath, sidebarConfig]) => {
      const nextSidebar = sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []

      if (JSON.stringify(nextSidebar) !== JSON.stringify(sidebar.value)) {
        sidebar.value = nextSidebar
      }
    },
    { immediate: true, deep: true, flush: 'sync' }
  )

  onMounted(() => {
    void scheduleHeaderSync()
  })

  onContentUpdated(() => {
    void scheduleHeaderSync()
  })

  if (inBrowser && !hasBoundResizeListener) {
    const updateViewport = () => {
      is960.value = window.innerWidth >= 960
    }

    updateViewport()
    window.addEventListener('resize', updateViewport, { passive: true })
    hasBoundResizeListener = true
  }

  watch(() => route.path, closeSidebar)
  watch(
    () => route.path,
    () => {
      void scheduleHeaderSync()
    },
    { flush: 'post' }
  )
  useCloseSidebarOnEscape(closeSidebar)
}

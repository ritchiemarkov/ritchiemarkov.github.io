import { computed, onMounted, onUnmounted, ref, watch, watchEffect, watchPostEffect } from 'vue'
import { useData } from 'vitepress'

import { hasActiveLink as containsActiveLink } from '../support/sidebar'
import { isActive } from '../support/shared'

const isOpen = ref(false)

export function useCloseSidebarOnEscape(close) {
  let triggerElement

  watchEffect(() => {
    triggerElement = isOpen.value && typeof document !== 'undefined'
      ? document.activeElement
      : undefined
  })

  const onEscape = (event) => {
    if (event.key === 'Escape' && isOpen.value) {
      close()
      triggerElement?.focus?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keyup', onEscape)
  })

  onUnmounted(() => {
    window.removeEventListener('keyup', onEscape)
  })
}

export function useSidebarControl() {
  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return {
    isOpen,
    open,
    close,
    toggle
  }
}

export function useSidebarItemControl(item) {
  const { page, hash } = useData()
  const collapsed = ref(false)
  const isActiveLink = ref(false)

  const collapsible = computed(() => item.value.collapsed != null)
  const isLink = computed(() => !!item.value.link)
  const hasChildren = computed(() => !!item.value.items?.length)
  const hasActiveLink = computed(() => {
    if (isActiveLink.value) return true
    return item.value.items ? containsActiveLink(page.value.relativePath, item.value.items) : false
  })

  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.relativePath, item.value.link)
  }

  watch([page, item, hash], updateIsActiveLink, { immediate: true })

  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed)
  })

  watchPostEffect(() => {
    if (isActiveLink.value || hasActiveLink.value) {
      collapsed.value = false
    }
  })

  function toggle() {
    if (collapsible.value) {
      collapsed.value = !collapsed.value
    }
  }

  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink,
    hasChildren,
    toggle
  }
}

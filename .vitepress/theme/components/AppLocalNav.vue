<script setup>
import { useWindowScroll } from '@vueuse/core'
import { ChevronDown, Menu } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

import { useDocumentHeaders } from '../composables/document-headers'
import { useLayout } from '../composables/layout'
import { resolveTitle } from '../composables/outline'
import AppOutlineTree from './AppOutlineTree.vue'

import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['open-menu'])

const { theme } = useData()
const { isHome, hasSidebar } = useLayout()
const { headers, hasLocalNav } = useDocumentHeaders()
const { y } = useWindowScroll()

const navHeight = ref(0)
const popoverOpen = ref(false)

onMounted(() => {
  navHeight.value = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--vp-nav-height')
  )
})

const visible = computed(() => {
  return !isHome.value && (hasLocalNav.value || hasSidebar.value || y.value >= navHeight.value)
})

function closeOnLink(event) {
  if (event.target.closest('a')) popoverOpen.value = false
}

function scrollToTop() {
  popoverOpen.value = false
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}
</script>

<template>
  <div
    v-if="visible"
    class="sticky top-[calc(var(--vp-nav-height)+var(--vp-layout-top-height,0px)+0.75rem)] z-[calc(var(--vp-z-index-local-nav)+1)] px-4 min-[960px]:pl-[calc(var(--vp-sidebar-width)+1rem)]"
  >
    <div class="mx-auto flex max-w-[1380px] gap-3">
      <Button
        v-if="hasSidebar"
        variant="outline"
        class="gap-2 rounded-full bg-card/88 min-[960px]:hidden"
        @click="$emit('open-menu')"
      >
        <Menu class="size-4" />
        Menu
      </Button>

      <Popover v-model:open="popoverOpen">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            class="gap-2 rounded-full border-border/80 bg-card/88 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-[18px]"
          >
            {{ hasLocalNav ? resolveTitle(theme) : theme.returnToTopLabel || 'Return to top' }}
            <ChevronDown class="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          class="w-[min(24rem,calc(100vw-2rem))] rounded-[1.5rem] border-border/80 bg-card/94 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-[18px]"
          @click="closeOnLink"
        >
          <div class="mb-3">
            <button
              type="button"
              class="text-[0.85rem] font-semibold text-[var(--vp-c-brand-1)]"
              @click="scrollToTop"
            >
              {{ theme.returnToTopLabel || 'Return to top' }}
            </button>
          </div>
          <AppOutlineTree v-if="hasLocalNav" :headers="headers" />
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>

<script setup>
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from 'vitepress'
import { watch } from 'vue'

import { useLayout } from '../composables/layout'
import AppSidebarItem from './AppSidebarItem.vue'

import { ScrollArea } from './ui/scroll-area'
import { cn } from '../lib'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const { hasSidebar, sidebarGroups } = useLayout()
const isLocked = useScrollLock(inBrowser ? document.body : null)

watch(
  () => props.open,
  (value) => {
    isLocked.value = value
  },
  { immediate: true }
)
</script>

<template>
  <aside
    v-if="hasSidebar"
    :class="
      cn(
        'fixed bottom-4 left-4 top-[calc(var(--vp-nav-height)+var(--vp-layout-top-height,0px)+1rem)] z-[var(--vp-z-index-sidebar)] w-[min(22rem,calc(100vw-2rem))] -translate-x-[calc(100%+2rem)] opacity-0 transition-[transform,opacity] duration-300 ease-out min-[960px]:top-[calc(var(--vp-nav-height)+1rem)] min-[960px]:w-[calc(var(--vp-sidebar-width)-1.5rem)] min-[960px]:translate-x-0 min-[960px]:opacity-100',
        props.open && 'translate-x-0 opacity-100'
      )
    "
    @click.stop
  >
    <ScrollArea class="h-full rounded-[1.8rem] border border-border/80 bg-card/92 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-[18px]">
      <nav class="p-4" id="VPSidebarNav">
        <div class="px-[0.35rem] pb-4">
          <p class="m-0 text-[0.74rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Navigazione</p>
          <h2 class="mt-2 text-[1.05rem] font-bold">Sezioni documento</h2>
        </div>

        <div class="grid gap-3">
          <div
            v-for="(group, index) in sidebarGroups"
            :key="group.text || group.link || `group-${index}`"
            class="border-t border-border/70 pt-3 first:border-t-0 first:pt-0"
          >
            <template v-if="group.text || group.link">
              <AppSidebarItem :item="group" :depth="0" />
            </template>
            <template v-else>
              <AppSidebarItem
                v-for="child in group.items"
                :key="child.text || child.link"
                :item="child"
                :depth="1"
              />
            </template>
          </div>
        </div>

        <slot name="sidebar-nav-after" />
      </nav>
    </ScrollArea>
  </aside>
</template>

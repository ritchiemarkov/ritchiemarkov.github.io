<script setup>
import { ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { useSidebarItemControl } from '../composables/sidebar'
import { isExternal } from '../support/shared'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { cn } from '../lib'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

const {
  collapsed,
  collapsible,
  isLink,
  isActiveLink,
  hasActiveLink,
  hasChildren,
  toggle
} = useSidebarItemControl(computed(() => props.item))

const isOpen = computed(() => !collapsed.value)

function setOpen(nextOpen) {
  if (nextOpen !== isOpen.value) toggle()
}

function resolveHref(link) {
  if (!link) return '#'
  return isExternal(link) ? link : withBase(link)
}
</script>

<template>
  <Collapsible
    :open="isOpen"
    @update:open="setOpen"
    class="block"
  >
    <div
      :class="
        cn(
          'flex min-h-11 items-center gap-1.5 rounded-2xl',
          (isActiveLink || hasActiveLink) && 'bg-secondary/92'
        )
      "
    >
      <a
        v-if="isLink"
        :href="resolveHref(item.link)"
        :target="item.target"
        :rel="item.rel"
        :class="
          cn(
            'flex min-h-11 flex-1 items-center rounded-2xl px-4 text-left transition-[background-color,color] duration-200 hover:bg-secondary/92',
            depth === 0
              ? 'text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground'
              : 'text-[0.92rem] font-semibold text-foreground'
          )
        "
      >
        <span>{{ item.text }}</span>
      </a>

      <button
        v-else
        type="button"
        :class="
          cn(
            'flex min-h-11 flex-1 items-center rounded-2xl px-4 text-left transition-[background-color,color] duration-200 hover:bg-secondary/92',
            depth === 0
              ? 'text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground'
              : 'text-[0.92rem] font-semibold text-foreground'
          )
        "
        @click="toggle"
      >
        <span>{{ item.text }}</span>
      </button>

      <CollapsibleTrigger
        v-if="hasChildren && collapsible"
        as-child
      >
        <button
          type="button"
          class="grid size-[2.3rem] place-items-center rounded-full transition-colors duration-200 hover:bg-accent/90"
          aria-label="Espandi sezione"
        >
          <ChevronRight :class="cn('size-4 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-90')" />
        </button>
      </CollapsibleTrigger>
    </div>

    <CollapsibleContent
      v-if="hasChildren"
      class="mt-1 ml-4 grid gap-1 border-l border-border/75 pl-2.5"
    >
      <AppSidebarItem
        v-for="child in item.items"
        :key="`${depth}-${child.text}-${child.link || 'section'}`"
        :item="child"
        :depth="depth + 1"
      />
    </CollapsibleContent>
  </Collapsible>
</template>

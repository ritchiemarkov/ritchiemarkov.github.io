<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import { useEditLink } from '../composables/edit-link'
import { usePrevNext } from '../composables/prev-next'

const { theme, page, frontmatter } = useData()
const editLink = useEditLink()
const pager = usePrevNext()

const hasEditLink = computed(
  () => theme.value.editLink && frontmatter.value.editLink !== false
)
const hasLastUpdated = computed(() => page.value.lastUpdated)
const showFooter = computed(
  () => hasEditLink.value || hasLastUpdated.value || pager.value.prev || pager.value.next
)

const lastUpdatedLabel = computed(() => {
  if (!page.value.lastUpdated) return ''

  const formatter = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  return `${theme.value.lastUpdatedText || 'Ultimo aggiornamento'}: ${formatter.format(
    new Date(page.value.lastUpdated)
  )}`
})
</script>

<template>
  <footer v-if="showFooter" class="mt-6">
    <slot name="doc-footer-before" />

    <div
      v-if="hasEditLink || hasLastUpdated"
      class="mb-4 flex flex-wrap items-center gap-4 px-[0.4rem] text-[0.92rem] text-muted-foreground"
    >
      <a
        v-if="hasEditLink"
        :href="editLink.url"
        class="transition-colors duration-200 hover:text-foreground"
      >
        {{ editLink.text }}
      </a>
      <div v-if="hasLastUpdated">
        {{ lastUpdatedLabel }}
      </div>
    </div>

    <div
      v-if="pager.prev?.link || pager.next?.link"
      class="grid gap-4 min-[960px]:grid-cols-2"
    >
      <a
        v-if="pager.prev?.link"
        :href="pager.prev.link"
        class="flex flex-col gap-1 rounded-[1.5rem] border border-border/75 bg-card/86 px-[1.15rem] py-4 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-primary/55"
      >
        <span class="text-[0.76rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {{ theme.docFooter?.prev || 'Previous page' }}
        </span>
        <span class="text-base font-semibold text-foreground">{{ pager.prev.text }}</span>
      </a>
      <a
        v-if="pager.next?.link"
        :href="pager.next.link"
        class="flex flex-col gap-1 rounded-[1.5rem] border border-border/75 bg-card/86 px-[1.15rem] py-4 text-right transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-primary/55"
      >
        <span class="text-[0.76rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {{ theme.docFooter?.next || 'Next page' }}
        </span>
        <span class="text-base font-semibold text-foreground">{{ pager.next.text }}</span>
      </a>
    </div>
  </footer>
</template>

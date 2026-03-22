<script setup>
import { useRoute } from 'vitepress'
import { computed, useSlots } from 'vue'
import { useData } from 'vitepress'

import { useDocumentHeaders } from '../composables/document-headers'
import { useLayout } from '../composables/layout'
import { resolveTitle } from '../composables/outline'
import { cn } from '../lib'

import AppDocFooter from './AppDocFooter.vue'
import AppOutlineTree from './AppOutlineTree.vue'
import ContentPostMeta from './ContentPostMeta.vue'

const { frontmatter, theme } = useData()
const route = useRoute()
const { hasAside, leftAside } = useLayout()
const { headers, hasLocalNav } = useDocumentHeaders()
const slots = useSlots()

const pageName = computed(() =>
  route.path.replace(/[./]+/g, '_').replace(/_html$/, '')
)

const showPostMeta = computed(() =>
  (route.path.startsWith('/travel/') || route.path.startsWith('/blog/')) &&
  frontmatter.value.layout !== 'page'
)

const showAside = computed(() => {
  if (!hasAside.value) return false

  return Boolean(
    hasLocalNav.value ||
      slots['aside-top'] ||
      slots['aside-outline-before'] ||
      slots['aside-outline-after'] ||
      slots['aside-ads-before'] ||
      slots['aside-ads-after'] ||
      slots['aside-bottom']
  )
})
</script>

<template>
  <div class="px-4 pb-20 pt-[calc(var(--vp-nav-height)+1.5rem)] min-[960px]:pt-[calc(var(--vp-nav-height)+2rem)]">
    <slot name="doc-top" />

    <div
      :class="
        cn(
          'mx-auto grid max-w-[1380px] gap-6',
          showAside &&
            !leftAside &&
            'min-[960px]:items-start min-[960px]:grid-cols-[minmax(0,1fr)_18rem] min-[1280px]:grid-cols-[minmax(0,1fr)_19rem]',
          showAside &&
            leftAside &&
            'min-[960px]:items-start min-[960px]:grid-cols-[18rem_minmax(0,1fr)] min-[1280px]:grid-cols-[19rem_minmax(0,1fr)]'
        )
      "
    >
      <aside
        v-if="showAside"
        :class="cn('hidden min-[960px]:block', leftAside ? 'min-[960px]:col-start-1' : 'min-[960px]:col-start-2')"
      >
        <div class="sticky top-[calc(var(--vp-nav-height)+2rem)] grid gap-4">
          <slot name="aside-top" />
          <slot name="aside-outline-before" />

          <div
            v-if="hasLocalNav"
            class="rounded-[1.5rem] border border-border/75 bg-card/90 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
          >
            <p class="mb-[0.55rem] text-[0.76rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {{ resolveTitle(theme) }}
            </p>
            <AppOutlineTree :headers="headers" />
          </div>

          <slot name="aside-outline-after" />
          <slot name="aside-ads-before" />
          <slot name="aside-ads-after" />
          <slot name="aside-bottom" />
        </div>
      </aside>

      <div
        :class="
          cn(
            'min-w-0',
            showAside && leftAside && 'min-[960px]:col-start-2',
            showAside && !leftAside && 'min-[960px]:col-start-1'
          )
        "
      >
        <slot name="doc-before" />

        <div class="rounded-[2rem] border border-border/75 bg-card/90 p-[1.2rem] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <main class="px-3 py-3 sm:px-4">
            <ContentPostMeta v-if="showPostMeta" />
            <Content
              class="vp-doc"
              :class="[
                pageName,
                theme.externalLinkIcon && 'external-link-icon-enabled'
              ]"
            />
          </main>
        </div>

        <AppDocFooter>
          <template #doc-footer-before><slot name="doc-footer-before" /></template>
        </AppDocFooter>

        <slot name="doc-after" />
      </div>
    </div>

    <slot name="doc-bottom" />
  </div>
</template>

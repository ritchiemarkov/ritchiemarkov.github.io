<script setup>
import localSearchIndex from '@localSearchIndex'
import { computedAsync, onKeyStroke, useSessionStorage } from '@vueuse/core'
import MiniSearch from 'minisearch'
import { Search } from 'lucide-vue-next'
import { computed, ref, shallowRef, watch } from 'vue'
import { useData, useRouter } from 'vitepress'

import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Kbd } from './ui/kbd'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '../lib'

const { localeIndex, theme } = useData()
const router = useRouter()

const open = ref(false)
const selectedIndex = ref(0)
const query = useSessionStorage('app-search-query', '')
const searchIndexData = shallowRef(localSearchIndex)

if (import.meta.hot) {
  import.meta.hot.accept('@localSearchIndex', (m) => {
    if (m) searchIndexData.value = m.default
  })
}

const miniSearch = computedAsync(async () => {
  const loader = searchIndexData.value[localeIndex.value]
  const raw = loader ? (await loader())?.default : null

  if (!raw) return null

  return MiniSearch.loadJSON(raw, {
    fields: ['title', 'titles', 'text'],
    storeFields: ['title', 'titles', 'text'],
    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      boost: { title: 4, text: 2, titles: 1 },
      ...(theme.value.search?.provider === 'local' &&
        theme.value.search.options?.miniSearch?.searchOptions)
    },
    ...(theme.value.search?.provider === 'local' &&
      theme.value.search.options?.miniSearch?.options)
  })
}, null)

const results = computed(() => {
  if (!miniSearch.value || !query.value.trim()) return []

  return miniSearch.value.search(query.value).slice(0, 12)
})

watch(results, (value) => {
  selectedIndex.value = value.length ? 0 : -1
})

watch(open, (value) => {
  if (!value) selectedIndex.value = results.value.length ? 0 : -1
})

onKeyStroke('k', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault()
    open.value = true
  }
})

onKeyStroke('/', (event) => {
  const target = event.target
  const editable =
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

  if (!editable) {
    event.preventDefault()
    open.value = true
  }
})

onKeyStroke('ArrowDown', (event) => {
  if (!open.value || !results.value.length) return
  event.preventDefault()
  selectedIndex.value = (selectedIndex.value + 1) % results.value.length
})

onKeyStroke('ArrowUp', (event) => {
  if (!open.value || !results.value.length) return
  event.preventDefault()
  selectedIndex.value =
    (selectedIndex.value - 1 + results.value.length) % results.value.length
})

onKeyStroke('Enter', (event) => {
  if (!open.value || selectedIndex.value < 0) return
  const target = event.target
  if (target instanceof HTMLButtonElement && target.type !== 'submit') return

  const selected = results.value[selectedIndex.value]
  if (!selected) return

  event.preventDefault()
  router.go(selected.id)
  open.value = false
})

function excerpt(result) {
  if (!result.text) return 'Nessuna anteprima disponibile.'
  const normalized = String(result.text).replace(/\s+/g, ' ').trim()
  return normalized.length > 160 ? `${normalized.slice(0, 160)}...` : normalized
}

const suggestions = computed(() => theme.value.searchSuggestions || [
  'alaska',
  'anchorage',
  'denali',
  'seward'
])

function openSearchPage() {
  const value = query.value.trim()
  const target = value ? `/search/?q=${encodeURIComponent(value)}` : '/search/'
  router.go(target)
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="min-w-[12.5rem] justify-between gap-[0.7rem] rounded-full bg-background/90"
      >
        <Search class="size-4" />
        <span class="font-medium">{{ theme.searchLabel || 'Cerca nel sito' }}</span>
        <span class="hidden items-center gap-1.5 min-[960px]:inline-flex">
          <Kbd class="rounded-full px-2">⌘</Kbd>
          <Kbd class="rounded-full px-2">K</Kbd>
        </span>
      </Button>
    </DialogTrigger>

    <DialogContent class="max-w-3xl border-border/70 bg-background/96 p-0 shadow-[0_28px_90px_rgba(15,23,42,0.2)] backdrop-blur-[18px] sm:rounded-[28px]">
      <DialogHeader class="border-b border-border/70 px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <Search class="size-4" />
          </div>
          <div class="text-left">
            <DialogTitle>Ricerca</DialogTitle>
            <DialogDescription>
              Cerca tra viaggi, articoli, gallerie, mappe e archivi del sito.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="px-5 pt-4">
        <Input
          v-model="query"
          :placeholder="theme.searchPlaceholder || 'Cerca per luogo, giorno, tag o itinerario'"
          class="h-12 rounded-2xl border-border/70 bg-card/80 px-4 text-base"
        />
      </div>

      <ScrollArea class="max-h-[28rem] px-3 pb-3 pt-4">
        <div v-if="query && results.length" class="grid gap-2 px-2">
          <button
            v-for="(result, index) in results"
            :key="result.id"
            type="button"
            :class="
              cn(
                'block w-full rounded-[1.25rem] border border-transparent p-4 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-px hover:border-border/80 hover:bg-secondary/92',
                index === selectedIndex && 'border-border/80 bg-secondary/92 -translate-y-px'
              )
            "
            @mouseenter="selectedIndex = index"
            @click="
              router.go(result.id);
              open = false
            "
          >
            <div class="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Badge variant="secondary">{{ index + 1 }}</Badge>
              <span v-for="(title, titleIndex) in result.titles || []" :key="`${result.id}-${titleIndex}`">
                {{ title }}
              </span>
            </div>
            <div class="mt-3">
              <p class="text-sm font-semibold text-foreground">{{ result.title }}</p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ excerpt(result) }}
              </p>
            </div>
          </button>

          <Button variant="outline" class="mt-2 rounded-full" @click="openSearchPage">
            Vedi tutti i risultati
          </Button>
        </div>

        <div v-else-if="query" class="px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Nessun risultato per "{{ query }}".</p>
          <Button variant="outline" class="mt-4 rounded-full" @click="openSearchPage">
            Apri la pagina risultati
          </Button>
        </div>

        <div v-else class="px-4 pb-5">
          <div class="rounded-[24px] border border-border/70 bg-card/70 p-5">
            <p class="text-sm font-medium">Suggerimenti</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="item in suggestions"
                :key="item"
                type="button"
                class="inline-flex"
                @click="query = item"
              >
                <Badge variant="outline">{{ item }}</Badge>
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
</template>

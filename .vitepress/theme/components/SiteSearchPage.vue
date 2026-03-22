<script setup>
import localSearchIndex from '@localSearchIndex'
import { computedAsync, useSessionStorage } from '@vueuse/core'
import MiniSearch from 'minisearch'
import { Search } from 'lucide-vue-next'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useData, useRouter } from 'vitepress'

import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

const { localeIndex, theme } = useData()
const router = useRouter()

const query = useSessionStorage('app-search-query', '')
const hydrated = ref(false)
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

const normalizedQuery = computed(() => query.value.trim())

const results = computed(() => {
  if (!miniSearch.value || !normalizedQuery.value) return []
  return miniSearch.value.search(normalizedQuery.value).slice(0, 60)
})

onMounted(() => {
  hydrated.value = true
  const params = new URLSearchParams(window.location.search)
  const initialQuery = params.get('q')
  if (initialQuery) {
    query.value = initialQuery
  }
})

watch(normalizedQuery, (value) => {
  if (!hydrated.value) return

  const url = new URL(window.location.href)
  if (value) {
    url.searchParams.set('q', value)
  } else {
    url.searchParams.delete('q')
  }

  window.history.replaceState({}, '', url)
})

function excerpt(result) {
  if (!result.text) return 'Nessuna anteprima disponibile.'
  const normalized = String(result.text).replace(/\s+/g, ' ').trim()
  return normalized.length > 220 ? `${normalized.slice(0, 220)}...` : normalized
}

function resultSection(id = '') {
  if (id.startsWith('/travel/')) return 'Travel'
  if (id.startsWith('/blog/')) return 'Blog'
  if (id.startsWith('/galleries/')) return 'Gallerie'
  if (id.startsWith('/maps/')) return 'Mappe'
  if (id.startsWith('/about/')) return 'About'
  if (id.startsWith('/contacts/')) return 'Contacts'
  return 'Sito'
}

function openResult(id) {
  router.go(id)
}
</script>

<template>
  <div class="grid gap-6">
    <Card class="rounded-[30px] border-border/70 bg-card/90 shadow-[0_18px_56px_rgba(15,23,42,0.08)]">
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <Search class="size-4" />
          </div>
          <div>
            <CardTitle class="text-2xl">Search</CardTitle>
            <CardDescription>
              Risultati completi del sito, allineati all indice locale di VitePress.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Input
          v-model="query"
          :placeholder="theme.searchPlaceholder || 'Cerca per viaggio, articolo, luogo, tag o categoria'"
          class="h-12 rounded-2xl border-border/70 bg-background/80 px-4"
        />
      </CardContent>
    </Card>

    <div v-if="normalizedQuery && results.length" class="grid gap-4">
      <p class="text-sm text-muted-foreground">
        {{ results.length }} risultati per "{{ normalizedQuery }}"
      </p>

      <Card
        v-for="result in results"
        :key="result.id"
        class="rounded-[28px] border-border/70 bg-card/90 shadow-[0_18px_52px_rgba(15,23,42,0.08)]"
      >
        <CardHeader class="gap-3">
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">{{ resultSection(result.id) }}</Badge>
            <Badge v-for="(title, index) in result.titles || []" :key="`${result.id}-${index}`" variant="outline">
              {{ title }}
            </Badge>
          </div>
          <CardTitle class="text-2xl">
            <button type="button" class="text-left hover:text-primary" @click="openResult(result.id)">
              {{ result.title }}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm leading-7 text-muted-foreground">
            {{ excerpt(result) }}
          </p>
          <p class="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {{ result.id }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div
      v-else-if="normalizedQuery"
      class="rounded-[1.75rem] border border-dashed border-border/70 bg-card/60 p-5 text-sm text-muted-foreground"
    >
      Nessun risultato per "{{ normalizedQuery }}".
    </div>

    <div
      v-else
      class="rounded-[1.75rem] border border-border/70 bg-card/60 p-5 text-sm text-muted-foreground"
    >
      Inserisci una query per cercare tra viaggi, blog, gallerie, mappe e pagine statiche.
    </div>
  </div>
</template>

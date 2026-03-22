<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

import { getContentTerms, getPostTerms } from '../data/content'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const props = defineProps({
  collection: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  term: {
    type: String,
    default: ''
  }
})

const { hash } = useData()

const terms = computed(() => getContentTerms(props.collection, props.mode))
const activeSlug = computed(() => props.term || hash.value.replace(/^#/, ''))
const activeTerm = computed(() => terms.value.find((term) => term.slug === activeSlug.value) || null)
const filteredPosts = computed(() => activeTerm.value?.posts || [])

const labels = {
  categories: 'Categorie',
  tags: 'Tag',
  authors: 'Autori'
}

const collectionNames = {
  travel: 'Travel',
  blog: 'Blog'
}

function termLink(slug) {
  return `/${props.collection}/${props.mode}/${slug}/`
}
</script>

<template>
  <div class="grid gap-6">
    <div class="rounded-[1.75rem] border border-border/70 bg-card/82 p-5">
      <div class="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{{ collectionNames[collection] || collection }}</Badge>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {{ labels[mode] }}
        </p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <a v-for="term in terms" :key="term.slug" :href="termLink(term.slug)">
          <Badge :variant="activeSlug === term.slug ? 'secondary' : 'outline'">
            {{ term.label }} · {{ term.count }}
          </Badge>
        </a>
      </div>
    </div>

    <div v-if="activeTerm" class="grid gap-4">
      <p class="text-sm text-muted-foreground">
        {{ activeTerm.count }} contenuti in "{{ activeTerm.label }}"
      </p>

      <Card
        v-for="post in filteredPosts"
        :key="post.link"
        class="rounded-[1.75rem] border-border/70 bg-card/88"
      >
        <CardHeader class="gap-3">
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">{{ collectionNames[post.collection] || post.collection }}</Badge>
            <Badge v-if="post.day" variant="outline">{{ post.day }}</Badge>
            <Badge v-if="post.tripSlug" variant="outline">{{ post.tripSlug }}</Badge>
          </div>
          <CardTitle class="text-2xl">
            <a :href="post.link" class="hover:text-primary">
              {{ post.title }}
            </a>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p class="text-sm leading-7 text-muted-foreground">
            {{ post.excerpt || 'Nessun estratto disponibile.' }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <Badge
              v-for="term in getPostTerms(post, mode).slice(0, 8)"
              :key="`${post.link}-${term.slug}`"
              variant="outline"
            >
              {{ term.label }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <div
      v-else
      class="rounded-[1.75rem] border border-dashed border-border/70 bg-card/60 p-5 text-sm text-muted-foreground"
    >
      Seleziona un termine sopra per vedere l archivio filtrato.
    </div>
  </div>
</template>

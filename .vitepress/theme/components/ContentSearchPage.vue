<script setup>
import { computed, ref } from 'vue'

import { getCollectionPosts } from '../data/content'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

const props = defineProps({
  collection: {
    type: String,
    required: true
  }
})

const query = ref('')

const collectionLabels = {
  travel: 'travel',
  blog: 'blog'
}

const posts = computed(() => getCollectionPosts(props.collection))
const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const results = computed(() => {
  if (!normalizedQuery.value) return posts.value

  return posts.value.filter((post) => {
    const haystack = [
      post.title,
      post.excerpt,
      post.tripSlug,
      post.day,
      post.author?.label,
      ...post.categories.map((item) => item.label),
      ...post.tags.map((item) => item.label)
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedQuery.value)
  })
})
</script>

<template>
  <div class="grid gap-6">
    <div class="rounded-[1.75rem] border border-border/70 bg-card/82 p-5">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Ricerca {{ collectionLabels[collection] || collection }}
      </p>
      <Input
        v-model="query"
        placeholder="Cerca per titolo, luogo, categoria, tag o autore"
        class="mt-4 h-12 rounded-2xl border-border/70 bg-background/80 px-4"
      />
    </div>

    <div class="grid gap-4">
      <Card
        v-for="post in results"
        :key="post.link"
        class="rounded-[1.75rem] border-border/70 bg-card/88"
      >
        <CardHeader class="gap-3">
          <div class="flex flex-wrap gap-2">
            <Badge variant="secondary">{{ collectionLabels[collection] || collection }}</Badge>
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
              v-for="tag in post.tags.slice(0, 6)"
              :key="`${post.link}-${tag.slug}`"
              variant="outline"
            >
              {{ tag.label }}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

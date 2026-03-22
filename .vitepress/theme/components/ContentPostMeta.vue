<script setup>
import { FolderOpen, Route, Tag, UserRound } from 'lucide-vue-next'
import { computed } from 'vue'
import { useData } from 'vitepress'

import { getContentPost } from '../data/content'
import { Badge } from './ui/badge'

const { page } = useData()

const post = computed(() => getContentPost(page.value.relativePath))

const formattedDate = computed(() => {
  if (!post.value?.publishedDate) return ''

  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(post.value.publishedDate))
})

const collectionLabel = computed(() =>
  post.value?.collection === 'travel' ? 'Travel' : post.value?.collection === 'blog' ? 'Blog' : ''
)
</script>

<template>
  <div
    v-if="post"
    class="mb-6 rounded-[1.75rem] border border-border/70 bg-card/82 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
  >
    <div class="flex flex-wrap items-center gap-2">
      <Badge v-if="collectionLabel" variant="secondary">{{ collectionLabel }}</Badge>
      <Badge v-if="post.tripSlug" variant="outline">{{ post.tripSlug }}</Badge>
      <Badge v-if="post.day" variant="outline">{{ post.day }}</Badge>
      <Badge v-if="formattedDate" variant="outline">{{ formattedDate }}</Badge>
    </div>

    <p v-if="post.excerpt" class="mt-4 text-sm leading-7 text-muted-foreground">
      {{ post.excerpt }}
    </p>

    <div class="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-4">
      <div v-if="post.author" class="flex items-start gap-2">
        <UserRound class="mt-0.5 size-4 shrink-0" />
        <div>
          <p class="font-medium text-foreground">Autore</p>
          <a :href="`/${post.collection}/authors/${post.author.slug}/`" class="hover:text-foreground">
            {{ post.author.label }}
          </a>
        </div>
      </div>

      <div v-if="post.collection === 'travel' && post.tripSlug" class="flex items-start gap-2">
        <Route class="mt-0.5 size-4 shrink-0" />
        <div>
          <p class="font-medium text-foreground">Viaggio</p>
          <a :href="`/travel/${post.tripSlug}/`" class="hover:text-foreground">
            {{ post.tripSlug }}
          </a>
        </div>
      </div>

      <div v-if="post.categories.length" class="flex items-start gap-2">
        <FolderOpen class="mt-0.5 size-4 shrink-0" />
        <div>
          <p class="font-medium text-foreground">Categorie</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <a
              v-for="category in post.categories"
              :key="category.slug"
              :href="`/${post.collection}/categories/${category.slug}/`"
              class="hover:text-foreground"
            >
              {{ category.label }}
            </a>
          </div>
        </div>
      </div>

      <div v-if="post.tags.length" class="flex items-start gap-2">
        <Tag class="mt-0.5 size-4 shrink-0" />
        <div>
          <p class="font-medium text-foreground">Tag</p>
          <div class="mt-1 flex flex-wrap gap-2">
            <a
              v-for="tag in post.tags.slice(0, 8)"
              :key="tag.slug"
              :href="`/${post.collection}/tags/${tag.slug}/`"
              class="hover:text-foreground"
            >
              {{ tag.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
